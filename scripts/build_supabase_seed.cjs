const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/data/fraganzaCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Helper to sanitize SQL strings
function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const items = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
  return `'{${items}}'::text[]`;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Map note category based on note name
function guessNoteCategory(note) {
  const n = note.toLowerCase();
  if (/bergamota|limón|naranja|mandarina|pomelo|cítric|toronja|lima|yuzu|neroli/.test(n)) return 'Cítrica';
  if (/rosa|jazmín|lavanda|peonía|iris|azahar|violeta|orquídea|geranio|tuberosa|fresia|ylang|clavel|magnolia|nardo/.test(n)) return 'Floral';
  if (/cedro|sándalo|oud|vetiver|pachulí|madera|guayaco|ciprés|enebro|abedul/.test(n)) return 'Amaderada';
  if (/vainilla|caramelo|tonka|chocolate|cacao|café|miel|praliné|azúcar|algodón|crema|malvavisco/.test(n)) return 'Gourmand / Dulce';
  if (/ámbar|incienso|mirra|benjuí|resina|ládano|opopónaco/.test(n)) return 'Oriental / Resinosa';
  if (/pimienta|canela|cardamomo|nuez moscada|clavo|jengibre|azafrán|anís|comino/.test(n)) return 'Especiada';
  if (/marina|acuátic|brisa|sal|ozono|algas|agua/.test(n)) return 'Marina / Acuática';
  if (/manzana|pera|durazno|frutos|baya|frambuesa|grosella|ciruela|higo|piña|coco|maracuyá|mango/.test(n)) return 'Frutal';
  if (/cuero|gamuza|ante/.test(n)) return 'Cuero';
  if (/almizcle|musk|almáciga|ámbar gris/.test(n)) return 'Almizclada';
  if (/menta|albahaca|salvia|romero|tomillo|eucalipto|té|verde/.test(n)) return 'Verde / Aromática';
  if (/tabaco/.test(n)) return 'Tabaco';
  return 'Aromática';
}

// 1. Gather all unique notes
const notesMap = new Map();
catalog.forEach(f => {
  const top = f.pyramid?.top || [];
  const heart = f.pyramid?.heart || [];
  const base = f.pyramid?.base || [];
  [...top, ...heart, ...base].forEach(n => {
    const trimmed = n.trim();
    if (trimmed && !notesMap.has(trimmed.toLowerCase())) {
      notesMap.set(trimmed.toLowerCase(), {
        name: trimmed,
        slug: slugify(trimmed),
        category: guessNoteCategory(trimmed)
      });
    }
  });
});

console.log(`Found ${notesMap.size} unique olfactory notes.`);

// Generate schema.sql
const schemaSql = `-- ==============================================================================
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

-- 3. TABLA: NOTES (Catálogo canónico de notas olfativas)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(60) NOT NULL DEFAULT 'Aromática',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para NOTES
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

-- Índices B-Tree optimizados para filtros de alta frecuencia
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

-- Índices compuestos para cruces N:M ultrarrápidos
CREATE INDEX IF NOT EXISTS idx_fn_search ON public.fragrance_notes (note_id, position, fragrance_id);
CREATE INDEX IF NOT EXISTS idx_fn_fragrance ON public.fragrance_notes (fragrance_id, position);

-- 6. VISTA COMPLETA DE DETALLE DE FRAGANCIAS
CREATE OR REPLACE VIEW public.v_fragrance_details AS
SELECT 
    f.id,
    f.code,
    f.name,
    f.brand,
    f.gender,
    f.family,
    f.subfamily,
    f.main_category,
    f.intensity,
    f.sweetness,
    f.skin_compat,
    f.age_range,
    f.occasion,
    f.personality,
    f.description,
    f.image_url,
    f.top_notes,
    f.heart_notes,
    f.base_notes,
    f.all_notes,
    (
        SELECT COALESCE(json_agg(
            json_build_object(
                'note_id', n.id,
                'name', n.name,
                'slug', n.slug,
                'category', n.category,
                'position', fn.position
            ) ORDER BY fn.position, n.name
        ), '[]'::json)
        FROM public.fragrance_notes fn
        JOIN public.notes n ON n.id = fn.note_id
        WHERE fn.fragrance_id = f.id
    ) AS detailed_notes
FROM public.fragrances f;

-- 7. FUNCIÓN RPC: BUSCADOR AVANZADO POR NOTAS CON INCLUSIÓN / EXCLUSIÓN (Estilo Fragrantica)
CREATE OR REPLACE FUNCTION public.search_fragrances_by_notes(
    p_included_note_names TEXT[] DEFAULT '{}'::text[],
    p_excluded_note_names TEXT[] DEFAULT '{}'::text[],
    p_position TEXT DEFAULT NULL,                -- 'salida', 'corazon', 'fondo' o NULL (cualquiera)
    p_gender public.gender_type DEFAULT NULL,    -- 'Dama', 'Caballero', 'Unisex' o NULL
    p_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
    id UUID,
    code VARCHAR(20),
    name VARCHAR(150),
    brand VARCHAR(120),
    gender public.gender_type,
    family VARCHAR(100),
    main_category public.main_category_type,
    intensity public.intensity_level,
    image_url TEXT,
    matching_notes TEXT[],
    match_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH candidate_matches AS (
        SELECT 
            f.id,
            f.code,
            f.name,
            f.brand,
            f.gender,
            f.family,
            f.main_category,
            f.intensity,
            f.image_url,
            ARRAY(
                SELECT elem FROM unnest(
                    CASE 
                        WHEN p_position = 'salida' THEN f.top_notes
                        WHEN p_position = 'corazon' THEN f.heart_notes
                        WHEN p_position = 'fondo' THEN f.base_notes
                        ELSE f.all_notes
                    END
                ) elem
                WHERE elem = ANY(p_included_note_names)
            ) AS matched_notes_array
        FROM public.fragrances f
        WHERE 
            -- Filtro de género opcional
            (p_gender IS NULL OR f.gender = p_gender)
            -- Exclusión estricta: ninguna fragancia que contenga alguna nota excluida
            AND (
                cardinality(p_excluded_note_names) = 0 
                OR NOT (f.all_notes && p_excluded_note_names)
            )
            -- Inclusión: debe contener al menos 1 nota de las requeridas si se pasaron notas
            AND (
                cardinality(p_included_note_names) = 0
                OR (
                    CASE 
                        WHEN p_position = 'salida' THEN f.top_notes && p_included_note_names
                        WHEN p_position = 'corazon' THEN f.heart_notes && p_included_note_names
                        WHEN p_position = 'fondo' THEN f.base_notes && p_included_note_names
                        ELSE f.all_notes && p_included_note_names
                    END
                )
            )
    )
    SELECT 
        cm.id,
        cm.code,
        cm.name,
        cm.brand,
        cm.gender,
        cm.family,
        cm.main_category,
        cm.intensity,
        cm.image_url,
        cm.matched_notes_array AS matching_notes,
        cardinality(cm.matched_notes_array) AS match_count
    FROM candidate_matches cm
    ORDER BY match_count DESC, cm.name ASC
    LIMIT p_limit;
END;
$$;

-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fragrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fragrance_notes ENABLE ROW LEVEL SECURITY;

-- Acceso público de sólo lectura (cualquier visitante puede consultar perfumes y notas)
CREATE POLICY "Public read notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Public read fragrances" ON public.fragrances FOR SELECT USING (true);
CREATE POLICY "Public read fragrance_notes" ON public.fragrance_notes FOR SELECT USING (true);

-- Trigger para actualizar columna updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fragrances_updated_at ON public.fragrances;
CREATE TRIGGER trg_fragrances_updated_at
BEFORE UPDATE ON public.fragrances
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
`;

// Now create the seed script SQL
let seedSql = `-- ==============================================================================
-- FRAGANZA - DATOS INICIALES (SEED): 207 PERFUMES Y 247 NOTAS OLFATIVAS
-- ==============================================================================

-- 1. INSERTAR NOTAS OLFATIVAS
INSERT INTO public.notes (name, slug, category) VALUES
`;

const notesValues = [];
for (const [_, note] of notesMap.entries()) {
  notesValues.push(`(${esc(note.name)}, ${esc(note.slug)}, ${esc(note.category)})`);
}
seedSql += notesValues.join(',\n') + '\nON CONFLICT (slug) DO NOTHING;\n\n';

// 2. INSERTAR FRAGANCIAS
seedSql += `-- 2. INSERTAR LAS 207 FRAGANCIAS OFICIALES DE FRAGANZA\nINSERT INTO public.fragrances (code, name, brand, gender, family, subfamily, main_category, intensity, sweetness, skin_compat, age_range, occasion, personality, description, image_url, top_notes, heart_notes, base_notes, all_notes) VALUES\n`;

const fragranceValues = [];
catalog.forEach(f => {
  const top = f.pyramid?.top || [];
  const heart = f.pyramid?.heart || [];
  const base = f.pyramid?.base || [];
  const all = f.allNotes || [...top, ...heart, ...base];

  fragranceValues.push(`(
    ${esc(f.code)},
    ${esc(f.name)},
    ${esc(f.brand)},
    ${esc(f.gender)}::public.gender_type,
    ${esc(f.family)},
    ${esc(f.subfamily || f.family)},
    ${esc(f.mainCategory)}::public.main_category_type,
    ${esc(f.intensity || 'Moderada')}::public.intensity_level,
    ${esc(f.sweetness || 'Moderado')},
    ${esc(f.skinCompat || 'Versátil')},
    ${esc(f.ageRange || '20-45 años')},
    ${esc(f.occasion || '')},
    ${esc(f.personality || '')},
    ${esc(f.description || '')},
    ${esc(f.image || '')},
    ${escArray(top)},
    ${escArray(heart)},
    ${escArray(base)},
    ${escArray(all)}
  )`);
});

seedSql += fragranceValues.join(',\n') + '\nON CONFLICT (code) DO NOTHING;\n\n';

// 3. VINCULAR RELACIONES FRAGRANCE_NOTES
seedSql += `-- 3. POBLAR TABLA RELACIONAL 'fragrance_notes' DINÁMICAMENTE\n`;
seedSql += `
DO $$
DECLARE
    f_rec RECORD;
    n_id UUID;
    elem TEXT;
BEGIN
    -- Notas de salida
    FOR f_rec IN SELECT id, top_notes, heart_notes, base_notes FROM public.fragrances LOOP
        -- Salida
        FOREACH elem IN ARRAY f_rec.top_notes LOOP
            SELECT id INTO n_id FROM public.notes WHERE LOWER(name) = LOWER(elem) LIMIT 1;
            IF n_id IS NOT NULL THEN
                INSERT INTO public.fragrance_notes (fragrance_id, note_id, position)
                VALUES (f_rec.id, n_id, 'salida'::public.pyramid_position)
                ON CONFLICT (fragrance_id, note_id, position) DO NOTHING;
            END IF;
        END LOOP;

        -- Corazón
        FOREACH elem IN ARRAY f_rec.heart_notes LOOP
            SELECT id INTO n_id FROM public.notes WHERE LOWER(name) = LOWER(elem) LIMIT 1;
            IF n_id IS NOT NULL THEN
                INSERT INTO public.fragrance_notes (fragrance_id, note_id, position)
                VALUES (f_rec.id, n_id, 'corazon'::public.pyramid_position)
                ON CONFLICT (fragrance_id, note_id, position) DO NOTHING;
            END IF;
        END LOOP;

        -- Fondo
        FOREACH elem IN ARRAY f_rec.base_notes LOOP
            SELECT id INTO n_id FROM public.notes WHERE LOWER(name) = LOWER(elem) LIMIT 1;
            IF n_id IS NOT NULL THEN
                INSERT INTO public.fragrance_notes (fragrance_id, note_id, position)
                VALUES (f_rec.id, n_id, 'fondo'::public.pyramid_position)
                ON CONFLICT (fragrance_id, note_id, position) DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;
`;

// Save files
const targetDir = path.join(__dirname, '../supabase');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'schema.sql'), schemaSql, 'utf8');
fs.writeFileSync(path.join(targetDir, 'seed.sql'), seedSql, 'utf8');

console.log('Successfully generated:');
console.log(' - supabase/schema.sql');
console.log(' - supabase/seed.sql');
