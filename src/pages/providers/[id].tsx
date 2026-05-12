import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Star, ShieldCheck, MapPin, Calendar, MessageCircle, Check } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, Pill } from '@components';
import { solvoColors, solvoFonts, SOLVO_PROVIDERS } from '@constants';

const PHOTO_TILES = ['🍽️', '🥗', '🍰', '🥂', '🌮'];

const SERVICES = [
  { name: 'Birthday catering', price: '₡165,000' },
  { name: 'Corporate events', price: '₡240,000' },
  { name: 'Weddings & banquets', price: '₡480,000' },
  { name: 'Private dinners', price: '₡120,000' },
];

const TIERS = [
  {
    tier: 'Essentials',
    price: '₡180,000',
    features: ['Buffet style for 25', '2 main dishes', 'Basic setup', 'Self-serve drinks'],
  },
  {
    tier: 'Standard',
    price: '₡285,000',
    features: ['Full service for 35', '3-course menu', 'Setup & cleanup', '1 server'],
    popular: true,
  },
  {
    tier: 'Premium',
    price: '₡480,000',
    features: ['Premium menu + bar', 'Wait staff (2)', 'Dessert table', 'Linen & decor'],
  },
];

const REVIEWS = [
  { initial: 'L', name: 'Laura M.', date: 'Nov 2025', rating: 5, text: 'Absolutely incredible. They handled everything from setup to cleanup, and the food was outstanding. Will definitely book again.' },
  { initial: 'D', name: 'Diego S.', date: 'Oct 2025', rating: 5, text: 'Quick to respond, professional, and the menu was customized perfectly to our needs. Highly recommend.' },
  { initial: 'P', name: 'Patricia V.', date: 'Sep 2025', rating: 4, text: 'Great food and service. A bit late on setup but they made up for it during the event.' },
];

export default function ProviderProfile() {
  const router = useRouter();
  const { id } = router.query;
  const provider = SOLVO_PROVIDERS.find((p) => p.id === Number(id)) || SOLVO_PROVIDERS[0];

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '24px 16px', md: '32px 24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Flex align="center" gap="6px" color={solvoColors.textMuted} fontSize="sm" marginBottom="20px" _hover={{ color: solvoColors.text }}>
            <ArrowLeft size={14} />
            Back to chat
          </Flex>
        </Link>

        {/* Photo gallery */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gridTemplateRows="repeat(2, 1fr)"
          gap="8px"
          height={{ base: '300px', md: '400px' }}
          borderRadius="24px"
          overflow="hidden"
          marginBottom="32px"
        >
          {PHOTO_TILES.map((emoji, i) => (
            <Flex
              key={i}
              gridColumn={i === 0 ? 'span 2' : 'span 1'}
              gridRow={i === 0 ? 'span 2' : 'span 1'}
              align="center"
              justify="center"
              fontSize={i === 0 ? '80px' : '40px'}
              style={{
                background: i === 0
                  ? `linear-gradient(135deg, ${solvoColors.indigoLight}, ${solvoColors.amberLight})`
                  : `linear-gradient(135deg, ${solvoColors.bg}, ${solvoColors.indigoLight})`,
              }}
              position="relative"
            >
              {emoji}
              {i === PHOTO_TILES.length - 1 && (
                <Flex
                  position="absolute"
                  bottom="12px"
                  right="12px"
                  bg="white"
                  padding="6px 12px"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="500"
                  color={solvoColors.text}
                  cursor="pointer"
                  _hover={{ bg: solvoColors.bg }}
                >
                  Show all 24 photos
                </Flex>
              )}
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
              <Text fontFamily={solvoFonts.serif} fontSize="4xl" fontWeight="500" color={solvoColors.text}>
                {provider.name}
              </Text>
              {provider.verified && (
                <Box color={solvoColors.indigo}>
                  <ShieldCheck size={20} />
                </Box>
              )}
            </Flex>

            <Flex gap="16px" align="center" wrap="wrap" marginBottom="20px">
              <Flex align="center" gap="4px">
                <Star size={14} fill={solvoColors.amberText} color={solvoColors.amberText} />
                <Text fontSize="sm" fontWeight="500">{provider.rating}</Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>({provider.reviews} reviews)</Text>
              </Flex>
              <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                <MapPin size={14} />
                <Text fontSize="sm">{provider.location}</Text>
              </Flex>
              <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                <Calendar size={14} />
                <Text fontSize="sm">Joined 2021</Text>
              </Flex>
            </Flex>

            <Text fontSize="lg" color={solvoColors.textMuted} lineHeight="1.7" marginBottom="40px">
              We're a Costa Rica-based catering team passionate about beautiful food and seamless service. From intimate dinners to corporate events for 100+, we handle every detail so you can enjoy your event.
            </Text>

            {/* Services */}
            <Text fontFamily={solvoFonts.serif} fontSize="2xl" fontWeight="500" color={solvoColors.text} marginBottom="16px">
              Services
            </Text>
            <Box display="grid" gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="10px" marginBottom="40px">
              {SERVICES.map((s) => (
                <Box
                  key={s.name}
                  padding="14px 16px"
                  bg="white"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  borderRadius="14px"
                >
                  <Text fontWeight="500" color={solvoColors.text} fontSize="sm">{s.name}</Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>From {s.price}</Text>
                </Box>
              ))}
            </Box>

            {/* Pricing tiers */}
            <Text fontFamily={solvoFonts.serif} fontSize="2xl" fontWeight="500" color={solvoColors.text} marginBottom="16px">
              Pricing tiers
            </Text>
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="12px" marginBottom="40px">
              {TIERS.map((t) => (
                <Flex
                  key={t.tier}
                  direction="column"
                  gap="10px"
                  padding="20px"
                  bg="white"
                  borderWidth={t.popular ? '2px' : '1px'}
                  borderColor={t.popular ? solvoColors.indigo : solvoColors.border}
                  borderRadius="16px"
                  position="relative"
                >
                  {t.popular && (
                    <Box
                      position="absolute"
                      top="-10px"
                      left="14px"
                      bg={solvoColors.indigo}
                      color="white"
                      padding="3px 10px"
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight="600"
                    >
                      POPULAR
                    </Box>
                  )}
                  <Text fontFamily={solvoFonts.serif} fontSize="xl" fontWeight="500">{t.tier}</Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="2xl" fontWeight="500" color={solvoColors.text}>{t.price}</Text>
                  <Flex direction="column" gap="6px">
                    {t.features.map((f) => (
                      <Flex key={f} align="center" gap="6px">
                        <Box color={solvoColors.emeraldText}><Check size={14} strokeWidth={3} /></Box>
                        <Text fontSize="sm" color={solvoColors.textMuted}>{f}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              ))}
            </Box>

            {/* Reviews */}
            <Text fontFamily={solvoFonts.serif} fontSize="2xl" fontWeight="500" color={solvoColors.text} marginBottom="16px">
              Reviews
            </Text>
            <Flex direction="column" gap="14px">
              {REVIEWS.map((r, i) => (
                <Box
                  key={i}
                  padding="20px"
                  bg="white"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  borderRadius="14px"
                >
                  <Flex align="center" gap="12px" marginBottom="10px">
                    <Flex
                      width="40px"
                      height="40px"
                      borderRadius="full"
                      bg={solvoColors.indigoLight}
                      color={solvoColors.indigo}
                      align="center"
                      justify="center"
                      fontWeight="600"
                    >
                      {r.initial}
                    </Flex>
                    <Box>
                      <Text fontWeight="600" fontSize="sm" color={solvoColors.text}>{r.name}</Text>
                      <Text fontSize="xs" color={solvoColors.textSubtle}>{r.date}</Text>
                    </Box>
                    <Flex flex="1" />
                    <Flex gap="2px">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          fill={idx < r.rating ? solvoColors.amberText : 'transparent'}
                          color={solvoColors.amberText}
                        />
                      ))}
                    </Flex>
                  </Flex>
                  <Text fontSize="sm" color={solvoColors.textMuted} lineHeight="1.6">
                    {r.text}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>

          {/* Sidebar */}
          <Box position={{ lg: 'sticky' }} top="96px" height="fit-content">
            <Box
              padding="24px"
              bg="white"
              borderWidth="1px"
              borderColor={solvoColors.border}
              borderRadius="20px"
            >
              <Text
                fontSize="xs"
                color={solvoColors.textSubtle}
                letterSpacing="0.08em"
                fontWeight="600"
                marginBottom="6px"
              >
                ESTIMATED FOR YOUR EVENT
              </Text>
              <Text fontFamily={solvoFonts.serif} fontSize="3xl" fontWeight="500" color={solvoColors.text}>
                {provider.priceLabel}
              </Text>
              <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="20px">
                35 guests · Standard tier
              </Text>

              <Flex direction="column" gap="8px" marginBottom="20px">
                <Flex
                  as="button"
                  align="center"
                  justify="center"
                  gap="8px"
                  padding="12px"
                  bg={solvoColors.emerald}
                  color="white"
                  borderRadius="12px"
                  fontWeight="500"
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{ opacity: 0.9 }}
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </Flex>
                <Flex
                  as="button"
                  justify="center"
                  padding="12px"
                  bg={solvoColors.text}
                  color="white"
                  borderRadius="12px"
                  fontWeight="500"
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{ bg: solvoColors.indigo }}
                >
                  Request booking
                </Flex>
                <Flex
                  as="button"
                  justify="center"
                  padding="12px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  color={solvoColors.text}
                  borderRadius="12px"
                  fontWeight="500"
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{ borderColor: solvoColors.borderHover }}
                >
                  Get custom quote
                </Flex>
              </Flex>

              <Box borderTop="1px solid" borderColor={solvoColors.border} paddingTop="16px">
                <Flex direction="column" gap="8px" fontSize="xs" color={solvoColors.textMuted}>
                  <Flex justify="space-between"><Text>Response time</Text><Text fontWeight="500">~5 min</Text></Flex>
                  <Flex justify="space-between"><Text>Response rate</Text><Text fontWeight="500">99%</Text></Flex>
                  <Flex justify="space-between"><Text>Identity</Text><Pill tone="emerald">✓ Verified</Pill></Flex>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
