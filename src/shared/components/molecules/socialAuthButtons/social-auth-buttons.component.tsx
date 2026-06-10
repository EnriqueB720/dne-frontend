import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { solvoColors, solvoFonts } from '@constants';

type Provider = 'google' | 'github';

interface SocialAuthButtonsProps {
  /** Where to land after a successful handshake. The auth bridge re-routes
   *  brand-new users to /complete-profile from wherever they end up. */
  callbackUrl?: string;
  disabled?: boolean;
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '11px 16px',
  borderRadius: '12px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontWeight: 600,
  fontSize: '15px',
  fontFamily: solvoFonts.sans,
  cursor: 'pointer',
};

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  callbackUrl = '/',
  disabled = false,
}) => {
  const [pending, setPending] = useState<Provider | null>(null);

  const handle = (provider: Provider) => {
    setPending(provider);
    // Redirects to the provider; the auth bridge takes over on return.
    signIn(provider, { callbackUrl });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        type="button"
        onClick={() => handle('google')}
        disabled={disabled || pending !== null}
        style={{ ...buttonStyle, opacity: disabled || pending ? 0.6 : 1 }}
      >
        <FcGoogle size={18} />
        {pending === 'google' ? 'Connecting…' : 'Continue with Google'}
      </button>

      <button
        type="button"
        onClick={() => handle('github')}
        disabled={disabled || pending !== null}
        style={{ ...buttonStyle, opacity: disabled || pending ? 0.6 : 1 }}
      >
        <FaGithub size={18} color={solvoColors.text} />
        {pending === 'github' ? 'Connecting…' : 'Continue with GitHub'}
      </button>
    </div>
  );
};

export default SocialAuthButtons;
