import type { SupplierCardFragment } from '@generated';
import { ContactChannel } from '@generated';

/**
 * The compact supplier shape the chat shows as a card and persists in
 * `ai_message.providers_json`. Built from the GraphQL SupplierCard fragment;
 * `fromStoredJson` also reads cards saved by older app versions.
 */
export interface ChatSupplier {
  supplierId: number;
  companyName: string;
  tagline?: string | null;
  city?: string | null;
  provinceName?: string | null;
  serviceProvinceNames?: string[];
  rating?: number | null;
  reviewCount?: number;
  verified?: boolean;
  preferred?: boolean;
  businessPhone?: string | null;
  businessPhoneAlt?: string | null;
  whatsappNumber?: string | null;
  businessEmail?: string | null;
  businessEmailAlt?: string | null;
  websiteUrl?: string | null;
  skills?: string[];
  categories?: Array<{ nameEs: string; nameEn: string; icon?: string | null }>;
  services?: Array<{ name: string; priceFrom?: string | null; priceUnit?: string | null; currency?: string }>;
}

export function toChatSupplier(s: SupplierCardFragment): ChatSupplier {
  const cats = [...(s.categories ?? [])].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  return {
    supplierId: s.supplierId,
    companyName: s.companyName,
    tagline: s.tagline,
    city: s.city,
    provinceName: s.provinceName,
    serviceProvinceNames: s.serviceProvinceNames ?? [],
    rating: s.rating != null ? Number(s.rating) : null,
    reviewCount: s.reviewCount ?? 0,
    verified: !!s.verified,
    preferred: !!s.preferred,
    businessPhone: s.businessPhone,
    businessPhoneAlt: s.businessPhoneAlt,
    whatsappNumber: s.whatsappNumber,
    businessEmail: s.businessEmail,
    businessEmailAlt: s.businessEmailAlt,
    websiteUrl: s.websiteUrl,
    skills: s.skills ?? [],
    categories: cats.map((c) => ({
      nameEs: c.category?.nameEs ?? '',
      nameEn: c.category?.nameEn ?? '',
      icon: c.category?.icon,
    })),
    services: (s.services ?? []).slice(0, 3).map((sv) => ({
      name: sv.name,
      priceFrom: sv.priceFrom,
      priceUnit: sv.priceUnit,
      currency: sv.currency,
    })),
  };
}

/**
 * Cards saved in providers_json. Old versions stored `{ id, name, phone,
 * email, website, isRealSupplier }` and also AI-invented suggestions
 * (negative ids) — those are dropped: the chat only shows real suppliers.
 */
export function fromStoredJson(json?: string | null): ChatSupplier[] | undefined {
  if (!json) return undefined;
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return undefined;
    const out: ChatSupplier[] = [];
    for (const raw of arr) {
      if (!raw || typeof raw !== 'object') continue;
      if ('supplierId' in raw) {
        out.push(raw as ChatSupplier);
      } else if (Number(raw.id) > 0 && raw.isRealSupplier !== false) {
        out.push({
          supplierId: Number(raw.id),
          companyName: String(raw.name ?? ''),
          city: raw.location ?? null,
          rating: raw.rating ?? null,
          reviewCount: raw.reviews ?? 0,
          verified: !!raw.verified,
          businessPhone: raw.phone ?? null,
          businessEmail: raw.email ?? null,
          websiteUrl: raw.website ?? null,
          skills: raw.skills ?? [],
        });
      }
    }
    return out;
  } catch {
    return undefined;
  }
}

export type ContactKind = 'phone' | 'whatsapp' | 'email' | 'website';

export interface ContactLink {
  kind: ContactKind;
  value: string;
  href: string;
}

const digits = (v: string) => v.replace(/[^\d+]/g, '');

/** Every published way to reach a supplier, as tappable links. */
export function contactLinks(s: {
  businessPhone?: string | null;
  businessPhoneAlt?: string | null;
  whatsappNumber?: string | null;
  businessEmail?: string | null;
  businessEmailAlt?: string | null;
  websiteUrl?: string | null;
}): ContactLink[] {
  const links: ContactLink[] = [];
  for (const phone of [s.businessPhone, s.businessPhoneAlt]) {
    if (phone) links.push({ kind: 'phone', value: phone, href: `tel:${digits(phone)}` });
  }
  const wa = s.whatsappNumber || s.businessPhone;
  if (wa) links.push({ kind: 'whatsapp', value: wa, href: `https://wa.me/${wa.replace(/[^\d]/g, '')}` });
  for (const email of [s.businessEmail, s.businessEmailAlt]) {
    if (email) links.push({ kind: 'email', value: email, href: `mailto:${email}` });
  }
  if (s.websiteUrl) {
    const url = s.websiteUrl.trim();
    links.push({
      kind: 'website',
      value: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      href: /^https?:\/\//i.test(url) ? url : `https://${url}`,
    });
  }
  return links;
}

export function channelFor(kind: ContactKind): ContactChannel {
  switch (kind) {
    case 'phone':
      return ContactChannel.Phone;
    case 'whatsapp':
      return ContactChannel.Whatsapp;
    case 'email':
      return ContactChannel.Email;
    default:
      return ContactChannel.Website;
  }
}

/** "₡15,000 por hora" / "Precio a consultar". */
export function formatPrice(
  priceFrom: string | number | null | undefined,
  unit: string | null | undefined,
  t: (k: string, v?: Record<string, string | number>) => string,
  currency = 'CRC',
): string {
  const n = priceFrom != null && priceFrom !== '' ? Number(priceFrom) : NaN;
  if (!Number.isFinite(n) || n <= 0) return t('common.priceOnRequest');
  const symbol = currency === 'CRC' ? '₡' : currency === 'USD' ? '$' : `${currency} `;
  const base = `${t('common.from')} ${symbol}${Math.round(n).toLocaleString('en-US')}`;
  return unit ? `${base} ${t('common.per', { unit })}` : base;
}

export function categoryName(c: { nameEs: string; nameEn: string }, lang: 'es' | 'en'): string {
  return lang === 'es' ? c.nameEs : c.nameEn;
}
