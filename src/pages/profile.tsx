import * as React from 'react';
import { useRouter } from 'next/router';

import { Box, Btn, Card, Chip, Flex, FieldLabel, Notice, PageTitle, SolvoNavBar, TextField, inputStyle } from '@components';
import { solvoColors } from '@constants';
import { Language, useUpdateMeMutation } from '@generated';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n, type Lang } from '@/shared/i18n';

/** Account settings: name, phone, language, sign out. */
export default function AccountPage() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const { user, isAuthenticated, logout, refreshUserToken } = React.useContext(AuthContext);
  const [updateMe, { loading }] = useUpdateMeMutation();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [msg, setMsg] = React.useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setPhone(user.phone ?? '');
  }, [user?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (isAuthenticated === false && typeof window !== 'undefined' && !localStorage.getItem('@token')) {
      router.replace('/login?next=/profile');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
      </Box>
    );
  }

  const changeLanguage = async (next: Lang) => {
    setLang(next);
    // Saved on the account too, for future emails.
    await updateMe({ variables: { data: { language: next === 'es' ? Language.Spanish : Language.English } } }).catch(() => undefined);
  };

  const save = async () => {
    setMsg(null);
    try {
      await updateMe({ variables: { data: { name: name.trim(), phone: phone.trim() } } });
      await refreshUserToken();
      setMsg({ tone: 'success', text: t('common.saved') });
    } catch (e: any) {
      setMsg({ tone: 'error', text: e?.message ?? t('common.error') });
    }
  };

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <Box maxWidth="560px" margin="0 auto" padding={{ base: '20px 16px 60px', md: '32px 24px' }}>
        <PageTitle title={t('account.title')} />
        <Flex gap="6px" marginBottom="16px" wrap="wrap">
          {user.isCustomer && <Chip tone="brand">{t('account.typeCustomer')}</Chip>}
          {user.isSupplier && <Chip tone="brand">{t('account.typeSupplier')}</Chip>}
          {user.isAdmin && <Chip tone="accent">{t('account.typeAdmin')}</Chip>}
        </Flex>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <Card>
          <TextField label={t('account.email')} value={user.email ?? ''} disabled style={{ opacity: 0.7 }} />
          <TextField label={t('account.name')} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          <TextField label={t('account.phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+506" />
          <Box marginBottom="16px">
            <FieldLabel>{t('account.language')}</FieldLabel>
            <select value={lang} onChange={(e) => changeLanguage(e.target.value as Lang)} style={inputStyle}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </Box>
          <Flex justify="space-between" gap="8px">
            <Btn
              variant="secondary"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
            >
              {t('common.signOut')}
            </Btn>
            <Btn onClick={save} disabled={loading || name.trim().length < 2}>
              {loading ? t('common.saving') : t('common.save')}
            </Btn>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
