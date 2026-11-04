import { CatalogFragrance, CATALOG, OlfactoryPyramid } from '../data/fraganzaCatalog';
import { idbGet, idbSet, idbDelete } from './dbStorage';
import { compressImage } from '../utils/imageCompressor';

export interface FragranceOverride {
  image?: string;
  pyramid?: OlfactoryPyramid;
  allNotes?: string[];
  description?: string;
  sensation?: string;
  sweetness?: 'Fresco' | 'Moderado' | 'Muy Dulce' | 'Seco';
  intensity?: 'Suave' | 'Moderada' | 'Intensa' | 'Envolvente';
  occasion?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'fraganza_admin_overrides';
const NOTE_PHOTOS_KEY = 'fraganza_custom_note_photos';

// In-memory active caches for instant synchronous lookups
let inMemoryOverrides: Record<string, FragranceOverride> = {};
let inMemoryNotePhotos: Record<string, string> = {};

// Safe helper to read localStorage with quota error protection
function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

// Safe helper to write localStorage; if QuotaExceededError happens, do NOT throw or crash
function writeLocalStorageSafe(key: string, value: any): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err: any) {
    console.warn(`localStorage quota warning for key ${key}:`, err?.message || err);
    // If quota exceeded, clean up large data URLs from localStorage copy while keeping them in IndexedDB
    try {
      if (typeof value === 'object' && value !== null) {
        const lightweightCopy: Record<string, any> = {};
        for (const [k, v] of Object.entries(value)) {
          // If value is a long data URI (> 20KB), don't store it in localStorage to prevent quota lock
          if (typeof v === 'string' && v.startsWith('data:') && v.length > 20480) {
            continue;
          }
          if (typeof v === 'object' && v !== null && (v as any).image?.startsWith('data:') && (v as any).image?.length > 20480) {
            lightweightCopy[k] = { ...(v as any), image: undefined };
            continue;
          }
          lightweightCopy[k] = v;
        }
        localStorage.setItem(key, JSON.stringify(lightweightCopy));
      }
    } catch {
      // If still fails, clear the localstorage key to prevent locking the app
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }
}

// Initialize memory caches from localStorage immediately
inMemoryOverrides = readLocalStorage<Record<string, FragranceOverride>>(STORAGE_KEY, {});
inMemoryNotePhotos = readLocalStorage<Record<string, string>>(NOTE_PHOTOS_KEY, {});

// Asynchronously hydrate from IndexedDB for unbounded persistence
let isHydratedFromIdb = false;
async function hydrateFromIndexedDB() {
  if (typeof window === 'undefined') return;
  try {
    const [idbOverrides, idbPhotos] = await Promise.all([
      idbGet<Record<string, FragranceOverride>>(STORAGE_KEY),
      idbGet<Record<string, string>>(NOTE_PHOTOS_KEY)
    ]);

    let hasNewData = false;

    if (idbOverrides && Object.keys(idbOverrides).length > 0) {
      inMemoryOverrides = { ...inMemoryOverrides, ...idbOverrides };
      hasNewData = true;
    }

    if (idbPhotos && Object.keys(idbPhotos).length > 0) {
      inMemoryNotePhotos = { ...inMemoryNotePhotos, ...idbPhotos };
      hasNewData = true;
    }

    isHydratedFromIdb = true;

    if (hasNewData) {
      window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { source: 'indexeddb_hydrated' } }));
      window.dispatchEvent(new CustomEvent('fraganza_notes_updated', { detail: { source: 'indexeddb_hydrated' } }));
    }
  } catch (e) {
    console.warn('Could not hydrate from IndexedDB:', e);
  }
}

// Start hydration immediately
if (typeof window !== 'undefined') {
  hydrateFromIndexedDB();
}

// Load overrides from memory cache safely
export function getStoredOverrides(): Record<string, FragranceOverride> {
  return inMemoryOverrides;
}

// Get the customized catalog with admin overrides applied
export function getCustomizedCatalog(): CatalogFragrance[] {
  const overrides = inMemoryOverrides;
  return CATALOG.map((fragrance) => {
    const override = overrides[fragrance.code] || overrides[fragrance.id];
    if (!override) return fragrance;

    const updatedPyramid = override.pyramid || fragrance.pyramid;
    const computedAllNotes = override.allNotes || [
      ...(updatedPyramid.top || []),
      ...(updatedPyramid.heart || []),
      ...(updatedPyramid.base || [])
    ];

    return {
      ...fragrance,
      image: override.image || fragrance.image,
      pyramid: updatedPyramid,
      allNotes: computedAllNotes,
      description: override.description || fragrance.description,
      sensation: override.sensation || fragrance.sensation,
      sweetness: (override.sweetness as any) || fragrance.sweetness,
      intensity: (override.intensity as any) || fragrance.intensity,
      occasion: override.occasion || fragrance.occasion,
    };
  });
}

// Get single customized fragrance by code or ID
export function getCustomizedFragrance(codeOrId: string): CatalogFragrance | undefined {
  const catalog = getCustomizedCatalog();
  const search = codeOrId.toUpperCase().trim();
  return catalog.find(
    (f) => f.code.toUpperCase() === search || f.id.toUpperCase() === search || f.name.toLowerCase() === codeOrId.toLowerCase()
  );
}

// Save admin update for a fragrance (async safe)
export async function saveAdminFragranceUpdate(
  code: string,
  updates: Partial<FragranceOverride>
): Promise<void> {
  try {
    const existing = inMemoryOverrides[code] || {};
    let optimizedImage = updates.image;

    // If bottle image is a large data URI, compress to max 600x600 jpeg
    if (optimizedImage && optimizedImage.startsWith('data:') && optimizedImage.length > 40960) {
      try {
        optimizedImage = await compressImage(optimizedImage, 600, 600, 0.8);
      } catch {
        // keep original
      }
    }

    const updatedEntry: FragranceOverride = {
      ...existing,
      ...updates,
      image: optimizedImage !== undefined ? optimizedImage : existing.image,
      updatedAt: new Date().toISOString()
    };

    inMemoryOverrides[code] = updatedEntry;

    // Persist to IndexedDB (virtually unlimited capacity)
    await idbSet(STORAGE_KEY, inMemoryOverrides);

    // Persist to localStorage safely
    writeLocalStorageSafe(STORAGE_KEY, inMemoryOverrides);

    // Dispatch custom event so all listeners update reactively
    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { code, updates: updatedEntry } }));
  } catch (e) {
    console.error('Error saving fragrance override:', e);
  }
}

// Reset admin update for a fragrance
export async function resetAdminFragranceUpdate(code: string): Promise<void> {
  try {
    delete inMemoryOverrides[code];

    await idbSet(STORAGE_KEY, inMemoryOverrides);
    writeLocalStorageSafe(STORAGE_KEY, inMemoryOverrides);

    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { code } }));
  } catch (e) {
    console.error('Error resetting fragrance override:', e);
  }
}

// Custom Note Photos Storage (for Olfactory Pyramid notes)
export function getStoredNotePhotos(): Record<string, string> {
  return inMemoryNotePhotos;
}

export async function saveCustomNotePhoto(noteName: string, rawPhotoUrl: string): Promise<void> {
  try {
    const key = noteName.toLowerCase().trim();
    let optimizedUrl = rawPhotoUrl.trim();

    // If note photo is a data URI, compress to 256x256 jpeg (~10KB)
    if (optimizedUrl.startsWith('data:')) {
      try {
        optimizedUrl = await compressImage(optimizedUrl, 256, 256, 0.75);
      } catch (err) {
        console.warn('Note compression warning:', err);
      }
    }

    inMemoryNotePhotos[key] = optimizedUrl;

    // 1. Save to IndexedDB (guaranteed high capacity)
    await idbSet(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    // 2. Save to localStorage safely (catches and mitigates QuotaExceededError)
    writeLocalStorageSafe(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    // 3. Dispatch events
    window.dispatchEvent(new CustomEvent('fraganza_notes_updated', { detail: { noteName, photoUrl: optimizedUrl } }));
    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { noteName } }));
  } catch (e) {
    console.error('Error saving custom note photo:', e);
  }
}

export async function resetCustomNotePhoto(noteName: string): Promise<void> {
  try {
    const key = noteName.toLowerCase().trim();
    delete inMemoryNotePhotos[key];

    await idbSet(NOTE_PHOTOS_KEY, inMemoryNotePhotos);
    writeLocalStorageSafe(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    window.dispatchEvent(new CustomEvent('fraganza_notes_updated', { detail: { noteName } }));
    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { noteName } }));
  } catch (e) {
    console.error('Error resetting custom note photo:', e);
  }
}
