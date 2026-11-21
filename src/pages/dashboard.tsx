import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Box, Btn, Card, ContactLinks, Flex, Notice, PageTitle, SolvoNavBar, Stars, Text } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import { useDismissReviewPromptMutation, useMySavedContactsQuery, useProvincesQuery } from '@generated';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';

/**
 * "Mis contactos": the suppliers a signed-in customer reached out to (the
 * saved interactions), plus "How did it go?" prompts for ones they haven't
 * reviewed yet. Nothing else is tracked — no bookings, no requests.
 */
export default function MyContactsPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { isAuthenticated } = React.useContext(AuthContext);
  const { data, loading, refetch } = useMySavedContactsQuery({ skip: !isAuthenticated, fetchPolicy: 'cache-and-network' });
  const { data: prov } = useProvincesQuery();
  const [dismiss] = useDismissReviewPromptMutation();
  const [open, setOpen] = React.useState<number | null>(null);

  const provinceName = (code?: string | null) => prov?.provinces.find((p) => p.code === code)?.name ?? '';
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  const contacts = data?.mySavedContacts ?? [];
  const prompts = data?.reviewPrompts ?? [];

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <Box maxWidth="860px" margin="0 auto" padding={{ base: '20px 16px 60px', md: '32px 24px 80px' }}>
        <PageTitle title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

        {!isAuthenticated ? (
          <Notice>
            {t('dashboard.signInRequired')}{' '}
            <Link href="/login?next=/dashboard" style={{ fontWeight: 700, color: 'inherit' }}>
              {t('common.signIn')}
            </Link>
          </Notice>
        ) : (
          <>
            {prompts.length > 0 && (
              <Card marginBottom="20px" borderColor={solvoColors.accentBorder} bg={solvoColors.accentSoft}>
                <Text fontFamily={solvoFonts.display} fontWeight={700} fontSize="18px" color={solvoColors.text} marginBottom="8px">
                  {t('dashboard.promptsTitle')}
                </Text>
                <Flex direction="column" gap="8px">
                  {prompts.map((p) => (
                    <Flex key={p.supplierId} justify="space-between" align="center" gap="10px" wrap="wrap">
                      <Text fontSize="sm" color={solvoColors.text}>
                        {t('dashboard.promptLine', { name: p.companyName, date: fmt(p.contactedAt) })}
                      </Text>
                      <Flex gap="6px">
                        <Btn onClick={() => router.push(`/providers/${p.supplierId}#reviews`)} style={{ padding: '7px 12px' }}>
                          {t('dashboard.rateNow')}
                        </Btn>
                        <Btn
                          variant="secondary"
                          style={{ padding: '7px 12px' }}
                          onClick={async () => {
                            await dismiss({ variables: { supplierId: p.supplierId } });
                            await refetch();
                          }}
                        >
                          {t('dashboard.notNow')}
                        </Btn>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Card>
            )}

            {loading && contacts.length === 0 ? (
              <Text color={solvoColors.textSubtle}>{t('common.loading')}</Text>
            ) : contacts.length === 0 ? (
              <Card textAlign="center" padding="40px 20px">
                <Text color={solvoColors.textMuted} marginBottom="14px">
                  {t('dashboard.empty')}
                </Text>
                <Btn onClick={() => router.push('/')}>{t('dashboard.startChat')}</Btn>
              </Card>
            ) : (
              <Flex direction="column" gap="10px">
                {contacts.map((c) => (
                  <Card key={c.supplierId} padding="16px 18px">
                    <Flex justify="space-between" align="flex-start" gap="12px" wrap="wrap">
                      <Box minWidth={0}>
                        <Link href={`/providers/${c.supplierId}`} style={{ textDecoration: 'none' }}>
                          <Text fontWeight={700} color={solvoColors.text} fontSize="16px">
                            {c.companyName}
                          </Text>
                        </Link>
                        <Text fontSize="13px" color={solvoColors.textSubtle}>
                          {[c.city, provinceName(c.province)].filter(Boolean).join(', ')}
                        </Text>
                        <Text fontSize="12px" color={solvoColors.textSubtle} marginTop="4px">
                          {t('dashboard.lastContact', { date: fmt(c.lastContactedAt) })}
                          {c.contactCount > 1 && ` · ${t('dashboard.contactedTimes', { n: c.contactCount })}`}
                        </Text>
                        {c.myRating != null && (
                          <Flex align="center" gap="6px" marginTop="4px">
                            <Stars value={c.myRating} size={13} />
                          </Flex>
                        )}
                      </Box>
                      <Flex gap="6px">
                        <Btn variant="secondary" style={{ padding: '7px 12px' }} onClick={() => setOpen(open === c.supplierId ? null : c.supplierId)}>
                          {t('card.contact')}
                        </Btn>
                        {c.myRating == null && (
                          <Btn variant="ghost" style={{ padding: '7px 12px' }} onClick={() => router.push(`/providers/${c.supplierId}`)}>
                            {t('dashboard.rate')}
                          </Btn>
                        )}
                      </Flex>
                    </Flex>
                    {open === c.supplierId && (
                      <Box marginTop="12px">
                        <ContactLinks supplierId={c.supplierId} supplier={c} source="profile" />
                      </Box>
                    )}
                  </Card>
                ))}
              </Flex>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
