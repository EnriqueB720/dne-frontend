import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

/**
 * The mark is the brand's geometric 'S' emblem. It renders from the 192px
 * asset rather than the 1600px master so the navbar isn't pulling ~700KB for
 * a 36px logo — 192 still gives better than 4x density at every size below.
 *
 * Brand guidelines §4 put the icon's minimum digital width at 24px; the
 * smallest step here is 28px.
 */
const MARK_SRC = '/assets/brand/logo-192.png';

const sizeMap = {
  sm: { mark: '28px', text: 'lg' },
  md: { mark: '36px', text: 'xl' },
  lg: { mark: '44px', text: '2xl' },
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
      <Image
        src={MARK_SRC}
        alt="Solvo"
        width={dim.mark}
        height={dim.mark}
        objectFit="contain"
        // The emblem's radiating rays read as noise below ~24px, so the mark
        // is never scaled under the guidelines' floor.
        minWidth={dim.mark}
      />
      {showText && (
        <Text
          fontSize={dim.text}
          fontWeight="800"
          color={solvoColors.text}
          fontFamily={solvoFonts.display}
          letterSpacing="-0.02em"
        >
          Solvo
        </Text>
      )}
    </Flex>
  );
};

export default React.memo(Logo, (p, n) => _.isEqual(p, n));
