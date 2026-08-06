import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, Pill } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  PromotionTier,
  useFavoritesByCustomerQuery,
  useSupplierQuery,
  useToggleFavoriteMutation,
} from '@generated';

/**
 * Whether a supplier currently qualifies for the "Sponsored" badge. Treats
 * an expired or future-dated FEATURED promotion as inactive.
 */
function isSponsoredActive(
  tier: PromotionTier | null | undefined,
  startDate: unknown,
  endDate: unknown,
): boolean {
  if (tier !== PromotionTier.Featured) return false;
  const now = Date.now();
  if (startDate && new Date(startDate as string).getTime() > now) return false;
  if (endDate && new Date(endDate as string).getTime() < now) return false;
  return true;
}

const PHOTO_TILES = ['🍽️', '🥗', '🍰', '🥂', '🌮'];

const formatColones = (value: string | number | null | undefined): string => {
  if (value == null) return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000) return `₡${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₡${Math.round(n / 1_000)}k`;
  return `₡${Math.round(n).toLocaleString('en-US')}`;
};

const formatReviewDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const initialsFrom = (id: number): string =>
  String.fromCharCode(65 + (id % 26));

export default function ProviderProfile() {
  const router = useRouter();
  const { id } = router.query;
  const supplierId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  const { user, isAuthenticated } = useContext(AuthContext);
  const customerId = user?.customerId ?? null;

  const supplierQuery = useSupplierQuery({
    variables: { where: { supplierId: supplierId ?? 0 } },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });
  const supplier = supplierQuery.data?.supplier ?? null;

  // Favorites — only fetched for signed-in customers
  const favoritesQuery = useFavoritesByCustomerQuery({
    variables: { customerId: customerId ?? 0 },
    skip: !customerId,
    fetchPolicy: 'cache-and-network',
  });
  const isFavorited = useMemo(() => {
    if (!supplier || !customerId) return false;
    return !!favoritesQuery.data?.favoritesByCustomer.find(
      (f: any) => f.supplierId === supplier.supplierId,
    );
  }, [favoritesQuery.data, supplier, customerId]);

  const [toggleFavorite, toggleState] = useToggleFavoriteMutation();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const showFavorited = optimistic ?? isFavorited;

  // Reset optimistic flag when query catches up
  useEffect(() => {
    if (optimistic !== null && optimistic === isFavorited) {
      setOptimistic(null);
    }
  }, [optimistic, isFavorited]);

  const handleToggleFavorite = async () => {
    if (!customerId || !supplier) return;
    setOptimistic(!showFavorited);
    try {
      await toggleFavorite({
        variables: {
          data: { customerId, supplierId: supplier.supplierId },
        },
      });
      favoritesQuery.refetch();
    } catch {
      setOptimistic(null);
    }
  };

  // ── Gates ───────────────────────────────────────────────────────────
  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
        <Flex minHeight="60vh" align="center" justify="center">
          <Text color={solvoColors.textSubtle}>Invalid provider link.</Text>
        </Flex>
      </Box>
    );
  }

  if (supplierQuery.loading && !supplier) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
        <Flex minHeight="60vh" align="center" justify="center">
          <Text color={solvoColors.textSubtle}>Loading…</Text>
        </Flex>
      </Box>
    );
  }

  if (!supplier) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar />
        <Flex minHeight="60vh" align="center" justify="center" direction="column" gap="8px">
          <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text}>
            Provider not found
          </Text>
          <Link href="/" style={{ color: solvoColors.indigo }}>
            Back to home
          </Link>
        </Flex>
      </Box>
    );
  }

  const reviews = (supplier.reviewsReceived ?? []).slice(0, 6);
  const categories = (supplier.categories ?? [])
    .map((sc: any) => sc.category?.categoryName)
    .filter(Boolean) as string[];

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '24px 16px', md: '32px 24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Flex
            align="center"
            gap="6px"
            color={solvoColors.textMuted}
            fontSize="sm"
            marginBottom="20px"
            _hover={{ color: solvoColors.text }}
          >
            <ArrowLeft size={14} />
            Back
          </Flex>
        </Link>

        {/* Photo gallery — placeholder until real photo uploads exist */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gridTemplateRows={{ base: 'repeat(3, 100px)', md: 'repeat(2, 120px)' }}
          gap="8px"
          marginBottom="40px"
          borderRadius="24px"
          overflow="hidden"
        >
          {PHOTO_TILES.map((emoji, i) => (
            <Flex
              key={i}
              align="center"
              justify="center"
              gridColumn={i === 0 ? 'span 2' : undefined}
              gridRow={i === 0 ? 'span 2' : undefined}
              fontSize={i === 0 ? '64px' : '32px'}
              style={{
                background: `linear-gradient(135deg, ${solvoColors.indigoLight}, ${solvoColors.bg})`,
              }}
            >
              {emoji}
            </Flex>
          ))}
        </Box>

        {/* Two-column layout */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
          gap="40px"
        >
          {/* Main column */}
          <Box>
            <Flex align="center" gap="10px" marginBottom="6px">
              <Text
                fontFamily={solvoFonts.serif}
                fontSize="4xl"
                fontWeight="500"
                color={solvoColors.text}
              >
                {supplier.companyName}
              </Text>
              {supplier.verified && (
                <Box color={solvoColors.indigo} title="Verified business">
                  <ShieldCheck size={20} />
                </Box>
              )}
              {isSponsoredActive(
                supplier.promotionTier,
                supplier.promotionStartDate,
                supplier.promotionEndDate,
              ) && (
                <Flex
                  align="center"
                  gap="4px"
                  padding="3px 10px"
                  borderRadius="full"
                  bg={solvoColors.indigoLight}
                  color={solvoColors.indigo}
                  fontSize="11px"
                  fontWeight={600}
                  title="Featured placement"
                >
                  <Sparkles size={12} />
                  Sponsored
                </Flex>
              )}
            </Flex>

            <Flex gap="16px" align="center" wrap="wrap" marginBottom="14px">
              {supplier.rating != null && (
                <Flex align="center" gap="4px">
                  <Star size={14} fill={solvoColors.amberText} color={solvoColors.amberText} />
                  <Text fontSize="sm" fontWeight="500">
                    {Number(supplier.rating).toFixed(1)}
                  </Text>
                  {!!supplier.reviewCount && (
                    <Text fontSize="sm" color={solvoColors.textSubtle}>
                      ({supplier.reviewCount} review{supplier.reviewCount === 1 ? '' : 's'})
                    </Text>
                  )}
                </Flex>
              )}
              {supplier.city && (
                <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                  <MapPin size={14} />
                  <Text fontSize="sm">{supplier.city}</Text>
                </Flex>
              )}
              {supplier.responseTimeMinutes != null && (
                <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                  <Calendar size={14} />
                  <Text fontSize="sm">
                    Replies in ~{supplier.responseTimeMinutes} min
                  </Text>
                </Flex>
              )}
            </Flex>

            {categories.length > 0 && (
              <Flex gap="6px" wrap="wrap" marginBottom="20px">
                {categories.map((c) => (
                  <Pill key={c} tone="default">
                    {c}
                  </Pill>
                ))}
              </Flex>
            )}

            {supplier.description && (
              <Text
                fontSize="lg"
                color={solvoColors.textMuted}
                lineHeight={1.7}
                marginBottom="40px"
              >
                {supplier.description}
              </Text>
            )}

            {/* Services */}
            {supplier.services && supplier.services.length > 0 && (
              <>
                <Text
                  fontFamily={solvoFonts.serif}
                  fontSize="2xl"
                  fontWeight="500"
                  color={solvoColors.text}
                  marginBottom="16px"
                >
                  Services
                </Text>
                <Box
                  display="grid"
                  gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                  gap="10px"
                  marginBottom="40px"
                >
                  {supplier.services.map((s: any) => (
                    <Box
                      key={s.serviceId}
                      padding="14px 16px"
                      bg="white"
                      borderWidth="1px"
                      borderColor={solvoColors.border}
                      borderRadius="14px"
                    >
                      <Text fontWeight="500" color={solvoColors.text} fontSize="sm">
                        {s.name}
                      </Text>
                      {s.basePrice && (
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          From {formatColones(s.basePrice)}
                        </Text>
                      )}
                      {s.description && (
                        <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="4px">
                          {s.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* Reviews */}
            <Text
              fontFamily={solvoFonts.serif}
              fontSize="2xl"
              fontWeight="500"
              color={solvoColors.text}
              marginBottom="16px"
            >
              Reviews
            </Text>
            {reviews.length === 0 ? (
              <Box
                padding="24px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="14px"
                textAlign="center"
              >
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  No reviews yet — be the first to book and review.
                </Text>
              </Box>
            ) : (
              <Flex direction="column" gap="14px">
                {reviews.map((r: any) => (
                  <Flex
                    key={r.reviewId}
                    direction="column"
                    gap="8px"
                    padding="16px 18px"
                    bg="white"
                    borderWidth="1px"
                    borderColor={solvoColors.border}
                    borderRadius="14px"
                  >
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap="10px">
                        <Flex
                          width="36px"
                          height="36px"
                          borderRadius="full"
                          bg={solvoColors.indigoLight}
                          color={solvoColors.indigo}
                          align="center"
                          justify="center"
                          fontWeight={600}
                          fontSize="14px"
                        >
                          {r.customer?.user?.name
                            ? r.customer.user.name.charAt(0).toUpperCase()
                            : initialsFrom(r.customerId)}
                        </Flex>
                        <Box>
                          <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                            {r.customer?.user?.name ?? 'Customer'}
                          </Text>
                          <Text fontSize="xs" color={solvoColors.textSubtle}>
                            {formatReviewDate(r.createdAt)}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="3px">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < r.rating ? solvoColors.amberText : 'transparent'}
                            color={solvoColors.amberText}
                          />
                        ))}
                      </Flex>
                    </Flex>
                    {r.text && (
                      <Text fontSize="sm" color={solvoColors.text} lineHeight={1.55}>
                        {r.text}
                      </Text>
                    )}
                    {(() => {
                      const parts = [
                        ['Quality', r.ratingQuality],
                        ['Communication', r.ratingCommunication],
                        ['Value', r.ratingValue],
                        ['Punctuality', r.ratingPunctuality],
                      ].filter(([, v]) => v != null) as Array<[string, number]>;
                      if (parts.length === 0) return null;
                      return (
                        <Flex gap="6px" wrap="wrap">
                          {parts.map(([label, v]) => (
                            <Box
                              key={label}
                              padding="3px 8px"
                              borderRadius="9999px"
                              bg={solvoColors.bg}
                              borderWidth="1px"
                              borderColor={solvoColors.border}
                            >
                              <Text fontSize="11px" color={solvoColors.textMuted}>
                                {label} {v}★
                              </Text>
                            </Box>
                          ))}
                        </Flex>
                      );
                    })()}
                    {r.supplierResponse && (
                      <Box
                        marginTop="4px"
                        padding="10px 12px"
                        borderLeftWidth="3px"
                        borderLeftStyle="solid"
                        borderLeftColor={solvoColors.indigo}
                        bg={solvoColors.bg}
                      >
                        <Text fontSize="11px" fontWeight={600} color={solvoColors.indigo} marginBottom="2px">
                          {supplier.companyName} responded
                        </Text>
                        <Text fontSize="13px" color={solvoColors.textMuted}>
                          {r.supplierResponse}
                        </Text>
                      </Box>
                    )}
                  </Flex>
                ))}
              </Flex>
            )}
          </Box>

          {/* Sidebar */}
          <Box>
            <Box
              padding="20px"
              bg="white"
              borderWidth="1px"
              borderColor={solvoColors.border}
              borderRadius="20px"
              position={{ base: 'static', lg: 'sticky' }}
              top="96px"
            >
              <Text
                fontSize="xs"
                color={solvoColors.textSubtle}
                letterSpacing="0.06em"
                fontWeight={600}
                marginBottom="6px"
              >
                INTERESTED?
              </Text>
              <Text
                fontFamily={solvoFonts.serif}
                fontSize="22px"
                color={solvoColors.text}
                marginBottom="14px"
              >
                Get matched in minutes
              </Text>
              <Text fontSize="xs" color={solvoColors.textMuted} marginBottom="14px">
                Start a request from the AI chat and {supplier.companyName} will be matched if they fit.
              </Text>

              <Flex direction="column" gap="8px">
                {supplier.whatsappNumber && (
                  <a
                    href={`https://wa.me/${supplier.whatsappNumber.replace(/[^\d+]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: solvoColors.emerald,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '14px',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <Flex align="center" justify="center" gap="6px">
                      <MessageCircle size={14} />
                      WhatsApp
                    </Flex>
                  </a>
                )}

                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Box
                    padding="12px 16px"
                    borderRadius="12px"
                    bg={solvoColors.text}
                    color="white"
                    fontWeight={600}
                    fontSize="14px"
                    textAlign="center"
                    cursor="pointer"
                  >
                    Start a request
                  </Box>
                </Link>

                {/* Save / Saved heart toggle — only for signed-in customers */}
                {customerId && (
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={toggleState.loading}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${showFavorited ? solvoColors.roseText : solvoColors.border}`,
                      background: showFavorited ? solvoColors.roseLight : 'white',
                      color: showFavorited ? solvoColors.roseText : solvoColors.text,
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: toggleState.loading ? 'wait' : 'pointer',
                      opacity: toggleState.loading ? 0.7 : 1,
                    }}
                  >
                    <Flex align="center" justify="center" gap="6px">
                      <Heart
                        size={14}
                        fill={showFavorited ? solvoColors.roseText : 'transparent'}
                      />
                      {showFavorited ? 'Saved' : 'Save'}
                    </Flex>
                  </button>
                )}
              </Flex>

              {/* Trust strip */}
              <Box
                marginTop="20px"
                paddingTop="16px"
                borderTopWidth="1px"
                borderTopStyle="solid"
                borderTopColor={solvoColors.border}
              >
                {supplier.responseTimeMinutes != null && (
                  <Flex justify="space-between" marginBottom="6px">
                    <Text fontSize="xs" color={solvoColors.textSubtle}>Response time</Text>
                    <Text fontSize="xs" fontWeight={600} color={solvoColors.text}>
                      ~{supplier.responseTimeMinutes} min
                    </Text>
                  </Flex>
                )}
                {supplier.verified && (
                  <Flex justify="space-between" marginBottom="6px">
                    <Text fontSize="xs" color={solvoColors.textSubtle}>Identity</Text>
                    <Text fontSize="xs" fontWeight={600} color={solvoColors.emeraldText}>
                      ✓ Verified
                    </Text>
                  </Flex>
                )}
                {supplier.minCapacity != null && supplier.maxCapacity != null && (
                  <Flex justify="space-between">
                    <Text fontSize="xs" color={solvoColors.textSubtle}>Capacity</Text>
                    <Text fontSize="xs" fontWeight={600} color={solvoColors.text}>
                      {supplier.minCapacity}–{supplier.maxCapacity}
                    </Text>
                  </Flex>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
