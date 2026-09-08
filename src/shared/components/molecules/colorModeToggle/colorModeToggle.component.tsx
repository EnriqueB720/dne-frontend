import * as React from 'react';
import _ from 'lodash';
import { Moon, Sun } from 'lucide-react';
import { Flex } from '@atoms';
import { solvoColors, solvoRadii } from '@constants';
import { useColorMode } from '@hooks';

export interface ColorModeToggleProps {
  /** Diameter of the control. Matches the navbar's other icon buttons. */
  size?: string;
}

/**
 * Light/dark switch. The icon is gated on `mounted` because the true mode is
 * only known on the client — rendering a Moon during SSR when the user is in
 * light mode would trip a hydration mismatch. Before mount we hold the space
 * with an empty box of the same size so the navbar doesn't reflow.
 */
const ColorModeToggle: React.FC<ColorModeToggleProps> = ({ size = '36px' }) => {
  const { colorMode, toggleColorMode, mounted } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Flex
      as="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleColorMode}
      width={size}
      height={size}
      align="center"
      justify="center"
      borderRadius={solvoRadii.md}
      bg="transparent"
      border="1px solid"
      borderColor={solvoColors.border}
      color={solvoColors.textMuted}
      cursor="pointer"
      transition="background 0.15s ease, border-color 0.15s ease, color 0.15s ease"
      _hover={{
        borderColor: solvoColors.accentBorder,
        color: solvoColors.accent,
        bg: solvoColors.accentSoft,
      }}
    >
      {mounted ? (
        isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />
      ) : null}
    </Flex>
  );
};

export default React.memo(ColorModeToggle, (p, n) => _.isEqual(p, n));
