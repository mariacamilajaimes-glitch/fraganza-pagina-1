import { CatalogFragrance, CATALOG } from './fraganzaCatalog';

export interface TieredJaccardResult {
  fragrance: CatalogFragrance;
  jaccardPercentage: number;
  rawScore: number;
  topJaccard: number;
  heartJaccard: number;
  baseJaccard: number;
  globalJaccard: number;
  sharedByTier: {
    top: string[];
    heart: string[];
    base: string[];
    crossTier: string[];
  };
  sharedTopNotes: string[];
  sharedHeartNotes: string[];
  sharedBaseNotes: string[];
  allSharedNotes: string[];
  totalSharedCount: number;
  highlights: string[];
}

/**
 * Normalizes note string by stripping accents, lowercase, and removing punctuation
 */
export function normalizeNote(note: string): string {
  return note
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if two note names are equivalent or match by constituent keyword
 */
export function notesAreEquivalent(n1: string, n2: string): boolean {
  const s1 = normalizeNote(n1);
  const s2 = normalizeNote(n2);
  if (s1 === s2) return true;

  const tokens1 = s1.split(' ').filter(t => t.length > 2);
  const tokens2 = s2.split(' ').filter(t => t.length > 2);

  for (const t1 of tokens1) {
    for (const t2 of tokens2) {
      if (t1 === t2) return true;
      if (t1.length >= 4 && t2.length >= 4) {
        if (t1.includes(t2) || t2.includes(t1)) return true;
      }
    }
  }

  return false;
}

/**
 * Computes Jaccard coefficient between two note sets: J(A, B) = |A ∩ B| / |A ∪ B|
 */
export function computeTierJaccard(
  tierA: string[],
  tierB: string[]
): { shared: string[]; jaccard: number } {
  if (tierA.length === 0 && tierB.length === 0) {
    return { shared: [], jaccard: 1.0 };
  }
  if (tierA.length === 0 || tierB.length === 0) {
    return { shared: [], jaccard: 0 };
  }

  const shared: string[] = [];
  for (const noteA of tierA) {
    if (tierB.some(noteB => notesAreEquivalent(noteA, noteB))) {
      shared.push(noteA);
    }
  }

  const unionSize = tierA.length + tierB.length - shared.length;
  const jaccard = unionSize > 0 ? shared.length / unionSize : 0;

  return { shared, jaccard };
}

/**
 * Weighted Jaccard Similarity Algorithm across the 3 levels of the pyramid:
 * - Superior (Salida / Top): weight 0.25
 * - Media (Corazón / Heart): weight 0.35
 * - Fundamental (Fondo / Base): weight 0.40
 */
export function computeWeightedJaccardSimilarity(
  target: CatalogFragrance,
  candidate: CatalogFragrance
): TieredJaccardResult {
  const topResult = computeTierJaccard(target.pyramid.top, candidate.pyramid.top);
  const heartResult = computeTierJaccard(target.pyramid.heart, candidate.pyramid.heart);
  const baseResult = computeTierJaccard(target.pyramid.base, candidate.pyramid.base);
  const globalResult = computeTierJaccard(target.allNotes, candidate.allNotes);

  const tierSharedSet = new Set([...topResult.shared, ...heartResult.shared, ...baseResult.shared]);
  const crossTierNotes = globalResult.shared.filter(n => !tierSharedSet.has(n));

  // Tier Weights: Top (0.25), Heart (0.35), Base (0.40)
  const tieredJaccard =
    0.25 * topResult.jaccard +
    0.35 * heartResult.jaccard +
    0.40 * baseResult.jaccard;

  let rawScore = 0.65 * tieredJaccard + 0.35 * globalResult.jaccard;

  // Family and intensity bonuses
  if (candidate.mainCategory === target.mainCategory) {
    rawScore += 0.05;
  }
  if (candidate.subfamily && target.subfamily && candidate.subfamily === target.subfamily) {
    rawScore += 0.04;
  } else if (candidate.family === target.family) {
    rawScore += 0.02;
  }
  if (candidate.intensity === target.intensity) {
    rawScore += 0.02;
  }

  const normalizedPercentage = Math.min(
    98,
    Math.max(15, Math.round(rawScore * 100))
  );

  const highlights: string[] = [];
  if (topResult.shared.length > 0) highlights.push(`Salida: ${topResult.shared.join(', ')}`);
  if (heartResult.shared.length > 0) highlights.push(`Corazón: ${heartResult.shared.join(', ')}`);
  if (baseResult.shared.length > 0) highlights.push(`Fondo: ${baseResult.shared.join(', ')}`);

  return {
    fragrance: candidate,
    jaccardPercentage: normalizedPercentage,
    rawScore,
    topJaccard: Math.round(topResult.jaccard * 100),
    heartJaccard: Math.round(heartResult.jaccard * 100),
    baseJaccard: Math.round(baseResult.jaccard * 100),
    globalJaccard: Math.round(globalResult.jaccard * 100),
    sharedByTier: {
      top: topResult.shared,
      heart: heartResult.shared,
      base: baseResult.shared,
      crossTier: crossTierNotes
    },
    sharedTopNotes: topResult.shared,
    sharedHeartNotes: heartResult.shared,
    sharedBaseNotes: baseResult.shared,
    allSharedNotes: globalResult.shared,
    totalSharedCount: globalResult.shared.length,
    highlights
  };
}

/**
 * Finds top N similar fragrances using the Weighted Jaccard Similarity Algorithm
 */
export function findSimilarFragrancesJaccard(
  target: CatalogFragrance,
  limit: number = 4
): TieredJaccardResult[] {
  const isGenderCompatible = (f: CatalogFragrance) => {
    if (target.gender === 'Dama') {
      return f.gender === 'Dama' || f.gender === 'Unisex';
    }
    if (target.gender === 'Caballero') {
      return f.gender === 'Caballero' || f.gender === 'Unisex';
    }
    return true;
  };

  const pool = CATALOG.filter(f => f.id !== target.id && isGenderCompatible(f));
  const scored = pool.map(candidate => computeWeightedJaccardSimilarity(target, candidate));
  scored.sort((a, b) => b.rawScore - a.rawScore);

  return scored.slice(0, limit);
}
