import { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  CalendarClock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import AuthContext from '@/shared/contexts/auth.context';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import {
  PromotionTier,
  useAdminStatsQuery,
  useAdminSuppliersQuery,
  useAiUsageBreakdownQuery,
  useRevenueByDayQuery,
  useSetSupplierPromotionMutation,
  useTopSuppliersQuery,
} from '@generated';

// ── Helpers ─────────────────────────────────────────────────────────────

const formatMoney = (value: string | number | null | undefined, currency = 'CRC'): string => {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return `${currency} 0`;
  const symbol = currency === 'USD' ? '$' : currency === 'CRC' ? '₡' : `${currency} `;
  return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatInt = (n: number | null | undefined): string =>
  (n ?? 0).toLocaleString();

const isPromotionActive = (
  tier: PromotionTier,
  start?: string | null,
  end?: string | null,
): boolean => {
  if (tier !== PromotionTier.Featured) return false;
  const now = Date.now();
  if (start && new Date(start).getTime() > now) return false;
  if (end && new Date(end).getTime() < now) return false;
  return true;
};

// ── Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const adminUserId = user?.userId ?? 0;
  const isAdmin = !!user?.isAdmin;

  // Skip every query until we know the caller is an admin — keeps the
  // backend from being hit with auth failures and stops the UI from
  // flashing partial data on non-admin viewers.
  const skip = !isAdmin || !adminUserId;
  const statsQuery = useAdminStatsQuery({ variables: { adminUserId }, skip, fetchPolicy: 'cache-and-network' });
  const topQuery = useTopSuppliersQuery({ variables: { adminUserId, limit: 10 }, skip, fetchPolicy: 'cache-and-network' });
  const [aiWindow, setAiWindow] = useState<number>(30);
  const aiQuery = useAiUsageBreakdownQuery({ variables: { adminUserId, daysBack: aiWindow }, skip, fetchPolicy: 'cache-and-network' });
  const [revenueWindow, setRevenueWindow] = useState<number>(30);
  const revenueQuery = useRevenueByDayQuery({ variables: { adminUserId, daysBack: revenueWindow }, skip, fetchPolicy: 'cache-and-network' });
  const suppliersQuery = useAdminSuppliersQuery({ skip, fetchPolicy: 'cache-and-network' });

  const [setPromotion, { loading: setPromotionLoading }] = useSetSupplierPromotionMutation({
    refetchQueries: ['adminSuppliers', 'topSuppliers'],
    awaitRefetchQueries: true,
  });

  const [pendingId, setPendingId] = useState<number | null>(null);
  const [endDateInputs, setEndDateInputs] = useState<Record<number, string>>({});

  const stats = statsQuery.data?.adminStats;
  const top = topQuery.data?.topSuppliers ?? [];
  const aiRows = aiQuery.data?.aiUsageBreakdown ?? [];
  const suppliers = suppliersQuery.data?.suppliers ?? [];
  const revenueRows = revenueQuery.data?.revenueByDay ?? [];

  const revenueTotals = useMemo(() => {
    const total = revenueRows.reduce((acc, r) => acc + Number(r.platformFee), 0);
    const bookings = revenueRows.reduce((acc, r) => acc + r.bookings, 0);
    const peak = revenueRows.reduce(
      (acc, r) => Math.max(acc, Number(r.platformFee)),
      0,
    );
    return { total, bookings, peak };
  }, [revenueRows]);

  const aiTotals = useMemo(() => {
    return aiRows.reduce(
      (acc, r) => {
        acc.requests += r.requests;
        acc.inputTokens += r.inputTokens;
        acc.outputTokens += r.outputTokens;
        acc.costUsd += Number(r.costUsd);
        return acc;
      },
      { requests: 0, inputTokens: 0, outputTokens: 0, costUsd: 0 },
    );
  }, [aiRows]);

  // ── Gates ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/admin" />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <GateCard
        title="Sign in to continue"
        body="The admin console requires an authenticated session."
        ctaHref="/login"
        ctaLabel="Sign in"
      />
    );
  }

  if (!isAdmin) {
    return (
      <GateCard
        title="Admins only"
        body="Your account doesn't have admin privileges. If this is a mistake, contact the platform owner."
        ctaHref="/dashboard"
        ctaLabel="Go to dashboard"
      />
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────
  const onToggleFeatured = async (supplierId: number, currentTier: PromotionTier) => {
    const nextTier =
      currentTier === PromotionTier.Featured ? PromotionTier.None : PromotionTier.Featured;
    const endDate = endDateInputs[supplierId];
    setPendingId(supplierId);
    try {
      await setPromotion({
        variables: {
          data: {
            adminUserId,
            supplierId,
            tier: nextTier,
            endDate:
              nextTier === PromotionTier.Featured && endDate ? new Date(endDate) : undefined,
          },
        },
      });
    } finally {
      setPendingId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/admin" />

      <Box maxWidth="1200px" margin="0 auto" padding={{ base: '24px 16px', md: '40px 24px' }}>
        {/* Header */}
        <Flex justify="space-between" align="flex-end" wrap="wrap" gap="16px" marginBottom="28px">
          <Box>
            <Text
              fontSize="xs"
              fontWeight={600}
              letterSpacing="0.14em"
              color={solvoColors.indigo}
              textTransform="uppercase"
            >
              Admin console
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '32px', md: '40px' }}
              color={solvoColors.text}
              lineHeight="1.1"
              marginTop="4px"
            >
              Solvo control center
            </Text>
            <Text color={solvoColors.textMuted} marginTop="8px" fontSize="sm">
              Signed in as {user.name} · {user.email}
            </Text>
          </Box>
        </Flex>

        {/* Stats */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap="16px"
          marginBottom="40px"
        >
          <StatCard
            icon={<Users size={18} />}
            tone="indigo"
            label="Total users"
            value={formatInt(stats?.totalUsers)}
            sub={`${formatInt(stats?.totalCustomers)} customers`}
            loading={statsQuery.loading && !stats}
          />
          <StatCard
            icon={<ShieldCheck size={18} />}
            tone="emerald"
            label="Suppliers"
            value={formatInt(stats?.totalSuppliers)}
            sub="active providers"
            loading={statsQuery.loading && !stats}
          />
          <StatCard
            icon={<CalendarClock size={18} />}
            tone="amber"
            label="Total bookings"
            value={formatInt(stats?.totalBookings)}
            sub="all time"
            loading={statsQuery.loading && !stats}
          />
          <StatCard
            icon={<DollarSign size={18} />}
            tone="rose"
            label="Revenue (MTD)"
            value={formatMoney(stats?.mtdRevenue, stats?.currency ?? 'CRC')}
            sub={`${formatMoney(stats?.allTimeRevenue, stats?.currency ?? 'CRC')} all time`}
            loading={statsQuery.loading && !stats}
          />
        </Box>

        {/* Revenue trend chart */}
        <Box marginBottom="20px">
          <Panel
            title="Revenue trend"
            icon={<TrendingUp size={16} color={solvoColors.indigo} />}
            right={
              <Flex gap="6px">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setRevenueWindow(d)}
                    style={{
                      background:
                        revenueWindow === d ? solvoColors.text : 'transparent',
                      color:
                        revenueWindow === d ? solvoColors.surface : solvoColors.textMuted,
                      border: `1px solid ${revenueWindow === d ? solvoColors.text : solvoColors.border}`,
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {d}d
                  </button>
                ))}
              </Flex>
            }
          >
            <Flex justify="space-between" align="baseline" wrap="wrap" gap="12px" marginBottom="14px">
              <Box>
                <Text
                  fontSize="xs"
                  color={solvoColors.textSubtle}
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                >
                  Platform fees · last {revenueWindow}d
                </Text>
                <Text fontFamily={solvoFonts.serif} fontSize="28px" color={solvoColors.text}>
                  {formatMoney(revenueTotals.total, stats?.currency ?? 'CRC')}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {formatInt(revenueTotals.bookings)} bookings
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  peak day {formatMoney(revenueTotals.peak, stats?.currency ?? 'CRC')}
                </Text>
              </Box>
            </Flex>
            <RevenueBars rows={revenueRows} loading={revenueQuery.loading && revenueRows.length === 0} />
          </Panel>
        </Box>

        {/* Two-column: Top suppliers + AI usage */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '3fr 2fr' }}
          gap="20px"
          marginBottom="40px"
        >
          {/* Top suppliers leaderboard */}
          <Panel title="Top suppliers" icon={<TrendingUp size={16} color={solvoColors.indigo} />}>
            {topQuery.loading && top.length === 0 ? (
              <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
                Loading…
              </Text>
            ) : top.length === 0 ? (
              <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
                No suppliers yet.
              </Text>
            ) : (
              <Box>
                {top.map((row, i) => (
                  <Flex
                    key={row.supplierId}
                    align="center"
                    justify="space-between"
                    padding="12px 4px"
                    borderTop={i === 0 ? undefined : `1px solid ${solvoColors.border}`}
                    gap="12px"
                  >
                    <Flex align="center" gap="12px" minWidth={0}>
                      <Box
                        width="28px"
                        height="28px"
                        borderRadius="full"
                        bg={solvoColors.bg}
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor={solvoColors.border}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Text fontSize="xs" fontWeight={600} color={solvoColors.textMuted}>
                          {i + 1}
                        </Text>
                      </Box>
                      <Box minWidth={0}>
                        <Text fontWeight={600} color={solvoColors.text} fontSize="sm">
                          {row.companyName}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {row.city ?? '—'}
                          {row.rating ? ` · ★ ${row.rating}` : ''}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap="20px" flexShrink={0}>
                      <Box textAlign="right">
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          Bookings
                        </Text>
                        <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                          {row.bookingCount}
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          Gross
                        </Text>
                        <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                          {formatMoney(row.grossRevenue)}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            )}
          </Panel>

          {/* AI usage panel */}
          <Panel
            title="AI usage"
            icon={<Sparkles size={16} color={solvoColors.indigo} />}
            right={
              <Flex gap="6px">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setAiWindow(d)}
                    style={{
                      background: aiWindow === d ? solvoColors.text : 'transparent',
                      color: aiWindow === d ? solvoColors.surface : solvoColors.textMuted,
                      border: `1px solid ${aiWindow === d ? solvoColors.text : solvoColors.border}`,
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {d}d
                  </button>
                ))}
              </Flex>
            }
          >
            <Flex justify="space-between" align="baseline" marginBottom="14px">
              <Box>
                <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.1em">
                  Total spend
                </Text>
                <Text fontFamily={solvoFonts.serif} fontSize="28px" color={solvoColors.text}>
                  {formatMoney(aiTotals.costUsd, 'USD')}
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {formatInt(aiTotals.requests)} requests
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {formatInt(aiTotals.inputTokens + aiTotals.outputTokens)} tokens
                </Text>
              </Box>
            </Flex>
            {aiQuery.loading && aiRows.length === 0 ? (
              <Text color={solvoColors.textMuted} fontSize="sm">
                Loading…
              </Text>
            ) : aiRows.length === 0 ? (
              <Text color={solvoColors.textMuted} fontSize="sm">
                No AI requests in this window.
              </Text>
            ) : (
              <Box>
                {aiRows.map((r, i) => (
                  <Flex
                    key={r.modelName}
                    justify="space-between"
                    align="center"
                    padding="10px 0"
                    borderTop={i === 0 ? undefined : `1px solid ${solvoColors.border}`}
                  >
                    <Box minWidth={0}>
                      <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                        {r.modelName}
                      </Text>
                      <Text fontSize="xs" color={solvoColors.textSubtle}>
                        {formatInt(r.requests)} req · {formatInt(r.inputTokens)} in · {formatInt(r.outputTokens)} out
                      </Text>
                    </Box>
                    <Text fontSize="sm" fontWeight={600} color={solvoColors.indigo}>
                      {formatMoney(r.costUsd, 'USD')}
                    </Text>
                  </Flex>
                ))}
              </Box>
            )}
          </Panel>
        </Box>

        {/* Suppliers + Featured toggle table */}
        <Panel
          title="Sponsored placement"
          icon={<Star size={16} color={solvoColors.indigo} />}
          right={
            <Text fontSize="xs" color={solvoColors.textSubtle}>
              {suppliers.length} suppliers · Featured boosts ranking in search
            </Text>
          }
        >
          {suppliersQuery.loading && suppliers.length === 0 ? (
            <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
              Loading suppliers…
            </Text>
          ) : suppliers.length === 0 ? (
            <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
              No suppliers found.
            </Text>
          ) : (
            <Box overflowX="auto">
              <Box as="table" width="100%" minWidth="720px" style={{ borderCollapse: 'collapse' }}>
                <Box as="thead">
                  <Box as="tr">
                    {['Supplier', 'City', 'Rating', 'Tier', 'Ends', 'Action'].map((h) => (
                      <Box
                        as="th"
                        key={h}
                        textAlign="left"
                        fontSize="xs"
                        color={solvoColors.textSubtle}
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        padding="10px 8px"
                        borderBottom={`1px solid ${solvoColors.border}`}
                      >
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  {suppliers.map((s) => {
                    const active = isPromotionActive(
                      s.promotionTier,
                      s.promotionStartDate as string | null,
                      s.promotionEndDate as string | null,
                    );
                    const endVal = endDateInputs[s.supplierId] ?? '';
                    return (
                      <Box as="tr" key={s.supplierId}>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          <Flex align="center" gap="8px">
                            <Text fontWeight={600} color={solvoColors.text} fontSize="sm">
                              {s.companyName}
                            </Text>
                            {s.verified ? <ShieldCheck size={12} color={solvoColors.indigo} /> : null}
                          </Flex>
                        </Box>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          <Text fontSize="sm" color={solvoColors.textMuted}>
                            {s.city ?? '—'}
                          </Text>
                        </Box>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          <Text fontSize="sm" color={solvoColors.textMuted}>
                            {s.rating ? `★ ${s.rating}` : '—'}{' '}
                            <Text as="span" color={solvoColors.textSubtle} fontSize="xs">
                              ({s.reviewCount ?? 0})
                            </Text>
                          </Text>
                        </Box>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          {active ? (
                            <Box
                              display="inline-flex"
                              alignItems="center"
                              gap="6px"
                              padding="3px 10px"
                              borderRadius="full"
                              bg={solvoColors.indigoLight}
                              color={solvoColors.indigo}
                              fontSize="xs"
                              fontWeight={600}
                            >
                              <Sparkles size={12} /> Featured
                            </Box>
                          ) : (
                            <Text fontSize="xs" color={solvoColors.textSubtle}>
                              Standard
                            </Text>
                          )}
                        </Box>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          <input
                            type="date"
                            value={endVal}
                            onChange={(e) =>
                              setEndDateInputs((prev) => ({
                                ...prev,
                                [s.supplierId]: e.target.value,
                              }))
                            }
                            style={{
                              border: `1px solid ${solvoColors.border}`,
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              color: solvoColors.text,
                              background: solvoColors.surface,
                            }}
                          />
                          {s.promotionEndDate ? (
                            <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="4px">
                              currently:{' '}
                              {new Date(s.promotionEndDate as string).toLocaleDateString()}
                            </Text>
                          ) : null}
                        </Box>
                        <Box as="td" padding="12px 8px" borderBottom={`1px solid ${solvoColors.border}`}>
                          <button
                            type="button"
                            disabled={setPromotionLoading && pendingId === s.supplierId}
                            onClick={() => onToggleFeatured(s.supplierId, s.promotionTier)}
                            style={{
                              background: active ? solvoColors.surface : solvoColors.text,
                              color: active ? solvoColors.text : solvoColors.surface,
                              border: `1px solid ${active ? solvoColors.border : solvoColors.text}`,
                              borderRadius: '10px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              opacity:
                                setPromotionLoading && pendingId === s.supplierId ? 0.6 : 1,
                            }}
                          >
                            {setPromotionLoading && pendingId === s.supplierId
                              ? '…'
                              : active
                                ? 'Clear'
                                : 'Feature'}
                          </button>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}
        </Panel>
      </Box>
    </Box>
  );
}

// ── Subcomponents ───────────────────────────────────────────────────────

type Tone = 'indigo' | 'emerald' | 'amber' | 'rose';

const toneStyles: Record<Tone, { bg: string; color: string }> = {
  indigo: { bg: '#EEF2FF', color: '#4338CA' },
  emerald: { bg: '#ECFDF5', color: '#047857' },
  amber: { bg: '#FEF3C7', color: '#B45309' },
  rose: { bg: '#FFF1F2', color: '#BE123C' },
};

function StatCard({
  icon,
  tone,
  label,
  value,
  sub,
  loading,
}: {
  icon: React.ReactNode;
  tone: Tone;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) {
  const s = toneStyles[tone];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box
        bg={solvoColors.surface}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={solvoColors.border}
        borderRadius="16px"
        padding="18px"
        minHeight="120px"
      >
        <Flex justify="space-between" align="flex-start">
          <Box
            width="36px"
            height="36px"
            borderRadius="10px"
            bg={s.bg}
            color={s.color}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Box>
          <Activity size={14} color={solvoColors.textSubtle} />
        </Flex>
        <Text
          fontFamily={solvoFonts.serif}
          fontSize="28px"
          color={solvoColors.text}
          marginTop="10px"
          lineHeight="1.1"
        >
          {loading ? '—' : value}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginTop="2px">
          {label}
        </Text>
        {sub ? (
          <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="4px">
            {sub}
          </Text>
        ) : null}
      </Box>
    </motion.div>
  );
}

function RevenueBars({
  rows,
  loading,
}: {
  rows: { day: string; platformFee: string; bookings: number }[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
        Loading…
      </Text>
    );
  }
  if (rows.length === 0) {
    return (
      <Text color={solvoColors.textMuted} fontSize="sm" padding="8px 0">
        No revenue yet.
      </Text>
    );
  }

  const max = Math.max(...rows.map((r) => Number(r.platformFee)), 1);
  // Show every Nth label so the axis doesn't overlap at long windows.
  const labelStride = Math.max(1, Math.floor(rows.length / 8));

  return (
    <Box>
      <Flex
        align="flex-end"
        justify="space-between"
        gap="3px"
        height="140px"
        padding="0 2px"
      >
        {rows.map((r, i) => {
          const value = Number(r.platformFee);
          const pct = (value / max) * 100;
          // Always show at least a sliver for days with any bookings, so
          // small-but-nonzero days don't look identical to empty ones.
          const heightPct = value > 0 ? Math.max(pct, 4) : 0;
          return (
            <Box
              key={r.day}
              flex="1"
              height="100%"
              display="flex"
              alignItems="flex-end"
              title={`${r.day} · ${value.toLocaleString()} · ${r.bookings} booking${r.bookings === 1 ? '' : 's'}`}
            >
              <Box
                width="100%"
                height={`${heightPct}%`}
                borderRadius="4px 4px 0 0"
                style={{
                  background:
                    value > 0
                      ? `linear-gradient(180deg, ${solvoColors.indigo} 0%, ${solvoColors.indigoMid} 100%)`
                      : solvoColors.border,
                  minHeight: value > 0 ? '4px' : '2px',
                  transition: 'height 0.3s ease',
                }}
              />
            </Box>
          );
        })}
      </Flex>
      <Flex justify="space-between" marginTop="8px" padding="0 2px">
        {rows.map((r, i) => (
          <Text
            key={r.day}
            fontSize="10px"
            color={solvoColors.textSubtle}
            flex="1"
            textAlign="center"
            style={{ visibility: i % labelStride === 0 ? 'visible' : 'hidden' }}
          >
            {r.day.slice(5)}
          </Text>
        ))}
      </Flex>
    </Box>
  );
}

function Panel({
  title,
  icon,
  right,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box
      bg={solvoColors.surface}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={solvoColors.border}
      borderRadius="16px"
      padding="20px"
      style={{ boxShadow: solvoShadows.cardRest }}
    >
      <Flex justify="space-between" align="center" marginBottom="14px" gap="12px" wrap="wrap">
        <Flex align="center" gap="8px">
          {icon}
          <Text fontWeight={600} color={solvoColors.text}>
            {title}
          </Text>
        </Flex>
        {right}
      </Flex>
      {children}
    </Box>
  );
}

function GateCard({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/admin" />
      <Flex minHeight="60vh" align="center" justify="center" padding="24px">
        <Box
          bg={solvoColors.surface}
          borderWidth="1px"
          borderStyle="solid"
          borderColor={solvoColors.border}
          borderRadius="16px"
          padding="28px"
          maxWidth="440px"
          textAlign="center"
        >
          <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
            {title}
          </Text>
          <Text color={solvoColors.textMuted} fontSize="sm" marginBottom="18px">
            {body}
          </Text>
          <Link href={ctaHref} style={{ textDecoration: 'none' }}>
            <Box
              display="inline-block"
              padding="10px 18px"
              borderRadius="10px"
              bg={solvoColors.text}
              color={solvoColors.surface}
              fontWeight={600}
              fontSize="14px"
              cursor="pointer"
            >
              {ctaLabel}
            </Box>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
