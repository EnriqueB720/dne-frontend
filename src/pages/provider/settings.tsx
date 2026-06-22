import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  useSupplierQuery,
  useUpdateSupplierMutation,
  useUpdateUserMutation,
} from '@generated';

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
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

const sectionStyle: React.CSSProperties = {
  background: solvoColors.surface,
  border: `1px solid ${solvoColors.border}`,
  borderRadius: '16px',
  padding: '24px',
};

export default function ProviderSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const supplierId = user?.supplierId ?? null;
  const userId = user?.userId ?? null;

  const supplierQuery = useSupplierQuery({
    variables: { where: { supplierId: supplierId ?? 0 } },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });
  const [updateSupplier, updateSupplierState] = useUpdateSupplierMutation();
  const [updateUser, updateUserState] = useUpdateUserMutation();

  const supplier = supplierQuery.data?.supplier;

  // Personal (User) — name + phone fall back to the supplier's contact phone
  const [contactName, setContactName] = useState('');

  // Business profile fields
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Sync form when supplier data loads
  useEffect(() => {
    if (!supplier) return;
    setContactName(user?.name ?? '');
    setCompanyName(supplier.companyName ?? '');
    setTagline(supplier.tagline ?? '');
    setDescription(supplier.description ?? '');
    setCity(supplier.city ?? '');
    setBusinessPhone(supplier.businessPhone ?? '');
    setBusinessEmail(supplier.businessEmail ?? '');
    setWhatsappNumber(supplier.whatsappNumber ?? '');
    setWebsiteUrl(supplier.websiteUrl ?? '');
    setMinCapacity(supplier.minCapacity != null ? String(supplier.minCapacity) : '');
    setMaxCapacity(supplier.maxCapacity != null ? String(supplier.maxCapacity) : '');
  }, [supplier, user]);

  const handleSave = async () => {
    if (!supplierId || !userId) return;
    setFeedback(null);

    const minN = minCapacity ? Number(minCapacity) : null;
    const maxN = maxCapacity ? Number(maxCapacity) : null;
    if (minN != null && maxN != null && minN > maxN) {
      setFeedback({ kind: 'err', text: 'Min capacity cannot exceed max capacity.' });
      return;
    }

    try {
      await Promise.all([
        updateUser({
          variables: {
            data: { userId, name: contactName || undefined },
          },
        }),
        updateSupplier({
          variables: {
            data: {
              supplierId,
              companyName: companyName || undefined,
              tagline: tagline || undefined,
              description: description || undefined,
              city: city || undefined,
              businessPhone: businessPhone || undefined,
              businessEmail: businessEmail || undefined,
              whatsappNumber: whatsappNumber || undefined,
              websiteUrl: websiteUrl || undefined,
              minCapacity: minN ?? undefined,
              maxCapacity: maxN ?? undefined,
            },
          },
        }),
      ]);
      setFeedback({ kind: 'ok', text: 'Business profile saved.' });
      refreshUserToken().catch(() => {});
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Save failed' });
    }
  };

  const busy = updateSupplierState.loading || updateUserState.loading;

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text} marginBottom="6px">
              Sign in to edit your business profile
            </Text>
            <Link href="/login" style={{ color: solvoColors.indigo }}>
              Sign in
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  // Customer-only users edit their profile at /profile
  if (!supplierId && user.customerId) {
    router.replace('/profile');
    return null;
  }

  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="460px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
              No supplier profile on your account.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/provider" />

      <Box maxWidth="900px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.08em" fontWeight={600} marginBottom="6px">
          PROVIDER WORKSPACE · SETTINGS
        </Text>
        <Text
          fontFamily={solvoFonts.serif}
          fontSize={{ base: '28px', md: '36px' }}
          color={solvoColors.text}
          marginBottom="6px"
        >
          Business profile
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="32px">
          What customers see on your storefront. Updated info appears immediately on{' '}
          <Link href={`/providers/${supplierId}`} style={{ color: solvoColors.indigo }}>
            your public profile
          </Link>
          .
        </Text>

        {feedback && (
          <Box
            marginBottom="20px"
            padding="12px 14px"
            borderRadius="10px"
            bg={feedback.kind === 'ok' ? solvoColors.successLight : solvoColors.roseLight}
            color={feedback.kind === 'ok' ? solvoColors.successText : solvoColors.roseText}
          >
            <Text fontSize="sm">{feedback.text}</Text>
          </Box>
        )}

        {supplierQuery.loading && !supplier ? (
          <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
        ) : (
          <Flex direction="column" gap="20px">
            {/* Account */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Account contact
              </Text>
              <Box>
                <label style={labelStyle}>Your name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Who runs the business"
                />
              </Box>
            </Box>

            {/* Business identity */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Business identity
              </Text>

              <Box marginBottom="14px">
                <label style={labelStyle}>Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={inputBaseStyle}
                />
              </Box>

              <Box marginBottom="14px">
                <label style={labelStyle}>Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Short one-liner shown next to your name"
                />
              </Box>

              <Box>
                <label style={labelStyle}>About</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  style={{ ...inputBaseStyle, resize: 'vertical' }}
                  placeholder="Tell customers what you do, your style, what makes you different."
                />
              </Box>
            </Box>

            {/* Location + capacity */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Location & capacity
              </Text>

              <Box marginBottom="14px">
                <label style={labelStyle}>City you serve</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Santa Ana"
                />
                <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="4px">
                  Used to match you with requests in this area.
                </Text>
              </Box>

              <Flex gap="14px" wrap="wrap">
                <Box flex="1" minWidth="160px">
                  <label style={labelStyle}>Min capacity</label>
                  <input
                    type="number"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="e.g. 10"
                  />
                </Box>
                <Box flex="1" minWidth="160px">
                  <label style={labelStyle}>Max capacity</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="e.g. 200"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Contacts */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Public contacts
              </Text>

              <Flex gap="14px" wrap="wrap" marginBottom="14px">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Business phone</label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="+506 …"
                  />
                </Box>
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Business email</label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="hello@yourbusiness.com"
                  />
                </Box>
              </Flex>

              <Flex gap="14px" wrap="wrap">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>WhatsApp number</label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="+506 …"
                  />
                </Box>
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Website</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="https://…"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Actions */}
            <Flex justify="flex-end" gap="10px">
              <Link href="/provider" style={{ textDecoration: 'none' }}>
                <Box
                  padding="10px 16px"
                  borderRadius="10px"
                  border={`1px solid ${solvoColors.border}`}
                  color={solvoColors.text}
                  fontSize="14px"
                  fontWeight={600}
                  cursor="pointer"
                  bg={solvoColors.surface}
                >
                  Cancel
                </Box>
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={busy}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: solvoColors.text,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.6 : 1,
                  fontFamily: solvoFonts.sans,
                }}
              >
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
