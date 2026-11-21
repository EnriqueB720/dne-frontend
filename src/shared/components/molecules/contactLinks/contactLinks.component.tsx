import * as React from 'react';
import { Globe, Mail, MessageCircle, Phone } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors } from '@constants';
import { useI18n } from '@/shared/i18n';
import { channelFor, contactLinks, type ContactKind } from '@/shared/lib/supplier';
import { logSupplierContact } from '@/shared/services/contact.service';

const ICONS: Record<ContactKind, React.ReactNode> = {
  phone: <Phone size={15} />,
  whatsapp: <MessageCircle size={15} />,
  email: <Mail size={15} />,
  website: <Globe size={15} />,
};

const LABEL_KEYS: Record<ContactKind, string> = {
  phone: 'common.call',
  whatsapp: 'common.whatsapp',
  email: 'common.email',
  website: 'common.website',
};

export interface ContactLinksProps {
  supplierId: number;
  supplier: Parameters<typeof contactLinks>[0];
  /** Where the click happened, recorded with the contact. */
  source: 'chat' | 'profile';
  /** Rendered when the supplier published nothing. */
  emptyText?: string;
}

/**
 * Tappable phone / WhatsApp / email / website rows. Each tap opens the
 * matching app AND logs a ContactEvent — that's Solvo's customer↔supplier
 * interaction signal (admin analytics, "Mis contactos", review prompts).
 */
const ContactLinks: React.FC<ContactLinksProps> = ({ supplierId, supplier, source, emptyText }) => {
  const { t } = useI18n();
  const links = contactLinks(supplier);

  if (links.length === 0) {
    return emptyText ? (
      <Text fontSize="sm" color={solvoColors.textSubtle}>
        {emptyText}
      </Text>
    ) : null;
  }

  return (
    <Flex direction="column" gap="6px">
      {links.map((l) => (
        <a
          key={`${l.kind}-${l.value}`}
          href={l.href}
          target={l.kind === 'website' || l.kind === 'whatsapp' ? '_blank' : undefined}
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
          onClick={() => logSupplierContact(supplierId, channelFor(l.kind), source)}
        >
          <Flex
            align="center"
            gap="10px"
            padding="9px 12px"
            borderRadius="10px"
            bg={solvoColors.bg}
            color={solvoColors.text}
            _hover={{ bg: solvoColors.accentSoft }}
          >
            {/* Emerald is reserved for WhatsApp. */}
            <Box color={l.kind === 'whatsapp' ? solvoColors.emerald : solvoColors.accentText}>{ICONS[l.kind]}</Box>
            <Text fontSize="xs" fontWeight={600} color={solvoColors.textSubtle} minWidth="64px">
              {t(LABEL_KEYS[l.kind])}
            </Text>
            <Text fontSize="sm" style={{ wordBreak: 'break-all' }}>
              {l.value}
            </Text>
          </Flex>
        </a>
      ))}
    </Flex>
  );
};

export default ContactLinks;
