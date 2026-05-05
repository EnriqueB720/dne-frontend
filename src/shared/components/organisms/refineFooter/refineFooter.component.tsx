import * as React from 'react';
import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, Text, Input } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

interface Message {
  from: 'ai' | 'user';
  text: string;
}

const initialMessages: Message[] = [
  {
    from: 'ai',
    text: "Want me to refine these results? I can adjust budget, location, dietary needs, or add more services.",
  },
];

const RefineFooter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: 'ai',
          text: "Got it — I'll update the results to focus on that. Anything else to adjust?",
        },
      ]);
    }, 800);
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
              width: 360,
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
                      Online
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

            <Box maxHeight="288px" overflowY="auto" padding="16px">
              <Flex direction="column" gap="12px">
                {messages.map((m, i) => (
                  <Flex
                    key={i}
                    justify={m.from === 'ai' ? 'flex-start' : 'flex-end'}
                  >
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
                ))}
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
                placeholder="Type your refinement..."
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
                bg={solvoColors.text}
                color="white"
                cursor="pointer"
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
