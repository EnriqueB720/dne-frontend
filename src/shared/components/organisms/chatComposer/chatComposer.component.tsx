import * as React from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, MODEL_LIST, MODEL_META } from '@constants';
import type { ModelKey } from '@/shared/jotai/ai-usage.atom';

export interface ChatComposerProps {
  onSend: (content: string) => void;
  /** Abort the in-flight AI turn. When provided, the send button becomes a
   *  stop button while `disabled` (i.e. "Solvo is thinking…") is true. */
  onStop?: () => void;
  disabled?: boolean;
  model: ModelKey;
  onModelChange: (m: ModelKey) => void;
}

const ChatComposer: React.FC<ChatComposerProps> = ({
  onSend,
  onStop,
  disabled = false,
  model,
  onModelChange,
}) => {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // Auto-resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <Box
      padding={{ base: '12px 16px', md: '16px 24px' }}
      borderTop="1px solid"
      borderColor={solvoColors.border}
      bg="white"
      flexShrink={0}
    >
      <Box maxWidth="760px" margin="0 auto">
        {/* Input box */}
        <Box
          bg={solvoColors.bg}
          borderWidth="1px"
          borderColor={solvoColors.border}
          borderRadius="16px"
          padding="12px 14px"
          marginBottom="10px"
          style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Solvo is thinking…' : 'Ask Solvo anything…'}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: solvoFonts.sans,
              fontSize: '14px',
              color: solvoColors.text,
              lineHeight: '1.5',
              minHeight: '24px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          />
          {disabled && onStop ? (
            // While Solvo is thinking, the action button becomes a STOP
            // button that aborts the in-flight AI turn.
            <button
              onClick={onStop}
              aria-label="Stop generating"
              title="Stop generating"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: 'none',
                background: solvoColors.text,
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <Square size={14} fill="white" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: 'none',
                background:
                  disabled || !value.trim()
                    ? solvoColors.border
                    : solvoColors.text,
                color: 'white',
                cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <ArrowUp size={16} />
            </button>
          )}
        </Box>

        {/* Model picker row */}
        <Flex align="center" gap="8px" wrap="wrap">
          <Text fontSize="11px" color={solvoColors.textSubtle}>
            Model:
          </Text>
          {MODEL_LIST.map((m) => {
            const selected = m.key === model;
            return (
              <button
                key={m.key}
                onClick={() => !disabled && onModelChange(m.key)}
                disabled={disabled}
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: `1px solid ${selected ? solvoColors.indigo : solvoColors.border}`,
                  background: selected ? solvoColors.indigo : 'transparent',
                  color: selected ? 'white' : solvoColors.textMuted,
                  opacity: disabled ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {m.shortLabel}
              </button>
            );
          })}
          <Text fontSize="11px" color={solvoColors.textSubtle} marginLeft="4px">
            · {MODEL_META[model].fullName}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatComposer;
