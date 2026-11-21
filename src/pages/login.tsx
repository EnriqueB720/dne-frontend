import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AuthShell, Box, Btn, Flex, Logo, Notice, SocialAuthButtons, SolvoNavBar, Text, TextField } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import PasswordField from '@/shared/components/molecules/passwordField';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await login({ credentials: { email, password } } as any);
    if (ok) router.push(next);
    else setError(t('auth.invalid'));
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <AuthShell>
        <Box marginBottom="16px">
          <Logo size="lg" showText={false} />
        </Box>
        <Text fontFamily={solvoFonts.display} fontSize="30px" fontWeight={700} color={solvoColors.text}>
          {t('auth.loginTitle')}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="22px">
          {t('auth.loginSub')}
        </Text>
        <form onSubmit={submit}>
          <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <PasswordField label={t('auth.password')} value={password} onChange={setPassword} minLength={4} />
          <Flex justify="flex-end" marginTop="-6px" marginBottom="14px">
            <Link href="/forgot-password" style={{ fontSize: '13px', color: solvoColors.brandText, textDecoration: 'none' }}>
              {t('auth.forgot')}
            </Link>
          </Flex>
          {error && <Notice tone="error">{error}</Notice>}
          <Btn type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px' }}>
            {isLoading ? t('common.loading') : t('auth.loginSubmit')}
          </Btn>
        </form>
        <Flex align="center" gap="10px" margin="18px 0" color={solvoColors.textSubtle} fontSize="12px">
          <Box flex="1" height="1px" bg={solvoColors.border} />
          {t('common.or')}
          <Box flex="1" height="1px" bg={solvoColors.border} />
        </Flex>
        <SocialAuthButtons callbackUrl={next} />
        <Text fontSize="sm" color={solvoColors.textMuted} textAlign="center" marginTop="20px">
          {t('auth.noAccount')}{' '}
          <Link href="/register" style={{ color: solvoColors.brandText, fontWeight: 700 }}>
            {t('auth.createOne')}
          </Link>
        </Text>
      </AuthShell>
    </Box>
  );
}
