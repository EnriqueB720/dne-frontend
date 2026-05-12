import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import {
  Box,
  Flex,
  Text,
  SolvoNavBar,
  PackageCard,
  type PackageData,
} from '@components';
import { solvoColors, solvoFonts, solvoShadows, SOLVO_PACKAGES } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  useSuppliersQuery,
  useCreateRequestMutation,
  useCreateQuoteMutation,
  useCalendarEventsBySupplierLazyQuery,
} from '@generated';

// Parse "₡245,000" → 245000
function parsePrice(priceLabel: string): number {
  const digits = priceLabel.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function extractGuestCount(pkg: PackageData): number | null {
  for (const item of pkg.items) {
    const m = item.label.match(/(\d+)/);
    if (m) return Number(m[1]);
  }
  return null;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

export default function Packages() {
  const router = useRouter();
  const query = (router.query.query as string) || 'birthday for 35 people';

  const { user, isAuthenticated } = useContext(AuthContext);
  const customerId = user?.customerId ?? null;

  const [activePkg, setActivePkg] = useState<PackageData | null>(null);
  const [serviceDate, setServiceDate] = useState('');
  const [city, setCity] = useState('Santa Ana');
  const [guestCount, setGuestCount] = useState('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<
    | { kind: 'ok'; requestId: number; quoteId: number; supplierName: string }
    | { kind: 'err'; text: string }
    | null
  >(null);

  const { data: suppliersData, loading: suppliersLoading } = useSuppliersQuery({
    skip: !activePkg,
  });
  const suppliers = suppliersData?.suppliers ?? [];

  const [createRequest, createRequestState] = useCreateRequestMutation();
  const [createQuote, createQuoteState] = useCreateQuoteMutation();
  const submitting = createRequestState.loading || createQuoteState.loading;

  // Availability check: when supplier + service date are both set, look for
  // overlapping events on that day. Warn (don't block) the customer.
  const [checkAvailability, availabilityState] = useCalendarEventsBySupplierLazyQuery({
    fetchPolicy: 'network-only',
  });
  const conflicts = useMemo(() => {
    if (!supplierId || !serviceDate) return [] as any[];
    const events = availabilityState.data?.calendarEventsBySupplier ?? [];
    const start = new Date(serviceDate);
    // 4-hour assumed service window (matches the auto-created booking event)
    const end = new Date(start);
    end.setHours(end.getHours() + 4);
    return events.filter((e: any) => {
      if (e.status === 'CANCELLED' || e.status === 'COMPLETED') return false;
      if (e.eventType !== 'BOOKING' && e.eventType !== 'BLOCKED') return false;
      const eStart = new Date(e.startsAt);
      const eEnd = new Date(e.endsAt);
      // Intervals overlap if start < eEnd && end > eStart
      return start < eEnd && end > eStart;
    });
  }, [supplierId, serviceDate, availabilityState.data]);

  useEffect(() => {
    if (!supplierId || !serviceDate) return;
    const dayStart = new Date(serviceDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    checkAvailability({
      variables: {
        supplierId: Number(supplierId),
        from: dayStart.toISOString(),
        to: dayEnd.toISOString(),
      },
    });
  }, [supplierId, serviceDate, checkAvailability]);

  const openBooking = (pkg: PackageData) => {
    setActivePkg(pkg);
    setResult(null);
    setGuestCount(String(extractGuestCount(pkg) ?? 35));
    setMessage(`Interested in the ${pkg.tier} package for "${query}".`);
  };

  const closeBooking = () => {
    setActivePkg(null);
  };

  // Default supplier once suppliers load
  useEffect(() => {
    if (supplierId === '' && suppliers.length > 0) {
      setSupplierId(suppliers[0].supplierId);
    }
  }, [suppliers, supplierId]);

  const handleBook = async () => {
    if (!activePkg) return;
    if (!customerId) {
      setResult({ kind: 'err', text: 'You must be signed in as a customer to book a package.' });
      return;
    }
    if (!serviceDate) {
      setResult({ kind: 'err', text: 'Pick a service date.' });
      return;
    }
    if (!supplierId) {
      setResult({ kind: 'err', text: 'Pick a supplier to send this to.' });
      return;
    }

    const totalPrice = parsePrice(activePkg.price);
    const guests = guestCount ? Number(guestCount) : null;

    try {
      // 1) Create the request
      const reqRes = await createRequest({
        variables: {
          data: {
            customerId,
            rawQuery: `${activePkg.tier} package — ${query}`,
            city: city || null,
            serviceDate,
            guestCount: guests,
            budgetMin: totalPrice,
            budgetMax: totalPrice,
          } as any,
        },
      });

      const requestId = reqRes.data?.createRequest.requestId;
      if (!requestId) throw new Error('Failed to create request');

      // 2) Auto-create a matching quote from the chosen supplier (test shortcut
      //    so the customer can immediately accept it and produce a booking).
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 14);

      const items = activePkg.items.map((it) => ({
        description: `${it.icon} ${it.label}`,
        quantity: 1,
        unitPrice: parsePrice(it.price),
        total: parsePrice(it.price),
      }));

      const quoteRes = await createQuote({
        variables: {
          data: {
            requestId,
            supplierId: Number(supplierId),
            totalPrice,
            currency: 'CRC',
            message,
            validUntil: validUntil.toISOString(),
            items,
          } as any,
        },
      });

      const quoteId = quoteRes.data?.createQuote.quoteId;
      if (!quoteId) throw new Error('Failed to create quote');

      const supplierName =
        suppliers.find((s) => s.supplierId === Number(supplierId))?.companyName ?? `Supplier #${supplierId}`;
      setResult({ kind: 'ok', requestId, quoteId, supplierName });
    } catch (err: any) {
      setResult({ kind: 'err', text: err?.message ?? 'Booking failed' });
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/packages" />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '24px 16px', md: '56px 24px' }}>
        {/* Header */}
        <Flex direction="column" align="center" textAlign="center" gap="12px" marginBottom="48px">
          <Text
            fontSize="xs"
            color={solvoColors.indigo}
            fontWeight="600"
            letterSpacing="0.1em"
          >
            ✨ CURATED BY SOLVO AI
          </Text>
          <Text
            fontFamily={solvoFonts.serif}
            fontSize={{ base: '36px', md: '56px' }}
            lineHeight="1.05"
            fontWeight="500"
            color={solvoColors.text}
            maxWidth="800px"
            letterSpacing="-0.02em"
          >
            Complete solutions,{' '}
            <Text as="span" fontStyle="italic" color={solvoColors.indigo}>
              not just providers.
            </Text>
          </Text>
          <Text fontSize="md" color={solvoColors.textMuted} maxWidth="640px">
            Three thoughtfully bundled packages for "{query}". One contract, one payment, zero coordination.
          </Text>
        </Flex>

        {/* Packages grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap="20px"
          marginBottom="48px"
          alignItems="stretch"
        >
          {SOLVO_PACKAGES.map((pkg, i) => (
            <PackageCard
              key={pkg.tier}
              pkg={pkg}
              index={i}
              onBook={openBooking}
              onCustomize={(p) => alert(`Customizing ${p.tier}`)}
            />
          ))}
        </Box>

        {/* Bottom CTA */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap="14px"
          padding="24px 28px"
          borderRadius="20px"
          style={{
            background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
          }}
          borderWidth="1px"
          borderColor={solvoColors.indigoBorder}
        >
          <Box>
            <Text fontSize="lg" fontWeight="600" color={solvoColors.text} marginBottom="4px">
              Want something else entirely?
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Tell Solvo what to add or remove and we'll rebuild your package in seconds.
            </Text>
          </Box>
          <Flex
            as="button"
            padding="10px 20px"
            bg={solvoColors.text}
            color="white"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            _hover={{ bg: solvoColors.indigo }}
          >
            Customize
          </Flex>
        </Flex>
      </Box>

      {/* ─── Booking Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activePkg && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28, 25, 23, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={closeBooking}
          >
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '540px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: solvoColors.surface,
                borderRadius: '24px',
                boxShadow: solvoShadows.heroInput,
              }}
            >
              {result?.kind === 'ok' ? (
                <Box padding="32px">
                  <Flex
                    width="48px"
                    height="48px"
                    borderRadius="14px"
                    bg={solvoColors.emeraldLight}
                    color={solvoColors.emeraldText}
                    align="center"
                    justify="center"
                    marginBottom="16px"
                  >
                    <CheckCircle2 size={22} />
                  </Flex>
                  <Text fontFamily={solvoFonts.serif} fontSize="26px" color={solvoColors.text} marginBottom="8px">
                    Request sent to {result.supplierName}
                  </Text>
                  <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="20px">
                    Request <strong>#{result.requestId}</strong> created. A test quote <strong>#{result.quoteId}</strong> from <strong>{result.supplierName}</strong> is already attached — go to your requests page to accept it and create the booking.
                  </Text>
                  <Flex gap="10px">
                    <Link href="/requests" style={{ textDecoration: 'none', flex: 1 }}>
                      <Box
                        padding="11px 16px"
                        borderRadius="12px"
                        bg={solvoColors.indigo}
                        color={solvoColors.surface}
                        fontSize="14px"
                        fontWeight={600}
                        textAlign="center"
                        cursor="pointer"
                      >
                        Go to My requests →
                      </Box>
                    </Link>
                    <Box
                      as="button"
                      onClick={closeBooking}
                      padding="11px 16px"
                      borderRadius="12px"
                      bg={solvoColors.surface}
                      color={solvoColors.text}
                      border={`1px solid ${solvoColors.border}`}
                      fontSize="14px"
                      fontWeight={600}
                      cursor="pointer"
                    >
                      Close
                    </Box>
                  </Flex>
                </Box>
              ) : (
                <>
                  <Flex
                    align="center"
                    justify="space-between"
                    padding="20px 24px"
                    borderBottom={`1px solid ${solvoColors.border}`}
                  >
                    <Flex align="center" gap="10px">
                      <Box fontSize="22px">{activePkg.emoji}</Box>
                      <Box>
                        <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                          {activePkg.tier} package
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {activePkg.price} · {activePkg.items.length} items
                        </Text>
                      </Box>
                    </Flex>
                    <Box
                      as="button"
                      onClick={closeBooking}
                      width="32px"
                      height="32px"
                      borderRadius="10px"
                      bg="transparent"
                      border={`1px solid ${solvoColors.border}`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                    >
                      <X size={16} color={solvoColors.text} />
                    </Box>
                  </Flex>

                  <Box padding="20px 24px">
                    {!isAuthenticated || !user ? (
                      <Box padding="14px" borderRadius="10px" bg={solvoColors.amberLight} marginBottom="14px">
                        <Text fontSize="sm" color={solvoColors.amberText} marginBottom="6px" fontWeight={600}>
                          Sign in required
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textMuted}>
                          Booking a package creates a real request linked to your account. Please <Link href="/login" style={{ color: solvoColors.indigo, fontWeight: 600 }}>sign in</Link> first.
                        </Text>
                      </Box>
                    ) : !customerId ? (
                      <Box padding="14px" borderRadius="10px" bg={solvoColors.amberLight} marginBottom="14px">
                        <Text fontSize="sm" color={solvoColors.amberText} marginBottom="6px" fontWeight={600}>
                          Customer account required
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textMuted}>
                          You're signed in as a supplier. Switch to a customer account to book packages.
                        </Text>
                      </Box>
                    ) : null}

                    <Flex gap="12px" wrap="wrap" marginBottom="12px">
                      <Box flex="1" minWidth="180px">
                        <label style={labelStyle}>Service date</label>
                        <input
                          type="datetime-local"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          style={inputStyle}
                        />
                      </Box>
                      <Box flex="1" minWidth="120px">
                        <label style={labelStyle}>Guests</label>
                        <input
                          type="number"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          style={inputStyle}
                        />
                      </Box>
                    </Flex>

                    <Box marginBottom="12px">
                      <label style={labelStyle}>City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={inputStyle}
                      />
                    </Box>

                    <Box marginBottom="12px">
                      <label style={labelStyle}>Send to supplier</label>
                      <select
                        value={supplierId}
                        onChange={(e) =>
                          setSupplierId(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        style={inputStyle}
                        disabled={suppliersLoading}
                      >
                        {suppliersLoading && <option>Loading suppliers…</option>}
                        {!suppliersLoading && suppliers.length === 0 && (
                          <option value="">No suppliers available</option>
                        )}
                        {suppliers.map((s) => (
                          <option key={s.supplierId} value={s.supplierId}>
                            {s.companyName}
                          </option>
                        ))}
                      </select>
                      <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="6px">
                        For testing, we'll auto-generate a matching quote from this supplier so you can accept it on the next screen.
                      </Text>
                    </Box>

                    {/* Availability check */}
                    {supplierId && serviceDate && conflicts.length > 0 && (
                      <Box
                        padding="12px 14px"
                        borderRadius="10px"
                        bg={solvoColors.amberLight}
                        marginBottom="14px"
                      >
                        <Text fontSize="sm" fontWeight={600} color={solvoColors.amberText} marginBottom="4px">
                          ⚠ This supplier may be unavailable
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textMuted}>
                          They have {conflicts.length} conflicting event{conflicts.length === 1 ? '' : 's'} on this date
                          {conflicts.find((c: any) => c.eventType === 'BOOKING') && ' (existing booking)'}
                          {conflicts.find((c: any) => c.eventType === 'BLOCKED') && ' (blocked time)'}.
                          You can still send the request — the supplier can decline.
                        </Text>
                      </Box>
                    )}
                    {supplierId && serviceDate && conflicts.length === 0 && !availabilityState.loading && (
                      <Box
                        padding="10px 14px"
                        borderRadius="10px"
                        bg={solvoColors.successLight}
                        marginBottom="14px"
                      >
                        <Text fontSize="xs" color={solvoColors.successText}>
                          ✓ Supplier is available on this date
                        </Text>
                      </Box>
                    )}

                    <Box marginBottom="16px">
                      <label style={labelStyle}>Message (optional)</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </Box>

                    {/* Package summary */}
                    <Box
                      padding="12px"
                      borderRadius="12px"
                      bg={solvoColors.bg}
                      marginBottom="16px"
                    >
                      <Text fontSize="xs" fontWeight={600} color={solvoColors.textMuted} marginBottom="8px" letterSpacing="0.04em" textTransform="uppercase">
                        Included
                      </Text>
                      {activePkg.items.map((it, idx) => (
                        <Flex
                          key={idx}
                          justify="space-between"
                          align="center"
                          paddingY="4px"
                          fontSize="13px"
                          color={solvoColors.text}
                        >
                          <Text>
                            {it.icon} {it.label}
                          </Text>
                          <Text color={solvoColors.textMuted}>{it.price}</Text>
                        </Flex>
                      ))}
                      <Flex
                        justify="space-between"
                        align="center"
                        paddingTop="8px"
                        marginTop="8px"
                        borderTop={`1px solid ${solvoColors.border}`}
                      >
                        <Text fontSize="13px" fontWeight={600} color={solvoColors.text}>
                          Total
                        </Text>
                        <Text fontFamily={solvoFonts.serif} fontSize="18px" color={solvoColors.text}>
                          {activePkg.price}
                        </Text>
                      </Flex>
                    </Box>

                    {result?.kind === 'err' && (
                      <Box
                        padding="10px 12px"
                        borderRadius="10px"
                        bg={solvoColors.roseLight}
                        color={solvoColors.roseText}
                        marginBottom="14px"
                      >
                        <Text fontSize="sm">{result.text}</Text>
                      </Box>
                    )}

                    <button
                      type="button"
                      onClick={handleBook}
                      disabled={submitting || !customerId}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: solvoColors.text,
                        color: solvoColors.surface,
                        fontWeight: 600,
                        fontSize: '15px',
                        fontFamily: solvoFonts.sans,
                        cursor: 'pointer',
                        opacity: submitting || !customerId ? 0.5 : 1,
                      }}
                    >
                      {submitting ? 'Sending…' : `Send request to supplier`}
                    </button>
                  </Box>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
