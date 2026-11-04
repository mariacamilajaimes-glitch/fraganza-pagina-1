import React, { useState, useMemo, useEffect } from 'react';
import { CatalogFragrance, CATALOG, ALL_UNIQUE_NOTES } from '../data/fraganzaCatalog';
import { getCustomizedCatalog } from '../services/catalogStore';
import { getNoteDetail, FRAGRANTICA_NOTES, NoteDetail } from '../data/fragranticaNotesDictionary';
import {
  getRealNotePhoto,
  computeFragranticaAccords,
  BRAND_CONFIGS,
  getPerfumeBottlePhoto
} from '../data/fragranceVisuals';
import {
  Search,
  Filter,
  Plus,
  X,
  Sparkles,
  ChevronRight,
  Heart,
  Ban,
  Check,
  Flame,
  Layers,
  Info,
  BookOpen,
  Droplets,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface AdvancedSearchProps {
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
}) => {
  // Mode: 'notes' (Fragrantica visual notes finder), 'text' (search by code/name), or 'glossary' (Fragrantica notes encyclopedia)
  const [searchMode, setSearchMode] = useState<'notes' | 'text' | 'glossary'>('notes');

  // Text/Code search state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pyramid filter position
  const [pyramidPosition, setPyramidPosition] = useState<'all' | 'top' | 'heart' | 'base'>('all');

  // Note category filter
  const [noteCategoryFilter, setNoteCategoryFilter] = useState<string>('Todas');

  // Filter query inside the 247 real notes
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>('');

  // Included & Excluded notes
  const [includedNotes, setIncludedNotes] = useState<string[]>(['Vainilla']);
  const [excludedNotes, setExcludedNotes] = useState<string[]>([]);

  // Active note detail modal state (¿A qué huele esta nota?)
  const [selectedNoteDetail, setSelectedNoteDetail] = useState<NoteDetail | null>(null);

  // Glossary filter state
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [glossaryFamily, setGlossaryFamily] = useState<string>('Todas');

  // Dynamic catalog containing admin overrides
  const [catalogList, setCatalogList] = useState<CatalogFragrance[]>(() => getCustomizedCatalog());

  useEffect(() => {
    const handleUpdate = () => {
      setCatalogList(getCustomizedCatalog());
    };
    window.addEventListener('fraganza_catalog_updated', handleUpdate);
    window.addEventListener('fraganza_notes_updated', handleUpdate);
    return () => {
      window.removeEventListener('fraganza_catalog_updated', handleUpdate);
      window.removeEventListener('fraganza_notes_updated', handleUpdate);
    };
  }, []);

  // Compute all unique notes strictly present in the selected pyramid position
  const availableNotesForPosition = useMemo(() => {
    const set = new Set<string>();
    catalogList.forEach((f) => {
      if (pyramidPosition === 'top') {
        (f.pyramid.top || []).forEach((n) => set.add(n));
      } else if (pyramidPosition === 'heart') {
        (f.pyramid.heart || []).forEach((n) => set.add(n));
      } else if (pyramidPosition === 'base') {
        (f.pyramid.base || []).forEach((n) => set.add(n));
      } else {
        f.allNotes.forEach((n) => set.add(n));
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [catalogList, pyramidPosition]);

  // Frequency count of notes in catalog
  const noteFrequencyMap = useMemo(() => {
    const map: Record<string, number> = {};
    catalogList.forEach((f) => {
      f.allNotes.forEach((n) => {
        map[n] = (map[n] || 0) + 1;
      });
    });
    return map;
  }, [catalogList]);

  // Filtered list of notes to display in the visual Fragrantica grid
  const displayedNotes = useMemo(() => {
    let list = availableNotesForPosition;

    // Filter by category
    if (noteCategoryFilter !== 'Todas') {
      list = list.filter((n) => {
        const visual = getRealNotePhoto(n);
        return visual.category === noteCategoryFilter;
      });
    }

    // Filter by search query
    if (noteSearchQuery.trim()) {
      const q = noteSearchQuery.toLowerCase();
      list = list.filter((n) => n.toLowerCase().includes(q));
    }

    // Sort by popularity (frequency in catalog) so most common notes appear first
    return list.sort((a, b) => (noteFrequencyMap[b] || 0) - (noteFrequencyMap[a] || 0));
  }, [availableNotesForPosition, noteCategoryFilter, noteSearchQuery, noteFrequencyMap]);

  // Note categories present in the catalog
  const availableCategories = [
    'Todas',
    'Florales',
    'Cítricos',
    'Frutales',
    'Gourmand & Dulces',
    'Maderas',
    'Especias',
    'Aromáticas & Verdes',
    'Acuáticas & Frescas',
    'Cuero & Resinas'
  ];

  // Toggle note inclusion
  const toggleIncludeNote = (note: string) => {
    if (includedNotes.includes(note)) {
      setIncludedNotes(includedNotes.filter((n) => n !== note));
    } else {
      setIncludedNotes([...includedNotes, note]);
      // Remove from excluded if it was there
      setExcludedNotes(excludedNotes.filter((n) => n !== note));
    }
  };

  // Toggle note exclusion
  const toggleExcludeNote = (note: string) => {
    if (excludedNotes.includes(note)) {
      setExcludedNotes(excludedNotes.filter((n) => n !== note));
    } else {
      setExcludedNotes([...excludedNotes, note]);
      // Remove from included if it was there
      setIncludedNotes(includedNotes.filter((n) => n !== note));
    }
  };

  const clearAllNoteFilters = () => {
    setIncludedNotes([]);
    setExcludedNotes([]);
    setNoteSearchQuery('');
  };

  // Results calculation for Notes Search
  const noteSearchResults = useMemo(() => {
    return catalogList.map((perfume) => {
      // Determine candidate notes based on pyramid position
      let candidateNotes: string[] = [];
      if (pyramidPosition === 'top') candidateNotes = perfume.pyramid.top;
      else if (pyramidPosition === 'heart') candidateNotes = perfume.pyramid.heart;
      else if (pyramidPosition === 'base') candidateNotes = perfume.pyramid.base;
      else candidateNotes = perfume.allNotes;

      const candLower = candidateNotes.map((n) => n.toLowerCase());

      // Check excluded notes: if any match, reject perfume
      const hasExcluded = excludedNotes.some((ex) =>
        perfume.allNotes.some((pn) => pn.toLowerCase().includes(ex.toLowerCase()))
      );
      if (hasExcluded) return null;

      // Check matched included notes
      const matched = includedNotes.filter((inc) =>
        candLower.some((cn) => cn.includes(inc.toLowerCase()) || inc.toLowerCase().includes(cn))
      );

      // If user selected included notes, only show perfumes that match at least 1 note
      if (includedNotes.length > 0 && matched.length === 0) return null;

      return {
        perfume,
        matchedNotes: matched,
        score: matched.length * 15 + (perfume.popularity === 'Alta' ? 3 : 0),
      };
    })
      .filter((item): item is { perfume: CatalogFragrance; matchedNotes: string[]; score: number } => item !== null)
      .sort((a, b) => b.score - a.score);
  }, [catalogList, includedNotes, excludedNotes, pyramidPosition]);

  // Autocomplete suggestions for Text/Code search
  const textSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();

    if (q.startsWith('d-') || q === 'd') {
      return catalogList.filter((f) => f.code.toLowerCase().startsWith(q) || f.gender === 'Dama').slice(0, 10);
    }
    if (q.startsWith('c-') || q === 'c') {
      return catalogList.filter((f) => f.code.toLowerCase().startsWith(q) || f.gender === 'Caballero').slice(0, 10);
    }
    if (q.startsWith('u-') || q === 'u') {
      return catalogList.filter((f) => f.code.toLowerCase().startsWith(q) || f.gender === 'Unisex').slice(0, 10);
    }

    return catalogList.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.brand.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [catalogList, searchTerm]);

  // Fragrances that contain the selected note in detail modal
  const perfumesWithSelectedNote = useMemo(() => {
    if (!selectedNoteDetail) return [];
    const target = selectedNoteDetail.name.toLowerCase();
    return catalogList.filter((f) =>
      f.allNotes.some((n) => n.toLowerCase().includes(target) || target.includes(n.toLowerCase()))
    ).slice(0, 8);
  }, [catalogList, selectedNoteDetail]);

  // Glossary notes list
  const glossaryList = useMemo(() => {
    const list = Object.values(FRAGRANTICA_NOTES);
    return list.filter((n) => {
      const matchFamily = glossaryFamily === 'Todas' || n.family === glossaryFamily;
      const matchText =
        !glossarySearch.trim() ||
        n.name.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        n.description.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        n.subgroup.toLowerCase().includes(glossarySearch.toLowerCase());
      return matchFamily && matchText;
    });
  }, [glossaryFamily, glossarySearch]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
          <span>Buscador por Notas & Enciclopedia Olfativa</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight">
          Buscador Visual de Notas Olfativas
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto">
          Explora las <span className="text-[#F0D080] font-semibold">{ALL_UNIQUE_NOTES.length} notas</span> registradas en el catálogo Fraganza. Incluye o excluye notas olfativas para encontrar el perfume exacto.
        </p>

        {/* Tab switch */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex flex-wrap justify-center p-1.5 rounded-2xl bg-[#121212] border border-stone-800 gap-1">
            <button
              onClick={() => setSearchMode('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                searchMode === 'notes'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 shadow-md shadow-[#C9A84C]/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Búsqueda Visual por Notas ({ALL_UNIQUE_NOTES.length})
            </button>
            <button
              onClick={() => setSearchMode('glossary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchMode === 'glossary'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 shadow-md shadow-[#C9A84C]/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              ¿A qué huele cada nota? (Glosario)
            </button>
            <button
              onClick={() => setSearchMode('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                searchMode === 'text'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 shadow-md shadow-[#C9A84C]/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Buscar por Nombre o Código (D-, C-, U-)
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: VISUAL FRAGRANTICA NOTES SEARCH (Real photos)            */}
      {/* ============================================================== */}
      {searchMode === 'notes' && (
        <div className="space-y-6">
          {/* Active selection control bar */}
          <div className="rounded-3xl bg-[#0f0f0f] border border-[#C9A84C]/30 p-5 sm:p-7 shadow-xl shadow-[#C9A84C]/5 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#F0D080]" />
                  Filtro Olfativo por Pirámide & Notas
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Haz clic en cualquier nota para <span className="text-emerald-400 font-semibold">incluirla (+)</span> o para <span className="text-rose-400 font-semibold">excluirla (-)</span>. Se muestran las {availableNotesForPosition.length} notas disponibles en el catálogo.
                </p>
              </div>

              {/* Position selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-stone-800 text-xs">
                {[
                  { id: 'all', label: `Todas las notas (${ALL_UNIQUE_NOTES.length})` },
                  { id: 'top', label: 'Salida' },
                  { id: 'heart', label: 'Corazón' },
                  { id: 'base', label: 'Fondo' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setPyramidPosition(pos.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      pyramidPosition === pos.id
                        ? 'bg-[#C9A84C] text-stone-950 font-bold shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Included & Excluded Chips Tray */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Included tray */}
              <div className="rounded-2xl bg-[#141414] border border-emerald-500/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Notas Deseadas ({includedNotes.length})
                  </span>
                  {includedNotes.length > 0 && (
                    <button
                      onClick={() => setIncludedNotes([])}
                      className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors"
                    >
                      Limpiar deseadas
                    </button>
                  )}
                </div>
                {includedNotes.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-1">
                    Selecciona notas de la galería inferior para filtrar...
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {includedNotes.map((note) => {
                      const visual = getRealNotePhoto(note);
                      return (
                        <div
                          key={note}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs group"
                        >
                          <img
                            src={visual.photoUrl}
                            alt={note}
                            className="w-5 h-5 rounded-md object-cover bg-white"
                          />
                          <span className="font-medium">{note}</span>
                          <button
                            onClick={() => toggleIncludeNote(note)}
                            className="text-stone-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Excluded tray */}
              <div className="rounded-2xl bg-[#141414] border border-rose-500/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Ban className="w-4 h-4" />
                    Notas Excluidas ({excludedNotes.length})
                  </span>
                  {excludedNotes.length > 0 && (
                    <button
                      onClick={() => setExcludedNotes([])}
                      className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors"
                    >
                      Limpiar excluidas
                    </button>
                  )}
                </div>
                {excludedNotes.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-1">
                    Ninguna nota descartada. (Haz clic secundario o usa el botón (-) para descartar)
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {excludedNotes.map((note) => {
                      const visual = getRealNotePhoto(note);
                      return (
                        <div
                          key={note}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs line-through group"
                        >
                          <img
                            src={visual.photoUrl}
                            alt={note}
                            className="w-5 h-5 rounded-md object-cover grayscale bg-white"
                          />
                          <span>{note}</span>
                          <button
                            onClick={() => toggleExcludeNote(note)}
                            className="text-stone-400 hover:text-white no-underline"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Filter controls inside note gallery: Search box & Family pills */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={noteSearchQuery}
                    onChange={(e) => setNoteSearchQuery(e.target.value)}
                    placeholder="Filtrar notas existentes (ej. rosa, vainilla, oud)..."
                    className="w-full bg-[#141414] border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C9A84C]"
                  />
                  {noteSearchQuery && (
                    <button
                      onClick={() => setNoteSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-stone-400">
                  <span>Mostrando: <strong className="text-stone-200">{displayedNotes.length}</strong> de {availableNotesForPosition.length} notas</span>
                  {(includedNotes.length > 0 || excludedNotes.length > 0 || noteSearchQuery) && (
                    <button
                      onClick={clearAllNoteFilters}
                      className="text-xs text-[#F0D080] hover:underline flex items-center gap-1 ml-2"
                    >
                      <RotateCcw className="w-3 h-3" /> Reiniciar
                    </button>
                  )}
                </div>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoteCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                      noteCategoryFilter === cat
                        ? 'bg-[#C9A84C]/25 text-[#F0D080] border border-[#C9A84C] font-semibold'
                        : 'bg-[#141414] text-stone-400 border border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* FRAGRANTICA-STYLE VISUAL NOTE GRID (Real photographic ingredient tiles) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <span>Catálogo de Notas Olfativas con Fotografía Real</span>
                <span className="text-[11px] text-stone-500">
                  [+] Añadir · [-] Excluir · [?] Ver reseña
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[460px] overflow-y-auto p-2 rounded-2xl bg-[#0a0a0a] border border-stone-800/80">
                {displayedNotes.map((note) => {
                  const visual = getRealNotePhoto(note);
                  const isIncluded = includedNotes.includes(note);
                  const isExcluded = excludedNotes.includes(note);
                  const count = noteFrequencyMap[note] || 0;

                  return (
                    <div
                      key={note}
                      className={`relative flex flex-col items-center p-2.5 rounded-2xl border transition-all duration-200 group ${
                        isIncluded
                          ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : isExcluded
                          ? 'bg-rose-950/30 border-rose-500 line-through opacity-60'
                          : 'bg-[#121212] border-stone-800/80 hover:border-[#C9A84C]/50 hover:bg-[#181818]'
                      }`}
                    >
                      {/* Real Photograph Tile (Rounded square on white background like Fragrantica) */}
                      <div
                        onClick={() => toggleIncludeNote(note)}
                        className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-1 bg-white shadow-md flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-105 transition-transform"
                        title={`Haz clic para incluir ${note}`}
                      >
                        <img
                          src={visual.photoUrl}
                          alt={note}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                        />
                        {/* Status badge */}
                        {isIncluded && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow">
                            ✓
                          </div>
                        )}
                        {isExcluded && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow">
                            ✕
                          </div>
                        )}
                      </div>

                      {/* Note Name underneath in lowercase/clean typography */}
                      <span
                        onClick={() => toggleIncludeNote(note)}
                        className={`text-xs font-medium text-center mt-2 cursor-pointer break-words max-w-[95px] leading-tight ${
                          isIncluded
                            ? 'text-emerald-300 font-bold'
                            : isExcluded
                            ? 'text-rose-400'
                            : 'text-stone-200 group-hover:text-[#F0D080]'
                        }`}
                        title={note}
                      >
                        {note.toLowerCase()}
                      </span>

                      {/* Fragrance count badge */}
                      <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {count} {count === 1 ? 'fragancia' : 'fragancias'}
                      </span>

                      {/* Quick action buttons on hover/focus */}
                      <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-stone-800/60 w-full justify-center">
                        <button
                          type="button"
                          onClick={() => toggleIncludeNote(note)}
                          title="Incluir nota en la búsqueda"
                          className={`p-1 rounded-md text-[10px] transition-colors ${
                            isIncluded
                              ? 'bg-emerald-500 text-stone-950 font-bold'
                              : 'text-stone-400 hover:text-emerald-400 hover:bg-stone-800'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleExcludeNote(note)}
                          title="Excluir nota de la búsqueda"
                          className={`p-1 rounded-md text-[10px] transition-colors ${
                            isExcluded
                              ? 'bg-rose-500 text-white font-bold'
                              : 'text-stone-400 hover:text-rose-400 hover:bg-stone-800'
                          }`}
                        >
                          <Ban className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const detail = getNoteDetail(note);
                            setSelectedNoteDetail(detail);
                          }}
                          title="¿A qué huele esta nota? (Reseña)"
                          className="p-1 rounded-md text-[10px] text-stone-400 hover:text-[#F0D080] hover:bg-stone-800"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PERFUME SEARCH RESULTS (Matching included/excluded notes) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xl font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                <span>Resultados Encontrados</span>
                <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] border border-[#C9A84C]/40">
                  {noteSearchResults.length} perfumes
                </span>
              </h3>
              <span className="text-xs text-stone-400">
                Ordenados por mayor afinidad con tus notas
              </span>
            </div>

            {noteSearchResults.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-[#0f0f0f] border border-stone-800 text-stone-400 space-y-3">
                <Flame className="w-10 h-10 text-stone-600 mx-auto" />
                <p className="text-base font-semibold text-stone-300">
                  No se encontraron perfumes con esta combinación exacta.
                </p>
                <p className="text-xs max-w-md mx-auto text-stone-500">
                  Prueba eliminando notas excluidas o cambiando la posición en la pirámide (Salida, Corazón o Fondo).
                </p>
                <button
                  onClick={clearAllNoteFilters}
                  className="px-4 py-2 rounded-xl bg-[#C9A84C] text-stone-950 font-bold text-xs hover:brightness-110"
                >
                  Reiniciar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {noteSearchResults.map(({ perfume, matchedNotes }) => {
                  const accords = computeFragranticaAccords(
                    perfume.family,
                    perfume.allNotes,
                    perfume.sweetness,
                    perfume.intensity
                  );
                  const isFav = favorites.includes(perfume.id);
                  const bottlePhoto = getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code);
                  const brandCfg = BRAND_CONFIGS[perfume.brand] || {
                    label: perfume.brand.toUpperCase(),
                    fontClass: 'tracking-widest font-sans font-bold',
                    bgColor: '#ffffff',
                    textColor: '#1a1a1a'
                  };

                  return (
                    <div
                      key={perfume.id}
                      onClick={() => onSelectFragrance(perfume)}
                      className="group relative rounded-3xl bg-[#0d0d0d] border border-stone-800 hover:border-[#C9A84C]/60 p-5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#C9A84C]/10 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Top row: Brand Badge & Code */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className="px-2.5 py-1 rounded-md text-[10px] shadow-sm uppercase font-black"
                          style={{ backgroundColor: brandCfg.bgColor, color: brandCfg.textColor }}
                        >
                          <span className={brandCfg.fontClass}>{brandCfg.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[#F0D080] font-bold">
                            {perfume.code}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(perfume.id);
                            }}
                            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:text-rose-400"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Main Fragrantica Hero Split: Bottle on Left, Accords on Right */}
                      <div className="grid grid-cols-12 gap-3 items-center py-2">
                        {/* Left: Real Bottle Image */}
                        <div className="col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-black border border-stone-800/80 p-2 flex items-center justify-center">
                          <img
                            src={bottlePhoto}
                            alt={perfume.name}
                            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className={`absolute bottom-2 left-2 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            perfume.gender === 'Dama'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : perfume.gender === 'Caballero'
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}>
                            {perfume.gender}
                          </span>
                        </div>

                        {/* Right: Fragrantica "Acordes Principales" */}
                        <div className="col-span-7 space-y-2">
                          <div className="border-b border-stone-800/80 pb-1">
                            <h4 className="text-base font-bold font-serif-luxury text-stone-100 group-hover:text-[#F0D080] transition-colors leading-tight break-words whitespace-normal">
                              {perfume.name}
                            </h4>
                            <p className="text-[11px] text-stone-400 break-words">{perfume.subfamily}</p>
                          </div>

                          {/* Colored Accord Bars */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                              Acordes principales:
                            </span>
                            {accords.slice(0, 4).map((acc) => (
                              <div
                                key={acc.name}
                                style={{
                                  backgroundColor: acc.color,
                                  color: acc.textColor,
                                  width: `${acc.percentage}%`
                                }}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight shadow-sm transition-all"
                              >
                                {acc.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Olfactory pyramid preview (Real photographic icons) */}
                      <div className="pt-3 border-t border-stone-800/80 space-y-1.5 mt-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400">Notas clave:</span>
                          <span className="text-[#F0D080] font-medium text-[10px]">
                            {matchedNotes.length} nota{matchedNotes.length !== 1 ? 's' : ''} coincidente{matchedNotes.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {perfume.allNotes.slice(0, 5).map((n) => {
                            const visual = getRealNotePhoto(n);
                            const matched = matchedNotes.some((m) => m.toLowerCase() === n.toLowerCase());
                            return (
                              <div
                                key={n}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] border ${
                                  matched
                                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                                    : 'bg-[#141414] border-stone-800 text-stone-400'
                                }`}
                              >
                                <img
                                  src={visual.photoUrl}
                                  alt={n}
                                  className="w-3.5 h-3.5 rounded-sm object-cover bg-white"
                                />
                                <span>{n}</span>
                              </div>
                            );
                          })}
                          {perfume.allNotes.length > 5 && (
                            <span className="text-[10px] text-stone-500 self-center">
                              +{perfume.allNotes.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom action */}
                      <div className="pt-3 mt-2 flex items-center justify-between text-xs text-[#C9A84C] font-semibold group-hover:text-[#F0D080]">
                        <span>Ver Ficha Completa</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: GLOSSARY / ¿A QUÉ HUELE CADA NOTA?                       */}
      {/* ============================================================== */}
      {searchMode === 'glossary' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0f0f0f] border border-[#C9A84C]/30 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-100">
                  Enciclopedia & Perfil Sensorial de Notas
                </h3>
                <p className="text-xs text-stone-400">
                  Aprende a qué huele cada ingrediente de perfumería con sus fotos reales y familias botánicas.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Buscar nota (ej. oud, rosa, ámbar)..."
                  className="w-full bg-[#141414] border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            {/* Families */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {['Todas', 'Floral', 'Dulce / Acaramelado', 'Cítrico / Acuático', 'Amaderado / Oriental'].map((f) => (
                <button
                  key={f}
                  onClick={() => setGlossaryFamily(f)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    glossaryFamily === f
                      ? 'bg-[#C9A84C] text-stone-950 font-bold'
                      : 'bg-[#141414] text-stone-400 border border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {glossaryList.map((item) => {
              const visual = getRealNotePhoto(item.name);
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedNoteDetail(item)}
                  className="rounded-2xl bg-[#0f0f0f] border border-stone-800 hover:border-[#C9A84C]/50 p-4 space-y-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-md">
                      <img
                        src={visual.photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-100 group-hover:text-[#F0D080] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider block">
                        {item.subgroup} · {item.family}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400 inline-block mt-0.5">
                        Fase típica: {item.pyramidTypical}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed break-words whitespace-normal">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-stone-800/80 flex justify-between items-center text-[11px] text-[#F0D080]">
                    <span>¿A qué huele? Ver perfil</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: TEXT & CODE SEARCH (D-, C-, U-)                          */}
      {/* ============================================================== */}
      {searchMode === 'text' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="relative">
            <Search className="w-5 h-5 text-[#F0D080] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe el nombre o código: D-001, C-015, U-002, Carolina Herrera..."
              className="w-full bg-[#0f0f0f] border border-[#C9A84C]/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>

          {textSuggestions.length > 0 && (
            <div className="rounded-2xl bg-[#0f0f0f] border border-stone-800 divide-y divide-stone-800 overflow-hidden shadow-2xl">
              {textSuggestions.map((perfume) => {
                const bottlePhoto = getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code);
                return (
                  <div
                    key={perfume.id}
                    onClick={() => onSelectFragrance(perfume)}
                    className="p-4 flex items-center justify-between hover:bg-[#151515] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-xl bg-black border border-stone-800 p-1 shrink-0 overflow-hidden">
                        <img
                          src={bottlePhoto}
                          alt={perfume.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-900 text-[#F0D080] font-bold">
                            {perfume.code}
                          </span>
                          <span className="font-bold text-sm text-stone-100">{perfume.name}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{perfume.brand} · {perfume.family}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-500" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* NOTE SENSORY DETAIL MODAL (¿A qué huele esta nota?)              */}
      {/* ============================================================== */}
      {selectedNoteDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-[#C9A84C]/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#C9A84C]/20 text-stone-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNoteDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Note Header with Real Photo */}
            <div className="flex items-center gap-4 border-b border-stone-800 pb-5">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl shrink-0">
                <img
                  src={getRealNotePhoto(selectedNoteDetail.name).photoUrl}
                  alt={selectedNoteDetail.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div>
                <span className="text-[11px] text-[#F0D080] font-bold uppercase tracking-wider block">
                  {selectedNoteDetail.subgroup} · {selectedNoteDetail.family}
                </span>
                <h3 className="text-2xl font-bold font-serif-luxury text-stone-100">
                  {selectedNoteDetail.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400 inline-block mt-1">
                  Ubicación habitual: Notas de {selectedNoteDetail.pyramidTypical}
                </span>
              </div>
            </div>

            {/* Sensory Description */}
            <div className="py-4 space-y-3">
              <h4 className="text-xs font-bold text-[#F0D080] uppercase tracking-wider">
                ¿A qué huele esta nota?
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed">
                {selectedNoteDetail.description}
              </p>

              <div className="rounded-2xl bg-[#141414] border border-stone-800/80 p-4 space-y-1.5">
                <span className="text-xs font-semibold text-stone-400 block">Perfil Sensorial:</span>
                <p className="text-xs text-stone-200 font-medium italic">
                  "{selectedNoteDetail.sensoryProfile}"
                </p>
              </div>
            </div>

            {/* Direct inclusion buttons */}
            <div className="flex gap-2 py-2">
              <button
                onClick={() => {
                  toggleIncludeNote(selectedNoteDetail.name);
                  setSelectedNoteDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Incluir en búsqueda</span>
              </button>
              <button
                onClick={() => {
                  toggleExcludeNote(selectedNoteDetail.name);
                  setSelectedNoteDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 text-rose-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Ban className="w-4 h-4" />
                <span>Excluir de búsqueda</span>
              </button>
            </div>

            {/* Perfumes that contain this note */}
            {perfumesWithSelectedNote.length > 0 && (
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <span className="text-xs font-bold text-stone-400 block">
                  Perfumes destacados de Fraganza con {selectedNoteDetail.name}:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {perfumesWithSelectedNote.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedNoteDetail(null);
                        onSelectFragrance(f);
                      }}
                      className="p-2 rounded-xl bg-[#141414] border border-stone-800 hover:border-[#C9A84C]/50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[#F0D080] font-bold shrink-0">{f.code}</span>
                      <span className="text-xs text-stone-200 font-medium break-words">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
