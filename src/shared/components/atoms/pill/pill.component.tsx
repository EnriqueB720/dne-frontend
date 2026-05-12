import * as React from 'react';
import _ from 'lodash';
import { Box } from '@chakra-ui/react';
import { solvoColors } from '@constants';

export type PillTone = 'default' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'dark';

export interface PillProps {
  children: React.ReactNode;
  tone?: PillTone;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

const toneMap: Record<PillTone, { bg: string; color: string; border?: string }> = {
  default: { bg: '#F5F5F4', color: solvoColors.textMuted, border: solvoColors.border },
  indigo: { bg: solvoColors.indigoLight, color: solvoColors.indigo },
  amber: { bg: solvoColors.amberLight, color: solvoColors.amberText },
  emerald: { bg: solvoColors.emeraldLight, color: solvoColors.emeraldText },
  rose: { bg: solvoColors.roseLight, color: solvoColors.roseText },
  dark: { bg: solvoColors.text, color: '#fff' },
};

const Pill: React.FC<PillProps> = ({ children, tone = 'default', size = 'sm', onClick }) => {
  const t = toneMap[tone];
  const padding = size === 'sm' ? '4px 10px' : '6px 14px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="4px"
      bg={t.bg}
      color={t.color}
      borderWidth={t.border ? '1px' : '0'}
      borderColor={t.border}
      borderRadius="9999px"
      padding={padding}
      fontSize={fontSize}
      fontWeight="500"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      whiteSpace="nowrap"
    >
      {children}
    </Box>
  );
};

export default React.memo(Pill, (p, n) => _.isEqual(p, n));
