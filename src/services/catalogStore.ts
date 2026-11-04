import { CatalogFragrance, CATALOG, OlfactoryPyramid } from '../data/fraganzaCatalog';
import { idbGet, idbSet, idbDelete } from './dbStorage';
import { compressImage } from '../utils/imageCompressor';

export interface AccordItem {
  name: string;
  percentage: number;
  color?: string;
  textColor?: string;
}

export interface FragranceOverride {
  image?: string;
  pyramid?: OlfactoryPyramid;
  allNotes?: string[];
  description?: string;
  sensation?: string;
  sweetness?: 'Fresco' | 'Moderado' | 'Muy Dulce' | 'Seco';
  intensity?: 'Suave' | 'Moderada' | 'Intensa' | 'Envolvente';
  environment?: 'Día' | 'Noche' | 'Indistinto';
  occasion?: string;
  mainAccords?: AccordItem[];
  themeMode?: 'black' | 'white';
  updatedAt?: string;
}

export interface CustomNoteDetail {
  originalName: string;
  displayName: string;
  botanicalName?: string;
  category: string;
  description: string;
  photoUrl: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'fraganza_admin_overrides';
const NOTE_PHOTOS_KEY = 'fraganza_custom_note_photos';
const CUSTOM_NOTES_KEY = 'fraganza_custom_notes_full';

// In-memory active caches for instant synchronous lookups
let inMemoryOverrides: Record<string, FragranceOverride> = {};
let inMemoryNotePhotos: Record<string, string> = {};
let inMemoryCustomNotes: Record<string, CustomNoteDetail> = {};

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
    try {
      if (typeof value === 'object' && value !== null) {
        const lightweightCopy: Record<string, any> = {};
        for (const [k, v] of Object.entries(value)) {
          if (typeof v === 'string' && v.startsWith('data:') && v.length > 20480) {
            continue;
          }
          if (typeof v === 'object' && v !== null && (v as any).image?.startsWith('data:') && (v as any).image?.length > 20480) {
            lightweightCopy[k] = { ...(v as any), image: undefined };
            continue;
          }
          if (typeof v === 'object' && v !== null && (v as any).photoUrl?.startsWith('data:') && (v as any).photoUrl?.length > 20480) {
            lightweightCopy[k] = { ...(v as any), photoUrl: '' };
            continue;
          }
          lightweightCopy[k] = v;
        }
        localStorage.setItem(key, JSON.stringify(lightweightCopy));
      }
    } catch {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }
}

// Initialize memory caches from localStorage immediately
inMemoryOverrides = readLocalStorage<Record<string, FragranceOverride>>(STORAGE_KEY, {});
inMemoryNotePhotos = readLocalStorage<Record<string, string>>(NOTE_PHOTOS_KEY, {});
inMemoryCustomNotes = readLocalStorage<Record<string, CustomNoteDetail>>(CUSTOM_NOTES_KEY, {});

// Asynchronously hydrate from IndexedDB for unbounded persistence
let isHydratedFromIdb = false;
async function hydrateFromIndexedDB() {
  if (typeof window === 'undefined') return;
  try {
    const [idbOverrides, idbPhotos, idbNotes] = await Promise.all([
      idbGet<Record<string, FragranceOverride>>(STORAGE_KEY),
      idbGet<Record<string, string>>(NOTE_PHOTOS_KEY),
      idbGet<Record<string, CustomNoteDetail>>(CUSTOM_NOTES_KEY)
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

    if (idbNotes && Object.keys(idbNotes).length > 0) {
      inMemoryCustomNotes = { ...inMemoryCustomNotes, ...idbNotes };
      // Also sync back to inMemoryNotePhotos for backward compat
      Object.entries(inMemoryCustomNotes).forEach(([k, detail]) => {
        if (detail.photoUrl && !inMemoryNotePhotos[k]) {
          inMemoryNotePhotos[k] = detail.photoUrl;
        }
      });
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
      environment: (override.environment as any) || fragrance.environment,
      occasion: override.occasion || fragrance.occasion,
      mainAccords: override.mainAccords,
      themeMode: override.themeMode,
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

// --- RICH CUSTOM NOTES STORAGE ---
export function getStoredCustomNotes(): Record<string, CustomNoteDetail> {
  return inMemoryCustomNotes;
}

export function getStoredCustomNote(noteName: string): CustomNoteDetail | undefined {
  const key = noteName.toLowerCase().trim();
  return inMemoryCustomNotes[key];
}

export async function saveCustomNoteDetail(note: CustomNoteDetail): Promise<void> {
  try {
    const key = note.originalName.toLowerCase().trim();
    let optimizedUrl = (note.photoUrl || '').trim();

    if (optimizedUrl.startsWith('data:')) {
      try {
        optimizedUrl = await compressImage(optimizedUrl, 256, 256, 0.75);
      } catch (err) {
        console.warn('Note compression warning:', err);
      }
    }

    const record: CustomNoteDetail = {
      ...note,
      photoUrl: optimizedUrl,
      updatedAt: new Date().toISOString()
    };

    inMemoryCustomNotes[key] = record;
    inMemoryNotePhotos[key] = optimizedUrl;

    // Persist to IndexedDB
    await idbSet(CUSTOM_NOTES_KEY, inMemoryCustomNotes);
    await idbSet(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    // Persist to localStorage safely
    writeLocalStorageSafe(CUSTOM_NOTES_KEY, inMemoryCustomNotes);
    writeLocalStorageSafe(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    // Dispatch events
    window.dispatchEvent(new CustomEvent('fraganza_notes_updated', { detail: { noteName: note.originalName, record } }));
    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { noteName: note.originalName } }));
  } catch (e) {
    console.error('Error saving custom note detail:', e);
  }
}

export async function resetCustomNoteDetail(noteName: string): Promise<void> {
  try {
    const key = noteName.toLowerCase().trim();
    delete inMemoryCustomNotes[key];
    delete inMemoryNotePhotos[key];

    await idbSet(CUSTOM_NOTES_KEY, inMemoryCustomNotes);
    await idbSet(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    writeLocalStorageSafe(CUSTOM_NOTES_KEY, inMemoryCustomNotes);
    writeLocalStorageSafe(NOTE_PHOTOS_KEY, inMemoryNotePhotos);

    window.dispatchEvent(new CustomEvent('fraganza_notes_updated', { detail: { noteName } }));
    window.dispatchEvent(new CustomEvent('fraganza_catalog_updated', { detail: { noteName } }));
  } catch (e) {
    console.error('Error resetting custom note detail:', e);
  }
}

// Backward compatible helper for note photos
export function getStoredNotePhotos(): Record<string, string> {
  return inMemoryNotePhotos;
}

export async function saveCustomNotePhoto(noteName: string, rawPhotoUrl: string): Promise<void> {
  const existing = getStoredCustomNote(noteName);
  await saveCustomNoteDetail({
    originalName: noteName,
    displayName: existing?.displayName || noteName,
    botanicalName: existing?.botanicalName,
    category: existing?.category || 'Florales',
    description: existing?.description || `Nota olfativa oficial: ${noteName}`,
    photoUrl: rawPhotoUrl
  });
}

export async function resetCustomNotePhoto(noteName: string): Promise<void> {
  await resetCustomNoteDetail(noteName);
}
