import * as React from 'react';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, Text, Input } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows, MODEL_LIST, MODEL_META } from '@constants';
import { aiUsageAtom, type ModelKey } from '@/shared/jotai';

interface Message {
  from: 'ai' | 'user' | 'system';
  text: string;
  model?: ModelKey;
}

const SYSTEM_PROMPT =
  "You are Solvo's refinement assistant. Help the user adjust their service search by clarifying budget, location, dietary needs, timing, or by suggesting additional services. Keep replies short, friendly, and actionable.";

const initialMessages: Message[] = [
  {
    from: 'ai',
    text: "Want me to refine these results? I can adjust budget, location, dietary needs, or add more services.",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const RefineFooter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [model, setModel] = useState<ModelKey>('claude-haiku');
  const [isThinking, setIsThinking] = useState(false);
  const setUsage = useSetAtom(aiUsageAtom);

  const activeMeta = MODEL_META[model];

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: Message = { from: 'user', text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsThinking(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => m.from === 'user' || m.from === 'ai')
        .map((m) => ({
          role: m.from === 'ai' ? ('assistant' as const) : ('user' as const),
          content: m.text,
        }));

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data: {
        content: string;
        model: ModelKey;
        usage?: { inputTokens?: number; outputTokens?: number };
      } = await res.json();

      setMessages((m) => [
        ...m,
        {
          from: 'ai',
          text: data.content || '(empty response)',
          model: data.model ?? model,
        },
      ]);

      // Track usage in the persistent atom
      setUsage((prev) => {
        const current = prev[model];
        return {
          ...prev,
          [model]: {
            requests: current.requests + 1,
            inputTokens: current.inputTokens + (data.usage?.inputTokens ?? 0),
            outputTokens: current.outputTokens + (data.usage?.outputTokens ?? 0),
            lastUsedAt: new Date().toISOString(),
          },
        };
      });
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          from: 'system',
          text:
            err instanceof Error
              ? `Couldn't reach the assistant — ${err.message}. Try again.`
              : "Couldn't reach the assistant. Try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Box position="fixed" bottom="24px" right="24px" zIndex={50}>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Flex
              as="button"
              align="center"
              gap="8px"
              bg={solvoColors.text}
              color="white"
              padding="12px 20px"
              borderRadius="full"
              fontSize="sm"
              fontWeight="500"
              cursor="pointer"
              boxShadow={solvoShadows.floatingPanel}
              onClick={() => setOpen(true)}
              _hover={{ bg: solvoColors.indigo }}
            >
              <Sparkles size={16} />
              Refine with AI
            </Flex>
          </motion.div>
        )}

        {open && (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            style={{
              width: 380,
              borderRadius: 24,
              background: 'white',
              overflow: 'hidden',
              boxShadow: solvoShadows.floatingPanel,
              border: `1px solid ${solvoColors.border}`,
            }}
          >
            <Flex
              align="center"
              justify="space-between"
              padding="16px"
              style={{
                background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
              }}
              borderBottom="1px solid"
              borderColor={solvoColors.border}
            >
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
                  <Text fontSize="sm" fontWeight="600" color={solvoColors.text}>
                    Solvo Assistant
                  </Text>
                  <Flex align="center" gap="6px">
                    <Box
                      width="6px"
                      height="6px"
                      borderRadius="full"
                      bg={solvoColors.emerald}
                    />
                    <Text fontSize="xs" color={solvoColors.textSubtle}>
                      {activeMeta.fullName} · Online
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <Box
                as="button"
                cursor="pointer"
                color={solvoColors.textMuted}
                onClick={() => setOpen(false)}
                _hover={{ color: solvoColors.text }}
              >
                <X size={18} />
              </Box>
            </Flex>

            <Flex
              padding="10px 16px"
              gap="6px"
              borderBottom="1px solid"
              borderColor={solvoColors.border}
              bg="white"
            >
              {MODEL_LIST.map((opt) => {
                const active = opt.key === model;
                return (
                  <Flex
                    key={opt.key}
                    as="button"
                    align="center"
                    justify="center"
                    padding="6px 12px"
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="500"
                    cursor={isThinking ? 'not-allowed' : 'pointer'}
                    opacity={isThinking && !active ? 0.5 : 1}
                    bg={active ? solvoColors.indigo : 'transparent'}
                    color={active ? 'white' : solvoColors.textMuted}
                    borderWidth="1px"
                    borderColor={active ? solvoColors.indigo : solvoColors.border}
                    title={opt.fullName}
                    onClick={() => !isThinking && setModel(opt.key)}
                    _hover={
                      !isThinking && !active
                        ? { borderColor: solvoColors.indigoBorder, color: solvoColors.text }
                        : undefined
                    }
                  >
                    {opt.shortLabel}
                  </Flex>
                );
              })}
            </Flex>

            <Box maxHeight="288px" overflowY="auto" padding="16px">
              <Flex direction="column" gap="12px">
                {messages.map((m, i) => {
                  if (m.from === 'system') {
                    return (
                      <Flex key={i} justify="center">
                        <Box
                          maxWidth="90%"
                          padding="8px 12px"
                          borderRadius="10px"
                          fontSize="xs"
                          bg={solvoColors.roseLight}
                          color={solvoColors.roseText}
                        >
                          {m.text}
                        </Box>
                      </Flex>
                    );
                  }
                  return (
                    <Flex
                      key={i}
                      direction="column"
                      align={m.from === 'ai' ? 'flex-start' : 'flex-end'}
                      gap="4px"
                    >
                      {m.from === 'ai' && m.model && (
                        <Text
                          fontSize="10px"
                          fontWeight="600"
                          color={solvoColors.indigo}
                          letterSpacing="0.04em"
                          textTransform="uppercase"
                          paddingLeft="4px"
                        >
                          {MODEL_META[m.model].fullName}
                        </Text>
                      )}
                      <Box
                        maxWidth="80%"
                        padding="10px 14px"
                        borderRadius="14px"
                        fontSize="sm"
                        bg={m.from === 'ai' ? solvoColors.indigoLight : solvoColors.text}
                        color={m.from === 'ai' ? solvoColors.text : 'white'}
                      >
                        {m.text}
                      </Box>
                    </Flex>
                  );
                })}

                {isThinking && (
                  <Flex justify="flex-start">
                    <Flex
                      align="center"
                      gap="4px"
                      padding="10px 14px"
                      borderRadius="14px"
                      bg={solvoColors.indigoLight}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: solvoColors.indigo,
                          }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Box>

            <Flex
              padding="12px"
              borderTop="1px solid"
              borderColor={solvoColors.border}
              gap="8px"
            >
              <Input
                flex="1"
                padding="8px 12px"
                borderRadius="10px"
                borderWidth="1px"
                borderColor={solvoColors.border}
                fontSize="sm"
                fontFamily={solvoFonts.sans}
                value={input}
                disabled={isThinking}
                placeholder={
                  isThinking ? 'Thinking…' : 'Type your refinement...'
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') handleSend();
                }}
                _focus={{ outline: 'none', borderColor: solvoColors.indigo }}
              />
              <Flex
                as="button"
                align="center"
                justify="center"
                width="36px"
                height="36px"
                borderRadius="10px"
                bg={isThinking ? solvoColors.borderHover : solvoColors.text}
                color="white"
                cursor={isThinking ? 'not-allowed' : 'pointer'}
                onClick={handleSend}
              >
                <Send size={14} />
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default RefineFooter;
