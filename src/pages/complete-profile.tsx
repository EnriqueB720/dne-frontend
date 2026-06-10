import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { Sparkles, User as UserIcon, Briefcase } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import { Box, Flex, Text } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';

type Role = 'CUSTOMER' | 'SUPPLIER';

// Inline gql (no codegen dependency) — mirrors the conversation.service pattern.
const COMPLETE_ONBOARDING = gql`
  mutation completeOnboarding($data: CompleteOnboardingInput!) {
    completeOnboarding(data: $data) {
      access_token
      user {
        userId
        isCustomer
        isSupplier
      }
    }
  }
`;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '15px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const [completeOnboarding] = useMutation(COMPLETE_ONBOARDING);

  const [role, setRole] = useState<Role>('CUSTOMER');
  const [phone, setPhone] = useState('+506');
  const [country, setCountry] = useState('CR');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already onboarded (or arrived here directly without a session) → leave.
  useEffect(() => {
    if (isAuthenticated && user && (user.isCustomer || user.isSupplier)) {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'SUPPLIER' && !companyName.trim()) {
      setError('Company name is required for supplier accounts');
      return;
    }

    setSubmitting(true);
    try {
      await completeOnboarding({
        variables: {
          data: {
            role,
            phone,
            country,
            companyName: role === 'SUPPLIER' ? companyName : undefined,
          },
        },
      });

      // Reload the profile (roles now set) on the existing token, then go home.
      await refreshUserToken();
      router.push('/');
    } catch (err: any) {
      setError(
        err?.message?.replace(/^GraphQL error: /, '') ??
          'Could not finish setting up your account',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="-200px"
        right="-200px"
        width="500px"
        height="500px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Flex minHeight="100vh" align="center" justify="center" padding="24px 16px">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          <Box
            bg={solvoColors.surface}
            border={`1px solid ${solvoColors.border}`}
            borderRadius="24px"
            padding="36px 32px"
            style={{ boxShadow: solvoShadows.heroInput }}
          >
            <Flex
              width="44px"
              height="44px"
              borderRadius="12px"
              bg={solvoColors.indigoLight}
              color={solvoColors.indigo}
              align="center"
              justify="center"
              marginBottom="18px"
            >
              <Sparkles size={20} />
            </Flex>

            <Text fontFamily={solvoFonts.serif} fontSize="32px" color={solvoColors.text} marginBottom="6px">
              Almost there{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
              Tell us how you'll use the platform so we can set up your workspace.
            </Text>

            {/* Role toggle */}
            <Flex gap="10px" marginBottom="20px">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: `1px solid ${role === 'CUSTOMER' ? solvoColors.text : solvoColors.border}`,
                  background: role === 'CUSTOMER' ? solvoColors.bg : solvoColors.surface,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: solvoFonts.sans,
                }}
              >
                <Flex align="center" gap="8px" marginBottom="4px">
                  <UserIcon size={16} color={solvoColors.indigo} />
                  <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                    Customer
                  </Text>
                </Flex>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  Looking for services
                </Text>
              </button>

              <button
                type="button"
                onClick={() => setRole('SUPPLIER')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: `1px solid ${role === 'SUPPLIER' ? solvoColors.text : solvoColors.border}`,
                  background: role === 'SUPPLIER' ? solvoColors.bg : solvoColors.surface,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: solvoFonts.sans,
                }}
              >
                <Flex align="center" gap="8px" marginBottom="4px">
                  <Briefcase size={16} color={solvoColors.indigo} />
                  <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                    Supplier
                  </Text>
                </Flex>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  Offering services
                </Text>
              </button>
            </Flex>

            <form onSubmit={handleSubmit}>
              <Box marginBottom="14px" className="solvo-phone-field">
                <label style={labelStyle}>Phone</label>
                <PhoneInput
                  defaultCountry="cr"
                  value={phone}
                  onChange={(phoneValue, meta) => {
                    setPhone(phoneValue);
                    const iso2 = (meta as any)?.country?.iso2;
                    if (iso2) setCountry(iso2.toUpperCase());
                  }}
                  inputStyle={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '0 10px 10px 0',
                    border: `1px solid ${solvoColors.border}`,
                    borderLeft: 'none',
                    background: solvoColors.surface,
                    color: solvoColors.text,
                    fontFamily: solvoFonts.sans,
                    fontSize: '15px',
                    outline: 'none',
                    height: '46px',
                  }}
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      borderRadius: '10px 0 0 10px',
                      border: `1px solid ${solvoColors.border}`,
                      borderRight: 'none',
                      padding: '0 10px',
                      height: '46px',
                      background: solvoColors.surface,
                    },
                  }}
                />
              </Box>

              {role === 'SUPPLIER' && (
                <Box marginBottom="14px">
                  <label style={labelStyle}>Company name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Your business name"
                    style={inputStyle}
                  />
                </Box>
              )}

              {error && (
                <Box
                  padding="10px 12px"
                  borderRadius="10px"
                  bg={solvoColors.roseLight}
                  color={solvoColors.roseText}
                  marginBottom="14px"
                >
                  <Text fontSize="sm">{error}</Text>
                </Box>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: solvoColors.text,
                  color: solvoColors.surface,
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: solvoFonts.sans,
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? 'Setting up…' : 'Finish setup'}
              </button>
            </form>
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
}
