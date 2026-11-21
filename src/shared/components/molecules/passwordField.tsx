import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Box } from '@atoms';
import { solvoColors } from '@constants';
import { FieldLabel, inputStyle } from '../ui';
import { useI18n } from '@/shared/i18n';

/** Password input with a show/hide toggle. */
export default function PasswordField({
  label,
  hint,
  value,
  onChange,
  autoComplete = 'current-password',
  minLength,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  minLength?: number;
}) {
  const { t } = useI18n();
  const [show, setShow] = React.useState(false);
  return (
    <Box marginBottom="14px">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <Box position="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          style={{ ...inputStyle, paddingRight: '42px' }}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? t('auth.hidePassword') : t('auth.showPassword')}
          style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: solvoColors.textSubtle, cursor: 'pointer', display: 'flex' }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </Box>
    </Box>
  );
}
