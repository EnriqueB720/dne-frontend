import * as React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';

export interface LoadingStateProps {
  headline?: string;
  steps?: string[];
}

const defaultSteps = [
  'Reading your request',
  'Matching with 12,400 providers',
  'Ranking by fit & response time',
];

const LoadingState: React.FC<LoadingStateProps> = ({
  headline = 'Solvo is finding the best options...',
  steps = defaultSteps,
}) => {
  return (
    <Flex direction="column" align="center" gap="24px" paddingY="64px">
      <Box position="relative" width="64px" height="64px">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            border: `3px solid ${solvoColors.indigoBorder}`,
            borderTopColor: solvoColors.indigo,
            position: 'absolute',
          }}
        />
        <Flex
          position="absolute"
          inset="0"
          align="center"
          justify="center"
          color={solvoColors.indigo}
        >
          <Sparkles size={24} />
        </Flex>
      </Box>

      <Text
        fontFamily={solvoFonts.serif}
        fontSize="2xl"
        fontWeight="500"
        color={solvoColors.text}
      >
        {headline}
      </Text>

      <Flex direction="column" gap="10px" align="flex-start">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.3 }}
          >
            <Flex align="center" gap="10px">
              <Flex
                width="20px"
                height="20px"
                borderRadius="full"
                bg={solvoColors.emeraldLight}
                color={solvoColors.emeraldText}
                align="center"
                justify="center"
              >
                <Check size={12} strokeWidth={3} />
              </Flex>
              <Text fontSize="sm" color={solvoColors.textMuted}>
                {step}
              </Text>
            </Flex>
          </motion.div>
        ))}
      </Flex>
    </Flex>
  );
};

export default LoadingState;
