import * as React from 'react';
import _ from 'lodash';
import { Box } from '@atoms';
import { solvoGlows } from '@constants';

export interface AtmosphericGlowProps {
  /**
   * `subtle` (default) is tuned for interior app pages, where the glow should
   * warm the canvas without competing with dense content. `full` is the
   * landing/auth treatment: larger, closer in, more present.
   */
  intensity?: 'subtle' | 'full';
}

const sizeMap = {
  subtle: { size: '720px', offset: '-320px', blur: '90px' },
  full: { size: '980px', offset: '-200px', blur: '70px' },
};

/**
 * The brand's ambient background lighting: a Creative Purple glow top-right
 * and an Energy Orange one bottom-left.
 *
 * Drop it as the FIRST child of a page root that has `position="relative"`.
 * Two details make that safe on every page:
 *
 *  - It clips the orbs against its own `overflow: hidden` wrapper rather than
 *    asking the page root to clip them. Putting `overflow: hidden` on the root
 *    would break the sticky navbar.
 *  - The wrapper sits at `zIndex: -1`, which paints it above the root's
 *    background colour but below all in-flow content, so no page needs its
 *    content re-stacked.
 */
const AtmosphericGlow: React.FC<AtmosphericGlowProps> = ({
  intensity = 'subtle',
}) => {
  const dim = sizeMap[intensity];

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflow="hidden"
      zIndex={-1}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Box
        position="absolute"
        top={dim.offset}
        right={dim.offset}
        width={dim.size}
        height={dim.size}
        borderRadius="full"
        style={{
          background: `radial-gradient(circle, ${solvoGlows.brand}, transparent 70%)`,
          filter: `blur(${dim.blur})`,
        }}
      />
      <Box
        position="absolute"
        bottom={dim.offset}
        left={dim.offset}
        width={dim.size}
        height={dim.size}
        borderRadius="full"
        style={{
          background: `radial-gradient(circle, ${solvoGlows.accent}, transparent 70%)`,
          filter: `blur(${dim.blur})`,
        }}
      />
    </Box>
  );
};

export default React.memo(AtmosphericGlow, (p, n) => _.isEqual(p, n));
