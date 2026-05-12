import * as React from 'react';
import _ from 'lodash';
import { Sparkles } from 'lucide-react';
import { Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: { box: '28px', icon: 16, text: 'lg' },
  md: { box: '36px', icon: 18, text: 'xl' },
  lg: { box: '44px', icon: 22, text: '2xl' },
};

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, onClick }) => {
  const dim = sizeMap[size];

  return (
    <Flex
      align="center"
      gap="10px"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
    >
      <Flex
        width={dim.box}
        height={dim.box}
        borderRadius="10px"
        align="center"
        justify="center"
        bgGradient="linear(135deg, #4338CA, #6366F1)"
        style={{ background: `linear-gradient(135deg, ${solvoColors.indigo}, #6366F1)` }}
        color="white"
      >
        <Sparkles size={dim.icon} strokeWidth={2.2} />
      </Flex>
      {showText && (
        <Text
          fontSize={dim.text}
          fontWeight="600"
          color={solvoColors.text}
          fontFamily={solvoFonts.serif}
          letterSpacing="-0.01em"
        >
          Solvo
        </Text>
      )}
    </Flex>
  );
};

export default React.memo(Logo, (p, n) => _.isEqual(p, n));
