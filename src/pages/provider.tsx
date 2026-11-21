import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, X } from 'lucide-react';

import { Box, Btn, Card, Chip, Flex, Notice, PageTitle, SectionTitle, SolvoNavBar, Text, TextAreaField, TextField, FieldLabel, inputStyle } from '@components';
import { solvoColors } from '@constants';
import {
  useCategoriesQuery,
  useDeleteMyServiceMutation,
  useMySupplierQuery,
  useProvincesQuery,
  useSaveMyServiceMutation,
  useSetMySupplierCategoriesMutation,
  useSetMySupplierSkillsMutation,
  useSuggestMySupplierSkillsLazyQuery,
  useUpdateMySupplierMutation,
} from '@generated';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';
import { categoryName, formatPrice } from '@/shared/lib/supplier';

const PROFILE_FIELDS = [
  'companyName',
  'tagline',
  'description',
  'city',
  'address',
  'businessPhone',
  'businessPhoneAlt',
  'whatsappNumber',
  'businessEmail',
  'businessEmailAlt',
  'websiteUrl',
] as const;
type ProfileField = (typeof PROFILE_FIELDS)[number];

const MAX_CATEGORIES = 5;

/**
 * The supplier's own page: everything the AI chat uses to find them
 * (description, categories, specialties, provinces, contacts), plus their
 * services and how many people contacted them.
 */
export default function MyBusinessPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { user, isAuthenticated } = React.useContext(AuthContext);

  const { data, loading, refetch } = useMySupplierQuery({ skip: !isAuthenticated || !user?.isSupplier, fetchPolicy: 'cache-and-network' });
  const { data: catData } = useCategoriesQuery();
  const { data: provData } = useProvincesQuery();
  const [updateSupplier] = useUpdateMySupplierMutation();
  const [setCategories] = useSetMySupplierCategoriesMutation();
  const [setSkills] = useSetMySupplierSkillsMutation();
  const [suggestSkills, suggestState] = useSuggestMySupplierSkillsLazyQuery({ fetchPolicy: 'network-only' });
  const [saveService] = useSaveMyServiceMutation();
  const [deleteService] = useDeleteMyServiceMutation();

  const s = data?.mySupplier;
  const stats = data?.mySupplierStats;
  const provinces = provData?.provinces ?? [];

  // ── Local form state, filled once the supplier loads ──
  const [form, setForm] = React.useState<Record<ProfileField, string>>(() =>
    Object.fromEntries(PROFILE_FIELDS.map((f) => [f, ''])) as Record<ProfileField, string>,
  );
  const [province, setProvince] = React.useState('');
  const [serves, setServes] = React.useState<string[]>([]);
  const [categoryIds, setCategoryIds] = React.useState<number[]>([]);
  const [skills, setSkillsState] = React.useState<string[]>([]);
  const [skillDraft, setSkillDraft] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!s) return;
    setForm(Object.fromEntries(PROFILE_FIELDS.map((f) => [f, (s as any)[f] ?? ''])) as Record<ProfileField, string>);
    setProvince(s.province ?? '');
    setServes(s.serviceProvinces ?? []);
    setCategoryIds(
      [...(s.categories ?? [])]
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
        .map((c) => c.category?.categoryId)
        .filter((id): id is number => id != null),
    );
    setSkillsState(s.skills ?? []);
  }, [s?.supplierId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated || !user) {
    return (
      <Shell>
        <Notice>
          {t('business.signInRequired')}{' '}
          <Link href="/login?next=/provider" style={{ fontWeight: 700, color: 'inherit' }}>
            {t('common.signIn')}
          </Link>
        </Notice>
      </Shell>
    );
  }
  if (!user.isSupplier) {
    return (
      <Shell>
        <Notice>{t('business.notSupplier')}</Notice>
      </Shell>
    );
  }
  if (!s) {
    return (
      <Shell>
        <Text color={solvoColors.textSubtle}>{loading ? t('common.loading') : t('common.error')}</Text>
      </Shell>
    );
  }

  const set = (f: ProfileField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const hasContact = !!(form.businessPhone || form.whatsappNumber || form.businessEmail || form.websiteUrl);

  const toggleServe = (code: string) => setServes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  const toggleCategory = (id: number) =>
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= MAX_CATEGORIES ? prev : [...prev, id]));
  const addSkill = (raw: string) => {
    const v = raw.trim().toLowerCase();
    if (v && !skills.includes(v) && skills.length < 20) setSkillsState([...skills, v]);
    setSkillDraft('');
  };

  const saveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateSupplier({
        variables: {
          data: {
            ...Object.fromEntries(PROFILE_FIELDS.map((f) => [f, form[f].trim()])),
            province: province || '',
            serviceProvinces: serves,
          },
        },
      });
      if (categoryIds.length > 0) {
        await setCategories({ variables: { data: { categoryIds, primaryCategoryId: categoryIds[0] } } });
      }
      await setSkills({ variables: { skills } });
      await refetch();
      setSavedAt(Date.now());
    } catch (e: any) {
      setError(e?.message ?? t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <PageTitle
        title={t('business.title')}
        subtitle={t('business.subtitle')}
        right={
          <Flex gap="8px">
            <Btn variant="secondary" onClick={() => router.push(`/providers/${s.supplierId}`)}>
              {t('business.viewPublic')}
            </Btn>
            <Btn onClick={saveAll} disabled={saving}>
              {saving ? t('common.saving') : savedAt ? t('common.saved') : t('business.saveAll')}
            </Btn>
          </Flex>
        }
      />

      {s.verified ? (
        <Notice tone="success">
          <Flex align="center" gap="6px">
            <ShieldCheck size={15} /> {t('business.statusVerified')}
          </Flex>
        </Notice>
      ) : (
        <Notice tone="warn">{t('business.statusPending')}</Notice>
      )}
      {(!province || !hasContact) && <Notice tone="error">{t('business.missingWarn')}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {stats && (
        <Box display="grid" gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="10px" marginBottom="20px">
          {[
            [t('business.stats.contacts30'), stats.contactsLast30Days],
            [t('business.stats.contactsTotal'), stats.contactsTotal],
            [t('business.stats.rating'), stats.rating ? Number(stats.rating).toFixed(1) + ' ★' : '—'],
            [t('business.stats.reviews'), stats.reviewCount],
          ].map(([label, value]) => (
            <Card key={String(label)} padding="14px 16px">
              <Text fontSize="24px" fontWeight={700} color={solvoColors.text}>
                {value}
              </Text>
              <Text fontSize="12px" color={solvoColors.textSubtle}>
                {label}
              </Text>
            </Card>
          ))}
        </Box>
      )}

      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="16px" alignItems="start">
        <Flex direction="column" gap="16px">
          <Card>
            <SectionTitle>{t('business.info')}</SectionTitle>
            <TextField label={t('business.companyName')} value={form.companyName} onChange={set('companyName')} maxLength={120} />
            <TextField label={t('business.tagline')} placeholder={t('business.taglinePlaceholder')} value={form.tagline} onChange={set('tagline')} maxLength={160} />
            <TextAreaField label={t('business.description')} placeholder={t('business.descriptionPlaceholder')} value={form.description} onChange={set('description')} maxLength={4000} style={{ minHeight: '140px' }} />
          </Card>

          <Card>
            <SectionTitle>{t('business.categories')}</SectionTitle>
            <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="10px">
              {t('business.categoriesHint')}
            </Text>
            <Flex gap="6px" wrap="wrap">
              {(catData?.categories ?? []).map((c) => {
                const idx = categoryIds.indexOf(c.categoryId);
                const on = idx >= 0;
                return (
                  <button
                    key={c.categoryId}
                    onClick={() => toggleCategory(c.categoryId)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      border: `1px solid ${on ? solvoColors.accent : solvoColors.border}`,
                      background: on ? solvoColors.accentSoft : solvoColors.surface,
                      color: solvoColors.text,
                      fontWeight: on ? 700 : 500,
                    }}
                  >
                    {c.icon} {categoryName(c, lang)}
                    {idx === 0 && ` · ${t('business.primary')}`}
                  </button>
                );
              })}
            </Flex>
          </Card>

          <Card>
            <SectionTitle
              right={
                <Btn
                  variant="ghost"
                  disabled={suggestState.loading}
                  onClick={async () => {
                    setError(null);
                    const res = await suggestSkills();
                    if (res.error) setError(res.error.message);
                    const merged = [...skills];
                    for (const sk of res.data?.suggestMySupplierSkills ?? []) if (!merged.includes(sk) && merged.length < 20) merged.push(sk);
                    setSkillsState(merged);
                  }}
                >
                  {suggestState.loading ? t('business.suggesting') : t('business.suggest')}
                </Btn>
              }
            >
              {t('business.skills')}
            </SectionTitle>
            <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="10px">
              {t('business.skillsHint')}
            </Text>
            <Flex gap="6px" wrap="wrap" marginBottom="10px">
              {skills.map((sk) => (
                <Chip key={sk}>
                  {sk}
                  <button onClick={() => setSkillsState(skills.filter((x) => x !== sk))} aria-label={t('common.delete')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}>
                    <X size={12} />
                  </button>
                </Chip>
              ))}
            </Flex>
            <input
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addSkill(skillDraft);
                }
              }}
              placeholder={t('business.skillPlaceholder')}
              maxLength={40}
              style={inputStyle}
            />
          </Card>
        </Flex>

        <Flex direction="column" gap="16px">
          <Card>
            <SectionTitle>{t('business.zone')}</SectionTitle>
            <Box marginBottom="14px">
              <FieldLabel>{t('business.province')}</FieldLabel>
              <select value={province} onChange={(e) => setProvince(e.target.value)} style={inputStyle}>
                <option value="">—</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Box>
            <FieldLabel hint={t('business.serviceProvincesHint')}>{t('business.serviceProvinces')}</FieldLabel>
            <Flex gap="6px" wrap="wrap" marginBottom="14px">
              {provinces.map((p) => {
                const on = p.code === province || serves.includes(p.code);
                return (
                  <button
                    key={p.code}
                    disabled={p.code === province}
                    onClick={() => toggleServe(p.code)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      cursor: p.code === province ? 'default' : 'pointer',
                      border: `1px solid ${on ? solvoColors.brand : solvoColors.border}`,
                      background: on ? solvoColors.brandSoft : solvoColors.surface,
                      color: on ? solvoColors.brandText : solvoColors.textMuted,
                      fontWeight: on ? 700 : 500,
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </Flex>
            <TextField label={t('business.city')} value={form.city} onChange={set('city')} maxLength={120} />
            <TextField label={t('business.address')} value={form.address} onChange={set('address')} maxLength={300} />
          </Card>

          <Card>
            <SectionTitle>{t('business.contact')}</SectionTitle>
            <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="10px">
              {t('business.contactHint')}
            </Text>
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} columnGap="12px">
              <TextField label={t('business.businessPhone')} type="tel" value={form.businessPhone} onChange={set('businessPhone')} placeholder="+506 8888 8888" />
              <TextField label={t('business.whatsappNumber')} type="tel" value={form.whatsappNumber} onChange={set('whatsappNumber')} placeholder="+506 8888 8888" />
              <TextField label={t('business.businessEmail')} type="email" value={form.businessEmail} onChange={set('businessEmail')} />
              <TextField label={t('business.websiteUrl')} value={form.websiteUrl} onChange={set('websiteUrl')} placeholder="https://" />
              <TextField label={t('business.businessPhoneAlt')} type="tel" value={form.businessPhoneAlt} onChange={set('businessPhoneAlt')} />
              <TextField label={t('business.businessEmailAlt')} type="email" value={form.businessEmailAlt} onChange={set('businessEmailAlt')} />
            </Box>
          </Card>

          <ServicesCard
            services={s.services ?? []}
            onSave={async (data) => {
              await saveService({ variables: { data } });
              await refetch();
            }}
            onDelete={async (serviceId) => {
              await deleteService({ variables: { serviceId } });
              await refetch();
            }}
          />

        </Flex>
      </Box>

      <Flex justify="flex-end" marginTop="20px">
        <Btn onClick={saveAll} disabled={saving}>
          {saving ? t('common.saving') : savedAt ? t('common.saved') : t('business.saveAll')}
        </Btn>
      </Flex>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar />
      <Box maxWidth="1120px" margin="0 auto" padding={{ base: '20px 16px 60px', md: '32px 24px 80px' }}>
        {children}
      </Box>
    </Box>
  );
}

type ServiceRow = { serviceId: number; name: string; description?: string | null; priceFrom?: string | null; priceUnit?: string | null; currency: string };

function ServicesCard({
  services,
  onSave,
  onDelete,
}: {
  services: ServiceRow[];
  onSave: (data: { serviceId?: number; name: string; description?: string; priceFrom?: string; priceUnit?: string }) => Promise<void>;
  onDelete: (serviceId: number) => Promise<void>;
}) {
  const { t } = useI18n();
  const empty = { name: '', description: '', priceFrom: '', priceUnit: '' };
  const [editing, setEditing] = React.useState<number | 'new' | null>(null);
  const [draft, setDraft] = React.useState(empty);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const start = (row?: ServiceRow) => {
    setError(null);
    setEditing(row ? row.serviceId : 'new');
    setDraft(row ? { name: row.name, description: row.description ?? '', priceFrom: row.priceFrom ? String(Math.round(Number(row.priceFrom))) : '', priceUnit: row.priceUnit ?? '' } : empty);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await onSave({ ...(editing !== 'new' && editing != null ? { serviceId: editing } : {}), ...draft });
      setEditing(null);
    } catch (e: any) {
      setError(e?.message ?? t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  const formRow = (
    <Box padding="12px" bg={solvoColors.bg} borderRadius="12px" marginBottom="10px">
      <TextField label={t('business.serviceName')} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={120} />
      <TextAreaField label={t('business.serviceDescription')} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={1000} style={{ minHeight: '64px' }} />
      <Box display="grid" gridTemplateColumns="1fr 1fr" columnGap="10px">
        <TextField label={t('business.priceFrom')} inputMode="numeric" value={draft.priceFrom} onChange={(e) => setDraft({ ...draft, priceFrom: e.target.value })} />
        <TextField label={t('business.priceUnit')} value={draft.priceUnit} onChange={(e) => setDraft({ ...draft, priceUnit: e.target.value })} maxLength={30} />
      </Box>
      {error && (
        <Text fontSize="sm" color={solvoColors.roseText} marginBottom="8px">
          {error}
        </Text>
      )}
      <Flex gap="8px">
        <Btn onClick={submit} disabled={busy || draft.name.trim().length < 2}>
          {busy ? t('common.saving') : t('common.save')}
        </Btn>
        <Btn variant="secondary" onClick={() => setEditing(null)}>
          {t('common.cancel')}
        </Btn>
      </Flex>
    </Box>
  );

  return (
    <Card>
      <SectionTitle right={editing === null && <Btn variant="ghost" onClick={() => start()}>{t('business.addService')}</Btn>}>{t('business.services')}</SectionTitle>
      <Text fontSize="sm" color={solvoColors.textSubtle} marginBottom="10px">
        {t('business.servicesHint')}
      </Text>
      {editing === 'new' && formRow}
      {services.length === 0 && editing === null && (
        <Text fontSize="sm" color={solvoColors.textSubtle}>
          {t('business.noServices')}
        </Text>
      )}
      <Flex direction="column" gap="8px">
        {services.map((sv) =>
          editing === sv.serviceId ? (
            <React.Fragment key={sv.serviceId}>{formRow}</React.Fragment>
          ) : (
            <Flex key={sv.serviceId} justify="space-between" align="center" gap="10px" padding="10px 12px" bg={solvoColors.bg} borderRadius="12px">
              <Box minWidth={0}>
                <Text fontWeight={600} fontSize="sm" color={solvoColors.text}>
                  {sv.name}
                </Text>
                <Text fontSize="12px" color={solvoColors.textSubtle}>
                  {formatPrice(sv.priceFrom, sv.priceUnit, t, sv.currency)}
                </Text>
              </Box>
              <Flex gap="4px">
                <Btn variant="ghost" onClick={() => start(sv)} style={{ padding: '6px 10px' }}>
                  {t('common.edit')}
                </Btn>
                <Btn variant="danger" onClick={() => onDelete(sv.serviceId)} style={{ padding: '6px 10px' }}>
                  {t('common.delete')}
                </Btn>
              </Flex>
            </Flex>
          ),
        )}
      </Flex>
    </Card>
  );
}
