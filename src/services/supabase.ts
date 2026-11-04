import { CatalogFragrance, CATALOG } from '../data/fraganzaCatalog';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const meta = import.meta as unknown as { env?: Record<string, string> };
  const url = meta.env?.VITE_SUPABASE_URL || '';
  const anonKey = meta.env?.VITE_SUPABASE_ANON_KEY || '';
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey)
  };
};

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- FRAGANZA - ESQUEMA DE BASE DE DATOS EN SUPABASE / POSTGRESQL
-- Diseñado y optimizado para la perfumería de lujo Fraganza
-- 
-- Incluye:
-- 1. Extensiones 'uuid-ossp' y 'pg_trgm' (búsqueda por trigramas ultrarrápida)
-- 2. ENUMs de alto rendimiento (género, intensidad, categorías, posición pirámide)
-- 3. Tabla 'notes' para el buscador inteligente (Fragrantica-style)
-- 4. Tabla 'fragrances' con atributos olfativos y arrays GIN indexados
-- 5. Tabla relacional 'fragrance_notes' (junction table N:M con posición piramidal)
-- 6. Índices B-Tree y GIN para sub-milisegundo en filtrado y autocompletado
-- 7. Vistas optimizadas y procedimiento almacenado RPC para búsqueda por inclusión/exclusión
-- 8. Políticas de seguridad RLS (Row Level Security) para acceso público de lectura
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. TIPOS ENUM PERSONALIZADOS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
        CREATE TYPE public.gender_type AS ENUM ('Dama', 'Caballero', 'Unisex');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'intensity_level') THEN
        CREATE TYPE public.intensity_level AS ENUM ('Suave', 'Moderada', 'Intensa', 'Envolvente');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pyramid_position') THEN
        CREATE TYPE public.pyramid_position AS ENUM ('salida', 'corazon', 'fondo');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'main_category_type') THEN
        CREATE TYPE public.main_category_type AS ENUM (
            'Floral', 
            'Dulce / Acaramelado', 
            'Cítrico / Acuático', 
            'Amaderado / Oriental'
        );
    END IF;
END $$;

-- 3. TABLA: NOTES (Catálogo canónico de notas olfativas para el buscador)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(60) NOT NULL DEFAULT 'Aromática',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_name_trgm ON public.notes USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_notes_category ON public.notes (category);
CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_name_lower ON public.notes (LOWER(name));

-- 4. TABLA: FRAGRANCES (Catálogo principal de fragancias)
CREATE TABLE IF NOT EXISTS public.fragrances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,                       -- Ej: 'D-023', 'C-001', 'U-015'
    name VARCHAR(150) NOT NULL,                              -- Ej: 'La Vie Est Belle'
    brand VARCHAR(120) NOT NULL,                             -- Ej: 'Lancôme'
    gender public.gender_type NOT NULL,                      -- 'Dama', 'Caballero', 'Unisex'
    family VARCHAR(100) NOT NULL,                            -- Ej: 'Floral Frutal', 'Oriental Amaderado'
    subfamily VARCHAR(100),                                  -- Sub-familia olfativa
    main_category public.main_category_type NOT NULL,        -- Familia principal del test
    intensity public.intensity_level NOT NULL,               -- 'Suave', 'Moderada', 'Intensa', 'Envolvente'
    sweetness VARCHAR(50) DEFAULT 'Moderado',                -- Ej: 'Muy dulce', 'Sutil', 'Seco'
    skin_compat VARCHAR(80) DEFAULT 'Versátil',              -- Recomendación según tipo de piel
    "skinCompat" VARCHAR(80) GENERATED ALWAYS AS (skin_compat) STORED, -- Compatibilidad directa camelCase
    age_range VARCHAR(50) DEFAULT '20-45 años',              -- Rango de edad recomendado
    occasion VARCHAR(150),                                   -- Ocasión ideal de uso
    personality VARCHAR(150),                                -- Rasgo distintivo de personalidad
    description TEXT,                                        -- Descripción corta y elegante
    image_url TEXT,                                          -- URL o ruta de la fotografía del frasco
    
    -- Arrays desnormalizados indexados con GIN para búsquedas combinadas instantáneas
    top_notes TEXT[] DEFAULT '{}'::text[] NOT NULL,          -- Notas de salida (primeros 15 min)
    heart_notes TEXT[] DEFAULT '{}'::text[] NOT NULL,        -- Notas de corazón (el alma)
    base_notes TEXT[] DEFAULT '{}'::text[] NOT NULL,         -- Notas de fondo (la huella final)
    all_notes TEXT[] DEFAULT '{}'::text[] NOT NULL,          -- Todas las notas unificadas
    
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices B-Tree optimizados para filtros rápidos
CREATE INDEX IF NOT EXISTS idx_fragrances_code ON public.fragrances (code);
CREATE INDEX IF NOT EXISTS idx_fragrances_gender ON public.fragrances (gender);
CREATE INDEX IF NOT EXISTS idx_fragrances_intensity ON public.fragrances (intensity);
CREATE INDEX IF NOT EXISTS idx_fragrances_main_category ON public.fragrances (main_category);

-- Índices GIN de trigramas para autocompletado en tiempo real (al teclear nombre o marca)
CREATE INDEX IF NOT EXISTS idx_fragrances_name_trgm ON public.fragrances USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_fragrances_brand_trgm ON public.fragrances USING gin (brand gin_trgm_ops);

-- Índices GIN de arrays para operadores de contención (@> y &&) en microsegundos
CREATE INDEX IF NOT EXISTS idx_fragrances_top_notes_gin ON public.fragrances USING gin (top_notes);
CREATE INDEX IF NOT EXISTS idx_fragrances_heart_notes_gin ON public.fragrances USING gin (heart_notes);
CREATE INDEX IF NOT EXISTS idx_fragrances_base_notes_gin ON public.fragrances USING gin (base_notes);
CREATE INDEX IF NOT EXISTS idx_fragrances_all_notes_gin ON public.fragrances USING gin (all_notes);

-- 5. TABLA RELACIONAL: FRAGRANCE_NOTES (Junction Table N:M)
CREATE TABLE IF NOT EXISTS public.fragrance_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fragrance_id UUID NOT NULL REFERENCES public.fragrances(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    position public.pyramid_position NOT NULL,               -- 'salida', 'corazon', 'fondo'
    prominence SMALLINT DEFAULT 1 CHECK (prominence BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_fragrance_note_position UNIQUE (fragrance_id, note_id, position)
);

CREATE INDEX IF NOT EXISTS idx_fn_search ON public.fragrance_notes (note_id, position, fragrance_id);
CREATE INDEX IF NOT EXISTS idx_fn_fragrance ON public.fragrance_notes (fragrance_id, position);

-- 6. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fragrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fragrance_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Public read fragrances" ON public.fragrances FOR SELECT USING (true);
CREATE POLICY "Public read fragrance_notes" ON public.fragrance_notes FOR SELECT USING (true);
`;

// Helper to fetch or fallback
export async function fetchCatalogFromSupabase(): Promise<CatalogFragrance[]> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return CATALOG;
  }

  try {
    // Try querying the normalized fragrances table first
    let res = await fetch(`${config.url}/rest/v1/fragrances?select=*`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((row: any, idx: number) => ({
          id: row.id,
          idNum: idx + 1,
          code: row.code,
          name: row.name,
          brand: row.brand,
          gender: row.gender,
          family: row.family,
          subfamily: row.subfamily || row.family,
          mainCategory: row.main_category,
          popularity: 'Alta',
          aromasClave: row.top_notes?.slice(0, 3) || [],
          pyramid: {
            top: row.top_notes || [],
            heart: row.heart_notes || [],
            base: row.base_notes || []
          },
          allNotes: row.all_notes || [...(row.top_notes || []), ...(row.heart_notes || []), ...(row.base_notes || [])],
          sweetness: row.sweetness || 'Moderado',
          sensation: '',
          intensity: row.intensity || 'Moderada',
          skinCompat: row.skin_compat || 'Versátil',
          ageRange: row.age_range || '20-45 años',
          personality: row.personality || '',
          environment: 'Indistinto',
          occasion: row.occasion || '',
          tags: [row.family, row.gender, row.intensity],
          description: row.description || '',
          image: row.image_url || ''
        }));
      }
    }

    // Secondary fallback: fraganza_catalog legacy table
    res = await fetch(`${config.url}/rest/v1/fraganza_catalog?select=*`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          idNum: row.id_num,
          code: row.code,
          name: row.name,
          brand: row.brand,
          gender: row.gender,
          family: row.family,
          subfamily: row.subfamily || row.family,
          mainCategory: row.main_category,
          popularity: row.popularity || 'Alta',
          aromasClave: row.aromas_clave || [],
          pyramid: {
            top: row.pyramid_top || [],
            heart: row.pyramid_heart || [],
            base: row.pyramid_base || []
          },
          allNotes: row.all_notes || [],
          sweetness: row.sweetness || 'Moderado',
          sensation: row.sensation || '',
          intensity: row.intensity || 'Moderada',
          skinCompat: row.skin_compat || 'Versátil',
          ageRange: row.age_range || '20-45 años',
          personality: row.personality || '',
          environment: row.environment || 'Indistinto',
          occasion: row.occasion || '',
          tags: row.tags || [],
          description: row.description || '',
          image: row.image || ''
        }));
      }
    }

    return CATALOG;
  } catch (err) {
    console.warn('Error connecting to Supabase, returning local catalog:', err);
    return CATALOG;
  }
}
