import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, SUPABASE_SQL_SCHEMA } from '../services/supabase';
import { CATALOG, CatalogFragrance } from '../data/fraganzaCatalog';
import { getPerfumeBottlePhoto } from '../data/fragranceVisuals';
import { getCustomizedFragrance, saveAdminFragranceUpdate, getCustomizedCatalog } from '../services/catalogStore';
import {
  Database,
  X,
  Copy,
  Check,
  Download,
  Server,
  FileCode,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  BookOpen,
  Send,
  Camera,
  Upload,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';

interface SupabaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDrawer: React.FC<SupabaseDrawerProps> = ({ isOpen, onClose }) => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedInsert, setCopiedInsert] = useState(false);
  const [copiedUpdate, setCopiedUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit_existing' | 'tutorial' | 'add_colonia' | 'schema' | 'architecture'>('edit_existing');
  const config = getSupabaseConfig();

  // State for Editing Existing Perfume (Identification, Photo & Notes)
  const [selectedFragranceCode, setSelectedFragranceCode] = useState<string>('D-001');
  const [editName, setEditName] = useState<string>('');
  const [editCode, setEditCode] = useState<string>('');
  const [editBrand, setEditBrand] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState<string>('');
  const [editTopNotes, setEditTopNotes] = useState<string>('');
  const [editHeartNotes, setEditHeartNotes] = useState<string>('');
  const [editBaseNotes, setEditBaseNotes] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string | null>(null);

  // Form state for adding new perfume
  const [formCode, setFormCode] = useState('C-075');
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formGender, setFormGender] = useState<'Caballero' | 'Dama' | 'Unisex'>('Caballero');
  const [formFamily, setFormFamily] = useState('Amaderada');
  const [formSubfamily, setFormSubfamily] = useState('Oriental Amaderada');
  const [formMainCat, setFormMainCat] = useState<'Floral' | 'Dulce / Acaramelado' | 'Cítrico / Acuático' | 'Amaderado / Oriental'>('Amaderado / Oriental');
  const [formIntensity, setFormIntensity] = useState<'Suave' | 'Moderada' | 'Intensa' | 'Envolvente'>('Intensa');
  const [formTopNotes, setFormTopNotes] = useState('Bergamota, Pimienta Rosa, Cardamomo');
  const [formHeartNotes, setFormHeartNotes] = useState('Iris, Lavanda, Ámbar');
  const [formBaseNotes, setFormBaseNotes] = useState('Cedro, Vainilla, Cuero');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80');
  const [insertStatus, setInsertStatus] = useState<string | null>(null);

  // Sync edit form with selected fragrance
  useEffect(() => {
    const f = getCustomizedFragrance(selectedFragranceCode);
    if (f) {
      setEditName(f.name || '');
      setEditCode(f.code || selectedFragranceCode);
      setEditBrand(f.brand || '');
      setEditImageUrl(f.image || '');
      setEditTopNotes((f.pyramid.top || []).join(', '));
      setEditHeartNotes((f.pyramid.heart || []).join(', '));
      setEditBaseNotes((f.pyramid.base || []).join(', '));
      setEditDescription(f.description || '');
      setEditStatus(null);
    }
  }, [selectedFragranceCode, isOpen]);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDownloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    handleDownloadFile(
      'fraganza_catalog_207_perfumes.json',
      JSON.stringify(getCustomizedCatalog(), null, 2),
      'application/json'
    );
  };

  const handleDownloadSchemaSQL = () => {
    handleDownloadFile('fraganza_supabase_schema.sql', SUPABASE_SQL_SCHEMA, 'text/plain');
  };

  const generatedSQLInsert = `INSERT INTO public.fragrances (
    code, name, brand, gender, family, subfamily, main_category, intensity, 
    top_notes, heart_notes, base_notes, all_notes, description, image_url
) VALUES (
    '${formCode}',
    '${formName.replace(/'/g, "''") || 'Nuevo Perfume'}',
    '${formBrand.replace(/'/g, "''") || 'Marca'}',
    '${formGender}'::public.gender_type,
    '${formFamily}',
    '${formSubfamily}',
    '${formMainCat}'::public.main_category_type,
    '${formIntensity}'::public.intensity_level,
    '{${formTopNotes.split(',').map(s => `"${s.trim()}"`).join(',')}}'::text[],
    '{${formHeartNotes.split(',').map(s => `"${s.trim()}"`).join(',')}}'::text[],
    '{${formBaseNotes.split(',').map(s => `"${s.trim()}"`).join(',')}}'::text[],
    '{${[...formTopNotes.split(','), ...formHeartNotes.split(','), ...formBaseNotes.split(',')].map(s => `"${s.trim()}"`).join(',')}}'::text[],
    '${formDescription.replace(/'/g, "''") || 'Descripción sensorial del perfume.'}',
    '${formImageUrl}'
);`;

  const handleCopyInsert = () => {
    navigator.clipboard.writeText(generatedSQLInsert);
    setCopiedInsert(true);
    setTimeout(() => setCopiedInsert(false), 2000);
  };

  const handleSaveColonia = async () => {
    if (!formName.trim() || !formBrand.trim()) {
      alert('Por favor ingresa al menos el Nombre y la Marca del perfume.');
      return;
    }

    if (config.isConfigured) {
      setInsertStatus('Guardando en Supabase...');
      try {
        const payload = {
          code: formCode,
          name: formName,
          brand: formBrand,
          gender: formGender,
          family: formFamily,
          subfamily: formSubfamily,
          main_category: formMainCat,
          intensity: formIntensity,
          top_notes: formTopNotes.split(',').map(s => s.trim()),
          heart_notes: formHeartNotes.split(',').map(s => s.trim()),
          base_notes: formBaseNotes.split(',').map(s => s.trim()),
          all_notes: [...formTopNotes.split(','), ...formHeartNotes.split(','), ...formBaseNotes.split(',')].map(s => s.trim()),
          description: formDescription,
          image_url: formImageUrl
        };

        const res = await fetch(`${config.url}/rest/v1/fragrances`, {
          method: 'POST',
          headers: {
            'apikey': config.anonKey,
            'Authorization': `Bearer ${config.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setInsertStatus('¡Perfume guardado exitosamente en tu base de datos Supabase!');
        } else {
          setInsertStatus(`Error al guardar en Supabase: ${res.statusText}. Puedes usar el comando SQL generado abajo.`);
        }
      } catch (err) {
        setInsertStatus('Error de conexión con Supabase. Usa el comando SQL generado abajo.');
      }
    } else {
      setInsertStatus('Supabase no está configurado en .env. Puedes copiar el comando SQL abajo y pegarlo en app.supabase.com');
    }
  };

  const catalogList = getCustomizedCatalog();
  const currentEditFragrance = getCustomizedFragrance(selectedFragranceCode);

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveExistingFragrance = async () => {
    const cleanArray = (str: string) =>
      str.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const top = cleanArray(editTopNotes);
    const heart = cleanArray(editHeartNotes);
    const base = cleanArray(editBaseNotes);
    const all = Array.from(new Set([...top, ...heart, ...base]));

    saveAdminFragranceUpdate(selectedFragranceCode, {
      name: editName.trim() || undefined,
      code: editCode.trim() || undefined,
      brand: editBrand.trim() || undefined,
      image: editImageUrl.trim() || undefined,
      pyramid: { top, heart, base },
      allNotes: all,
      description: editDescription.trim() || undefined,
    });

    if (config.isConfigured) {
      try {
        const payload: any = {
          name: editName.trim() || undefined,
          code: editCode.trim() || undefined,
          brand: editBrand.trim() || undefined,
          top_notes: top,
          heart_notes: heart,
          base_notes: base,
          all_notes: all,
          description: editDescription.trim() || undefined,
        };
        if (editImageUrl.trim()) {
          payload.image_url = editImageUrl.trim();
        }
        await fetch(`${config.url}/rest/v1/fragrances?code=eq.${selectedFragranceCode}`, {
          method: 'PATCH',
          headers: {
            apikey: config.anonKey,
            Authorization: `Bearer ${config.anonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('Could not patch Supabase directly:', e);
      }
    }

    setEditStatus(`¡Nombre, casa, código y notas del perfume ${editName || selectedFragranceCode} guardados con éxito en la subbase y en toda la web!`);
    setTimeout(() => setEditStatus(null), 3500);
  };

  const generatedSQLUpdate = `UPDATE public.fragrances
SET 
  name = '${editName.replace(/'/g, "''")}',
  brand = '${editBrand.replace(/'/g, "''")}',
  code = '${editCode.replace(/'/g, "''")}',
  image_url = '${editImageUrl || (currentEditFragrance ? getPerfumeBottlePhoto(currentEditFragrance.name, currentEditFragrance.gender, currentEditFragrance.image, currentEditFragrance.code) : '')}',
  top_notes = '{${editTopNotes.split(',').map((s) => `"${s.trim()}"`).filter(Boolean).join(',')}}'::text[],
  heart_notes = '{${editHeartNotes.split(',').map((s) => `"${s.trim()}"`).filter(Boolean).join(',')}}'::text[],
  base_notes = '{${editBaseNotes.split(',').map((s) => `"${s.trim()}"`).filter(Boolean).join(',')}}'::text[],
  all_notes = '{${[...editTopNotes.split(','), ...editHeartNotes.split(','), ...editBaseNotes.split(',')].map((s) => `"${s.trim()}"`).filter(Boolean).join(',')}}'::text[]
WHERE code = '${selectedFragranceCode}';`;

  const handleCopyUpdate = () => {
    navigator.clipboard.writeText(generatedSQLUpdate);
    setCopiedUpdate(true);
    setTimeout(() => setCopiedUpdate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#0e0e0e] border border-[#C9A84C]/40 rounded-3xl shadow-2xl p-5 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 bg-black rounded-full border border-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#F0D080]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
              Gestor de Base de Datos Supabase (Fraganza)
            </h3>
            <p className="text-xs text-stone-400">
              Acceso a tu panel, tutorial para añadir colonias nuevas y esquema relacional
            </p>
          </div>
        </div>

        {/* Status card */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-stone-800 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C9A84C]" /> Estado de Conexión:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                config.isConfigured
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              {config.isConfigured ? 'Conectado en Vivo a Supabase' : 'Catálogo Local Activo (207 Perfumes)'}
            </span>
          </div>
          <p className="text-xs text-stone-300">
            {config.isConfigured
              ? `Conectado al proyecto: ${config.url}`
              : 'La aplicación opera con los 207 perfumes del catálogo base en memoria. Para conectar tu base de datos de producción, añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-2">
          <button
            onClick={() => setActiveTab('edit_existing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'edit_existing'
                ? 'bg-[#C9A84C] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Colocar Fotos & Notas (Catálogo)</span>
          </button>

          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tutorial'
                ? 'bg-[#C9A84C] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tutorial: ¿Cómo acceder a Supabase?</span>
          </button>

          <button
            onClick={() => setActiveTab('add_colonia')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'add_colonia'
                ? 'bg-[#C9A84C] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Agregar Nueva Colonia (Formulario)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-[#C9A84C] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Script SQL (schema.sql)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-[#C9A84C] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Estructura de Tablas</span>
          </button>
        </div>

        {/* TAB: COLOCAR FOTOS Y NOTAS (ADMINISTRADOR) */}
        {activeTab === 'edit_existing' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-1">
              <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#F0D080]" />
                <span>Gestor de Fotos Reales y Notas para Perfumes Existentes</span>
              </h4>
              <p className="text-xs text-stone-400">
                Selecciona cualquier perfume del catálogo para subir su foto real y editar las notas de su pirámide olfativa. Los cambios se sincronizan en vivo y generan el comando de actualización para Supabase.
              </p>
            </div>

            {/* Perfume Selector */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-stone-800 space-y-2">
              <label className="text-xs font-semibold text-[#F0D080] block">
                Selecciona la Fragancia a Modificar:
              </label>
              <select
                value={selectedFragranceCode}
                onChange={(e) => setSelectedFragranceCode(e.target.value)}
                className="w-full bg-black/80 border border-stone-700 text-stone-100 rounded-xl p-3 text-xs focus:border-[#C9A84C] focus:outline-none"
              >
                {catalogList.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.code} - {f.name} ({f.brand} · {f.gender})
                  </option>
                ))}
              </select>
            </div>

            {currentEditFragrance && (
              <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-5">
                {/* Perfume Identification (Name, Original House/Brand, Code) */}
                <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#F0D080]" />
                    <span className="text-xs font-bold text-stone-200">
                      Identificación Oficial (Nombre, Casa Perfumera y Código)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Fraganza es la tienda que los distribuye. Aquí puedes cambiar el nombre real del perfume (ej. <span className="text-stone-300">Nitro Intense</span>), la casa que lo originó (ej. <span className="text-[#F0D080]">Dumont</span>, <span className="text-[#F0D080]">Dior</span>, <span className="text-[#F0D080]">Creed</span>) y el código.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-[#F0D080] font-semibold block mb-1">
                        Nombre de la Fragancia:
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Ej. Nitro Intense"
                        className="w-full bg-black/80 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#F0D080] font-semibold block mb-1">
                        Casa Perfumera / Creador:
                      </label>
                      <input
                        type="text"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        placeholder="Ej. Dumont, Carolina Herrera, Creed"
                        className="w-full bg-black/80 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#F0D080] font-semibold block mb-1">
                        Código Fraganza:
                      </label>
                      <input
                        type="text"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        placeholder="Ej. C-015, D-008"
                        className="w-full bg-black/80 border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-100 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Upload & Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-black border border-[#C9A84C]/40 p-2 flex items-center justify-center">
                    <img
                      src={
                        editImageUrl ||
                        getPerfumeBottlePhoto(
                          currentEditFragrance.name,
                          currentEditFragrance.gender,
                          currentEditFragrance.image,
                          currentEditFragrance.code
                        )
                      }
                      alt={currentEditFragrance.name}
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 text-[9px] text-stone-300 py-0.5 text-center rounded font-mono">
                      Foto Actual
                    </span>
                  </div>

                  <div className="sm:col-span-8 space-y-3">
                    <div>
                      <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                        Subir foto real desde tu dispositivo:
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-[#C9A84C] text-xs text-stone-200 hover:text-white transition w-full justify-center">
                        <Upload className="w-4 h-4 text-[#F0D080]" />
                        <span>Elegir Foto Real (PNG, JPG, WEBP)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                        O ingresar URL directa de la fotografía:
                      </label>
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/foto-real.jpg"
                        className="w-full bg-black/80 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes editing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div>
                    <label className="text-[#F0D080] font-semibold block mb-1">
                      Salida (Top Notes):
                    </label>
                    <input
                      type="text"
                      value={editTopNotes}
                      onChange={(e) => setEditTopNotes(e.target.value)}
                      placeholder="Bergamota, Mandarina"
                      className="w-full bg-black/80 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-rose-300 font-semibold block mb-1">
                      Corazón (Heart Notes):
                    </label>
                    <input
                      type="text"
                      value={editHeartNotes}
                      onChange={(e) => setEditHeartNotes(e.target.value)}
                      placeholder="Rosa, Jazmín"
                      className="w-full bg-black/80 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-amber-300 font-semibold block mb-1">
                      Fondo (Base Notes):
                    </label>
                    <input
                      type="text"
                      value={editBaseNotes}
                      onChange={(e) => setEditBaseNotes(e.target.value)}
                      placeholder="Vainilla, Ámbar"
                      className="w-full bg-black/80 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-xs">
                  <label className="text-stone-300 font-semibold block">
                    Descripción Sensorial Puntual:
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-black/80 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none resize-none"
                  />
                </div>

                {/* Save button & Status */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveExistingFragrance}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Foto & Notas ({selectedFragranceCode})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyUpdate}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#F0D080]" />
                    <span>{copiedUpdate ? '¡SQL Copiado!' : 'Copiar Comando SQL para Supabase'}</span>
                  </button>
                </div>

                {editStatus && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{editStatus}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: TUTORIAL PASO A PASO */}
        {activeTab === 'tutorial' && (
          <div className="space-y-4 text-xs text-stone-300 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-3">
              <h4 className="text-sm font-bold font-serif-luxury text-[#F0D080] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Paso a Paso para Administrar tus Perfumes en Supabase</span>
              </h4>
              <p className="leading-relaxed">
                Supabase te proporciona una base de datos PostgreSQL en la nube con una interfaz visual similar a Excel y una consola SQL. Sigue estos 4 pasos para gestionar o agregar colonias nuevas:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] font-mono font-bold text-[10px]">
                    PASO 1
                  </span>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#C9A84C] hover:underline flex items-center gap-1"
                  >
                    <span>Ir a Supabase</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h5 className="font-bold text-stone-100 text-sm">Entrar a tu Dashboard</h5>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Ingresa en <strong className="text-stone-200">supabase.com/dashboard</strong> e inicia sesión con tu cuenta de GitHub o tu correo institucional (<code>mariacamila.jaimes@unet.edu.ve</code>). Selecciona o crea tu proyecto "Fraganza".
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-stone-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] font-mono font-bold text-[10px]">
                  PASO 2
                </span>
                <h5 className="font-bold text-stone-100 text-sm">Crear las Tablas con el SQL Editor</h5>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  En el menú lateral izquierdo de Supabase, haz clic en el icono <strong>SQL Editor (&gt;_)</strong>. Pega el contenido de la pestaña <strong>"Script SQL (schema.sql)"</strong> y pulsa el botón verde <strong>"Run"</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-stone-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] font-mono font-bold text-[10px]">
                  PASO 3
                </span>
                <h5 className="font-bold text-stone-100 text-sm">Agregar Colonias en el Table Editor</h5>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  En la barra lateral izquierda, abre el <strong>Table Editor</strong> (icono de tabla) y haz clic sobre la tabla <code>fragrances</code>. Verás todas las filas. Para agregar una colonia nueva, haz clic en <strong>"Insert row"</strong>, escribe los datos y guarda.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-stone-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] font-mono font-bold text-[10px]">
                  PASO 4
                </span>
                <h5 className="font-bold text-stone-100 text-sm">Vincular con tu Página Web</h5>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  En Supabase ve a <strong>Project Settings &gt; API</strong>. Copia la <code>URL</code> y la <code>anon public key</code>. Añádelas en el archivo <code>.env</code> de tu app para que la web lea y escriba en vivo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULARIO AGREGAR COLONIA */}
        {activeTab === 'add_colonia' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-1">
              <h4 className="text-sm font-bold text-stone-100">
                Formulario de Nueva Fragancia para Catálogo
              </h4>
              <p className="text-xs text-stone-400">
                Rellena los datos para generar el comando SQL o insertarlo directamente si Supabase está conectado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-stone-400 font-semibold block mb-1">Código del Catálogo</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Ej: C-075, D-106, U-029"
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 font-semibold block mb-1">Nombre del Perfume</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Grand Soir, Hacivat, Delina Exclusif"
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 font-semibold block mb-1">Marca / Diseñador</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="Ej: Maison Francis Kurkdjian, Nishane"
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 font-semibold block mb-1">Género</label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as any)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                >
                  <option value="Caballero">Caballero</option>
                  <option value="Dama">Dama</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 font-semibold block mb-1">Familia Principal</label>
                <select
                  value={formMainCat}
                  onChange={(e) => setFormMainCat(e.target.value as any)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                >
                  <option value="Amaderado / Oriental">Amaderado / Oriental</option>
                  <option value="Dulce / Acaramelado">Dulce / Acaramelado</option>
                  <option value="Cítrico / Acuático">Cítrico / Acuático</option>
                  <option value="Floral">Floral</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 font-semibold block mb-1">Intensidad</label>
                <select
                  value={formIntensity}
                  onChange={(e) => setFormIntensity(e.target.value as any)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                >
                  <option value="Suave">Suave</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Intensa">Intensa</option>
                  <option value="Envolvente">Envolvente</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-stone-400 font-semibold block mb-1">
                  Notas de Salida (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formTopNotes}
                  onChange={(e) => setFormTopNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-stone-400 font-semibold block mb-1">
                  Notas de Corazón (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formHeartNotes}
                  onChange={(e) => setFormHeartNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-stone-400 font-semibold block mb-1">
                  Notas de Fondo (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formBaseNotes}
                  onChange={(e) => setFormBaseNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-stone-400 font-semibold block mb-1">
                  Descripción Sensorial (¿A qué huele?)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ej: Perfume amaderado oriental con estela opulenta de ámbar cálido y vainilla dorada..."
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-stone-400 font-semibold block mb-1">URL de la Foto del Frasco</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:border-[#C9A84C] focus:outline-none text-xs"
                />
              </div>
            </div>

            {insertStatus && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs">
                {insertStatus}
              </div>
            )}

            {/* Actions & Generated SQL */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveColonia}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs shadow-lg hover:brightness-110 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Guardar en Supabase</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInsert}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors flex items-center gap-1.5 border border-stone-700"
              >
                {copiedInsert ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#C9A84C]" />}
                <span>{copiedInsert ? '¡Copiado!' : 'Copiar Sentencia SQL (INSERT)'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-black border border-stone-800 p-3 font-mono text-[11px] text-stone-400 overflow-x-auto max-h-36">
              <pre>{generatedSQLInsert}</pre>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEMA SQL */}
        {activeTab === 'schema' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-widest text-[#F0D080] font-bold">
                Ejecutar en Supabase SQL Editor
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSchemaSQL}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Descargar schema.sql</span>
                </button>
                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 rounded-lg bg-[#C9A84C] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-[#F0D080] transition-colors"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
            </div>
            <div className="relative rounded-2xl bg-black border border-stone-800 p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-64">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#F0D080] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>1. fragrances</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Catálogo maestro de 207 perfumes. Contiene código único, nombre, marca, género, familia, subfamilia, intensidad y arrays desnormalizados GIN-indexados (<code className="text-stone-300">top_notes</code>, <code className="text-stone-300">heart_notes</code>, <code className="text-stone-300">base_notes</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#F0D080] font-bold">
                <Search className="w-4 h-4" />
                <span>2. notes</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Catálogo canónico de las 247 notas olfativas para el buscador visual de notas. Incluye trigramas (<code className="text-stone-300">pg_trgm</code>) para autocompletar al instante mientras el usuario escribe.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#F0D080] font-bold">
                <Layers className="w-4 h-4" />
                <span>3. fragrance_notes</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Tabla de unión N:M que enlaza cada perfume con sus notas exactas y su posición en la pirámide olfativa (<code className="text-stone-300">'salida'</code>, <code className="text-stone-300">'corazon'</code>, <code className="text-stone-300">'fondo'</code>).
              </p>
            </div>
          </div>
        )}

        {/* Export JSON dataset */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4 className="text-sm font-bold text-stone-200">
              Exportar los 207 Perfumes de Fraganza (JSON)
            </h4>
            <p className="text-xs text-stone-400">
              Descarga el archivo completo estructurado con las pirámides y familias para importar en cualquier base de datos.
            </p>
          </div>
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-[#C9A84C] hover:text-stone-950 text-stone-200 font-bold text-xs transition-all flex items-center gap-2 border border-stone-700"
          >
            <Download className="w-4 h-4" />
            <span>Descargar JSON</span>
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
