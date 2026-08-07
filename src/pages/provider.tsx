import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Inbox,
  MessageSquare,
  Sparkles,
  Store,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, Pill, QuoteCreateModal } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  useOpenRequestsForSupplierQuery,
  useSupplierDashboardStatsQuery,
  useOpenRequestEventForSupplierSubscription,
  useQuoteEventForSupplierSubscription,
} from '@generated';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const TONE_BG: Record<string, string> = {
  emerald: solvoColors.emeraldLight,
  indigo: solvoColors.indigoLight,
  amber: solvoColors.amberLight,
  rose: solvoColors.roseLight,
};
const TONE_TEXT: Record<string, string> = {
  emerald: solvoColors.emeraldText,
  indigo: solvoColors.indigo,
  amber: solvoColors.amberText,
  rose: solvoColors.roseText,
};

const formatColones = (value: string | number): string => {
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n) || n === 0) return '₡0';
  if (n >= 1_000_000) return `₡${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₡${(n / 1_000).toFixed(0)}k`;
  return `₡${Math.round(n).toLocaleString('en-US')}`;
};

const timeAgo = (iso?: string | null): string => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = diffMs / 3_600_000;
  if (h < 1) {
    const m = Math.max(1, Math.floor(diffMs / 60_000));
    return `${m}m ago`;
  }
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24;
  if (d < 7) return `${Math.floor(d)}d ago`;
  return new Date(iso).toLocaleDateString();
};

export default function ProviderDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const supplierId = user?.supplierId ?? null;
  const customerId = user?.customerId ?? null;

  // Customer-only users land on /dashboard instead of seeing an empty
  // supplier workspace. Dual-role users stay here since they typed/clicked
  // /provider.
  useEffect(() => {
    if (isAuthenticated && !supplierId && customerId) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, supplierId, customerId, router]);

  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [quoteModalFor, setQuoteModalFor] = useState<{
    requestId: number;
    preview?: string;
    meta?: string;
    customerName?: string;
  } | null>(null);

  // ── Queries ─────────────────────────────────────────────────────────
  const statsQuery = useSupplierDashboardStatsQuery({
    variables: { supplierId: supplierId ?? 0 },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });
  const leadsQuery = useOpenRequestsForSupplierQuery({
    variables: { supplierId: supplierId ?? 0, limit: 50 },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });

  // Live updates — refetch both whenever a matching event fires
  useOpenRequestEventForSupplierSubscription({
    variables: { supplierId: supplierId ?? 0 },
    skip: !supplierId,
    onData: () => {
      statsQuery.refetch();
      leadsQuery.refetch();
    },
  });
  useQuoteEventForSupplierSubscription({
    variables: { supplierId: supplierId ?? 0 },
    skip: !supplierId,
    onData: () => {
      statsQuery.refetch();
      leadsQuery.refetch();
    },
  });

  const stats = statsQuery.data?.supplierDashboardStats;
  const leads = leadsQuery.data?.openRequestsForSupplier ?? [];

  // Make sure the selected lead is always one that's still in the list
  useEffect(() => {
    if (leads.length === 0) {
      if (selectedLeadId !== null) setSelectedLeadId(null);
      return;
    }
    if (!selectedLeadId || !leads.find((l: any) => l.requestId === selectedLeadId)) {
      setSelectedLeadId(leads[0].requestId);
    }
  }, [leads, selectedLeadId]);

  const selectedLead = useMemo(
    () => leads.find((l: any) => l.requestId === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  // ── Stats cards data ────────────────────────────────────────────────
  const statCards = stats
    ? [
        {
          label: 'Response rate',
          value: `${stats.responseRate}%`,
          sub: 'Last 30 days',
          icon: Zap,
          tone: 'emerald' as const,
        },
        {
          label: 'Conversion',
          value: `${stats.conversionRate}%`,
          sub: 'All-time quote outcomes',
          icon: TrendingUp,
          tone: 'indigo' as const,
        },
        {
          label: 'Active leads',
          value: String(stats.activeLeadsCount),
          sub: 'Open & matching',
          icon: Inbox,
          tone: 'amber' as const,
        },
        {
          label: 'Earnings (MTD)',
          value: formatColones(stats.mtdEarnings),
          sub:
            Number(stats.mtdGross) > 0
              ? `${formatColones(stats.mtdGross)} gross · ${Math.round(stats.platformFeeRate * 100)}% platform fee`
              : `${Math.round(stats.platformFeeRate * 100)}% platform fee applies`,
          icon: DollarSign,
          tone: 'rose' as const,
        },
      ]
    : null;

  const weeklyMax = Math.max(1, ...(stats?.weeklyLeadCounts ?? [0]));

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="24px"
            maxWidth="420px"
            textAlign="center"
          >
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to open your workspace
            </Text>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Box
                display="inline-block"
                padding="10px 18px"
                borderRadius="10px"
                bg={solvoColors.text}
                color="white"
                fontWeight={600}
                fontSize="14px"
                cursor="pointer"
              >
                Sign in
              </Box>
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="24px"
            maxWidth="460px"
            textAlign="center"
          >
            <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text} marginBottom="6px">
              This workspace is for suppliers
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account doesn't have a Supplier profile. If you're a customer,
              head to{' '}
              <Link href="/dashboard" style={{ color: solvoColors.indigo }}>
                Dashboard
              </Link>
              .
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  const businessName = user.name ?? 'Workspace';

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/provider" />

      <Box maxWidth="1300px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        {/* Header */}
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap="14px"
          marginBottom="32px"
        >
          <Box>
            <Text
              fontSize="xs"
              color={solvoColors.textSubtle}
              letterSpacing="0.08em"
              fontWeight="600"
              marginBottom="4px"
            >
              PROVIDER WORKSPACE
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '32px', md: '44px' }}
              fontWeight="500"
              color={solvoColors.text}
              letterSpacing="-0.01em"
            >
              {businessName}
            </Text>
          </Box>
          <Flex align="center" gap="10px" wrap="wrap">
            {/* The storefront editor is otherwise only reachable from the
                avatar menu — surface it where the provider actually works. */}
            <Link href="/provider/settings" style={{ textDecoration: 'none' }}>
              <Flex
                align="center"
                gap="7px"
                padding="9px 16px"
                borderRadius="10px"
                bg={solvoColors.surface}
                borderWidth="1px"
                borderColor={solvoColors.border}
                color={solvoColors.text}
                fontSize="sm"
                fontWeight="600"
                cursor="pointer"
                _hover={{ borderColor: solvoColors.borderHover }}
              >
                <Store size={14} />
                Edit my public page
              </Flex>
            </Link>
            <Flex
              align="center"
              gap="6px"
              padding="8px 16px"
              borderRadius="9999px"
              style={{ background: `linear-gradient(135deg, ${solvoColors.amberLight}, #FED7AA)` }}
              color={solvoColors.amberText}
              fontSize="xs"
              fontWeight="600"
            >
              👑 Pro plan
            </Flex>
          </Flex>
        </Flex>

        {/* Stats grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
          gap="14px"
          marginBottom="32px"
        >
          {(statCards ?? new Array(4).fill(null)).map((stat, i) => {
            if (!stat) {
              return (
                <Box
                  key={i}
                  padding="20px"
                  bg="white"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  borderRadius="16px"
                  minHeight="118px"
                />
              );
            }
            const Icon = stat.icon;
            return (
              <Flex
                key={stat.label}
                direction="column"
                gap="10px"
                padding="20px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="16px"
              >
                <Flex
                  width="36px"
                  height="36px"
                  borderRadius="10px"
                  bg={TONE_BG[stat.tone]}
                  color={TONE_TEXT[stat.tone]}
                  align="center"
                  justify="center"
                >
                  <Icon size={18} />
                </Flex>
                <Box>
                  <Text
                    fontFamily={solvoFonts.serif}
                    fontSize="28px"
                    fontWeight="500"
                    color={solvoColors.text}
                    lineHeight={1.1}
                  >
                    {stat.value}
                  </Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    {stat.label}
                  </Text>
                  <Text fontSize="10px" color={solvoColors.textSubtle}>
                    {stat.sub}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Box>

        {/* Lead inbox + detail panel */}
        <Flex gap="20px" direction={{ base: 'column', lg: 'row' }} align="flex-start" marginBottom="32px">
          {/* LEFT: incoming leads */}
          <Box
            width={{ base: '100%', lg: '420px' }}
            flexShrink={0}
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="20px"
          >
            <Flex justify="space-between" align="center" marginBottom="14px">
              <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                Incoming leads
              </Text>
              <Text fontSize="xs" color={solvoColors.textSubtle}>
                {leads.length} open
              </Text>
            </Flex>

            {leadsQuery.loading && leads.length === 0 ? (
              <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
            ) : leads.length === 0 ? (
              <Flex direction="column" align="center" gap="8px" padding="40px 12px">
                <Box color={solvoColors.textSubtle}>
                  <Inbox size={28} />
                </Box>
                <Text fontSize="sm" color={solvoColors.textSubtle} textAlign="center">
                  No open leads right now. New matching requests appear here in real time.
                </Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="8px">
                {leads.map((lead: any) => {
                  const isSelected = lead.requestId === selectedLeadId;
                  return (
                    <Box
                      key={lead.requestId}
                      onClick={() => setSelectedLeadId(lead.requestId)}
                      padding="12px 14px"
                      borderRadius="12px"
                      borderWidth="1px"
                      borderColor={isSelected ? solvoColors.text : solvoColors.border}
                      bg={isSelected ? solvoColors.bg : 'transparent'}
                      cursor="pointer"
                      _hover={{ borderColor: solvoColors.borderHover }}
                    >
                      <Flex justify="space-between" align="center" marginBottom="4px">
                        <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                          {lead.customer?.user?.name ?? `Customer #${lead.customerId}`}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle} flexShrink={0}>
                          {timeAgo(lead.createdAt)}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="xs"
                        color={solvoColors.textMuted}
                        marginBottom="6px"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {lead.rawQuery}
                      </Text>
                      <Text fontSize="11px" color={solvoColors.textSubtle}>
                        {[
                          lead.city,
                          lead.guestCount ? `${lead.guestCount} guests` : null,
                          lead.serviceDate
                            ? new Date(lead.serviceDate).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </Text>
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Box>

          {/* RIGHT: lead detail panel */}
          <Box
            flex="1"
            width="100%"
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="24px"
          >
            {!selectedLead ? (
              <Flex direction="column" align="center" gap="8px" padding="60px 20px">
                <Box color={solvoColors.textSubtle}>
                  <Inbox size={32} />
                </Box>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Select a lead to see its details.
                </Text>
              </Flex>
            ) : (
              <>
                <Flex justify="space-between" align="flex-start" marginBottom="16px">
                  <Box>
                    <Text
                      fontFamily={solvoFonts.serif}
                      fontSize="24px"
                      color={solvoColors.text}
                      lineHeight={1.2}
                    >
                      {selectedLead.customer?.user?.name ?? `Customer #${selectedLead.customerId}`}
                    </Text>
                    <Text fontSize="xs" color={solvoColors.textSubtle}>
                      Lead received {timeAgo(selectedLead.createdAt)}
                    </Text>
                  </Box>
                  {(selectedLead.budgetMax || selectedLead.budgetMin) && (
                    <Box textAlign="right">
                      <Text fontSize="11px" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight={600}>
                        BUDGET
                      </Text>
                      <Text
                        fontFamily={solvoFonts.serif}
                        fontSize="20px"
                        color={solvoColors.text}
                      >
                        {formatColones(selectedLead.budgetMax ?? selectedLead.budgetMin)}
                      </Text>
                    </Box>
                  )}
                </Flex>

                {/* Request box */}
                <Box
                  bg={solvoColors.bg}
                  borderRadius="14px"
                  padding="16px"
                  marginBottom="16px"
                >
                  <Text
                    fontSize="11px"
                    color={solvoColors.textSubtle}
                    letterSpacing="0.06em"
                    fontWeight={600}
                    marginBottom="6px"
                  >
                    THE REQUEST
                  </Text>
                  <Text fontSize="sm" color={solvoColors.text} marginBottom="12px">
                    {selectedLead.rawQuery}
                  </Text>
                  <Flex gap="6px" wrap="wrap">
                    {selectedLead.city && <Pill tone="default">{selectedLead.city}</Pill>}
                    {selectedLead.guestCount && (
                      <Pill tone="default">{selectedLead.guestCount} guests</Pill>
                    )}
                    {selectedLead.serviceDate && (
                      <Pill tone="default">
                        {new Date(selectedLead.serviceDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Pill>
                    )}
                  </Flex>
                </Box>

                {/* Action row */}
                <Flex gap="10px" wrap="wrap">
                  <Box
                    as="button"
                    flex="1"
                    minWidth="180px"
                    padding="12px 18px"
                    borderRadius="12px"
                    bg={solvoColors.text}
                    color="white"
                    fontWeight={600}
                    fontSize="14px"
                    cursor="pointer"
                    border="none"
                    onClick={() =>
                      setQuoteModalFor({
                        requestId: selectedLead.requestId,
                        preview: selectedLead.rawQuery,
                        customerName: selectedLead.customer?.user?.name,
                        meta: [
                          selectedLead.city,
                          selectedLead.guestCount ? `${selectedLead.guestCount} guests` : null,
                          selectedLead.serviceDate
                            ? new Date(selectedLead.serviceDate).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' · '),
                      })
                    }
                  >
                    Send a quote
                  </Box>
                  <Link
                    href={{ pathname: '/requests', query: { id: selectedLead.requestId } }}
                    style={{ textDecoration: 'none', flex: 1, minWidth: '160px' }}
                  >
                    <Box
                      padding="12px 18px"
                      borderRadius="12px"
                      borderWidth="1px"
                      borderColor={solvoColors.border}
                      color={solvoColors.text}
                      fontWeight={600}
                      fontSize="14px"
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: solvoColors.borderHover }}
                    >
                      View in inbox
                    </Box>
                  </Link>
                </Flex>
              </>
            )}
          </Box>
        </Flex>

        {/* Weekly chart */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor={solvoColors.border}
          borderRadius="16px"
          padding="20px 24px"
        >
          <Flex justify="space-between" align="baseline" marginBottom="20px">
            <Box>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" color={solvoColors.text}>
                Lead flow this week
              </Text>
              <Text fontSize="xs" color={solvoColors.textSubtle}>
                New matching requests per day
              </Text>
            </Box>
            <Text fontSize="xs" color={solvoColors.textSubtle}>
              {(stats?.weeklyLeadCounts ?? []).reduce((a, b) => a + b, 0)} total
            </Text>
          </Flex>
          <Flex align="flex-end" gap="14px" height="120px" marginBottom="10px">
            {(stats?.weeklyLeadCounts ?? new Array(7).fill(0)).map((count, i) => {
              const heightPct = Math.max(6, (count / weeklyMax) * 100);
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  style={{
                    flex: 1,
                    background: `linear-gradient(180deg, ${solvoColors.indigo} 0%, ${solvoColors.indigoMid} 100%)`,
                    borderRadius: '8px',
                    minHeight: '6px',
                  }}
                  title={`${count} lead${count === 1 ? '' : 's'}`}
                />
              );
            })}
          </Flex>
          <Flex gap="14px">
            {DAYS.map((d, i) => (
              <Text key={i} flex="1" textAlign="center" fontSize="11px" color={solvoColors.textSubtle}>
                {d}
              </Text>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Quote create popup */}
      {quoteModalFor && supplierId && (
        <QuoteCreateModal
          requestId={quoteModalFor.requestId}
          supplierId={supplierId}
          requestPreview={quoteModalFor.preview}
          requestMeta={quoteModalFor.meta}
          customerName={quoteModalFor.customerName}
          onClose={() => setQuoteModalFor(null)}
          onCreated={() => {
            // Live event will refetch automatically; just close the modal.
            setQuoteModalFor(null);
          }}
        />
      )}
    </Box>
  );
}
