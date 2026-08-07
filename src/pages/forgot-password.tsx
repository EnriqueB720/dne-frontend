import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Box, Flex, Text } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useRequestPasswordResetMutation } from '@generated';

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [requestReset, { loading }] = useRequestPasswordResetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await requestReset({ variables: { data: { email } } });
      // The mutation always returns ok=true regardless of whether the
      // email is registered — that's intentional (prevents enumeration).
      // The resetUrl field is populated only when the account actually
      // exists and has a password, since we have no email service yet.
      setResetUrl(res.data?.requestPasswordReset.resetUrl ?? null);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <Flex minHeight="100vh" align="center" justify="center" padding="24px">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <Box
            bg={solvoColors.surface}
            borderWidth="1px"
            borderStyle="solid"
            borderColor={solvoColors.border}
            borderRadius="24px"
            padding="36px"
            style={{ boxShadow: solvoShadows.floatingPanel }}
          >
            <Flex align="center" gap="10px" marginBottom="24px">
              <Box
                width="36px"
                height="36px"
                borderRadius="10px"
                bg={solvoColors.indigoLight}
                color={solvoColors.indigo}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Sparkles size={18} />
              </Box>
              <Text
                fontFamily={solvoFonts.serif}
                fontSize="22px"
                color={solvoColors.text}
              >
                Reset your password
              </Text>
            </Flex>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <Text color={solvoColors.textMuted} fontSize="sm" marginBottom="20px">
                  Enter your email and we&apos;ll send you a link to set a new password.
                </Text>

                <Box marginBottom="18px">
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
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: solvoColors.text,
                    color: solvoColors.surface,
                    fontWeight: 600,
                    fontSize: '15px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            ) : (
              <Box>
                <Text color={solvoColors.text} marginBottom="10px">
                  If <strong>{email}</strong> is registered, a reset link is on its way.
                </Text>

                {resetUrl ? (
                  <Box
                    marginTop="18px"
                    padding="14px"
                    borderRadius="12px"
                    bg={solvoColors.indigoLight}
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor={solvoColors.indigoBorder}
                  >
                    <Text
                      fontSize="xs"
                      color={solvoColors.indigo}
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      fontWeight={600}
                      marginBottom="6px"
                    >
                      Dev preview
                    </Text>
                    <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="10px">
                      Email isn&apos;t wired up yet, so use this link to reset:
                    </Text>
                    <Link
                      href={resetUrl.replace(/^https?:\/\/[^/]+/, '')}
                      style={{
                        color: solvoColors.indigo,
                        fontSize: '13px',
                        wordBreak: 'break-all',
                        textDecoration: 'underline',
                      }}
                    >
                      {resetUrl}
                    </Link>
                  </Box>
                ) : (
                  <Text
                    fontSize="sm"
                    color={solvoColors.textSubtle}
                    marginTop="14px"
                  >
                    Check your inbox — the link expires in 1 hour.
                  </Text>
                )}

                <Flex justify="center" marginTop="24px">
                  <Link
                    href="/login"
                    style={{ color: solvoColors.textMuted, fontSize: '14px' }}
                  >
                    ← Back to sign in
                  </Link>
                </Flex>
              </Box>
            )}

            {!submitted && (
              <Text
                textAlign="center"
                marginTop="24px"
                fontSize="sm"
                color={solvoColors.textMuted}
              >
                Remembered it?{' '}
                <Link href="/login" style={{ color: solvoColors.indigo }}>
                  Sign in
                </Link>
              </Text>
            )}
          </Box>
        </motion.div>
      </Flex>
    </Box>
  );
}
