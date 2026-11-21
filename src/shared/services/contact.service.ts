import { ContactChannel, LogSupplierContactDocument } from '@generated';
import { getApolloClient } from './apollo.client';
import { getOrCreateDeviceId } from './conversation.service';

/** Map a contact link's kind to the channel the API records. */
export function contactChannelFor(kind: string): ContactChannel {
  switch (kind) {
    case 'phone':
      return ContactChannel.Phone;
    case 'email':
      return ContactChannel.Email;
    case 'whatsapp':
      return ContactChannel.Whatsapp;
    default:
      return ContactChannel.Website;
  }
}

/**
 * Record that the user reached out to a real supplier — Solvo's lead
 * signal, and what the "How did it go?" review prompt follows up on.
 *
 * Fire-and-forget: it must never delay the phone call, email or page the
 * click is opening, and a failure is not the user's problem. The API
 * dedupes repeat clicks, so callers don't need to.
 */
export function logSupplierContact(
  supplierId: number,
  channel: ContactChannel,
  source: 'chat' | 'profile',
): void {
  if (!Number.isFinite(supplierId) || supplierId <= 0) return;
  try {
    void getApolloClient()
      .mutate({
        mutation: LogSupplierContactDocument,
        variables: {
          data: { supplierId, channel, source, deviceId: getOrCreateDeviceId() },
        },
      })
      .catch(() => undefined);
  } catch {
    /* client not ready — nothing to do */
  }
}
