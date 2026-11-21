import { contactLinks, formatPrice, fromStoredJson, toChatSupplier } from '../shared/lib/supplier';
import en from '../shared/i18n/messages.en';
import es from '../shared/i18n/messages.es';

const t = (k: string, v?: Record<string, string | number>) => {
  const s = k === 'common.from' ? 'Desde' : k === 'common.per' ? `por ${v?.unit}` : k === 'common.priceOnRequest' ? 'Precio a consultar' : k;
  return s;
};

describe('supplier helpers', () => {
  it('builds tappable contact links, WhatsApp falling back to the phone', () => {
    const links = contactLinks({ businessPhone: '+506 8888-1234', businessEmail: 'a@b.cr', websiteUrl: 'solvo.cr' });
    expect(links.map((l) => l.kind)).toEqual(['phone', 'whatsapp', 'email', 'website']);
    expect(links[0].href).toBe('tel:+50688881234');
    expect(links[1].href).toBe('https://wa.me/50688881234');
    expect(links[3].href).toBe('https://solvo.cr');
  });

  it('formats "from" prices and the no-price case', () => {
    expect(formatPrice('15000', 'hora', t)).toBe('Desde ₡15,000 por hora');
    expect(formatPrice(null, null, t)).toBe('Precio a consultar');
  });

  it('reads new cards and old saved cards, dropping AI-invented ones', () => {
    const json = JSON.stringify([
      { supplierId: 3, companyName: 'Nuevo' },
      { id: 7, name: 'Viejo', phone: '+506 1', isRealSupplier: true },
      { id: -1000, name: 'Invented', isRealSupplier: false },
    ]);
    const out = fromStoredJson(json)!;
    expect(out.map((s) => s.supplierId)).toEqual([3, 7]);
    expect(out[1].businessPhone).toBe('+506 1');
    expect(fromStoredJson('not json')).toBeUndefined();
  });

  it('puts the primary category first', () => {
    const s = toChatSupplier({
      supplierId: 1,
      companyName: 'X',
      categories: [
        { isPrimary: false, category: { nameEs: 'B', nameEn: 'B' } },
        { isPrimary: true, category: { nameEs: 'A', nameEn: 'A' } },
      ],
    } as any);
    expect(s.categories?.[0].nameEs).toBe('A');
  });
});

describe('dictionaries', () => {
  const keys = (o: any, p = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));

  it('English has exactly the Spanish keys', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });
});
