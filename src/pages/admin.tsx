import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, Star } from 'lucide-react';

import { Box, Btn, Card, Chip, Flex, Notice, PageTitle, SectionTitle, SolvoNavBar, Text, inputStyle } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import {
  AdminSupplierStatus,
  useAdminOverviewQuery,
  useAdminSetSupplierPreferredMutation,
  useAdminSetSupplierVerifiedMutation,
  useAdminSuppliersQuery,
  useProvincesQuery,
  type AdminOverviewQuery,
} from '@generated';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';

type Tab = 'analytics' | 'verification' | 'preferred';
const RANGES = [7, 30, 90];
const PAGE_SIZE = 20;

/**
 * Admin (users with is_admin):
 *  - Analytics: supplier sign-ups, customer sign-ups and customer→supplier
 *    contacts over time, by channel, by province, top suppliers.
 *  - Verification: queue of unverified suppliers → Verify.
 *  - Preferred: pin suppliers to the top of chat results (optional end date).
 */
export default function AdminPage() {
  const { t } = useI18n();
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const [tab, setTab] = React.useState<Tab>('analytics');

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <Box maxWidth="1180px" margin="0 auto" padding={{ base: '20px 16px 60px', md: '32px 24px 80px' }}>
        <PageTitle title={t('admin.title')} />
        {!isAuthenticated || !user?.isAdmin ? (
          <Notice tone="warn">
            {t('admin.notAdmin')}{' '}
            {!isAuthenticated && (
              <Link href="/login?next=/admin" style={{ fontWeight: 700, color: 'inherit' }}>
                {t('common.signIn')}
              </Link>
            )}
          </Notice>
        ) : (
          <>
            <Flex gap="4px" borderBottom="1px solid" borderColor={solvoColors.border} marginBottom="20px">
              {(['analytics', 'verification', 'preferred'] as Tab[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontWeight: tab === k ? 700 : 500,
                    color: tab === k ? solvoColors.text : solvoColors.textMuted,
                    borderBottom: `2px solid ${tab === k ? solvoColors.accent : 'transparent'}`,
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}
                >
                  {t(`admin.tabs.${k}`)}
                </button>
              ))}
            </Flex>
            {tab === 'analytics' && <Analytics />}
            {tab === 'verification' && <SupplierTable mode="verification" />}
            {tab === 'preferred' && <SupplierTable mode="preferred" />}
          </>
        )}
      </Box>
    </Box>
  );
}

// ── Analytics ────────────────────────────────────────────────────────────

function Analytics() {
  const { t } = useI18n();
  const [days, setDays] = React.useState(30);
  const { data, loading, error } = useAdminOverviewQuery({ variables: { days }, fetchPolicy: 'cache-and-network' });
  const o = data?.adminOverview;

  if (error) return <Notice tone="error">{error.message}</Notice>;
  if (!o) return <Text color={solvoColors.textSubtle}>{loading ? t('common.loading') : t('admin.none')}</Text>;

  const k = o.totals;
  const tiles: Array<[string, number, string?]> = [
    [t('admin.kpi.newSuppliers'), k.newSuppliers, t('admin.lastDays', { n: days })],
    [t('admin.kpi.newCustomers'), k.newCustomers, t('admin.lastDays', { n: days })],
    [t('admin.kpi.contacts'), k.contacts, t('admin.lastDays', { n: days })],
    [t('admin.kpi.uniqueContacters'), k.uniqueContacters, t('admin.lastDays', { n: days })],
    [t('admin.kpi.suppliers'), k.suppliers],
    [t('admin.kpi.pending'), k.pendingVerification],
    [t('admin.kpi.preferred'), k.preferredSuppliers],
    [t('admin.kpi.chats'), k.chats, t('admin.lastDays', { n: days })],
  ];

  return (
    <Flex direction="column" gap="16px">
      <Flex gap="6px">
        {RANGES.map((n) => (
          <button
            key={n}
            onClick={() => setDays(n)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${days === n ? solvoColors.text : solvoColors.border}`,
              background: days === n ? solvoColors.text : solvoColors.surface,
              color: days === n ? solvoColors.surface : solvoColors.textMuted,
            }}
          >
            {t('admin.lastDays', { n })}
          </button>
        ))}
      </Flex>

      <Box display="grid" gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="10px">
        {tiles.map(([label, value, sub]) => (
          <Card key={label} padding="14px 16px">
            <Text fontFamily={solvoFonts.display} fontSize="28px" fontWeight={700} color={solvoColors.text}>
              {value.toLocaleString()}
            </Text>
            <Text fontSize="13px" color={solvoColors.textMuted}>
              {label}
            </Text>
            {sub && (
              <Text fontSize="11px" color={solvoColors.textSubtle}>
                {sub}
              </Text>
            )}
          </Card>
        ))}
      </Box>

      <Card>
        <SectionTitle>{t('admin.daily')}</SectionTitle>
        {/* Small multiples: each metric on its own axis (never a dual axis). */}
        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="20px">
          <DailyBars title={t('admin.legendSuppliers')} rows={o.daily} pick={(r) => r.newSuppliers} />
          <DailyBars title={t('admin.legendCustomers')} rows={o.daily} pick={(r) => r.newCustomers} />
          <DailyBars title={t('admin.legendContacts')} rows={o.daily} pick={(r) => r.contacts} />
        </Box>
      </Card>

      <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="16px">
        <Card>
          <SectionTitle>{t('admin.byChannel')}</SectionTitle>
          <HBars rows={o.contactsByChannel} />
        </Card>
        <Card>
          <SectionTitle>{t('admin.byProvince')}</SectionTitle>
          <HBars rows={o.suppliersByProvince} />
        </Card>
        <Card>
          <SectionTitle>{t('admin.top')}</SectionTitle>
          {o.topSuppliers.length === 0 ? (
            <Text fontSize="sm" color={solvoColors.textSubtle}>
              {t('admin.none')}
            </Text>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                {o.topSuppliers.map((s) => (
                  <tr key={s.supplierId} style={{ borderTop: `1px solid ${solvoColors.border}` }}>
                    <td style={{ padding: '7px 0', color: solvoColors.text }}>
                      <Link href={`/providers/${s.supplierId}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                        {s.companyName}
                      </Link>
                      <div style={{ color: solvoColors.textSubtle, fontSize: '11px' }}>{s.provinceName ?? '—'}</div>
                    </td>
                    <td style={{ padding: '7px 0', textAlign: 'right', color: solvoColors.text, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{s.contacts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </Box>
    </Flex>
  );
}

type DailyRow = AdminOverviewQuery['adminOverview']['daily'][number];

/** One metric per day. Single series → one hue; hover shows the exact value. */
function DailyBars({ title, rows, pick }: { title: string; rows: DailyRow[]; pick: (r: DailyRow) => number }) {
  const { locale } = useI18n();
  const [hover, setHover] = React.useState<number | null>(null);
  const values = rows.map(pick);
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);
  const W = 300;
  const H = 96;
  const gap = 2;
  const bw = Math.max(1, W / rows.length - gap);
  const label = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  return (
    <Box>
      <Flex justify="space-between" align="baseline" marginBottom="6px">
        <Text fontSize="13px" fontWeight={600} color={solvoColors.textMuted}>
          {title}
        </Text>
        <Text fontSize="13px" fontWeight={700} color={solvoColors.text} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {hover != null ? `${label(rows[hover].day)}: ${values[hover]}` : total}
        </Text>
      </Flex>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={`${title}: ${total}`} onMouseLeave={() => setHover(null)}>
        <line x1={0} y1={H - 0.5} x2={W} y2={H - 0.5} stroke={solvoColors.border} strokeWidth={1} />
        {values.map((v, i) => {
          const h = v === 0 ? 0 : Math.max(3, (v / max) * (H - 8));
          const x = i * (bw + gap);
          return (
            <g key={rows[i].day} onMouseEnter={() => setHover(i)}>
              {/* Hit target taller than the mark. */}
              <rect x={x} y={0} width={bw + gap} height={H} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${x},${H} V${H - h + Math.min(4, h)} Q${x},${H - h} ${x + Math.min(4, bw / 2)},${H - h} H${x + bw - Math.min(4, bw / 2)} Q${x + bw},${H - h} ${x + bw},${H - h + Math.min(4, h)} V${H} Z`}
                  fill={solvoColors.brand}
                  opacity={hover == null || hover === i ? 1 : 0.45}
                />
              )}
            </g>
          );
        })}
      </svg>
      <Flex justify="space-between" fontSize="11px" color={solvoColors.textSubtle} marginTop="2px">
        <Text>{rows[0] ? label(rows[0].day) : ''}</Text>
        <Text>{rows.length ? label(rows[rows.length - 1].day) : ''}</Text>
      </Flex>
    </Box>
  );
}

function HBars({ rows }: { rows: Array<{ key: string; label: string; count: number }> }) {
  const { t } = useI18n();
  if (rows.length === 0) {
    return (
      <Text fontSize="sm" color={solvoColors.textSubtle}>
        {t('admin.none')}
      </Text>
    );
  }
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Flex direction="column" gap="8px">
      {rows.map((r) => (
        <Box key={r.key}>
          <Flex justify="space-between" fontSize="13px" marginBottom="3px">
            <Text color={solvoColors.textMuted}>{r.label}</Text>
            <Text color={solvoColors.text} fontWeight={700} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {r.count}
            </Text>
          </Flex>
          <Box height="8px" bg={solvoColors.surfaceMuted} borderRadius="4px">
            <Box height="8px" width={`${(r.count / max) * 100}%`} bg={solvoColors.brand} borderRadius="4px" />
          </Box>
        </Box>
      ))}
    </Flex>
  );
}

// ── Verification & preferred ─────────────────────────────────────────────

function SupplierTable({ mode }: { mode: 'verification' | 'preferred' }) {
  const { t, locale } = useI18n();
  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [status, setStatus] = React.useState<AdminSupplierStatus>(mode === 'verification' ? AdminSupplierStatus.Unverified : AdminSupplierStatus.All);
  const [province, setProvince] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [until, setUntil] = React.useState<Record<number, string>>({});
  const { data: prov } = useProvincesQuery();

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);
  React.useEffect(() => setOffset(0), [debounced, status, province]);

  const { data, loading, refetch } = useAdminSuppliersQuery({
    variables: { filter: { search: debounced || undefined, status, province: province || undefined, limit: PAGE_SIZE, offset } },
    fetchPolicy: 'cache-and-network',
  });
  const [setVerified] = useAdminSetSupplierVerifiedMutation();
  const [setPreferred] = useAdminSetSupplierPreferredMutation();

  const rows = data?.adminSuppliers.rows ?? [];
  const total = data?.adminSuppliers.total ?? 0;
  const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : '');

  const filters: Array<[AdminSupplierStatus, string]> = [
    [AdminSupplierStatus.All, t('admin.filterAll')],
    [AdminSupplierStatus.Unverified, t('admin.filterUnverified')],
    [AdminSupplierStatus.Verified, t('admin.filterVerified')],
    [AdminSupplierStatus.Preferred, t('admin.filterPreferred')],
  ];

  return (
    <Flex direction="column" gap="12px">
      <Notice>{mode === 'verification' ? t('admin.verificationHint') : t('admin.preferredHint')}</Notice>
      <Flex gap="8px" wrap="wrap" align="center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.search')} style={{ ...inputStyle, maxWidth: '320px' }} />
        <select value={province} onChange={(e) => setProvince(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">{t('common.allCountry')}</option>
          {(prov?.provinces ?? []).map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
        <Flex gap="4px" wrap="wrap">
          {filters.map(([v, label]) => (
            <button
              key={v}
              onClick={() => setStatus(v)}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${status === v ? solvoColors.text : solvoColors.border}`,
                background: status === v ? solvoColors.text : solvoColors.surface,
                color: status === v ? solvoColors.surface : solvoColors.textMuted,
              }}
            >
              {label}
            </button>
          ))}
        </Flex>
      </Flex>

      {loading && rows.length === 0 ? (
        <Text color={solvoColors.textSubtle}>{t('common.loading')}</Text>
      ) : rows.length === 0 ? (
        <Card>
          <Text color={solvoColors.textSubtle}>{t('admin.noResults')}</Text>
        </Card>
      ) : (
        <Flex direction="column" gap="8px">
          {rows.map((s) => (
            <Card key={s.supplierId} padding="14px 16px">
              <Flex justify="space-between" gap="14px" wrap="wrap" align="flex-start">
                <Box minWidth={0} flex="1">
                  <Flex align="center" gap="6px" wrap="wrap">
                    <Link href={`/providers/${s.supplierId}`} style={{ color: solvoColors.text, fontWeight: 700, textDecoration: 'none' }}>
                      {s.companyName}
                    </Link>
                    {s.verifiedAt ? (
                      <Chip tone="success">
                        <ShieldCheck size={12} /> {t('common.verified')}
                      </Chip>
                    ) : (
                      <Chip>{t('common.notVerified')}</Chip>
                    )}
                    {s.preferred && (
                      <Chip tone="brand">
                        <Star size={12} /> {t('common.preferred')}
                        {s.preferredUntil ? ` · ${t('admin.until')} ${fmt(s.preferredUntil)}` : ''}
                      </Chip>
                    )}
                  </Flex>
                  <Text fontSize="13px" color={solvoColors.textMuted} marginTop="2px">
                    {[s.city, s.provinceName].filter(Boolean).join(', ') || '—'} · {s.categories.join(', ') || '—'}
                  </Text>
                  {s.tagline && (
                    <Text fontSize="13px" color={solvoColors.textSubtle}>
                      {s.tagline}
                    </Text>
                  )}
                  <Text fontSize="12px" color={solvoColors.textSubtle} marginTop="4px">
                    {t('admin.owner')}: {s.ownerName} ({s.ownerEmail}) · {t('admin.joined', { date: fmt(s.createdAt) })} · {t('admin.contacts30', { n: s.contactsLast30Days })}
                  </Text>
                  <Text fontSize="12px" color={solvoColors.textSubtle}>
                    {[s.businessPhone, s.whatsappNumber && `WA ${s.whatsappNumber}`, s.businessEmail, s.websiteUrl].filter(Boolean).join(' · ') || '—'}
                  </Text>
                </Box>
                <Flex gap="6px" align="center" wrap="wrap">
                  {mode === 'verification' ? (
                    <Btn
                      variant={s.verifiedAt ? 'secondary' : 'primary'}
                      onClick={async () => {
                        await setVerified({ variables: { supplierId: s.supplierId, verified: !s.verifiedAt } });
                        await refetch();
                      }}
                    >
                      {s.verifiedAt ? t('admin.unverify') : t('admin.verify')}
                    </Btn>
                  ) : s.preferred ? (
                    <Btn
                      variant="secondary"
                      onClick={async () => {
                        await setPreferred({ variables: { data: { supplierId: s.supplierId, preferred: false } } });
                        await refetch();
                      }}
                    >
                      {t('admin.removePreferred')}
                    </Btn>
                  ) : (
                    <>
                      <input
                        type="date"
                        aria-label={t('admin.until')}
                        title={`${t('admin.until')} (${t('admin.noEnd')})`}
                        value={until[s.supplierId] ?? ''}
                        onChange={(e) => setUntil({ ...until, [s.supplierId]: e.target.value })}
                        style={{ ...inputStyle, width: 'auto', padding: '8px 10px' }}
                      />
                      <Btn
                        onClick={async () => {
                          const d = until[s.supplierId];
                          await setPreferred({ variables: { data: { supplierId: s.supplierId, preferred: true, until: d ? new Date(`${d}T23:59:59`).toISOString() : undefined } } });
                          await refetch();
                        }}
                      >
                        {t('admin.makePreferred')}
                      </Btn>
                    </>
                  )}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      {total > PAGE_SIZE && (
        <Flex justify="space-between" align="center">
          <Btn variant="secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
            {t('admin.prev')}
          </Btn>
          <Text fontSize="13px" color={solvoColors.textSubtle}>
            {t('admin.pageOf', { from: offset + 1, to: Math.min(offset + PAGE_SIZE, total), total })}
          </Text>
          <Btn variant="secondary" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
            {t('admin.next')}
          </Btn>
        </Flex>
      )}
    </Flex>
  );
}
