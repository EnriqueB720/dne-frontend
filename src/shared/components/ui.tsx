import * as React from 'react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

/**
 * Small, theme-aware building blocks shared by every page, so forms and
 * cards look the same everywhere. Colors are always `solvoColors` tokens
 * (never hex) so dark mode keeps working.
 */

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '15px',
  outline: 'none',
};

export const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

export function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <Box marginBottom="6px">
      <label style={{ ...labelStyle, marginBottom: hint ? '2px' : 0 }}>{children}</label>
      {hint && (
        <Text fontSize="12px" color={solvoColors.textSubtle}>
          {hint}
        </Text>
      )}
    </Box>
  );
}

export function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; hint?: React.ReactNode },
) {
  const { label, hint, style, ...rest } = props;
  return (
    <Box marginBottom="14px">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <input {...rest} style={{ ...inputStyle, ...style }} />
    </Box>
  );
}

export function TextAreaField(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: React.ReactNode; hint?: React.ReactNode },
) {
  const { label, hint, style, ...rest } = props;
  return (
    <Box marginBottom="14px">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <textarea {...rest} style={{ ...inputStyle, minHeight: '96px', resize: 'vertical', ...style }} />
    </Box>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Btn({
  variant = 'primary',
  style,
  disabled,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const palette: Record<ButtonVariant, React.CSSProperties> = {
    // Orange fills always take accentFg (white on orange fails contrast).
    primary: { background: solvoColors.accent, color: solvoColors.accentFg, border: 'none' },
    secondary: { background: solvoColors.surface, color: solvoColors.text, border: `1px solid ${solvoColors.border}` },
    ghost: { background: 'transparent', color: solvoColors.brandText, border: 'none' },
    danger: { background: solvoColors.roseLight, color: solvoColors.roseText, border: 'none' },
  };
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 16px',
        borderRadius: '12px',
        fontFamily: solvoFonts.sans,
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        whiteSpace: 'nowrap',
        ...palette[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, padding = '20px', ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      bg={solvoColors.surface}
      borderWidth="1px"
      borderColor={solvoColors.border}
      borderRadius="16px"
      padding={padding}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <Flex justify="space-between" align="center" marginBottom="12px" gap="12px">
      <Text fontFamily={solvoFonts.display} fontSize="18px" fontWeight={700} color={solvoColors.text}>
        {children}
      </Text>
      {right}
    </Flex>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'error' | 'success'; children: React.ReactNode }) {
  const tones = {
    info: { bg: solvoColors.brandSoft, fg: solvoColors.brandText },
    warn: { bg: solvoColors.amberLight, fg: solvoColors.amberText },
    error: { bg: solvoColors.roseLight, fg: solvoColors.roseText },
    success: { bg: solvoColors.successLight, fg: solvoColors.successText },
  }[tone];
  return (
    <Box padding="10px 14px" borderRadius="12px" bg={tones.bg} color={tones.fg} fontSize="sm" marginBottom="14px">
      {children}
    </Box>
  );
}

/** Centered card used by sign-in, sign-up and password pages. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Flex minHeight="calc(100vh - 64px)" align="center" justify="center" padding="24px">
      <Box
        width="100%"
        maxWidth="440px"
        bg={solvoColors.surface}
        border={`1px solid ${solvoColors.border}`}
        borderRadius="24px"
        padding={{ base: '28px 22px', md: '36px 32px' }}
        style={{ boxShadow: solvoShadows.heroInput }}
      >
        {children}
      </Box>
    </Flex>
  );
}

export function PageTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <Flex justify="space-between" align={{ base: 'flex-start', md: 'flex-end' }} gap="16px" marginBottom="24px" wrap="wrap">
      <Box>
        <Text fontFamily={solvoFonts.display} fontSize={{ base: '28px', md: '34px' }} fontWeight={700} color={solvoColors.text} letterSpacing="-0.02em">
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color={solvoColors.textMuted} marginTop="4px">
            {subtitle}
          </Text>
        )}
      </Box>
      {right}
    </Flex>
  );
}

/** Read-only stars ("★★★★☆ 4.2"). */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span style={{ color: 'var(--solvo-amber-text)', fontSize: size, letterSpacing: '1px' }} aria-label={`${value} / 5`}>
      {'★★★★★'.slice(0, full)}
      <span style={{ color: solvoColors.border }}>{'★★★★★'.slice(full)}</span>
    </span>
  );
}

/** Clickable 1–5 star input. */
export function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <Flex gap="4px">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n}`}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '28px',
            lineHeight: 1,
            padding: 0,
            color: n <= value ? 'var(--solvo-amber-text)' : solvoColors.border,
          }}
        >
          ★
        </button>
      ))}
    </Flex>
  );
}

export function Chip({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'brand' | 'accent' | 'success' }) {
  const tones = {
    default: { bg: solvoColors.surfaceMuted, fg: solvoColors.textMuted },
    brand: { bg: solvoColors.brandSoft, fg: solvoColors.brandText },
    accent: { bg: solvoColors.accentSoft, fg: solvoColors.accentText },
    success: { bg: solvoColors.successLight, fg: solvoColors.successText },
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        background: tones.bg,
        color: tones.fg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
