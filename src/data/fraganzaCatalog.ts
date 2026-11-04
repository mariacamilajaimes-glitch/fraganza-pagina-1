import catalogData from './fraganzaCatalog.json';

export interface OlfactoryPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export type GenderType = 'Dama' | 'Caballero' | 'Unisex';

export type MainCategory =
  | 'Floral'
  | 'Dulce / Acaramelado'
  | 'Cítrico / Acuático'
  | 'Amaderado / Oriental';

export type IntensityLevel = 'Suave' | 'Moderada' | 'Intensa' | 'Envolvente';

export type SkinCompatibility = 'Piel Seca' | 'Piel Grasa' | 'Piel Mixta' | 'Versátil';

export interface CatalogFragrance {
  id: string;
  idNum: number;
  code: string;
  name: string;
  brand: string;
  gender: GenderType;
  family: string;
  subfamily: string;
  mainCategory: MainCategory;
  popularity: 'Alta' | 'Media';
  aromasClave: string[];
  pyramid: OlfactoryPyramid;
  allNotes: string[];
  sweetness: 'Fresco' | 'Moderado' | 'Muy Dulce' | 'Seco';
  sensation: string;
  intensity: IntensityLevel;
  skinCompat: SkinCompatibility;
  ageRange: string;
  personality: string;
  environment: 'Día' | 'Noche' | 'Indistinto';
  occasion: string;
  tags: string[];
  description: string;
  image: string;
  mainAccords?: { name: string; percentage: number; color?: string; textColor?: string }[];
  themeMode?: 'black' | 'white';
}

export const CATALOG: CatalogFragrance[] = catalogData as CatalogFragrance[];

// Helper to get unique list of all notes in the entire catalog
export const ALL_UNIQUE_NOTES: string[] = (() => {
  const notesSet = new Set<string>();
  CATALOG.forEach(f => {
    f.allNotes.forEach(n => notesSet.add(n));
  });
  return Array.from(notesSet).sort((a, b) => a.localeCompare(b));
})();

import {
  computeWeightedJaccardSimilarity,
  findSimilarFragrancesJaccard,
  TieredJaccardResult
} from './jaccardSimilarity';

// Re-export Weighted Jaccard Similarity functions and types
export {
  computeWeightedJaccardSimilarity,
  findSimilarFragrancesJaccard,
  type TieredJaccardResult
};

// Helper to find similar perfumes using the Weighted Jaccard Similarity Engine
export function findSimilarFragrances(target: CatalogFragrance, limit: number = 4): { fragrance: CatalogFragrance; sharedNotes: string[]; jaccardPercentage: number; result: TieredJaccardResult }[] {
  const jaccardResults: TieredJaccardResult[] = findSimilarFragrancesJaccard(target, limit);
  return jaccardResults.map((res: TieredJaccardResult) => ({
    fragrance: res.fragrance,
    sharedNotes: res.allSharedNotes,
    jaccardPercentage: res.jaccardPercentage,
    result: res
  }));
}

// Occasion text generator for Question 8
export function getOccasionDescription(occasionAnswer: string): string {
  switch (occasionAnswer) {
    case 'Ocasiones especiales':
      return 'Perfecto para citas románticas, veladas elegantes o salidas nocturnas. Su intensidad y profundidad lo convierten en el compañero ideal para los momentos que quieres hacer inolvidables.';
    case 'Todo uso / Diario':
      return 'Ideal para acompañarte en tu rutina diaria. Fresco y versátil, se adapta a cualquier ambiente sin resultar invasivo.';
    case 'Oficina / Trabajo':
      return 'Su proyección discreta y elegante lo hace perfecto para entornos profesionales y espacios cerrados.';
    case 'Deportivo / Activo':
      return 'Energizante y fresco, pensado para acompañarte en movimiento sin perder personalidad.';
    default:
      return 'Versátil y distinguido, capaz de adaptarse armónicamente a tus momentos más preciados.';
  }
}

// Generates a punctual, direct sensory review without verbose filler or truncation
export function getFullFragranceReview(f: CatalogFragrance): string {
  const cleanedDesc = (f.description || '')
    .replace(/\s+y\s+dulzor$/i, '.')
    .replace(/\s+y\s+dulzor\.$/i, '.')
    .replace(/,\s*$/, '.')
    .trim();

  return cleanedDesc || `${f.name} de ${f.brand}: una composición ${f.family} con proyección ${f.intensity.toLowerCase()}, dulzor ${f.sweetness.toLowerCase()} y fijación óptima para ${f.skinCompat.toLowerCase()}.`;
}

export function getPunctualFragranceBreakdown(f: CatalogFragrance): {
  salida: string;
  corazon: string;
  fondo: string;
  resumen: string;
} {
  return {
    resumen: (f.description || '').replace(/\s+y\s+dulzor(\.)?$/i, '.').trim(),
    salida: f.pyramid?.top && f.pyramid.top.length > 0 ? f.pyramid.top.join(', ') : 'Notas frescas',
    corazon: f.pyramid?.heart && f.pyramid.heart.length > 0 ? f.pyramid.heart.join(', ') : 'Cuerpo floral/especiado',
    fondo: f.pyramid?.base && f.pyramid.base.length > 0 ? f.pyramid.base.join(', ') : 'Fondo cálido y fijador'
  };
}

