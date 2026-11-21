import * as React from 'react';

import { Box, Text } from '@atoms';
import { solvoColors } from '@constants';
import { useI18n } from '@/shared/i18n';

export type AccountType = 'CUSTOMER' | 'SUPPLIER';

/** Two big buttons: "I'm looking for suppliers" / "I have a business". */
export default function AccountTypePicker({ value, onChange }: { value: AccountType; onChange: (v: AccountType) => void }) {
  const { t } = useI18n();
  const option = (type: AccountType, title: string, sub: string) => {
    const on = value === type;
    return (
      <button
        type="button"
        onClick={() => onChange(type)}
        style={{
          flex: 1,
          textAlign: 'left',
          padding: '12px 14px',
          borderRadius: '14px',
          cursor: 'pointer',
          border: `1.5px solid ${on ? solvoColors.accent : solvoColors.border}`,
          background: on ? solvoColors.accentSoft : solvoColors.surface,
        }}
      >
        <Text fontWeight={700} fontSize="14px" color={solvoColors.text}>
          {title}
        </Text>
        <Text fontSize="12px" color={solvoColors.textSubtle}>
          {sub}
        </Text>
      </button>
    );
  };
  return (
    <Box display="flex" gap="8px" marginBottom="18px">
      {option('CUSTOMER', t('auth.asCustomer'), t('auth.asCustomerSub'))}
      {option('SUPPLIER', t('auth.asSupplier'), t('auth.asSupplierSub'))}
    </Box>
  );
}
