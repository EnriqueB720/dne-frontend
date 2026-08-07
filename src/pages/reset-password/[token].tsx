import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Box, Flex, Text } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useResetPasswordMutation } from '@generated';

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

// Password field with a visibility toggle button anchored to the right
// edge. Extra right-padding on the input keeps typed text from sliding
// under the button. Deliberately not a component — it's used twice in
// one file, extracting adds more indirection than it removes.
const passwordInputStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: '42px',
};

const toggleButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '10px',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: solvoColors.textSubtle,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const rawToken = router.query.token;
  // Next.js routes with dynamic segments return the param as `string |
  // string[] | undefined`. Only accept the string form; anything else is
  // a malformed URL and gets an immediate error.
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // Independent visibility toggles per field so users can eyeball the new
  // password without also revealing what they typed in "confirm" (and vice
  // versa if they only want to double-check the second box).
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [resetPassword, { loading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError('This reset link is malformed.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords don’t match.');
      return;
    }
    try {
      await resetPassword({
        variables: { data: { token, newPassword: password } },
      });
      setDone(true);
      // Give the user a beat to see the success state, then bounce them
      // to login so they can sign in with the new password.
      setTimeout(() => router.push('/login'), 1800);
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
                Set a new password
              </Text>
            </Flex>

            {done ? (
              <Box>
                <Box
                  padding="12px 14px"
                  borderRadius="10px"
                  bg={solvoColors.successLight}
                  color={solvoColors.successText}
                  marginBottom="14px"
                >
                  <Text fontSize="sm">
                    Password updated. Redirecting to sign in…
                  </Text>
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Text color={solvoColors.textMuted} fontSize="sm" marginBottom="20px">
                  Choose a strong password of at least 8 characters.
                </Text>

                <Box marginBottom="14px">
                  <label style={labelStyle}>New password</label>
                  <Box position="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      style={passwordInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={toggleButtonStyle}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Box>
                </Box>

                <Box marginBottom="18px">
                  <label style={labelStyle}>Confirm new password</label>
                  <Box position="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      style={passwordInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      style={toggleButtonStyle}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      title={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </Box>
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
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
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
        </motion.div>
      </Flex>
    </Box>
  );
}
