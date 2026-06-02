import * as React from 'react';
import { ArrowUp, Square, Mic, MicOff, Sparkles } from 'lucide-react';
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
  /**
   * When provided, a "See options →" chip is shown above the input so the
   * user can request provider results with one tap instead of typing.
   * The callback should call `handleSend('show me available options')`.
   */
  onShowOptions?: () => void;
}

const ChatComposer: React.FC<ChatComposerProps> = ({
  onSend,
  onStop,
  disabled = false,
  model,
  onModelChange,
  onShowOptions,
}) => {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // ── Speech recognition ─────────────────────────────────────────────────
  const recognitionRef = React.useRef<any>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [micSupported, setMicSupported] = React.useState(false);
  // Default to Spanish (Costa Rica) since the app is bilingual but CR-first.
  // Users can toggle to English with the ES/EN pill in the toolbar.
  const [micLang, setMicLang] = React.useState<'es-CR' | 'en-US'>('es-CR');

  React.useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setMicSupported(!!SR);
    // Respect the browser's language if it's English — the user likely expects
    // English recognition by default on an EN browser.
    if (typeof navigator !== 'undefined' && navigator.language && !navigator.language.startsWith('es')) {
      setMicLang('en-US');
    }
  }, []);

  // Stop listening automatically if the AI starts responding.
  React.useEffect(() => {
    if (disabled && isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [disabled, isListening]);

  // Cleanup on unmount.
  React.useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const toggleListening = () => {
    if (disabled) return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    // Use the language the user selected via the ES/EN toggle.
    recognition.lang = micLang;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const transcript = finalTranscript || interimTranscript;
      if (transcript) {
        setValue(transcript);
        // Defer resize so the DOM has updated with new value.
        setTimeout(resizeTextarea, 0);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    // Stop listening if still active when the user submits.
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    onSend(trimmed);
    setValue('');
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

        {/* "See options" suggestion chip — appears when the AI has chatted
            for a few turns without showing any provider cards. */}
        {onShowOptions && !disabled && (
          <Flex marginBottom="10px" justify="flex-start">
            <button
              onClick={onShowOptions}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: `1px solid ${solvoColors.indigo}`,
                background: 'transparent',
                color: solvoColors.indigo,
                fontFamily: solvoFonts.sans,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = solvoColors.indigo;
                (e.currentTarget as HTMLButtonElement).style.color = 'white';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = solvoColors.indigo;
              }}
            >
              <Sparkles size={12} />
              See available options
            </button>
          </Flex>
        )}

        {/* Input box */}
        <Box
          bg={solvoColors.bg}
          borderWidth="1px"
          borderColor={isListening ? solvoColors.indigo : solvoColors.border}
          borderRadius="16px"
          padding="12px 14px"
          marginBottom="10px"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              isListening
                ? 'Listening…'
                : disabled
                  ? 'Solvo is thinking…'
                  : 'Ask Solvo anything…'
            }
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

          {/* Mic button — only shown when browser supports it */}
          {micSupported && (
            <button
              onClick={toggleListening}
              disabled={disabled}
              aria-label={isListening ? 'Stop recording' : 'Start voice input'}
              title={
                isListening
                  ? 'Stop recording'
                  : `Speak your message (${micLang === 'es-CR' ? 'Spanish / ES' : 'English / EN'})`
              }
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: 'none',
                background: isListening ? '#EF4444' : 'transparent',
                color: isListening ? 'white' : solvoColors.textMuted,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s, color 0.2s',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          {/* Send / Stop button */}
          {disabled && onStop ? (
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

        {/* Model picker + voice language row */}
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

          {/* Voice language toggle — only shown when the browser supports the mic */}
          {micSupported && (
            <>
              <Text fontSize="11px" color={solvoColors.textSubtle} marginLeft="8px">
                · 🎤
              </Text>
              {(['es-CR', 'en-US'] as const).map((lang) => {
                const selected = micLang === lang;
                const label = lang === 'es-CR' ? 'ES' : 'EN';
                return (
                  <button
                    key={lang}
                    onClick={() => !isListening && !disabled && setMicLang(lang)}
                    disabled={disabled || isListening}
                    title={
                      lang === 'es-CR'
                        ? 'Voice input in Spanish'
                        : 'Voice input in English'
                    }
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: disabled || isListening ? 'not-allowed' : 'pointer',
                      border: `1px solid ${selected ? solvoColors.indigo : solvoColors.border}`,
                      background: selected ? solvoColors.indigo : 'transparent',
                      color: selected ? 'white' : solvoColors.textMuted,
                      opacity: disabled || isListening ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatComposer;
