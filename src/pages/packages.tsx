import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  SolvoNavBar,
  PackageCard,
} from '@components';
import { solvoColors, solvoFonts, SOLVO_PACKAGES } from '@constants';

export default function Packages() {
  const router = useRouter();
  const query = (router.query.query as string) || 'birthday for 35 people';

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/packages" />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '24px 16px', md: '56px 24px' }}>
        {/* Header */}
        <Flex direction="column" align="center" textAlign="center" gap="12px" marginBottom="48px">
          <Text
            fontSize="xs"
            color={solvoColors.indigo}
            fontWeight="600"
            letterSpacing="0.1em"
          >
            ✨ CURATED BY SOLVO AI
          </Text>
          <Text
            fontFamily={solvoFonts.serif}
            fontSize={{ base: '36px', md: '56px' }}
            lineHeight="1.05"
            fontWeight="500"
            color={solvoColors.text}
            maxWidth="800px"
            letterSpacing="-0.02em"
          >
            Complete solutions,{' '}
            <Text as="span" fontStyle="italic" color={solvoColors.indigo}>
              not just providers.
            </Text>
          </Text>
          <Text fontSize="md" color={solvoColors.textMuted} maxWidth="640px">
            Three thoughtfully bundled packages for "{query}". One contract, one payment, zero coordination.
          </Text>
        </Flex>

        {/* Packages grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap="20px"
          marginBottom="48px"
          alignItems="stretch"
        >
          {SOLVO_PACKAGES.map((pkg, i) => (
            <PackageCard
              key={pkg.tier}
              pkg={pkg}
              index={i}
              onBook={(p) => alert(`Booking ${p.tier}`)}
              onCustomize={(p) => alert(`Customizing ${p.tier}`)}
            />
          ))}
        </Box>

        {/* Bottom CTA */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap="14px"
          padding="24px 28px"
          borderRadius="20px"
          style={{
            background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
          }}
          borderWidth="1px"
          borderColor={solvoColors.indigoBorder}
        >
          <Box>
            <Text fontSize="lg" fontWeight="600" color={solvoColors.text} marginBottom="4px">
              Want something else entirely?
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Tell Solvo what to add or remove and we'll rebuild your package in seconds.
            </Text>
          </Box>
          <Flex
            as="button"
            padding="10px 20px"
            bg={solvoColors.text}
            color="white"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            _hover={{ bg: solvoColors.indigo }}
          >
            Customize
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
