import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Paperclip,
  Mic,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Calendar,
  Home as HomeIcon,
  Briefcase,
  Scissors,
  Car,
} from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

const SUGGESTED_PROMPTS = [
  '🎂 Plan a birthday party',
  '❄️ Fix my AC',
  '🧽 Find a cleaning service',
  '🎧 Get a DJ for an event',
  '📸 Hire a photographer',
  '🚚 Need movers this weekend',
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Verified providers', subtitle: 'Every business is identity-checked' },
  { icon: Zap, title: 'Replies in minutes', subtitle: 'Average first response: 8 minutes' },
  { icon: TrendingUp, title: 'Compare instantly', subtitle: 'Side-by-side options & pricing' },
];

const CATEGORIES = [
  { icon: Calendar, label: 'Events', count: '2.4k providers', from: '#FFE4E6', to: '#FED7AA' },
  { icon: HomeIcon, label: 'Home services', count: '1.8k providers', from: '#E0F2FE', to: '#C7D2FE' },
  { icon: Briefcase, label: 'Business', count: '920 providers', from: '#D1FAE5', to: '#CCFBF1' },
  { icon: Scissors, label: 'Beauty & wellness', count: '1.2k providers', from: '#FCE7F3', to: '#FAE8FF' },
  { icon: Car, label: 'Auto', count: '640 providers', from: '#FEF3C7', to: '#FEF9C3' },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <Box position="relative" minHeight="100vh" bg={solvoColors.bg} overflow="hidden">
      {/* Atmospheric blurred gradients */}
      <Box
        position="absolute"
        top="-200px"
        right="-200px"
        width="600px"
        height="600px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <Box
        position="absolute"
        bottom="-200px"
        left="-200px"
        width="600px"
        height="600px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <SolvoNavBar activePath="/" />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '32px 20px', md: '56px 24px' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Flex direction="column" align="center" gap="20px" textAlign="center" marginBottom="40px">
            <Flex
              align="center"
              gap="8px"
              padding="6px 14px"
              bg="white"
              borderRadius="full"
              borderWidth="1px"
              borderColor={solvoColors.border}
              fontSize="12px"
              color={solvoColors.textMuted}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: solvoColors.emerald,
                }}
              />
              AI concierge · 12,400+ verified providers
            </Flex>

            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '40px', md: '72px' }}
              lineHeight="1.05"
              fontWeight="500"
              color={solvoColors.text}
              maxWidth="900px"
              letterSpacing="-0.02em"
            >
              Ask for anything.
              <br />
              <Text
                as="span"
                fontStyle="italic"
                color={solvoColors.indigo}
                fontFamily={solvoFonts.serif}
              >
                Solvo finds
              </Text>{' '}
              who solves it.
            </Text>

            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={solvoColors.textMuted}
              maxWidth="640px"
            >
              Describe what you need in your own words. We match you with the right people, instantly.
            </Text>
          </Flex>
        </motion.div>

        {/* Input box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Box
            maxWidth="720px"
            margin="0 auto"
            bg="white"
            borderRadius="24px"
            padding="20px"
            boxShadow={solvoShadows.heroInput}
            borderWidth="1px"
            borderColor={solvoColors.border}
          >
            <Box
              as="textarea"
              width="100%"
              minHeight="60px"
              border="none"
              outline="none"
              resize="none"
              fontSize="md"
              fontFamily={solvoFonts.sans}
              color={solvoColors.text}
              placeholder="I need catering for 40 people this Saturday..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              style={{
                background: 'transparent',
              }}
            />
            <Flex align="center" justify="space-between" marginTop="12px">
              <Flex gap="14px" align="center" color={solvoColors.textSubtle}>
                <Box cursor="pointer" _hover={{ color: solvoColors.text }}>
                  <Paperclip size={18} />
                </Box>
                <Box cursor="pointer" _hover={{ color: solvoColors.text }}>
                  <Mic size={18} />
                </Box>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  Press ⏎ to send
                </Text>
              </Flex>
              <Flex
                as="button"
                align="center"
                gap="8px"
                bg={solvoColors.text}
                color="white"
                padding="10px 18px"
                borderRadius="14px"
                fontSize="sm"
                fontWeight="500"
                cursor="pointer"
                onClick={handleSubmit}
                _hover={{ bg: solvoColors.indigo }}
              >
                Find options
                <ArrowRight size={14} />
              </Flex>
            </Flex>
          </Box>
        </motion.div>

        {/* Suggested prompts */}
        <Flex
          wrap="wrap"
          gap="8px"
          justify="center"
          marginTop="24px"
          marginBottom="80px"
        >
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <motion.div
              key={prompt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Flex
                as="button"
                padding="8px 14px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="full"
                fontSize="sm"
                color={solvoColors.textMuted}
                cursor="pointer"
                onClick={() => setQuery(prompt.replace(/^[^\s]+\s/, ''))}
                _hover={{ borderColor: solvoColors.indigoMid, bg: '#F5F3FF' }}
              >
                {prompt}
              </Flex>
            </motion.div>
          ))}
        </Flex>

        {/* Trust strip */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          marginBottom="80px"
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor={solvoColors.border}
        >
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Flex
                key={item.title}
                direction="column"
                gap="8px"
                padding="32px 24px"
                borderRight={{ base: 'none', md: i < 2 ? '1px solid' : 'none' }}
                borderColor={solvoColors.border}
              >
                <Box color={solvoColors.indigo}>
                  <Icon size={20} />
                </Box>
                <Text fontWeight="600" color={solvoColors.text}>
                  {item.title}
                </Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  {item.subtitle}
                </Text>
              </Flex>
            );
          })}
        </Box>

        {/* Categories */}
        <Box marginBottom="80px">
          <Text
            fontFamily={solvoFonts.serif}
            fontSize="3xl"
            fontWeight="500"
            color={solvoColors.text}
            marginBottom="24px"
          >
            Browse by category
          </Text>
          <Box
            display="grid"
            gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
            gap="12px"
          >
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <Flex
                    direction="column"
                    gap="14px"
                    padding="20px"
                    bg="white"
                    borderWidth="1px"
                    borderColor={solvoColors.border}
                    borderRadius="20px"
                    cursor="pointer"
                    _hover={{ borderColor: solvoColors.borderHover }}
                  >
                    <Flex
                      width="48px"
                      height="48px"
                      borderRadius="14px"
                      align="center"
                      justify="center"
                      style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
                      color={solvoColors.text}
                    >
                      <Icon size={22} />
                    </Flex>
                    <Box>
                      <Text fontWeight="600" color={solvoColors.text} fontSize="sm">
                        {cat.label}
                      </Text>
                      <Text fontSize="xs" color={solvoColors.textSubtle}>
                        {cat.count}
                      </Text>
                    </Box>
                  </Flex>
                </motion.div>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        borderTop="1px solid"
        borderColor={solvoColors.border}
        padding="32px 24px"
        textAlign="center"
      >
        <Text fontSize="sm" color={solvoColors.textSubtle}>
          © {new Date().getFullYear()} Solvo · Designed in Costa Rica
        </Text>
      </Box>
    </Box>
  );
}
