import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, User as UserIcon, Briefcase } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import { Box, Flex, Text } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import { useSignupMutation } from '@generated';

type Role = 'CUSTOMER' | 'SUPPLIER';

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

export default function RegisterPage() {
  const router = useRouter();
  const { login, isLoading } = useContext(AuthContext);
  const [signup] = useSignupMutation();

  const [role, setRole] = useState<Role>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+506');
  const [country, setCountry] = useState('CR');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (role === 'SUPPLIER' && !companyName.trim()) {
      setError('Company name is required for supplier accounts');
      setSubmitting(false);
      return;
    }

    try {
      await signup({
        variables: {
          data: {
            email,
            name,
            password,
            phone,
            country,
            role,
            companyName: role === 'SUPPLIER' ? companyName : undefined,
          } as any,
        },
      });

      // Auto-login after successful signup
      const ok = await login({ credentials: { email, password } } as any);
      if (ok) {
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err?.message?.replace(/^GraphQL error: /, '') ?? 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg} position="relative" overflow="hidden">
      {/* Atmospheric gradients */}
      <Box
        position="absolute"
        top="-200px"
        left="-200px"
        width="500px"
        height="500px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12), transparent 70%)',
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
              Create your account.
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
              Tell us who you are so we can set up your workspace.
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
              <Flex gap="12px" wrap="wrap" marginBottom="14px">
                <Box flex="1" minWidth="180px">
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={4}
                    style={inputStyle}
                  />
                </Box>
                <Box flex="1" minWidth="180px">
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </Box>
              </Flex>

              <Box marginBottom="14px">
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  style={inputStyle}
                />
              </Box>

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
                <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="4px">
                  Country detected from the dial code: <strong>{country}</strong>
                </Text>
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
                disabled={submitting || isLoading}
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
                  opacity: submitting || isLoading ? 0.6 : 1,
                }}
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <Flex justify="center" marginTop="20px">
              <Text fontSize="sm" color={solvoColors.textMuted}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: solvoColors.indigo, fontWeight: 600 }}>
                  Sign in
                </Link>
              </Text>
            </Flex>
          </Box>

          <Flex justify="center" marginTop="16px">
            <Link href="/" style={{ color: solvoColors.textSubtle, fontSize: '13px' }}>
              ← Back home
            </Link>
          </Flex>
        </motion.div>
      </Flex>
    </Box>
  );
}
