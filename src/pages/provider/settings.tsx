import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  Box,
  FileUpload,
  Flex,
  Text,
  SolvoNavBar,
  ConfirmModal,
  StatusModal,
} from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import type {
  CategoriesQuery,
  ServicesBySupplierQuery,
  SupplierQuery,
} from '@generated';
import {
  PricingModel,
  useCategoriesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useDeleteSupplierMediaMutation,
  useReorderSupplierMediaMutation,
  useServicesBySupplierQuery,
  useSetSupplierCategoriesMutation,
  useSupplierQuery,
  useUpdateServiceMutation,
  useUpdateSupplierMutation,
  useUpdateUserMutation,
} from '@generated';

type SupplierRecord = SupplierQuery['supplier'];
type GalleryPhoto = NonNullable<SupplierRecord['media']>[number];
type SupplierServiceRow = ServicesBySupplierQuery['servicesBySupplier'][number];
type CategoryOption = CategoriesQuery['categories'][number];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const UPLOAD_ENDPOINT = `${API_BASE}/files/upload`;
/** Images are streamed through our API, not linked straight to Drive. */
const mediaSrc = (mediaAssetId: number) => `${API_BASE}/files/media/${mediaAssetId}`;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
/** Mirrors MAX_SUPPLIER_CATEGORIES on the API — keep the two in step. */
const MAX_CATEGORIES = 5;

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

const sectionStyle: React.CSSProperties = {
  background: solvoColors.surface,
  border: `1px solid ${solvoColors.border}`,
  borderRadius: '16px',
  padding: '24px',
};

const ghostButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: solvoFonts.sans,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
};

const darkButtonStyle: React.CSSProperties = {
  ...ghostButtonStyle,
  border: 'none',
  background: solvoColors.text,
  color: 'white',
};

const PRICING_MODEL_LABELS: Array<{ value: PricingModel; label: string }> = [
  { value: PricingModel.Flat, label: 'Flat price' },
  { value: PricingModel.PerPerson, label: 'Per person' },
  { value: PricingModel.PerHour, label: 'Per hour' },
  { value: PricingModel.PerDay, label: 'Per day' },
  { value: PricingModel.Custom, label: 'Custom / quote only' },
];

/** Everything the service form edits, as strings so inputs stay controlled. */
interface ServiceDraft {
  serviceId: number | null;
  categoryId: string;
  name: string;
  description: string;
  pricingModel: PricingModel;
  basePrice: string;
  currency: string;
  minTotalPrice: string;
  maxTotalPrice: string;
  minUnits: string;
  maxUnits: string;
  unitLabel: string;
  active: boolean;
}

const emptyServiceDraft = (categoryId: string): ServiceDraft => ({
  serviceId: null,
  categoryId,
  name: '',
  description: '',
  pricingModel: PricingModel.Flat,
  basePrice: '',
  currency: 'CRC',
  minTotalPrice: '',
  maxTotalPrice: '',
  minUnits: '',
  maxUnits: '',
  unitLabel: '',
  active: true,
});

const formatColones = (value: string | number | null | undefined): string => {
  if (value == null || value === '') return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '—';
  return `₡${Math.round(n).toLocaleString('en-US')}`;
};

export default function ProviderSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUserToken } = useContext(AuthContext);
  const supplierId = user?.supplierId ?? null;
  const userId = user?.userId ?? null;

  const supplierQuery = useSupplierQuery({
    variables: { where: { supplierId: supplierId ?? 0 } },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });
  const [updateSupplier, updateSupplierState] = useUpdateSupplierMutation();
  const [updateUser, updateUserState] = useUpdateUserMutation();
  const [setSupplierCategories, setCategoriesState] =
    useSetSupplierCategoriesMutation();

  const supplier = supplierQuery.data?.supplier;

  // Personal (User) — name + phone fall back to the supplier's contact phone
  const [contactName, setContactName] = useState('');

  // Business profile fields
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessPhoneAlt, setBusinessPhoneAlt] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessEmailAlt, setBusinessEmailAlt] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [responseTimeMinutes, setResponseTimeMinutes] = useState('');

  // Category badges — stored in their own join table, so they save through
  // a separate mutation alongside the profile fields.
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(
    null,
  );

  /**
   * Hydrate the form from the server record once per identity. Re-running on
   * every `supplier`/`user` object change would stomp on whatever the
   * provider is typing — and, right after a save, would repaint the fields
   * with whatever the query last fetched.
   */
  const hydratedForRef = useRef<number | null>(null);
  const applySupplier = useCallback((record: SupplierRecord | undefined, name?: string | null) => {
    if (!record) return;
    setContactName(name ?? '');
    setCompanyName(record.companyName ?? '');
    setTagline(record.tagline ?? '');
    setDescription(record.description ?? '');
    setCity(record.city ?? '');
    setBusinessPhone(record.businessPhone ?? '');
    setBusinessPhoneAlt(record.businessPhoneAlt ?? '');
    setBusinessEmail(record.businessEmail ?? '');
    setBusinessEmailAlt(record.businessEmailAlt ?? '');
    setWebsiteUrl(record.websiteUrl ?? '');
    setMinCapacity(record.minCapacity != null ? String(record.minCapacity) : '');
    setMaxCapacity(record.maxCapacity != null ? String(record.maxCapacity) : '');
    setResponseTimeMinutes(
      record.responseTimeMinutes != null ? String(record.responseTimeMinutes) : '',
    );

    const linked = record.categories ?? [];
    setSelectedCategoryIds(linked.map((c) => c.categoryId));
    setPrimaryCategoryId(
      linked.find((c) => c.isPrimary)?.categoryId ?? linked[0]?.categoryId ?? null,
    );
  }, []);

  useEffect(() => {
    if (!supplier) return;
    if (hydratedForRef.current === supplier.supplierId) return;
    hydratedForRef.current = supplier.supplierId;
    applySupplier(supplier, user?.name);
  }, [supplier, user, applySupplier]);

  /** Add/remove a category, keeping exactly one primary in the selection. */
  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((current) => {
      if (current.includes(categoryId)) {
        const next = current.filter((id) => id !== categoryId);
        // Dropping the primary promotes whatever is left.
        setPrimaryCategoryId((p) => (p === categoryId ? (next[0] ?? null) : p));
        return next;
      }
      if (current.length >= MAX_CATEGORIES) return current;
      const next = [...current, categoryId];
      setPrimaryCategoryId((p) => p ?? categoryId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!supplierId || !userId) return;

    const minN = minCapacity ? Number(minCapacity) : null;
    const maxN = maxCapacity ? Number(maxCapacity) : null;
    if (minN != null && maxN != null && minN > maxN) {
      setFeedback({ kind: 'error', text: 'Min capacity cannot exceed max capacity.' });
      return;
    }
    if (!companyName.trim()) {
      setFeedback({ kind: 'error', text: 'Your business needs a name customers can see.' });
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setFeedback({
        kind: 'error',
        text: 'Pick at least one category — it decides which requests reach you.',
      });
      return;
    }

    const responseN = responseTimeMinutes ? Number(responseTimeMinutes) : null;
    if (responseN != null && (!Number.isFinite(responseN) || responseN < 1)) {
      setFeedback({ kind: 'error', text: 'Typical reply time must be at least 1 minute.' });
      return;
    }

    try {
      await Promise.all([
        setSupplierCategories({
          variables: {
            data: {
              supplierId,
              categoryIds: selectedCategoryIds,
              primaryCategoryId: primaryCategoryId ?? undefined,
            },
          },
        }),
        updateUser({
          variables: {
            data: { userId, name: contactName.trim() || undefined },
          },
        }),
        updateSupplier({
          variables: {
            data: {
              supplierId,
              companyName: companyName.trim(),
              // Blank strings are sent through on purpose — the API reads
              // them as "clear this field", which is the only way to remove
              // a contact channel you no longer want published.
              tagline: tagline.trim(),
              description: description.trim(),
              city: city.trim(),
              businessPhone: businessPhone.trim(),
              businessPhoneAlt: businessPhoneAlt.trim(),
              businessEmail: businessEmail.trim(),
              businessEmailAlt: businessEmailAlt.trim(),
              websiteUrl: websiteUrl.trim(),
              minCapacity: minN ?? undefined,
              maxCapacity: maxN ?? undefined,
              responseTimeMinutes: responseN ?? undefined,
            },
          },
        }),
      ]);
      // Pull the saved record back and repaint the form from it, so what you
      // see afterwards is exactly what the server stored (trimmed values,
      // cleared fields) instead of the pre-save cache.
      const refreshed = await supplierQuery.refetch();
      if (refreshed.data?.supplier) {
        applySupplier(refreshed.data.supplier, contactName.trim() || user?.name);
      }
      setFeedback({ kind: 'success', text: 'Your business profile is live on your public page.' });
      refreshUserToken().catch(() => {});
    } catch (err: any) {
      setFeedback({ kind: 'error', text: err?.message ?? 'Save failed' });
    }
  };

  const busy =
    updateSupplierState.loading || updateUserState.loading || setCategoriesState.loading;

  // ── Services ────────────────────────────────────────────────────────
  const servicesQuery = useServicesBySupplierQuery({
    variables: { supplierId: supplierId ?? 0, includeInactive: true },
    skip: !supplierId,
    fetchPolicy: 'cache-and-network',
  });
  const categoriesQuery = useCategoriesQuery({ fetchPolicy: 'cache-first' });
  const categories = useMemo<CategoryOption[]>(
    () => categoriesQuery.data?.categories ?? [],
    [categoriesQuery.data],
  );

  const [createService, createServiceState] = useCreateServiceMutation();
  const [updateService, updateServiceState] = useUpdateServiceMutation();
  const [deleteService, deleteServiceState] = useDeleteServiceMutation();

  const [serviceDraft, setServiceDraft] = useState<ServiceDraft | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [pendingServiceDelete, setPendingServiceDelete] = useState<{
    serviceId: number;
    name: string;
  } | null>(null);

  const services = servicesQuery.data?.servicesBySupplier ?? [];

  /** Default a new service to the supplier's primary category when there is one. */
  const defaultCategoryId = useMemo(() => {
    const primary = (supplier?.categories ?? []).find((c) => c.isPrimary);
    const first = (supplier?.categories ?? [])[0];
    const id = primary?.categoryId ?? first?.categoryId ?? categories[0]?.categoryId;
    return id != null ? String(id) : '';
  }, [supplier, categories]);

  const startNewService = () => {
    setServiceError(null);
    setServiceDraft(emptyServiceDraft(defaultCategoryId));
  };

  const startEditService = (s: SupplierServiceRow) => {
    setServiceError(null);
    setServiceDraft({
      serviceId: s.serviceId,
      categoryId: String(s.categoryId),
      name: s.name ?? '',
      description: s.description ?? '',
      pricingModel: s.pricingModel ?? PricingModel.Flat,
      basePrice: s.basePrice != null ? String(s.basePrice) : '',
      currency: s.currency ?? 'CRC',
      minTotalPrice: s.minTotalPrice != null ? String(s.minTotalPrice) : '',
      maxTotalPrice: s.maxTotalPrice != null ? String(s.maxTotalPrice) : '',
      minUnits: s.minUnits != null ? String(s.minUnits) : '',
      maxUnits: s.maxUnits != null ? String(s.maxUnits) : '',
      unitLabel: s.unitLabel ?? '',
      active: s.active ?? true,
    });
  };

  const patchDraft = (patch: Partial<ServiceDraft>) =>
    setServiceDraft((d) => (d ? { ...d, ...patch } : d));

  const handleSaveService = async () => {
    if (!serviceDraft || !supplierId) return;
    setServiceError(null);

    if (!serviceDraft.name.trim()) {
      setServiceError('Give the service a name customers will recognise.');
      return;
    }
    if (!serviceDraft.description.trim()) {
      setServiceError('Describe what the service includes.');
      return;
    }
    if (!serviceDraft.categoryId) {
      setServiceError('Pick a category so the AI can match you to the right requests.');
      return;
    }
    const priceN = Number(serviceDraft.basePrice);
    if (!serviceDraft.basePrice.trim() || !Number.isFinite(priceN) || priceN < 0) {
      setServiceError('Base price must be a number — this is the "From ₡…" customers see.');
      return;
    }

    const shared = {
      supplierId,
      categoryId: Number(serviceDraft.categoryId),
      name: serviceDraft.name.trim(),
      description: serviceDraft.description.trim(),
      pricingModel: serviceDraft.pricingModel,
      basePrice: serviceDraft.basePrice.trim(),
      currency: serviceDraft.currency.trim() || 'CRC',
      minTotalPrice: serviceDraft.minTotalPrice.trim() || undefined,
      maxTotalPrice: serviceDraft.maxTotalPrice.trim() || undefined,
      minUnits: serviceDraft.minUnits.trim() ? Number(serviceDraft.minUnits) : undefined,
      maxUnits: serviceDraft.maxUnits.trim() ? Number(serviceDraft.maxUnits) : undefined,
      unitLabel: serviceDraft.unitLabel.trim() || undefined,
      active: serviceDraft.active,
    };

    try {
      if (serviceDraft.serviceId == null) {
        await createService({ variables: { data: shared } });
      } else {
        await updateService({
          variables: { data: { ...shared, serviceId: serviceDraft.serviceId } },
        });
      }
      await servicesQuery.refetch();
      // The public profile reads services off the supplier query, so that
      // one needs to catch up too.
      supplierQuery.refetch().catch(() => {});
      setServiceDraft(null);
      setFeedback({ kind: 'success', text: 'Service saved and visible on your public page.' });
    } catch (err: any) {
      setServiceError(err?.message ?? 'Could not save the service.');
    }
  };

  const handleDeleteService = async () => {
    if (!pendingServiceDelete || !supplierId) return;
    try {
      await deleteService({
        variables: {
          data: { serviceId: pendingServiceDelete.serviceId, supplierId },
        },
      });
      await servicesQuery.refetch();
      supplierQuery.refetch().catch(() => {});
      setPendingServiceDelete(null);
      setFeedback({ kind: 'success', text: 'Service removed from your public page.' });
    } catch (err: any) {
      setPendingServiceDelete(null);
      setFeedback({ kind: 'error', text: err?.message ?? 'Could not remove the service.' });
    }
  };

  // ── Gallery photos ──────────────────────────────────────────────────
  const [deleteMedia] = useDeleteSupplierMediaMutation();
  const [reorderMedia] = useReorderSupplierMediaMutation();
  const [uploading, setUploading] = useState(false);

  const media = supplier?.media ?? [];

  /** POST one file to the REST upload endpoint. Throws on failure. */
  const uploadOne = async (file: File, ownerId: number) => {
    const body = new FormData();
    body.append('file', file);
    body.append('ownerType', 'supplier');
    body.append('ownerId', String(ownerId));

    const token = typeof window !== 'undefined' ? localStorage.getItem('@token') : null;
    const res = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body,
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.message ?? `Upload failed (${res.status})`);
    }
  };

  /**
   * Uploads sequentially so gallery order matches drop order — the API
   * appends each photo one past the current highest position.
   */
  const handleUploadPhotos = async (files: File[]) => {
    if (!supplierId || files.length === 0) return;

    const tooBig = files.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooBig) {
      setFeedback({
        kind: 'error',
        text: `"${tooBig.name}" is over 8MB. Shrink it and try again.`,
      });
      return;
    }

    setUploading(true);
    let uploaded = 0;
    try {
      for (const file of files) {
        await uploadOne(file, supplierId);
        uploaded += 1;
      }
      await supplierQuery.refetch();
      setFeedback({
        kind: 'success',
        text:
          uploaded === 1
            ? 'Photo added to your gallery.'
            : `${uploaded} photos added to your gallery.`,
      });
    } catch (err: any) {
      // Partial success is still progress — show what landed before the failure.
      if (uploaded > 0) await supplierQuery.refetch().catch(() => {});
      setFeedback({
        kind: 'error',
        text:
          uploaded > 0
            ? `Added ${uploaded} of ${files.length}. ${err?.message ?? 'Upload failed.'}`
            : (err?.message ?? 'Could not upload the photo.'),
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMovePhoto = async (index: number, direction: -1 | 1) => {
    if (!supplierId) return;
    const target = index + direction;
    if (target < 0 || target >= media.length) return;

    const ids = media.map((m) => m.mediaAssetId);
    [ids[index], ids[target]] = [ids[target], ids[index]];

    try {
      await reorderMedia({ variables: { data: { supplierId, mediaAssetIds: ids } } });
      await supplierQuery.refetch();
    } catch (err: any) {
      setFeedback({ kind: 'error', text: err?.message ?? 'Could not reorder the gallery.' });
    }
  };

  const handleDeletePhoto = async (mediaAssetId: number) => {
    if (!supplierId) return;
    try {
      await deleteMedia({ variables: { data: { mediaAssetId, supplierId } } });
      await supplierQuery.refetch();
    } catch (err: any) {
      setFeedback({ kind: 'error', text: err?.message ?? 'Could not remove the photo.' });
    }
  };

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text} marginBottom="6px">
              Sign in to edit your business profile
            </Text>
            <Link href="/login" style={{ color: solvoColors.indigo }}>
              Sign in
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  // Customer-only users edit their profile at /profile
  if (!supplierId && user.customerId) {
    router.replace('/profile');
    return null;
  }

  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/provider" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="460px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
              No supplier profile on your account.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  const savingService = createServiceState.loading || updateServiceState.loading;

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/provider" />

      <Box maxWidth="900px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.08em" fontWeight={600} marginBottom="6px">
          PROVIDER WORKSPACE · SETTINGS
        </Text>
        <Text
          fontFamily={solvoFonts.serif}
          fontSize={{ base: '28px', md: '36px' }}
          color={solvoColors.text}
          marginBottom="6px"
        >
          Business profile
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="32px">
          What customers see on your storefront. Updated info appears immediately on{' '}
          <Link href={`/providers/${supplierId}`} style={{ color: solvoColors.indigo }}>
            your public profile
          </Link>
          .
        </Text>

        {supplierQuery.loading && !supplier ? (
          <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
        ) : (
          <Flex direction="column" gap="20px">
            {/* Account */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Account contact
              </Text>
              <Box>
                <label style={labelStyle}>Your name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Who runs the business"
                />
              </Box>
            </Box>

            {/* Business identity */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Business identity
              </Text>

              <Box marginBottom="14px">
                <label style={labelStyle}>Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={inputBaseStyle}
                />
              </Box>

              <Box marginBottom="14px">
                <label style={labelStyle}>Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Short one-liner shown next to your name"
                />
              </Box>

              <Box>
                <label style={labelStyle}>About</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  style={{ ...inputBaseStyle, resize: 'vertical' }}
                  placeholder="Tell customers what you do, your style, what makes you different."
                />
              </Box>
            </Box>

            {/* Gallery */}
            <Box style={sectionStyle}>
              <Flex align="center" gap="8px" marginBottom="6px">
                <Text fontFamily={solvoFonts.serif} fontSize="18px">
                  Photos
                </Text>
                {uploading && (
                  <Flex align="center" gap="6px" color={solvoColors.indigo}>
                    <ImagePlus size={13} />
                    <Text fontSize="12px" fontWeight={600}>
                      Uploading…
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="14px">
                The first photo is the large tile at the top of your profile. Without photos we
                fall back to illustrated placeholders.
              </Text>

              <Box marginBottom={media.length === 0 ? '0' : '16px'} opacity={uploading ? 0.6 : 1}>
                <FileUpload
                  accept={['image/png', 'image/jpeg', 'image/webp', 'image/gif']}
                  maxFileSize={MAX_PHOTO_BYTES}
                  maxFiles={6}
                  resetOnChange
                  disabled={uploading}
                  placeholder="Drag photos here, or click to choose"
                  onFilesChange={handleUploadPhotos}
                  onFilesRejected={(names) =>
                    setFeedback({
                      kind: 'error',
                      text: `Skipped ${names.join(', ')} — photos must be PNG, JPEG, WebP or GIF, up to 8MB.`,
                    })
                  }
                />
              </Box>

              {media.length === 0 ? (
                <Box
                  marginTop="12px"
                  padding="18px"
                  borderRadius="12px"
                  border={`1px dashed ${solvoColors.border}`}
                  textAlign="center"
                >
                  <Text fontSize="sm" color={solvoColors.textSubtle}>
                    No photos yet — add a few and your profile stops looking like a placeholder.
                  </Text>
                </Box>
              ) : (
                <Box
                  display="grid"
                  gridTemplateColumns={{ base: '1fr 1fr', sm: 'repeat(3, 1fr)' }}
                  gap="10px"
                >
                  {media.map((m: GalleryPhoto, i: number) => (
                    <Box
                      key={m.mediaAssetId}
                      borderRadius="12px"
                      overflow="hidden"
                      border={`1px solid ${solvoColors.border}`}
                      bg={solvoColors.bg}
                    >
                      <Box
                        height="110px"
                        style={{
                          backgroundImage: `url(${mediaSrc(m.mediaAssetId)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <Flex justify="space-between" align="center" padding="6px 8px">
                        <Text fontSize="11px" color={solvoColors.textSubtle}>
                          {i === 0 ? 'Cover' : `#${i + 1}`}
                        </Text>
                        <Flex gap="4px">
                          <Box
                            as="button"
                            aria-label="Move earlier"
                            title="Move earlier"
                            onClick={() => handleMovePhoto(i, -1)}
                            style={{ ...ghostButtonStyle, padding: '4px 6px' }}
                          >
                            <ArrowUp size={12} />
                          </Box>
                          <Box
                            as="button"
                            aria-label="Move later"
                            title="Move later"
                            onClick={() => handleMovePhoto(i, 1)}
                            style={{ ...ghostButtonStyle, padding: '4px 6px' }}
                          >
                            <ArrowDown size={12} />
                          </Box>
                          <Box
                            as="button"
                            aria-label="Remove photo"
                            title="Remove photo"
                            onClick={() => handleDeletePhoto(m.mediaAssetId)}
                            style={{
                              ...ghostButtonStyle,
                              padding: '4px 6px',
                              color: solvoColors.roseText,
                            }}
                          >
                            <Trash2 size={12} />
                          </Box>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Services */}
            <Box style={sectionStyle}>
              <Flex justify="space-between" align="center" marginBottom="6px" wrap="wrap" gap="10px">
                <Text fontFamily={solvoFonts.serif} fontSize="18px">
                  Services
                </Text>
                {!serviceDraft && (
                  <button type="button" style={darkButtonStyle} onClick={startNewService}>
                    <Plus size={14} />
                    Add service
                  </button>
                )}
              </Flex>
              <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="16px">
                Each service is a card on your public profile and a signal the AI uses to match
                you with requests.
              </Text>

              {serviceDraft && (
                <Box
                  marginBottom="16px"
                  padding="18px"
                  borderRadius="14px"
                  border={`1px solid ${solvoColors.indigoBorder}`}
                  bg={solvoColors.indigoLight}
                >
                  <Flex justify="space-between" align="center" marginBottom="14px">
                    <Text fontWeight={600} fontSize="14px" color={solvoColors.text}>
                      {serviceDraft.serviceId == null ? 'New service' : 'Edit service'}
                    </Text>
                    <Box
                      as="button"
                      aria-label="Close"
                      onClick={() => setServiceDraft(null)}
                      style={{ ...ghostButtonStyle, padding: '4px 6px' }}
                    >
                      <X size={13} />
                    </Box>
                  </Flex>

                  <Box marginBottom="12px">
                    <label style={labelStyle}>Service name</label>
                    <input
                      type="text"
                      value={serviceDraft.name}
                      onChange={(e) => patchDraft({ name: e.target.value })}
                      style={inputBaseStyle}
                      placeholder="Tropical Catering Buffet"
                    />
                  </Box>

                  <Box marginBottom="12px">
                    <label style={labelStyle}>What it includes</label>
                    <textarea
                      value={serviceDraft.description}
                      onChange={(e) => patchDraft({ description: e.target.value })}
                      rows={3}
                      style={{ ...inputBaseStyle, resize: 'vertical' }}
                      placeholder="Hawaiian-style buffet for events. Mains, sides, fruit displays and tropical drinks."
                    />
                  </Box>

                  <Flex gap="12px" wrap="wrap" marginBottom="12px">
                    <Box flex="1" minWidth="180px">
                      <label style={labelStyle}>Category</label>
                      <select
                        value={serviceDraft.categoryId}
                        onChange={(e) => patchDraft({ categoryId: e.target.value })}
                        style={inputBaseStyle}
                      >
                        <option value="">Select a category…</option>
                        {categories.map((c: CategoryOption) => (
                          <option key={c.categoryId} value={String(c.categoryId)}>
                            {c.categoryName}
                          </option>
                        ))}
                      </select>
                    </Box>
                    <Box flex="1" minWidth="180px">
                      <label style={labelStyle}>Pricing model</label>
                      <select
                        value={serviceDraft.pricingModel}
                        onChange={(e) =>
                          patchDraft({ pricingModel: e.target.value as PricingModel })
                        }
                        style={inputBaseStyle}
                      >
                        {PRICING_MODEL_LABELS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </Box>
                  </Flex>

                  <Flex gap="12px" wrap="wrap" marginBottom="12px">
                    <Box flex="1" minWidth="160px">
                      <label style={labelStyle}>Base price (the “From ₡…” shown)</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceDraft.basePrice}
                        onChange={(e) => patchDraft({ basePrice: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="18000"
                      />
                    </Box>
                    <Box flex="1" minWidth="120px">
                      <label style={labelStyle}>Currency</label>
                      <input
                        type="text"
                        value={serviceDraft.currency}
                        onChange={(e) => patchDraft({ currency: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="CRC"
                      />
                    </Box>
                    <Box flex="1" minWidth="160px">
                      <label style={labelStyle}>Unit label</label>
                      <input
                        type="text"
                        value={serviceDraft.unitLabel}
                        onChange={(e) => patchDraft({ unitLabel: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="person, hour, event"
                      />
                    </Box>
                  </Flex>

                  <Flex gap="12px" wrap="wrap" marginBottom="12px">
                    <Box flex="1" minWidth="150px">
                      <label style={labelStyle}>Min total price</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceDraft.minTotalPrice}
                        onChange={(e) => patchDraft({ minTotalPrice: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="Optional"
                      />
                    </Box>
                    <Box flex="1" minWidth="150px">
                      <label style={labelStyle}>Max total price</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceDraft.maxTotalPrice}
                        onChange={(e) => patchDraft({ maxTotalPrice: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="Optional"
                      />
                    </Box>
                    <Box flex="1" minWidth="120px">
                      <label style={labelStyle}>Min units</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceDraft.minUnits}
                        onChange={(e) => patchDraft({ minUnits: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="Optional"
                      />
                    </Box>
                    <Box flex="1" minWidth="120px">
                      <label style={labelStyle}>Max units</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceDraft.maxUnits}
                        onChange={(e) => patchDraft({ maxUnits: e.target.value })}
                        style={inputBaseStyle}
                        placeholder="Optional"
                      />
                    </Box>
                  </Flex>

                  <Flex align="center" gap="8px" marginBottom="14px">
                    <input
                      id="service-active"
                      type="checkbox"
                      checked={serviceDraft.active}
                      onChange={(e) => patchDraft({ active: e.target.checked })}
                    />
                    <label htmlFor="service-active" style={{ fontSize: '13px', color: solvoColors.textMuted }}>
                      Show this service on my public profile
                    </label>
                  </Flex>

                  {serviceError && (
                    <Box
                      marginBottom="12px"
                      padding="10px 12px"
                      borderRadius="10px"
                      bg={solvoColors.roseLight}
                      color={solvoColors.roseText}
                    >
                      <Text fontSize="13px">{serviceError}</Text>
                    </Box>
                  )}

                  <Flex justify="flex-end" gap="8px">
                    <button
                      type="button"
                      style={ghostButtonStyle}
                      onClick={() => setServiceDraft(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      style={{ ...darkButtonStyle, opacity: savingService ? 0.6 : 1 }}
                      disabled={savingService}
                      onClick={handleSaveService}
                    >
                      {savingService ? 'Saving…' : 'Save service'}
                    </button>
                  </Flex>
                </Box>
              )}

              {services.length === 0 && !serviceDraft ? (
                <Box
                  padding="24px"
                  borderRadius="12px"
                  border={`1px dashed ${solvoColors.border}`}
                  textAlign="center"
                >
                  <Text fontSize="sm" color={solvoColors.textSubtle}>
                    No services yet — add the first one so customers know what to book.
                  </Text>
                </Box>
              ) : (
                <Flex direction="column" gap="10px">
                  {services.map((s: SupplierServiceRow) => (
                    <Flex
                      key={s.serviceId}
                      justify="space-between"
                      align="flex-start"
                      gap="12px"
                      padding="14px 16px"
                      borderRadius="12px"
                      border={`1px solid ${solvoColors.border}`}
                      bg={solvoColors.bg}
                      wrap="wrap"
                    >
                      <Box flex="1" minWidth="200px">
                        <Flex align="center" gap="8px" wrap="wrap">
                          <Text fontWeight={600} fontSize="14px" color={solvoColors.text}>
                            {s.name}
                          </Text>
                          {!s.active && (
                            <Box
                              padding="2px 8px"
                              borderRadius="9999px"
                              bg={solvoColors.amberLight}
                              color={solvoColors.amberText}
                            >
                              <Text fontSize="11px" fontWeight={600}>Hidden</Text>
                            </Box>
                          )}
                        </Flex>
                        <Text fontSize="12px" color={solvoColors.textSubtle} marginTop="2px">
                          From {formatColones(s.basePrice)} {s.currency ?? ''}
                          {s.unitLabel ? ` · per ${s.unitLabel}` : ''}
                        </Text>
                        <Text fontSize="13px" color={solvoColors.textMuted} marginTop="6px">
                          {s.description}
                        </Text>
                      </Box>
                      <Flex gap="6px">
                        <button
                          type="button"
                          style={ghostButtonStyle}
                          onClick={() => startEditService(s)}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          style={{ ...ghostButtonStyle, color: solvoColors.roseText }}
                          onClick={() =>
                            setPendingServiceDelete({ serviceId: s.serviceId, name: s.name })
                          }
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>

            {/* Location + capacity */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="16px">
                Location & capacity
              </Text>

              <Box marginBottom="14px">
                <label style={labelStyle}>City you serve</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="Santa Ana"
                />
                <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="4px">
                  Used to match you with requests in this area.
                </Text>
              </Box>

              <Flex gap="14px" wrap="wrap">
                <Box flex="1" minWidth="160px">
                  <label style={labelStyle}>Min capacity</label>
                  <input
                    type="number"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="e.g. 10"
                  />
                </Box>
                <Box flex="1" minWidth="160px">
                  <label style={labelStyle}>Max capacity</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="e.g. 200"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Categories + reputation signals */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="6px">
                Categories
              </Text>
              <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="16px">
                The badges under your name, and the strongest signal for which requests reach
                you. Pick up to {MAX_CATEGORIES}; the primary one leads.
              </Text>

              {categoriesQuery.loading && categories.length === 0 ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>Loading categories…</Text>
              ) : (
                <Flex direction="column" gap="8px" marginBottom="18px">
                  {categories.map((c: CategoryOption) => {
                    const checked = selectedCategoryIds.includes(c.categoryId);
                    const isPrimary = primaryCategoryId === c.categoryId;
                    const atLimit =
                      !checked && selectedCategoryIds.length >= MAX_CATEGORIES;
                    return (
                      <Flex
                        key={c.categoryId}
                        align="center"
                        justify="space-between"
                        gap="10px"
                        padding="10px 12px"
                        borderRadius="10px"
                        borderWidth="1px"
                        borderColor={checked ? solvoColors.indigoBorder : solvoColors.border}
                        bg={checked ? solvoColors.indigoLight : solvoColors.surface}
                        opacity={atLimit ? 0.5 : 1}
                      >
                        <Flex align="center" gap="9px">
                          <input
                            id={`cat-${c.categoryId}`}
                            type="checkbox"
                            checked={checked}
                            disabled={atLimit}
                            onChange={() => toggleCategory(c.categoryId)}
                          />
                          <label
                            htmlFor={`cat-${c.categoryId}`}
                            style={{
                              fontSize: '14px',
                              color: solvoColors.text,
                              cursor: atLimit ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {c.categoryName}
                          </label>
                        </Flex>

                        {checked && (
                          <button
                            type="button"
                            onClick={() => setPrimaryCategoryId(c.categoryId)}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              border: `1px solid ${isPrimary ? solvoColors.indigo : solvoColors.border}`,
                              background: isPrimary ? solvoColors.indigo : 'transparent',
                              color: isPrimary ? 'white' : solvoColors.textSubtle,
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: solvoFonts.sans,
                            }}
                          >
                            {isPrimary ? 'Primary' : 'Make primary'}
                          </button>
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              )}

              <Box marginBottom="14px">
                <label style={labelStyle}>Typical reply time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={responseTimeMinutes}
                  onChange={(e) => setResponseTimeMinutes(e.target.value)}
                  style={{ ...inputBaseStyle, maxWidth: '220px' }}
                  placeholder="e.g. 12"
                />
                <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="4px">
                  Shown as “Replies in ~N min” on your profile. This is a promise you make —
                  your measured response rate lives on the dashboard.
                </Text>
              </Box>

              <Flex
                align="center"
                justify="space-between"
                gap="10px"
                padding="12px 14px"
                borderRadius="10px"
                bg={solvoColors.bg}
                borderWidth="1px"
                borderColor={solvoColors.border}
              >
                <Box>
                  <Text fontSize="13px" fontWeight={600} color={solvoColors.text}>
                    Identity verification
                  </Text>
                  <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="2px">
                    Reviewed by Solvo — not something you can set yourself.
                  </Text>
                </Box>
                <Text
                  fontSize="13px"
                  fontWeight={600}
                  color={supplier?.verified ? solvoColors.emeraldText : solvoColors.textSubtle}
                >
                  {supplier?.verified ? '✓ Verified' : 'Not verified'}
                </Text>
              </Flex>
            </Box>

            {/* Contacts */}
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="18px" marginBottom="6px">
                Contact channels
              </Text>
              <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="16px">
                Kept behind a “Show contact details” button on your profile — bookings, quotes and
                messages all run through Solvo, so customers reach you here first. Leave a field
                blank to remove it.
              </Text>

              <Flex gap="14px" wrap="wrap" marginBottom="14px">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="+506 …"
                  />
                </Box>
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Second phone (optional)</label>
                  <input
                    type="tel"
                    value={businessPhoneAlt}
                    onChange={(e) => setBusinessPhoneAlt(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="+506 …"
                  />
                </Box>
              </Flex>

              <Flex gap="14px" wrap="wrap" marginBottom="14px">
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="hello@yourbusiness.com"
                  />
                </Box>
                <Box flex="1" minWidth="220px">
                  <label style={labelStyle}>Second email (optional)</label>
                  <input
                    type="email"
                    value={businessEmailAlt}
                    onChange={(e) => setBusinessEmailAlt(e.target.value)}
                    style={inputBaseStyle}
                    placeholder="bookings@yourbusiness.com"
                  />
                </Box>
              </Flex>

              <Box>
                <label style={labelStyle}>Website</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  style={inputBaseStyle}
                  placeholder="https://…"
                />
                <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="4px">
                  Promote yourself — this links out from your profile.
                </Text>
              </Box>
            </Box>

            {/* Actions */}
            <Flex justify="flex-end" gap="10px">
              <Link href="/provider" style={{ textDecoration: 'none' }}>
                <Box
                  padding="10px 16px"
                  borderRadius="10px"
                  border={`1px solid ${solvoColors.border}`}
                  color={solvoColors.text}
                  fontSize="14px"
                  fontWeight={600}
                  cursor="pointer"
                  bg={solvoColors.surface}
                >
                  Cancel
                </Box>
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={busy}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: solvoColors.text,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.6 : 1,
                  fontFamily: solvoFonts.sans,
                }}
              >
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </Flex>
          </Flex>
        )}
      </Box>

      {pendingServiceDelete && (
        <ConfirmModal
          title="Remove this service?"
          message={`"${pendingServiceDelete.name}" will stop showing on your public profile. Past quotes that used it are unaffected.`}
          confirmLabel="Remove service"
          loading={deleteServiceState.loading}
          onConfirm={handleDeleteService}
          onCancel={() => setPendingServiceDelete(null)}
        />
      )}

      {feedback && (
        <StatusModal
          kind={feedback.kind}
          title={feedback.kind === 'success' ? 'Saved' : 'Something went wrong'}
          message={feedback.text}
          onClose={() => setFeedback(null)}
        />
      )}
    </Box>
  );
}
