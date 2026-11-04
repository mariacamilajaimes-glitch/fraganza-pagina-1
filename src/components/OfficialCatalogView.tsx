import React, { useState, useMemo, useEffect } from 'react';
import { CatalogFragrance, CATALOG } from '../data/fraganzaCatalog';
import { getPerfumeBottlePhoto, getRealNotePhoto } from '../data/fragranceVisuals';
import { getCustomizedCatalog } from '../services/catalogStore';
import { AdminFragranceEditorModal } from './AdminFragranceEditorModal';
import {
  Search,
  Filter,
  Sparkles,
  Heart,
  ChevronRight,
  SlidersHorizontal,
  X,
  Droplet,
  Layers,
  Flame,
  Check,
  Edit3,
  Camera,
  Lock,
  Scale
} from 'lucide-react';

interface OfficialCatalogViewProps {
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isAdmin?: boolean;
  onRequireAdminAuth?: () => void;
  onAddToCompare?: (fragrance: CatalogFragrance) => void;
  compareListIds?: string[];
}

export type GenderFilter = 'Todos' | 'Dama' | 'Caballero' | 'Unisex';

export const OfficialCatalogView: React.FC<OfficialCatalogViewProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
  isAdmin = false,
  onRequireAdminAuth,
  onAddToCompare,
  compareListIds = [],
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('Todas');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('Todas');
  const [activeNotePopup, setActiveNotePopup] = useState<string | null>(null);

  // Admin edit modal state
  const [editingFragrance, setEditingFragrance] = useState<CatalogFragrance | null>(null);

  // Dynamic catalog containing admin overrides
  const [catalogList, setCatalogList] = useState<CatalogFragrance[]>(() => getCustomizedCatalog());

  useEffect(() => {
    const handleUpdate = () => {
      setCatalogList(getCustomizedCatalog());
    };
    window.addEventListener('fraganza_catalog_updated', handleUpdate);
    return () => window.removeEventListener('fraganza_catalog_updated', handleUpdate);
  }, []);

  // Extract all unique olfactory families
  const allFamilies = useMemo(() => {
    const set = new Set<string>();
    catalogList.forEach((f) => {
      if (f.family) set.add(f.family);
      if (f.subfamily) set.add(f.subfamily);
    });
    return ['Todas', ...Array.from(set).sort()];
  }, [catalogList]);

  // Counts for gender tabs
  const counts = useMemo(() => {
    const total = catalogList.length;
    const dama = catalogList.filter((f) => f.gender === 'Dama').length;
    const caballero = catalogList.filter((f) => f.gender === 'Caballero').length;
    const unisex = catalogList.filter((f) => f.gender === 'Unisex').length;
    return { total, dama, caballero, unisex };
  }, [catalogList]);

  // Filtered fragrances
  const filteredFragrances = useMemo(() => {
    return catalogList.filter((fragrance) => {
      // Gender filter
      if (selectedGender !== 'Todos' && fragrance.gender !== selectedGender) {
        return false;
      }

      // Family filter
      if (selectedFamily !== 'Todas') {
        const matchesFamily =
          fragrance.family.toLowerCase().includes(selectedFamily.toLowerCase()) ||
          (fragrance.subfamily && fragrance.subfamily.toLowerCase().includes(selectedFamily.toLowerCase()));
        if (!matchesFamily) return false;
      }

      // Intensity filter
      if (selectedIntensity !== 'Todas' && fragrance.intensity !== selectedIntensity) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase().trim();
        const matchesCode = fragrance.code.toLowerCase().includes(q);
        const matchesName = fragrance.name.toLowerCase().includes(q);
        const matchesBrand = fragrance.brand.toLowerCase().includes(q);
        const matchesFamily = fragrance.family.toLowerCase().includes(q);
        const matchesNotes = (fragrance.allNotes || []).some((n) => n.toLowerCase().includes(q));
        const matchesSensation = fragrance.sensation?.toLowerCase().includes(q);

        if (!matchesCode && !matchesName && !matchesBrand && !matchesFamily && !matchesNotes && !matchesSensation) {
          return false;
        }
      }

      return true;
    });
  }, [catalogList, selectedGender, selectedFamily, selectedIntensity, searchTerm]);

  const hasActiveFilters =
    selectedGender !== 'Todos' ||
    selectedFamily !== 'Todas' ||
    selectedIntensity !== 'Todas' ||
    searchTerm.trim() !== '';

  const clearAllFilters = () => {
    setSelectedGender('Todos');
    setSelectedFamily('Todas');
    setSelectedIntensity('Todas');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1708] border border-[#C9A84C]/40 text-[#F0D080] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección Oficial Fraganza · {counts.total} Fragancias</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-stone-100 tracking-tight">
            Catálogo General de Fragancias
          </h2>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl break-words whitespace-normal">
            Explora nuestra alta perfumería clasificada por género, familias olfativas, notas de pirámide con fotografías botánicas y frascos auténticos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-stone-300 bg-[#121212] px-4 py-2.5 rounded-2xl border border-stone-800 shadow">
            Mostrando <span className="text-[#F0D080] font-bold font-mono text-sm">{filteredFragrances.length}</span> de {catalogList.length}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:border-stone-500 text-xs text-stone-300 hover:text-white transition flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Notice & Quick Action Banner (Only visible when admin is logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#A07830]/20 via-[#C9A84C]/20 to-[#A07830]/20 border border-[#C9A84C]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C] text-stone-950 flex items-center justify-center font-bold shrink-0">
              <Camera className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F0D080] flex items-center gap-2">
                <span>Modo Administrador Activo</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-semibold">Autorizado</span>
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Para cambiar la foto real o las notas de cualquier fragancia, haz clic en el botón dorado con el icono de cámara en su tarjeta o dentro de su ficha técnica.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GENDER TABS */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-wider text-stone-400 font-bold block">
          Filtrar por Género:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Todos */}
          <button
            type="button"
            onClick={() => setSelectedGender('Todos')}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              selectedGender === 'Todos'
                ? 'bg-gradient-to-br from-[#1e1708] to-[#121212] border-[#C9A84C] text-[#F0D080] shadow-lg shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]/50'
                : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-[#161616]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Ver Todos</span>
              {selectedGender === 'Todos' && <Check className="w-4 h-4 text-[#F0D080]" />}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-serif-luxury text-stone-100">
                {counts.total}
              </span>
              <span className="text-[10px] text-stone-400">Total general</span>
            </div>
          </button>

          {/* Solo Dama */}
          <button
            type="button"
            onClick={() => setSelectedGender('Dama')}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              selectedGender === 'Dama'
                ? 'bg-gradient-to-br from-rose-950/60 to-[#121212] border-rose-500/80 text-rose-200 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-rose-900/60 hover:bg-[#161616]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Solo Dama</span>
              {selectedGender === 'Dama' && <Check className="w-4 h-4 text-rose-300" />}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-serif-luxury text-stone-100">
                {counts.dama}
              </span>
              <span className="text-[10px] text-stone-400">Damas</span>
            </div>
          </button>

          {/* Solo Caballero */}
          <button
            type="button"
            onClick={() => setSelectedGender('Caballero')}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              selectedGender === 'Caballero'
                ? 'bg-gradient-to-br from-blue-950/60 to-[#121212] border-blue-500/80 text-blue-200 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/40'
                : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-blue-900/60 hover:bg-[#161616]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Solo Caballero</span>
              {selectedGender === 'Caballero' && <Check className="w-4 h-4 text-blue-300" />}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-serif-luxury text-stone-100">
                {counts.caballero}
              </span>
              <span className="text-[10px] text-stone-400">Caballeros</span>
            </div>
          </button>

          {/* Solo Unisex */}
          <button
            type="button"
            onClick={() => setSelectedGender('Unisex')}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              selectedGender === 'Unisex'
                ? 'bg-gradient-to-br from-amber-950/60 to-[#121212] border-amber-500/80 text-amber-200 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/40'
                : 'bg-[#121212] border-stone-800 text-stone-300 hover:border-amber-900/60 hover:bg-[#161616]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Solo Unisex</span>
              {selectedGender === 'Unisex' && <Check className="w-4 h-4 text-amber-300" />}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-serif-luxury text-stone-100">
                {counts.unisex}
              </span>
              <span className="text-[10px] text-stone-400">Unisex</span>
            </div>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#101010] border border-stone-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código (D-008, C-015), perfume, marca (Escada, Dior) o nota..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-stone-800 focus:border-[#C9A84C] text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Family Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-black/70 border border-stone-800 text-stone-200 text-sm focus:border-[#C9A84C] focus:outline-none"
            >
              <option value="Todas">Todas las Familias</option>
              {allFamilies.filter((f) => f !== 'Todas').map((fam) => (
                <option key={fam} value={fam}>{fam}</option>
              ))}
            </select>
          </div>

          {/* Intensity Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedIntensity}
              onChange={(e) => setSelectedIntensity(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-black/70 border border-stone-800 text-stone-200 text-sm focus:border-[#C9A84C] focus:outline-none"
            >
              <option value="Todas">Cualquier Intensidad</option>
              <option value="Suave">Suave (Íntimo)</option>
              <option value="Moderada">Moderada (Elegante)</option>
              <option value="Intensa">Intensa (Estela)</option>
              <option value="Envolvente">Envolvente (Descomunal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CATALOG GRID */}
      {filteredFragrances.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0f0f0f] border border-stone-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-900 flex items-center justify-center text-stone-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-200">No se encontraron perfumes</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Ninguna fragancia coincide con los filtros aplicados. Intenta ampliar tus criterios.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A07830] to-[#C9A84C] text-stone-950 font-bold text-xs uppercase"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFragrances.map((perfume) => {
            const isFav = favorites.includes(perfume.id);
            const bottlePhoto = getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code);

            return (
              <div
                key={perfume.id}
                onClick={() => onSelectFragrance(perfume)}
                className="bg-[#0e0e0e] rounded-3xl border border-stone-800/90 hover:border-[#C9A84C]/60 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl hover:shadow-[#C9A84C]/10 cursor-pointer group relative overflow-hidden"
              >
                {/* Bottle Showcase Header */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 via-[#101010] to-black border border-stone-800/80 p-3 flex items-center justify-center">
                  <img
                    src={bottlePhoto}
                    alt={perfume.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  {/* Code Tag badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#F0D080] border border-[#C9A84C]/50 shadow">
                    {perfume.code}
                  </div>

                  {/* Top-right action buttons */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFragrance(perfume);
                        }}
                        className="p-2 rounded-xl bg-[#C9A84C] text-stone-950 font-bold hover:brightness-110 shadow-lg transition"
                        title="Administrador: Cambiar foto real o notas"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onAddToCompare && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCompare(perfume);
                        }}
                        className={`p-2 rounded-xl backdrop-blur-md border transition ${
                          compareListIds.includes(perfume.id)
                            ? 'bg-[#C9A84C] text-stone-950 border-[#F0D080] font-bold shadow'
                            : 'bg-black/80 border-stone-700 text-stone-300 hover:text-[#F0D080]'
                        }`}
                        title={compareListIds.includes(perfume.id) ? 'Quitar de la comparativa' : 'Añadir a comparativa'}
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(perfume.id);
                      }}
                      className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-rose-400 transition"
                      aria-label="Guardar en favoritos"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Gender Badge */}
                  <span className={`absolute bottom-2.5 right-2.5 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                    perfume.gender === 'Dama'
                      ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                      : perfume.gender === 'Caballero'
                      ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                      : 'bg-amber-950/90 text-amber-200 border border-amber-800'
                  }`}>
                    {perfume.gender}
                  </span>
                </div>

                {/* Brand and Name with clear Code Tag and full text */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] uppercase tracking-wider text-[#C9A84C] font-bold">
                      {perfume.brand}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-black/80 text-[#F0D080] border border-[#C9A84C]/50 shadow-sm">
                      {perfume.code}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-serif-luxury text-stone-100 break-words whitespace-normal group-hover:text-[#F0D080] transition-colors leading-snug">
                    {perfume.name}
                  </h4>
                </div>

                {/* Details & Olfactory Notes Preview */}
                <div className="space-y-3">
                  {/* Family & Intensity Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-stone-900 text-stone-300 border border-stone-800">
                      {perfume.family}
                    </span>
                    {perfume.subfamily && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-stone-900/80 text-[#F0D080] border border-stone-800">
                        {perfume.subfamily}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-[#1e1708] text-[#F0D080] border border-[#C9A84C]/30">
                      {perfume.intensity}
                    </span>
                  </div>

                  {/* Notes Preview Chips */}
                  <div className="p-2.5 rounded-2xl bg-[#141414] border border-stone-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono block">
                      Notas Principales:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(perfume.allNotes || []).slice(0, 4).map((note) => {
                        const noteVisual = getRealNotePhoto(note);
                        return (
                          <div
                            key={note}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveNotePopup(note);
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/60 border border-stone-800 hover:border-[#C9A84C] text-[11px] text-stone-200 transition"
                            title={`Ingrediente: ${note}`}
                          >
                            <img
                              src={noteVisual.photoUrl}
                              alt={note}
                              referrerPolicy="no-referrer"
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                            <span className="capitalize break-words">{note}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Skin compat & Action */}
                <div className="pt-3 border-t border-stone-800/80 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="text-[11px] text-stone-400 break-words">
                      {perfume.skinCompat}
                    </span>
                    <span className="text-[#F0D080] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                      Ver Pirámide y Similares <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFragrance(perfume);
                      }}
                      className="w-full mt-1 py-1.5 px-3 rounded-xl bg-[#C9A84C]/20 hover:bg-[#C9A84C]/35 border border-[#C9A84C]/50 text-[#F0D080] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Poner Foto Real y Editar Notas</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Detail Modal */}
      {activeNotePopup && (() => {
        const noteVisual = getRealNotePhoto(activeNotePopup);
        return (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
            onClick={() => setActiveNotePopup(null)}
          >
            <div
              className="relative w-full max-w-sm bg-[#121212] border border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveNotePopup(null)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 bg-stone-900 rounded-full border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1.5 shadow-xl overflow-hidden border border-[#C9A84C]/40">
                <img
                  src={noteVisual.photoUrl}
                  alt={noteVisual.name || activeNotePopup}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-xl font-bold font-serif-luxury text-stone-100 capitalize break-words">
                  {noteVisual.name || activeNotePopup}
                </h4>
                {noteVisual.botanicalName && (
                  <p className="text-xs text-stone-400 italic">
                    {noteVisual.botanicalName}
                  </p>
                )}
                <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#F0D080]">
                  Grupo: {noteVisual.category.toUpperCase()}
                </p>
              </div>

              <div className="p-3.5 bg-black/50 rounded-2xl border border-stone-800 text-xs text-stone-300 leading-relaxed text-left space-y-1">
                <span className="text-[#F0D080] font-bold text-[11px] block uppercase tracking-wide">
                  Perfil Aromático:
                </span>
                <p>{noteVisual.description}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveNotePopup(null)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#A07830] to-[#C9A84C] text-stone-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        );
      })()}

      {/* Admin Quick Editor Modal */}
      {isAdmin && (
        <AdminFragranceEditorModal
          fragrance={editingFragrance}
          isOpen={Boolean(editingFragrance)}
          onClose={() => setEditingFragrance(null)}
          onSaved={() => {
            setCatalogList(getCustomizedCatalog());
          }}
        />
      )}
    </div>
  );
};
