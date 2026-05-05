import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Inbox, DollarSign, MessageSquare, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, Pill } from '@components';
import { solvoColors, solvoFonts, SOLVO_LEADS } from '@constants';

const STATS = [
  { label: 'Response rate', value: '98%', change: '+2%', icon: Zap, tone: 'emerald' as const },
  { label: 'Conversion', value: '34%', change: '+5%', icon: TrendingUp, tone: 'indigo' as const },
  { label: 'Active leads', value: '12', change: '+3', icon: Inbox, tone: 'amber' as const },
  { label: 'Earnings (Nov)', value: '₡2.4M', change: '+18%', icon: DollarSign, tone: 'rose' as const },
];

const TONE_BG: Record<string, string> = {
  emerald: solvoColors.emeraldLight,
  indigo: solvoColors.indigoLight,
  amber: solvoColors.amberLight,
  rose: solvoColors.roseLight,
};

const TONE_TEXT: Record<string, string> = {
  emerald: solvoColors.emeraldText,
  indigo: solvoColors.indigo,
  amber: solvoColors.amberText,
  rose: solvoColors.roseText,
};

const BAR_HEIGHTS = [40, 60, 80, 50, 90, 70, 55];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ProviderDashboard() {
  const [selectedLead, setSelectedLead] = useState(SOLVO_LEADS[0].id);
  const lead = SOLVO_LEADS.find((l) => l.id === selectedLead) || SOLVO_LEADS[0];

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/provider" />

      <Box maxWidth="1300px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        {/* Header */}
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap="14px"
          marginBottom="32px"
        >
          <Box>
            <Text
              fontSize="xs"
              color={solvoColors.textSubtle}
              letterSpacing="0.08em"
              fontWeight="600"
              marginBottom="4px"
            >
              PROVIDER WORKSPACE
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '32px', md: '44px' }}
              fontWeight="500"
              color={solvoColors.text}
              letterSpacing="-0.01em"
            >
              Sabor Catering Co.
            </Text>
          </Box>
          <Flex
            as="button"
            align="center"
            gap="6px"
            padding="8px 16px"
            borderRadius="full"
            style={{ background: `linear-gradient(135deg, ${solvoColors.amberLight}, #FED7AA)` }}
            color={solvoColors.amberText}
            fontSize="xs"
            fontWeight="600"
            cursor="pointer"
          >
            👑 Pro plan · Upgrade
          </Flex>
        </Flex>

        {/* Stats grid */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="12px" marginBottom="32px">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Box
                key={s.label}
                padding="20px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="16px"
              >
                <Flex justify="space-between" align="flex-start" marginBottom="14px">
                  <Flex
                    width="36px"
                    height="36px"
                    borderRadius="10px"
                    bg={TONE_BG[s.tone]}
                    color={TONE_TEXT[s.tone]}
                    align="center"
                    justify="center"
                  >
                    <Icon size={18} />
                  </Flex>
                  <Pill tone="emerald">{s.change}</Pill>
                </Flex>
                <Text fontFamily={solvoFonts.serif} fontSize="2xl" fontWeight="500" color={solvoColors.text}>
                  {s.value}
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>{s.label}</Text>
              </Box>
            );
          })}
        </Box>

        {/* Two-column lower section */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap="20px">
          {/* Left: Lead inbox */}
          <Box>
            <Flex justify="space-between" align="center" marginBottom="14px">
              <Text fontWeight="600" color={solvoColors.text}>Incoming leads</Text>
              <Flex
                as="button"
                align="center"
                gap="4px"
                fontSize="xs"
                padding="6px 10px"
                borderRadius="8px"
                borderWidth="1px"
                borderColor={solvoColors.border}
                color={solvoColors.textMuted}
                cursor="pointer"
                bg="white"
              >
                <SlidersHorizontal size={12} />
                Filter
              </Flex>
            </Flex>

            <Flex direction="column" gap="8px">
              {SOLVO_LEADS.map((l) => {
                const sel = selectedLead === l.id;
                return (
                  <Box
                    key={l.id}
                    as="button"
                    textAlign="left"
                    padding="14px 16px"
                    bg={sel ? solvoColors.bg : 'white'}
                    borderWidth={sel ? '2px' : '1px'}
                    borderColor={sel ? solvoColors.text : solvoColors.border}
                    borderRadius="14px"
                    cursor="pointer"
                    onClick={() => setSelectedLead(l.id)}
                    _hover={{ borderColor: solvoColors.borderHover }}
                    width="100%"
                  >
                    <Flex align="center" gap="8px" marginBottom="4px">
                      <Text fontWeight="600" fontSize="sm" color={solvoColors.text}>
                        {l.customer}
                      </Text>
                      {l.urgent && <Pill tone="rose">urgent</Pill>}
                    </Flex>
                    <Text fontSize="xs" color={solvoColors.textMuted} marginBottom="4px" lineClamp={1}>
                      {l.request}
                    </Text>
                    <Text fontSize="11px" color={solvoColors.textSubtle}>
                      {l.location} · {l.time}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </Box>

          {/* Right: Lead detail + chart */}
          <Box>
            <Box
              padding="24px"
              bg="white"
              borderWidth="1px"
              borderColor={solvoColors.border}
              borderRadius="20px"
              marginBottom="20px"
            >
              <Flex align="flex-start" justify="space-between" marginBottom="14px">
                <Box>
                  <Flex align="center" gap="8px" marginBottom="2px">
                    <Text
                      fontFamily={solvoFonts.serif}
                      fontSize="2xl"
                      fontWeight="500"
                      color={solvoColors.text}
                    >
                      {lead.customer}
                    </Text>
                    {lead.urgent && <Pill tone="rose">urgent</Pill>}
                  </Flex>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    Lead received {lead.time}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="xs" color={solvoColors.textSubtle} fontWeight="600" letterSpacing="0.08em">
                    BUDGET
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="xl" fontWeight="500">
                    {lead.budget}
                  </Text>
                </Box>
              </Flex>

              <Box bg={solvoColors.bg} padding="16px" borderRadius="12px" marginBottom="14px">
                <Text
                  fontSize="xs"
                  color={solvoColors.textSubtle}
                  letterSpacing="0.08em"
                  fontWeight="600"
                  marginBottom="8px"
                >
                  THE REQUEST
                </Text>
                <Text fontSize="sm" color={solvoColors.text} marginBottom="10px" lineHeight="1.6">
                  {lead.request}
                </Text>
                <Flex gap="6px" wrap="wrap">
                  <Pill tone="default">📍 {lead.location}</Pill>
                  <Pill tone="default">📅 Saturday Nov 15</Pill>
                  <Pill tone="default">👥 35 guests</Pill>
                </Flex>
              </Box>

              <Box
                padding="14px 16px"
                borderRadius="12px"
                style={{
                  background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
                }}
                borderWidth="1px"
                borderColor={solvoColors.indigoBorder}
                marginBottom="16px"
              >
                <Flex gap="10px" align="flex-start">
                  <Box color={solvoColors.indigo} marginTop="2px">
                    <Sparkles size={14} />
                  </Box>
                  <Text fontSize="sm" color={solvoColors.text} lineHeight="1.55">
                    <Text as="span" fontWeight="600" color={solvoColors.indigo}>Solvo suggests:</Text>{' '}
                    Match to your "Standard" tier (₡285k for 35 ppl). Customer has 92% likelihood of accepting based on similar past leads.
                  </Text>
                </Flex>
              </Box>

              <Flex gap="8px">
                <Flex
                  as="button"
                  flex="1"
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
                  Accept & send quote
                </Flex>
                <Flex
                  as="button"
                  justify="center"
                  align="center"
                  padding="12px 18px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  borderRadius="12px"
                  fontWeight="500"
                  fontSize="sm"
                  cursor="pointer"
                  color={solvoColors.textMuted}
                >
                  Reject
                </Flex>
                <Flex
                  as="button"
                  justify="center"
                  align="center"
                  width="44px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  borderRadius="12px"
                  cursor="pointer"
                  color={solvoColors.textMuted}
                >
                  <MessageSquare size={14} />
                </Flex>
              </Flex>
            </Box>

            {/* Weekly chart */}
            <Box
              padding="20px 24px"
              bg="white"
              borderWidth="1px"
              borderColor={solvoColors.border}
              borderRadius="20px"
            >
              <Flex justify="space-between" align="flex-end" marginBottom="14px">
                <Box>
                  <Text fontWeight="600" color={solvoColors.text} fontSize="sm">
                    Lead flow this week
                  </Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    vs. last week
                  </Text>
                </Box>
                <Pill tone="emerald">+24%</Pill>
              </Flex>

              <Flex gap="8px" align="flex-end" height="120px">
                {BAR_HEIGHTS.map((h, i) => (
                  <Flex key={i} flex="1" direction="column" align="center" gap="6px">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.06, duration: 0.5 }}
                      style={{
                        width: '100%',
                        borderRadius: 6,
                        background: `linear-gradient(180deg, ${solvoColors.indigoMid}, ${solvoColors.indigo})`,
                      }}
                    />
                    <Text fontSize="11px" color={solvoColors.textSubtle}>
                      {DAYS[i]}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
