import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AuthShell, Box, Btn, FieldLabel, Flex, Notice, SocialAuthButtons, SolvoNavBar, Text, TextField, inputStyle } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import { useProvincesQuery, useSignupMutation } from '@generated';
import AccountTypePicker, { type AccountType } from '@/shared/components/molecules/accountTypePicker';
import PasswordField from '@/shared/components/molecules/passwordField';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';

/** Sign-up for customers (optional — the chat works without it) and suppliers. */
export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { login } = useContext(AuthContext);
  const [signup] = useSignupMutation();
  const { data: prov } = useProvincesQuery();

  const [type, setType] = useState<AccountType>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+506 ');
  const [companyName, setCompanyName] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (router.query.type === 'supplier') setType('SUPPLIER');
  }, [router.query.type]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError(t('auth.tooShort'));
    if (type === 'SUPPLIER' && !companyName.trim()) return setError(t('auth.companyRequired'));

    setSubmitting(true);
    try {
      await signup({
        variables: {
          data: {
            email: email.trim(),
            name: name.trim(),
            password,
            phone: phone.replace(/\s+/g, ''),
            country: 'CR',
            role: type,
            companyName: type === 'SUPPLIER' ? companyName.trim() : undefined,
            province: type === 'SUPPLIER' && province ? province : undefined,
          },
        },
      });
      const ok = await login({ credentials: { email: email.trim(), password } } as any);
      router.push(ok ? (type === 'SUPPLIER' ? '/provider' : '/') : '/login');
    } catch (err: any) {
      setError(err?.message ?? t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <AuthShell>
        <Text fontFamily={solvoFonts.display} fontSize="28px" fontWeight={700} color={solvoColors.text}>
          {t('auth.registerTitle')}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="18px">
          {t('auth.registerSub')}
        </Text>
        <AccountTypePicker value={type} onChange={setType} />
        <form onSubmit={submit}>
          <TextField label={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} required minLength={4} maxLength={100} autoComplete="name" />
          <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <PasswordField label={t('auth.password')} hint={t('auth.passwordHint')} value={password} onChange={setPassword} autoComplete="new-password" minLength={8} />
          <TextField label={t('auth.phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
          {type === 'SUPPLIER' && (
            <>
              <TextField label={t('auth.companyName')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required maxLength={120} />
              <Box marginBottom="14px">
                <FieldLabel>{t('auth.province')}</FieldLabel>
                <select value={province} onChange={(e) => setProvince(e.target.value)} style={inputStyle}>
                  <option value="">—</option>
                  {(prov?.provinces ?? []).map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Box>
            </>
          )}
          {error && <Notice tone="error">{error}</Notice>}
          <Btn type="submit" disabled={submitting} style={{ width: '100%', padding: '12px' }}>
            {submitting ? t('common.loading') : t('auth.registerSubmit')}
          </Btn>
        </form>
        <Flex align="center" gap="10px" margin="18px 0" color={solvoColors.textSubtle} fontSize="12px">
          <Box flex="1" height="1px" bg={solvoColors.border} />
          {t('common.or')}
          <Box flex="1" height="1px" bg={solvoColors.border} />
        </Flex>
        <SocialAuthButtons callbackUrl="/" />
        <Text fontSize="sm" color={solvoColors.textMuted} textAlign="center" marginTop="20px">
          {t('auth.haveAccount')}{' '}
          <Link href="/login" style={{ color: solvoColors.brandText, fontWeight: 700 }}>
            {t('common.signIn')}
          </Link>
        </Text>
      </AuthShell>
    </Box>
  );
}
