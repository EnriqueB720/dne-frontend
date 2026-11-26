import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPin, ShieldCheck } from 'lucide-react';

import { Box, Btn, Card, Chip, ContactLinks, Flex, Notice, SectionTitle, SolvoNavBar, StarInput, Stars, Text, inputStyle } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useDeleteReviewMutation, useSaveReviewMutation, useSupplierQuery, useSupplierReviewsQuery } from '@generated';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';
import { categoryName, formatPrice } from '@/shared/lib/supplier';

/**
 * Public supplier profile: who they are, where they work, how to contact
 * them and what customers say. Anyone can view it; signed-in
 * customers can leave (or edit) one review.
 */
export default function SupplierProfilePage() {
  const router = useRouter();
  const { t, lang, locale } = useI18n();
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const supplierId = Number(router.query.id);
  const valid = Number.isFinite(supplierId) && supplierId > 0;

  const { data, loading, error, refetch } = useSupplierQuery({ variables: { supplierId }, skip: !valid });
  const reviewsQuery = useSupplierReviewsQuery({ variables: { supplierId }, skip: !valid, fetchPolicy: 'cache-and-network' });
  const [saveReview, saveState] = useSaveReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const s = data?.supplier;
  const reviews = reviewsQuery.data?.supplierReviews ?? [];
  const mine = reviews.find((r) => r.isMine);
  const isOwn = user?.supplierId != null && user.supplierId === supplierId;

  const [rating, setRating] = React.useState(0);
  const [text, setText] = React.useState('');
  const [reviewError, setReviewError] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setText(mine.text ?? '');
    }
  }, [mine?.reviewId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitReview = async () => {
    setReviewError(null);
    try {
      await saveReview({ variables: { data: { supplierId, rating, text: text.trim() || undefined } } });
      await Promise.all([reviewsQuery.refetch(), refetch()]);
    } catch (e: any) {
      setReviewError(e?.message ?? t('common.error'));
    }
  };

  if (router.isReady && (!valid || (!loading && (error || !s)))) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
        <Box maxWidth="720px" margin="60px auto" padding="0 20px" textAlign="center">
          <Text color={solvoColors.textMuted}>{t('profile.notFound')}</Text>
          <Link href="/" style={{ color: solvoColors.brandText }}>
            {t('chat.backHome')}
          </Link>
        </Box>
      </Box>
    );
  }
  if (!s) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
        <Text textAlign="center" marginTop="80px" color={solvoColors.textSubtle}>
          {t('common.loading')}
        </Text>
      </Box>
    );
  }

  const cats = [...(s.categories ?? [])].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const place = [s.city, s.provinceName].filter(Boolean).join(', ');

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <Box maxWidth="1080px" margin="0 auto" padding={{ base: '20px 16px 60px', md: '32px 24px 80px' }}>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'transparent', color: solvoColors.textSubtle, cursor: 'pointer', fontSize: '13px', marginBottom: '16px', padding: 0 }}>
          {t('common.back')}
        </button>

        {isOwn && (
          <Notice tone="info">
            {t('profile.ownProfile')}{' '}
            <Link href="/provider" style={{ fontWeight: 700, color: 'inherit' }}>
              {t('profile.editBusiness')} →
            </Link>
          </Notice>
        )}


        <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="24px" alignItems="start">
          <Flex direction="column" gap="20px">
            <Box>
              <Flex align="center" gap="8px" wrap="wrap">
                <Text fontFamily={solvoFonts.display} fontSize={{ base: '28px', md: '36px' }} fontWeight={700} color={solvoColors.text} letterSpacing="-0.02em">
                  {s.companyName}
                </Text>
                {s.verified && (
                  <Chip tone="brand">
                    <ShieldCheck size={13} /> {t('profile.verifiedBy')}
                  </Chip>
                )}
                {s.preferred && <Chip tone="accent">{t('common.preferred')}</Chip>}
              </Flex>
              {s.tagline && (
                <Text fontSize="lg" color={solvoColors.textMuted} marginTop="4px">
                  {s.tagline}
                </Text>
              )}
              <Flex gap="14px" wrap="wrap" marginTop="10px" fontSize="sm" color={solvoColors.textSubtle} align="center">
                {(s.reviewCount ?? 0) > 0 ? (
                  <Flex align="center" gap="6px">
                    <Stars value={Number(s.rating ?? 0)} />
                    <Text fontWeight={600} color={solvoColors.text}>
                      {Number(s.rating).toFixed(1)}
                    </Text>
                    <Text>({s.reviewCount === 1 ? t('common.oneReview') : t('common.reviewsCount', { n: s.reviewCount ?? 0 })})</Text>
                  </Flex>
                ) : (
                  <Chip>{t('common.newSupplier')}</Chip>
                )}
                {place && (
                  <Flex align="center" gap="4px">
                    <MapPin size={14} /> {place}
                  </Flex>
                )}
              </Flex>
              {cats.length > 0 && (
                <Flex gap="6px" wrap="wrap" marginTop="12px">
                  {cats.map((c) => c.category && <Chip key={c.category.categoryId}>{c.category.icon} {categoryName(c.category, lang)}</Chip>)}
                </Flex>
              )}
            </Box>

            {s.description && (
              <Card>
                <SectionTitle>{t('profile.about')}</SectionTitle>
                <Text color={solvoColors.textMuted} lineHeight="1.7" whiteSpace="pre-line">
                  {s.description}
                </Text>
                {(s.skills?.length ?? 0) > 0 && (
                  <Box marginTop="14px">
                    <Text fontSize="12px" fontWeight={700} color={solvoColors.textSubtle} marginBottom="6px">
                      {t('profile.skills').toUpperCase()}
                    </Text>
                    <Flex gap="6px" wrap="wrap">
                      {s.skills!.map((sk) => (
                        <Chip key={sk}>{sk}</Chip>
                      ))}
                    </Flex>
                  </Box>
                )}
              </Card>
            )}

            {(s.services?.length ?? 0) > 0 && (
              <Card>
                <SectionTitle>{t('profile.services')}</SectionTitle>
                <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="10px">
                  {s.services!.map((sv) => (
                    <Box key={sv.serviceId} padding="12px 14px" bg={solvoColors.bg} borderRadius="12px">
                      <Text fontWeight={600} color={solvoColors.text}>
                        {sv.name}
                      </Text>
                      {sv.description && (
                        <Text fontSize="sm" color={solvoColors.textMuted} marginTop="2px">
                          {sv.description}
                        </Text>
                      )}
                      <Text fontSize="sm" fontWeight={600} color={solvoColors.accentText} marginTop="6px">
                        {formatPrice(sv.priceFrom, sv.priceUnit, t, sv.currency)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}

            <Card>
              <SectionTitle>{t('profile.reviews')}</SectionTitle>
              {isAuthenticated && user?.isCustomer && !isOwn ? (
                <Box marginBottom="18px" padding="14px" bg={solvoColors.bg} borderRadius="12px">
                  <Text fontWeight={600} color={solvoColors.text} marginBottom="8px">
                    {mine ? t('profile.editReview') : t('profile.writeReview')}
                  </Text>
                  <StarInput value={rating} onChange={setRating} />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('profile.commentPlaceholder')}
                    maxLength={2000}
                    style={{ ...inputStyle, minHeight: '80px', marginTop: '10px', resize: 'vertical' }}
                  />
                  {reviewError && (
                    <Text fontSize="sm" color={solvoColors.roseText} marginTop="6px">
                      {reviewError}
                    </Text>
                  )}
                  <Flex gap="8px" marginTop="10px">
                    <Btn onClick={submitReview} disabled={rating < 1 || saveState.loading}>
                      {saveState.loading ? t('common.saving') : mine ? t('profile.updateReview') : t('profile.submitReview')}
                    </Btn>
                    {mine && (
                      <Btn
                        variant="ghost"
                        onClick={async () => {
                          await deleteReview({ variables: { reviewId: mine.reviewId } });
                          setRating(0);
                          setText('');
                          await Promise.all([reviewsQuery.refetch(), refetch()]);
                        }}
                      >
                        {t('profile.deleteReview')}
                      </Btn>
                    )}
                  </Flex>
                </Box>
              ) : !isOwn ? (
                <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="14px">
                  {isAuthenticated && user?.isSupplier ? (
                    t('profile.suppliersCantReview')
                  ) : (
                    <Link href={`/login?next=${encodeURIComponent(router.asPath)}`} style={{ color: solvoColors.brandText }}>
                      {t('profile.signInToReview')}
                    </Link>
                  )}
                </Text>
              ) : null}

              {reviews.length === 0 ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  {t('profile.noReviews')}
                </Text>
              ) : (
                <Flex direction="column" gap="14px">
                  {reviews.map((r) => (
                    <Box key={r.reviewId} borderTop="1px solid" borderColor={solvoColors.border} paddingTop="12px">
                      <Flex justify="space-between" align="center" gap="8px">
                        <Text fontWeight={600} fontSize="sm" color={solvoColors.text}>
                          {r.reviewerName} {r.isMine && <span style={{ color: solvoColors.textSubtle, fontWeight: 400 }}>{t('profile.you')}</span>}
                        </Text>
                        <Text fontSize="12px" color={solvoColors.textSubtle}>
                          {new Date(r.createdAt).toLocaleDateString(locale)}
                        </Text>
                      </Flex>
                      <Stars value={r.rating} />
                      {r.text && (
                        <Text fontSize="sm" color={solvoColors.textMuted} marginTop="4px" whiteSpace="pre-line">
                          {r.text}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Flex>
              )}
            </Card>
          </Flex>

          <Box position={{ lg: 'sticky' }} top="88px">
            <Card style={{ boxShadow: solvoShadows.floatingPanel }}>
              <SectionTitle>{t('profile.contact')}</SectionTitle>
              <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="12px">
                {t('profile.contactHint')}
              </Text>
              <ContactLinks supplierId={s.supplierId} supplier={s} source="profile" emptyText={t('profile.noContact')} />
              <Box marginTop="18px" borderTop="1px solid" borderColor={solvoColors.border} paddingTop="14px">
                {place && (
                  <Text fontSize="sm" color={solvoColors.textMuted}>
                    <b>{t('profile.basedIn')}:</b> {place}
                    {s.address ? ` · ${s.address}` : ''}
                  </Text>
                )}
                {(s.serviceProvinceNames?.length ?? 0) > 0 && (
                  <Text fontSize="sm" color={solvoColors.textMuted} marginTop="6px">
                    <b>{t('profile.serves')}:</b> {s.serviceProvinceNames!.join(', ')}
                  </Text>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
