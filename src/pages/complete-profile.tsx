import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { AuthShell, Box, Btn, FieldLabel, Notice, SolvoNavBar, Text, TextField, inputStyle } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import { useCompleteOnboardingMutation, useProvincesQuery } from '@generated';
import AccountTypePicker, { type AccountType } from '@/shared/components/molecules/accountTypePicker';
import AuthContext from '@/shared/contexts/auth.context';
import { StorageService } from '@services';
import { useI18n } from '@/shared/i18n';

/** After Google/GitHub sign-up: pick customer or supplier and fill the gaps. */
export default function CompleteProfilePage() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const [completeOnboarding] = useCompleteOnboardingMutation();
  const { data: prov } = useProvincesQuery();
  const [type, setType] = useState<AccountType>('CUSTOMER');
  const [phone, setPhone] = useState('+506 ');
  const [companyName, setCompanyName] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && (user.isCustomer || user.isSupplier)) router.replace('/');
  }, [isAuthenticated, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (type === 'SUPPLIER' && !companyName.trim()) return setError(t('auth.companyRequired'));
    setSubmitting(true);
    try {
      const res = await completeOnboarding({
        variables: {
          data: {
            role: type,
            phone: phone.replace(/\s+/g, '') || undefined,
            country: 'CR',
            companyName: type === 'SUPPLIER' ? companyName.trim() : undefined,
            province: type === 'SUPPLIER' && province ? province : undefined,
          },
        },
      });
      const token = res.data?.completeOnboarding.access_token;
      if (token) await StorageService.setJwtToken(token);
      await refreshUserToken();
      router.push(type === 'SUPPLIER' ? '/provider' : '/');
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
          {t('auth.completeTitle')}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="18px">
          {t('auth.completeSub')}
        </Text>
        <AccountTypePicker value={type} onChange={setType} />
        <form onSubmit={submit}>
          <TextField label={t('auth.phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
            {submitting ? t('common.loading') : t('auth.completeSubmit')}
          </Btn>
        </form>
      </AuthShell>
    </Box>
  );
}
