import { useContext, useState } from 'react';
import { useAtom } from 'jotai';
import AuthContext from '@/shared/contexts/auth.context';
import { motion } from 'framer-motion';
import { Plus, Star, Inbox, Sparkles, RotateCcw } from 'lucide-react';
import {
  Box,
  Flex,
  Text,
  SolvoNavBar,
  Pill,
} from '@components';
import {
  solvoColors,
  solvoFonts,
  SOLVO_ACTIVE_REQUESTS,
  SOLVO_CONVERSATIONS,
  SOLVO_SAVED,
  MODEL_LIST,
  estimateCostUsd,
} from '@constants';
import { aiUsageAtom, EMPTY_USAGE } from '@/shared/jotai';

const TABS = [
  { id: 'active', label: 'Active requests', count: 3 },
  { id: 'conversations', label: 'Conversations', count: 4 },
  { id: 'saved', label: 'Saved', count: 3 },
  { id: 'past', label: 'Past bookings', count: 0 },
  { id: 'usage', label: 'AI usage', count: 0 },
] as const;

type TabId = typeof TABS[number]['id'];

const formatNumber = (n: number) => n.toLocaleString('en-US');
const formatCost = (n: number) =>
  n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
const formatDate = (iso?: string) => {
  if (!iso) return 'Never';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const displayName = user?.name?.split(' ')[0] ?? 'there';

  const [tab, setTab] = useState<TabId>('active');
  const [usage, setUsage] = useAtom(aiUsageAtom);

  const totals = MODEL_LIST.reduce(
    (acc, m) => {
      const u = usage[m.key];
      const cost = estimateCostUsd(m.key, u.inputTokens, u.outputTokens);
      acc.requests += u.requests;
      acc.inputTokens += u.inputTokens;
      acc.outputTokens += u.outputTokens;
      acc.cost += cost;
      return acc;
    },
    { requests: 0, inputTokens: 0, outputTokens: 0, cost: 0 },
  );

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/dashboard" />

      <Box maxWidth="1100px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
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
              WELCOME BACK
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '32px', md: '44px' }}
              fontWeight="500"
              color={solvoColors.text}
              letterSpacing="-0.01em"
            >
              Hello, {displayName}.
            </Text>
          </Box>
          <Flex
            as="button"
            align="center"
            gap="6px"
            padding="10px 18px"
            bg={solvoColors.text}
            color="white"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            _hover={{ bg: solvoColors.indigo }}
          >
            <Plus size={14} /> New request
          </Flex>
        </Flex>

        {/* Tabs */}
        <Flex
          gap="24px"
          borderBottom="1px solid"
          borderColor={solvoColors.border}
          marginBottom="24px"
          overflowX="auto"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Box
                key={t.id}
                as="button"
                position="relative"
                padding="14px 0"
                cursor="pointer"
                onClick={() => setTab(t.id)}
                whiteSpace="nowrap"
              >
                <Flex align="center" gap="6px">
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color={active ? solvoColors.text : solvoColors.textSubtle}
                  >
                    {t.label}
                  </Text>
                  {t.count > 0 && (
                    <Box
                      bg={active ? solvoColors.text : '#F5F5F4'}
                      color={active ? 'white' : solvoColors.textMuted}
                      fontSize="11px"
                      fontWeight="500"
                      padding="2px 7px"
                      borderRadius="full"
                    >
                      {t.count}
                    </Box>
                  )}
                </Flex>
                {active && (
                  <motion.div
                    layoutId="dash-tab"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: solvoColors.text,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Flex>

        {/* Tab content */}
        {tab === 'active' && (
          <Flex direction="column" gap="10px">
            {SOLVO_ACTIVE_REQUESTS.map((r) => (
              <Flex
                key={r.id}
                align="center"
                gap="14px"
                padding="16px 20px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="14px"
                _hover={{ borderColor: solvoColors.borderHover }}
                cursor="pointer"
              >
                <Flex
                  width="44px"
                  height="44px"
                  borderRadius="12px"
                  bg={solvoColors.bg}
                  align="center"
                  justify="center"
                  fontSize="22px"
                >
                  {r.emoji}
                </Flex>
                <Box flex="1">
                  <Text fontWeight="500" color={solvoColors.text} fontSize="sm">{r.title}</Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>{r.status}</Text>
                </Box>
                {r.isNew && <Pill tone="indigo">New</Pill>}
                {r.booked && <Pill tone="emerald">✓ Booked</Pill>}
                <Text fontSize="xs" color={solvoColors.textSubtle}>{r.time}</Text>
              </Flex>
            ))}
          </Flex>
        )}

        {tab === 'conversations' && (
          <Box bg="white" borderWidth="1px" borderColor={solvoColors.border} borderRadius="14px" overflow="hidden">
            {SOLVO_CONVERSATIONS.map((c, i) => (
              <Flex
                key={i}
                align="center"
                gap="14px"
                padding="14px 18px"
                borderBottom={i < SOLVO_CONVERSATIONS.length - 1 ? '1px solid' : 'none'}
                borderColor={solvoColors.border}
                cursor="pointer"
                _hover={{ bg: solvoColors.bg }}
              >
                <Flex
                  width="40px"
                  height="40px"
                  borderRadius="full"
                  bg={solvoColors.bg}
                  align="center"
                  justify="center"
                  fontSize="20px"
                >
                  {c.emoji}
                </Flex>
                <Box flex="1" minWidth="0">
                  <Text
                    fontWeight={c.unread ? '600' : '500'}
                    color={solvoColors.text}
                    fontSize="sm"
                  >
                    {c.name}
                  </Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle} truncate>
                    {c.last}
                  </Text>
                </Box>
                <Flex direction="column" align="flex-end" gap="4px">
                  <Text fontSize="xs" color={solvoColors.textSubtle}>{c.time}</Text>
                  {c.unread && (
                    <Box width="8px" height="8px" borderRadius="full" bg={solvoColors.indigo} />
                  )}
                </Flex>
              </Flex>
            ))}
          </Box>
        )}

        {tab === 'saved' && (
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="12px">
            {SOLVO_SAVED.map((s) => (
              <Flex
                key={s.name}
                direction="column"
                align="center"
                gap="10px"
                padding="24px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="16px"
                cursor="pointer"
                _hover={{ borderColor: solvoColors.borderHover }}
              >
                <Flex
                  width="60px"
                  height="60px"
                  borderRadius="full"
                  bg={solvoColors.bg}
                  align="center"
                  justify="center"
                  fontSize="28px"
                >
                  {s.emoji}
                </Flex>
                <Text fontWeight="600" color={solvoColors.text} fontSize="sm" textAlign="center">{s.name}</Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>{s.category}</Text>
                <Flex align="center" gap="3px">
                  <Star size={12} fill={solvoColors.amberText} color={solvoColors.amberText} />
                  <Text fontSize="xs" fontWeight="500">{s.rating}</Text>
                </Flex>
              </Flex>
            ))}
          </Box>
        )}

        {tab === 'past' && (
          <Flex direction="column" align="center" gap="12px" padding="64px 20px">
            <Box color={solvoColors.textSubtle}>
              <Inbox size={40} />
            </Box>
            <Text color={solvoColors.textSubtle} fontSize="sm">No past bookings yet.</Text>
          </Flex>
        )}

        {tab === 'usage' && (
          <Flex direction="column" gap="20px">
            {/* Summary */}
            <Box
              padding="24px"
              borderRadius="20px"
              borderWidth="1px"
              borderColor={solvoColors.border}
              bg="white"
              style={{
                background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
              }}
            >
              <Flex align="center" justify="space-between" marginBottom="16px">
                <Flex align="center" gap="10px">
                  <Flex
                    width="32px"
                    height="32px"
                    borderRadius="10px"
                    align="center"
                    justify="center"
                    style={{
                      background: `linear-gradient(135deg, ${solvoColors.indigo}, #6366F1)`,
                    }}
                    color="white"
                  >
                    <Sparkles size={16} />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight="600">
                      AI USAGE — THIS DEVICE
                    </Text>
                    <Text fontSize="sm" color={solvoColors.textMuted}>
                      Stored locally. Resets when you clear browser data.
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  as="button"
                  align="center"
                  gap="6px"
                  padding="8px 14px"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  fontSize="xs"
                  fontWeight="500"
                  color={solvoColors.textMuted}
                  bg="white"
                  cursor="pointer"
                  onClick={() => setUsage(EMPTY_USAGE)}
                  _hover={{ borderColor: solvoColors.borderHover, color: solvoColors.text }}
                >
                  <RotateCcw size={12} />
                  Reset
                </Flex>
              </Flex>

              <Flex gap="32px" wrap="wrap">
                <Box>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight="600">
                    REQUESTS
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="32px" color={solvoColors.text}>
                    {formatNumber(totals.requests)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight="600">
                    INPUT TOKENS
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="32px" color={solvoColors.text}>
                    {formatNumber(totals.inputTokens)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight="600">
                    OUTPUT TOKENS
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="32px" color={solvoColors.text}>
                    {formatNumber(totals.outputTokens)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.06em" fontWeight="600">
                    EST. COST
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="32px" color={solvoColors.indigo}>
                    {formatCost(totals.cost)}
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* Per-model breakdown */}
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="14px">
              {MODEL_LIST.map((m) => {
                const u = usage[m.key];
                const cost = estimateCostUsd(m.key, u.inputTokens, u.outputTokens);
                const hasUsage = u.requests > 0;
                return (
                  <Flex
                    key={m.key}
                    direction="column"
                    gap="14px"
                    padding="20px"
                    bg="white"
                    borderWidth="1px"
                    borderColor={solvoColors.border}
                    borderRadius="16px"
                  >
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text fontWeight="600" color={solvoColors.text} fontSize="sm">
                          {m.fullName}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {m.apiId}
                        </Text>
                      </Box>
                      {hasUsage ? (
                        <Pill tone="indigo">{u.requests} reqs</Pill>
                      ) : (
                        <Pill tone="default">Unused</Pill>
                      )}
                    </Flex>

                    <Flex direction="column" gap="6px">
                      <Flex justify="space-between">
                        <Text fontSize="xs" color={solvoColors.textSubtle}>Input tokens</Text>
                        <Text fontSize="xs" fontWeight="500" color={solvoColors.text}>
                          {formatNumber(u.inputTokens)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color={solvoColors.textSubtle}>Output tokens</Text>
                        <Text fontSize="xs" fontWeight="500" color={solvoColors.text}>
                          {formatNumber(u.outputTokens)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="xs" color={solvoColors.textSubtle}>Last used</Text>
                        <Text fontSize="xs" fontWeight="500" color={solvoColors.text}>
                          {formatDate(u.lastUsedAt)}
                        </Text>
                      </Flex>
                    </Flex>

                    <Box
                      padding="10px 12px"
                      bg={solvoColors.bg}
                      borderRadius="10px"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.04em" fontWeight="600">
                          EST. COST
                        </Text>
                        <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.indigo}>
                          {formatCost(cost)}
                        </Text>
                      </Flex>
                      <Text fontSize="10px" color={solvoColors.textSubtle} marginTop="2px">
                        ${m.inputPricePerMillion.toFixed(2)}/M in · ${m.outputPricePerMillion.toFixed(2)}/M out
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Box>

            <Text fontSize="11px" color={solvoColors.textSubtle}>
              Cost is estimated client-side from token counts returned by each provider. For exact billing, check the provider dashboard.
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
