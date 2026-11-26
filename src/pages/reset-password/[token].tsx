import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AuthShell, Box, Btn, Notice, SolvoNavBar, Text } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import { useResetPasswordMutation } from '@generated';
import PasswordField from '@/shared/components/molecules/passwordField';
import { useI18n } from '@/shared/i18n';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const token = typeof router.query.token === 'string' ? router.query.token : '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resetPassword, { loading }] = useResetPasswordMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError(t('auth.tooShort'));
    if (password !== confirm) return setError(t('auth.mismatch'));
    try {
      await resetPassword({ variables: { data: { token, newPassword: password } } });
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? t('common.error'));
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <AuthShell>
        <Text fontFamily={solvoFonts.display} fontSize="28px" fontWeight={700} color={solvoColors.text} marginBottom="16px">
          {t('auth.resetTitle')}
        </Text>
        {done ? (
          <Notice tone="success">{t('auth.resetDone')}</Notice>
        ) : (
          <form onSubmit={submit}>
            <PasswordField label={t('auth.newPassword')} value={password} onChange={setPassword} autoComplete="new-password" minLength={8} />
            <PasswordField label={t('auth.confirmPassword')} value={confirm} onChange={setConfirm} autoComplete="new-password" minLength={8} />
            {error && <Notice tone="error">{error}</Notice>}
            <Btn type="submit" disabled={loading || !token} style={{ width: '100%', padding: '12px' }}>
              {loading ? t('common.loading') : t('auth.resetSubmit')}
            </Btn>
          </form>
        )}
        <Box marginTop="18px" textAlign="center">
          <Link href="/login" style={{ fontSize: '14px', color: solvoColors.brandText }}>
            {t('auth.backToLogin')}
          </Link>
        </Box>
      </AuthShell>
    </Box>
  );
}
