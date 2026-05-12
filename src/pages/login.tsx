import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Box, Flex, Text } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';

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

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const ok = await login({ credentials: { email, password } } as any);
      if (ok) {
        const next = (router.query.next as string) || '/';
        router.push(next);
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg} position="relative" overflow="hidden">
      {/* Atmospheric gradients */}
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

      <Flex minHeight="100vh" align="center" justify="center" padding="24px">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '420px' }}
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
              Welcome back.
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
              Sign in to manage your requests, quotes, and bookings.
            </Text>

            <form onSubmit={handleSubmit}>
              <Box marginBottom="14px">
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </Box>

              <Box marginBottom="18px">
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={4}
                  style={inputStyle}
                />
              </Box>

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
                disabled={isLoading}
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
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <Flex justify="center" marginTop="20px">
              <Text fontSize="sm" color={solvoColors.textMuted}>
                Don't have an account?{' '}
                <Link href="/register" style={{ color: solvoColors.indigo, fontWeight: 600 }}>
                  Sign up
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
