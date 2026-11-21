/** Backend origin, no path (e.g. "https://api.solvocr.com"). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/** Gallery photos are streamed through the API (GET /files/media/:id). */
export const mediaSrc = (mediaAssetId: number) => `${API_BASE}/files/media/${mediaAssetId}`;

/**
 * Upload a photo for the signed-in user (REST, multipart). The API takes
 * the owner from the token: 'supplier' appends to the user's own gallery,
 * 'user' replaces their profile picture.
 */
export async function uploadPhoto(file: File, ownerType: 'supplier' | 'user'): Promise<{ mediaAssetId?: number; url: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('@token') : null;
  const body = new FormData();
  body.append('file', file);
  body.append('ownerType', ownerType);
  const res = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    body,
    headers: token ? { authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `Upload failed (${res.status})`);
  }
  return res.json();
}
