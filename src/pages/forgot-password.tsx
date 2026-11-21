import { useState } from 'react';
import Link from 'next/link';

import { AuthShell, Box, Btn, Notice, SolvoNavBar, Text, TextField } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import { useRequestPasswordResetMutation } from '@generated';
import { useI18n } from '@/shared/i18n';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestReset, { loading }] = useRequestPasswordResetMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await requestReset({ variables: { data: { email: email.trim() } } });
      // Always "sent" — the API never reveals whether the email exists.
      // Outside production it returns the link so developers can click it.
      setResetUrl(res.data?.requestPasswordReset.resetUrl ?? null);
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? t('common.error'));
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <AuthShell>
        <Text fontFamily={solvoFonts.display} fontSize="28px" fontWeight={700} color={solvoColors.text}>
          {t('auth.forgotTitle')}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="18px">
          {t('auth.forgotSub')}
        </Text>
        {sent ? (
          <>
            <Notice tone="success">{t('auth.forgotSent')}</Notice>
            {resetUrl && (
              <Notice>
                {t('auth.devResetLink')}{' '}
                <a href={resetUrl} style={{ color: 'inherit', wordBreak: 'break-all' }}>
                  {resetUrl}
                </a>
              </Notice>
            )}
          </>
        ) : (
          <form onSubmit={submit}>
            <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <Notice tone="error">{error}</Notice>}
            <Btn type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
              {loading ? t('common.loading') : t('auth.forgotSubmit')}
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
