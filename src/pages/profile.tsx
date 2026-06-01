import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  useCustomerQuery,
  useUpdateCustomerMutation,
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

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const customerId = user?.customerId ?? null;
  const userId = user?.userId ?? null;

  const customerQuery = useCustomerQuery({
    variables: { where: { customerId: customerId ?? 0 } },
    skip: !customerId,
    fetchPolicy: 'cache-and-network',
  });
  const [updateCustomer, updateCustomerState] = useUpdateCustomerMutation();
  const [updateUser, updateUserState] = useUpdateUserMutation();

  const profile = customerQuery.data?.customer;

  // Form state — initialized from fetched profile, kept editable
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [defaultCity, setDefaultCity] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');

  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Sync form when data loads
  useEffect(() => {
    if (!profile) return;
    setName(profile.user?.name ?? '');
    setPhone(profile.user?.phone ?? '');
    setCountry(profile.user?.country ?? '');
    setDefaultCity(profile.defaultCity ?? '');
    setDefaultAddress(profile.defaultAddress ?? '');
  }, [profile]);

  const handleSave = async () => {
    if (!userId || !customerId) return;
    setFeedback(null);
    try {
      await Promise.all([
        updateUser({
          variables: {
            data: {
              userId,
              name: name || undefined,
              phone: phone || undefined,
              country: country || undefined,
            },
          },
        }),
        updateCustomer({
          variables: {
            data: {
              customerId,
              defaultCity: defaultCity || undefined,
              defaultAddress: defaultAddress || undefined,
            },
          },
        }),
      ]);
      setFeedback({ kind: 'ok', text: 'Profile saved.' });
      // Refresh the in-memory user so the header / nav reflect the new name
      refreshUserToken().catch(() => {});
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Save failed' });
    }
  };

  const busy = updateCustomerState.loading || updateUserState.loading;

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/profile" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text} marginBottom="6px">
              Sign in to edit your profile
            </Text>
            <Link href="/login" style={{ color: solvoColors.indigo }}>
              Sign in
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  // Supplier-only users edit their business profile at /provider/settings
  if (!customerId && user.supplierId) {
    router.replace('/provider/settings');
    return null;
  }

  if (!customerId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/profile" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="460px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
              No customer profile on your account.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/profile" />

      <Box maxWidth="780px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.08em" fontWeight={600} marginBottom="6px">
          ACCOUNT
        </Text>
        <Text
          fontFamily={solvoFonts.serif}
          fontSize={{ base: '28px', md: '36px' }}
          color={solvoColors.text}
          marginBottom="6px"
        >
          Your profile
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="32px">
          Update your contact info and default location. These are used when you start a new request.
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

        {customerQuery.loading && !profile ? (
          <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
        ) : (
          <Flex direction="column" gap="20px">
            {/* Identity */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Identity
              </Text>

              <Flex gap="14px" wrap="wrap">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="Your name"
                  />
                </Box>
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Email (read only)</label>
                  <input
                    type="email"
                    value={profile?.user?.email ?? ''}
                    readOnly
                    style={{
                      ...inputBaseStyle,
                      background: solvoColors.bg,
                      color: solvoColors.textMuted,
                      cursor: 'not-allowed',
                    }}
                  />
                </Box>
              </Flex>

              <Flex gap="14px" wrap="wrap" marginTop="14px">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="+506 …"
                  />
                </Box>
                <Box flex="1" minWidth="160px">
                  <label style={labelStyle}>Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="Costa Rica"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Default location */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="4px">
                Default location
              </Text>
              <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="16px">
                Used to match you with nearby providers when you create a new request.
              </Text>

              <Box marginBottom="14px">
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  value={defaultCity}
                  onChange={(e) => setDefaultCity(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Santa Ana"
                />
              </Box>

              <Box>
                <label style={labelStyle}>Address (optional)</label>
                <input
                  type="text"
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Street, building, etc."
                />
              </Box>
            </Box>

            {/* Actions */}
            <Flex justify="flex-end" gap="10px">
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
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
