import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Sparkles, Edit3, SlidersHorizontal } from 'lucide-react';
import {
  Box,
  Flex,
  Text,
  Input,
  SolvoNavBar,
  ProviderCard,
  LoadingState,
  RefineFooter,
  Pill,
} from '@components';
import { solvoColors, solvoFonts, SOLVO_PROVIDERS } from '@constants';

function parseQuery(q: string) {
  return {
    service: /cater/i.test(q)
      ? 'Catering'
      : /dj/i.test(q)
      ? 'DJ'
      : /clean/i.test(q)
      ? 'Cleaning'
      : /ac|fix/i.test(q)
      ? 'AC repair'
      : 'Service',
    people: (q.match(/(\d+)/) || [])[1] || '35',
    location: 'Santa Ana',
    budget: '₡300,000',
    when: /saturday/i.test(q) ? 'Saturday' : 'this week',
  };
}

export default function Search() {
  const router = useRouter();
  const { query: queryParam } = router.query;
  const initialQuery = Array.isArray(queryParam) ? queryParam[0] : queryParam ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [initialQuery]);

  const parsed = parseQuery(query);

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/search" />

      <Box maxWidth="1100px" margin="0 auto" padding={{ base: '24px 16px', md: '40px 24px' }}>
        {/* Top section */}
        <Flex align="center" gap="10px" marginBottom="12px">
          <Text
            fontSize="xs"
            color={solvoColors.textSubtle}
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            Your request
          </Text>
          <Flex
            as="button"
            align="center"
            gap="4px"
            fontSize="xs"
            color={solvoColors.indigo}
            cursor="pointer"
            onClick={() => setEditing(!editing)}
          >
            <Edit3 size={12} />
            Refine
          </Flex>
        </Flex>

        {editing ? (
          <Flex gap="10px" marginBottom="24px">
            <Input
              flex="1"
              padding="14px 18px"
              borderRadius="14px"
              borderWidth="1px"
              borderColor={solvoColors.border}
              fontSize="lg"
              fontFamily={solvoFonts.sans}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              _focus={{ outline: 'none', borderColor: solvoColors.indigo }}
            />
            <Flex
              as="button"
              align="center"
              padding="0 18px"
              bg={solvoColors.text}
              color="white"
              borderRadius="14px"
              fontSize="sm"
              fontWeight="500"
              cursor="pointer"
              onClick={() => {
                setEditing(false);
                router.push(`/search?query=${encodeURIComponent(query)}`);
              }}
            >
              Update
            </Flex>
          </Flex>
        ) : (
          <Text
            fontFamily={solvoFonts.serif}
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            color={solvoColors.text}
            marginBottom="24px"
            letterSpacing="-0.01em"
          >
            "{query || 'I need help finding something'}"
          </Text>
        )}

        {/* AI interpretation card */}
        <Box
          borderRadius="16px"
          padding="20px"
          borderWidth="1px"
          borderColor={solvoColors.indigoBorder}
          style={{
            background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white, ${solvoColors.bg})`,
          }}
          marginBottom="32px"
        >
          <Flex gap="14px" align="flex-start">
            <Flex
              width="36px"
              height="36px"
              borderRadius="10px"
              align="center"
              justify="center"
              bg={solvoColors.indigoLight}
              color={solvoColors.indigo}
              flexShrink={0}
            >
              <Sparkles size={18} />
            </Flex>
            <Box flex="1">
              <Text
                fontSize="xs"
                color={solvoColors.indigo}
                fontWeight="600"
                letterSpacing="0.1em"
                marginBottom="6px"
              >
                SOLVO UNDERSTOOD
              </Text>
              <Text fontSize="md" color={solvoColors.text} lineHeight="1.55">
                Looking for <b>{parsed.service}</b> for <b>{parsed.people} people</b> in{' '}
                <b>{parsed.location}</b>, around <b>{parsed.budget}</b>, on <b>{parsed.when}</b>.
              </Text>
              <Flex gap="6px" marginTop="12px" wrap="wrap">
                <Pill tone="indigo">+ Add dietary needs</Pill>
                <Pill tone="indigo">+ Specify time</Pill>
                <Pill tone="indigo">+ Adjust budget</Pill>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Results */}
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <Flex
              align={{ base: 'flex-start', md: 'center' }}
              justify="space-between"
              direction={{ base: 'column', md: 'row' }}
              gap="12px"
              marginBottom="20px"
            >
              <Box>
                <Text fontSize="xl" fontWeight="600" color={solvoColors.text}>
                  {SOLVO_PROVIDERS.length} options found
                </Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Sorted by AI relevance for your request
                </Text>
              </Box>
              <Flex gap="8px">
                <Flex
                  as="button"
                  align="center"
                  gap="6px"
                  padding="8px 14px"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  bg="white"
                  fontSize="sm"
                  color={solvoColors.textMuted}
                  cursor="pointer"
                  _hover={{ borderColor: solvoColors.borderHover }}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </Flex>
                <Flex
                  as="button"
                  align="center"
                  gap="6px"
                  padding="8px 14px"
                  borderRadius="10px"
                  bg={solvoColors.text}
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  cursor="pointer"
                  onClick={() => router.push('/packages')}
                  _hover={{ bg: solvoColors.indigo }}
                >
                  <Sparkles size={14} />
                  See packages
                </Flex>
              </Flex>
            </Flex>

            <Flex direction="column" gap="14px">
              {SOLVO_PROVIDERS.map((p, i) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  index={i}
                  onSelect={() => router.push(`/providers/${p.id}`)}
                  onViewProfile={() => router.push(`/providers/${p.id}`)}
                  onWhatsApp={() => alert(`WhatsApp ${p.name}`)}
                />
              ))}
            </Flex>
          </>
        )}
      </Box>

      <RefineFooter />
    </Box>
  );
}
