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

// Generates an articulate, poetic, and complete sensory review without missing words or truncation
export function getFullFragranceReview(f: CatalogFragrance): string {
  if (
    f.description &&
    f.description.length >= 60 &&
    f.description.endsWith('.') &&
    !f.description.match(/y dulzo/i)
  ) {
    return f.description.trim();
  }

  const top = f.pyramid?.top && f.pyramid.top.length > 0
    ? f.pyramid.top.slice(0, 3).join(', ')
    : f.allNotes?.slice(0, 2).join(', ') || 'acordes cítricos y luminosos';
  const heart = f.pyramid?.heart && f.pyramid.heart.length > 0
    ? f.pyramid.heart.slice(0, 3).join(', ')
    : f.allNotes?.slice(2, 4).join(', ') || 'matices florales y especiados';
  const base = f.pyramid?.base && f.pyramid.base.length > 0
    ? f.pyramid.base.slice(0, 3).join(', ')
    : f.allNotes?.slice(4, 6).join(', ') || 'maderas nobles y almizcle fijador';

  const sens = (f.sensation || 'cálida y envolvente').toLowerCase();
  const sweet = (f.sweetness || 'moderado').toLowerCase();
  const intens = (f.intensity || 'moderada').toLowerCase();
  const skin = (f.skinCompat || 'todo tipo de piel').toLowerCase();
  const occ = (f.occasion || 'ocasiones especiales').toLowerCase();

  return `${f.name} de ${f.brand} es una composición ${f.family.toLowerCase()} (${f.subfamily}). Abre con una salida brillante de ${top}, evoluciona hacia un corazón sofisticado de ${heart} y se asienta sobre un fondo duradero de ${base}. Proyecta una estela ${sens} con dulzor ${sweet}, intensidad ${intens} y una fijación sublime en ${skin}, ideal para ${occ}.`;
}

export function getPunctualFragranceBreakdown(f: CatalogFragrance): {
  salida: string;
  corazon: string;
  fondo: string;
  resumen: string;
} {
  return {
    resumen: getFullFragranceReview(f),
    salida: f.pyramid?.top && f.pyramid.top.length > 0 ? f.pyramid.top.join(', ') : 'Notas frescas de apertura',
    corazon: f.pyramid?.heart && f.pyramid.heart.length > 0 ? f.pyramid.heart.join(', ') : 'Cuerpo floral y especiado',
    fondo: f.pyramid?.base && f.pyramid.base.length > 0 ? f.pyramid.base.join(', ') : 'Fondo cálido y fijador'
  };
}

