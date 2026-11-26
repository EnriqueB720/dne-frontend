import * as React from 'react';
import { ArrowUp, MapPin, Mic, MicOff, Square } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';
import { useI18n } from '@/shared/i18n';

/** Where the chat will search — shown as the "📍 Zona" chip. */
export interface ZoneState {
  /** 'device' = from GPS, 'picked' = chosen by hand, 'none' = nationwide. */
  mode: 'device' | 'picked' | 'none';
  code?: string | null;
  name?: string | null;
  locating?: boolean;
  denied?: boolean;
}

export interface ChatComposerProps {
  onSend: (content: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  zone: ZoneState;
  provinces: Array<{ code: string; name: string }>;
  /** A province code, or null for "whole country". */
  onPickZone: (code: string | null) => void;
  onUseDeviceZone: () => void;
}

const DEVICE_VALUE = '__device__';
const NONE_VALUE = '__none__';

const ChatComposer: React.FC<ChatComposerProps> = ({
  onSend,
  onStop,
  disabled = false,
  zone,
  provinces,
  onPickZone,
  onUseDeviceZone,
}) => {
  const { t, lang } = useI18n();
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // ── Voice input (browser speech recognition, in the UI language) ──
  const recognitionRef = React.useRef<any>(null);
  const [listening, setListening] = React.useState(false);
  const [micSupported, setMicSupported] = React.useState(false);
  React.useEffect(() => {
    setMicSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    return () => recognitionRef.current?.stop();
  }, []);
  React.useEffect(() => {
    if (disabled && listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }
  }, [disabled, listening]);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR || disabled) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang === 'es' ? 'es-CR' : 'en-US';
    rec.onresult = (e: any) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript;
      if (text) {
        setValue(text);
        setTimeout(resize, 0);
      }
    };
    rec.onend = rec.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    if (listening) recognitionRef.current?.stop();
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const zoneLabel = zone.locating
    ? t('chat.zoneLocating')
    : zone.mode === 'device' && zone.name
      ? t('chat.zoneDevice', { zone: zone.name })
      : zone.mode === 'picked' && zone.name
        ? zone.name
        : zone.denied
          ? t('chat.zoneDenied')
          : t('common.allCountry');

  const selectValue = zone.mode === 'picked' && zone.code ? zone.code : zone.mode === 'device' ? DEVICE_VALUE : NONE_VALUE;

  const iconBtn: React.CSSProperties = {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
  };

  return (
    <Box
      padding={{ base: '10px 12px', md: '14px 24px' }}
      borderTop="1px solid"
      borderColor={solvoColors.border}
      bg={solvoColors.surface}
      flexShrink={0}
    >
      <Box maxWidth="760px" margin="0 auto">
        <Flex
          bg={solvoColors.bg}
          borderWidth="1px"
          borderColor={listening ? solvoColors.brand : solvoColors.border}
          borderRadius="16px"
          padding="10px 12px"
          align="flex-end"
          gap="8px"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              setValue(e.target.value);
              resize();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={listening ? t('chat.listening') : disabled ? t('chat.thinking') : t('chat.placeholder')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: solvoFonts.sans,
              fontSize: '15px',
              color: solvoColors.text,
              lineHeight: 1.5,
              minHeight: '24px',
              maxHeight: '180px',
            }}
          />
          {micSupported && (
            <button
              onClick={toggleMic}
              disabled={disabled}
              aria-label={listening ? t('chat.voiceStop') : t('chat.voiceStart')}
              title={listening ? t('chat.voiceStop') : t('chat.voiceStart')}
              style={{
                ...iconBtn,
                background: listening ? solvoColors.roseLight : 'transparent',
                color: listening ? solvoColors.roseText : solvoColors.textMuted,
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}
          {disabled && onStop ? (
            <button onClick={onStop} aria-label={t('chat.stop')} title={t('chat.stop')} style={{ ...iconBtn, background: solvoColors.accent, color: solvoColors.accentFg }}>
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={disabled || !value.trim()}
              aria-label={t('chat.send')}
              style={{
                ...iconBtn,
                background: disabled || !value.trim() ? solvoColors.border : solvoColors.accent,
                color: solvoColors.accentFg,
                cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <ArrowUp size={16} />
            </button>
          )}
        </Flex>

        {/* Zone chip: which province the search is limited to. */}
        <Flex align="center" gap="6px" marginTop="8px" color={solvoColors.textSubtle}>
          <MapPin size={13} />
          <Text fontSize="12px">{t('chat.zoneLabel')}:</Text>
          <Box position="relative">
            <Text fontSize="12px" fontWeight={600} color={solvoColors.brandText} style={{ pointerEvents: 'none' }}>
              {zoneLabel} ▾
            </Text>
            <select
              aria-label={t('chat.zoneLabel')}
              value={selectValue}
              onChange={(e) => {
                const v = e.target.value;
                if (v === DEVICE_VALUE) onUseDeviceZone();
                else onPickZone(v === NONE_VALUE ? null : v);
              }}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
            >
              <option value={DEVICE_VALUE}>{t('chat.zoneUseDevice')}</option>
              <option value={NONE_VALUE}>{t('common.allCountry')}</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatComposer;
