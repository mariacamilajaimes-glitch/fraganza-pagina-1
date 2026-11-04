import React, { useState } from 'react';
import { CatalogFragrance, computeWeightedJaccardSimilarity } from '../data/fraganzaCatalog';
import { getCustomizedCatalog } from '../services/catalogStore';
import { getPerfumeBottlePhoto, computeFragranticaAccords, BRAND_CONFIGS } from '../data/fragranceVisuals';
import {
  X,
  Layers,
  Plus,
  Sparkles,
  Flame,
  Droplets,
  Heart,
  ChevronRight,
  Sun,
  Moon,
  Columns2,
  Trash2,
  Check,
  Search,
  Scale,
  Percent
} from 'lucide-react';

interface FragranceComparatorProps {
  compareList: CatalogFragrance[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  onAddFragrance: (fragrance: CatalogFragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const FragranceComparator: React.FC<FragranceComparatorProps> = ({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onSelectFragrance,
  onAddFragrance,
  favorites,
  onToggleFavorite,
}) => {
  const catalog = getCustomizedCatalog();

  // If 2 perfumes are not in compareList yet, default to popular ones or let user select
  const [selectedLeftId, setSelectedLeftId] = useState<string>(() => {
    return compareList[0]?.id || catalog[0]?.id || '';
  });

  const [selectedRightId, setSelectedRightId] = useState<string>(() => {
    return compareList[1]?.id || catalog[1]?.id || '';
  });

  // Keep in sync with compareList if updated from outside
  React.useEffect(() => {
    if (compareList.length >= 1 && compareList[0].id !== selectedLeftId) {
      setSelectedLeftId(compareList[0].id);
    }
    if (compareList.length >= 2 && compareList[1].id !== selectedRightId) {
      setSelectedRightId(compareList[1].id);
    }
  }, [compareList]);

  const leftFragrance = catalog.find((f) => f.id === selectedLeftId) || catalog[0];
  const rightFragrance = catalog.find((f) => f.id === selectedRightId) || catalog[1];

  // Calculate shared notes and similarity
  const leftNotes = new Set(leftFragrance?.allNotes.map((n) => n.toLowerCase()) || []);
  const rightNotes = new Set(rightFragrance?.allNotes.map((n) => n.toLowerCase()) || []);

  const sharedNotes = (leftFragrance?.allNotes || []).filter((n) =>
    rightNotes.has(n.toLowerCase())
  );

  const similarityScore = leftFragrance && rightFragrance
    ? computeWeightedJaccardSimilarity(leftFragrance, rightFragrance).jaccardPercentage
    : 0;

  // Accords
  const leftAccords = leftFragrance
    ? computeFragranticaAccords(
        leftFragrance.family,
        leftFragrance.allNotes,
        leftFragrance.sweetness,
        leftFragrance.intensity,
        leftFragrance.mainAccords
      )
    : [];

  const rightAccords = rightFragrance
    ? computeFragranticaAccords(
        rightFragrance.family,
        rightFragrance.allNotes,
        rightFragrance.sweetness,
        rightFragrance.intensity,
        rightFragrance.mainAccords
      )
    : [];

  const renderNoteBadge = (note: string, otherNotesSet: Set<string>) => {
    const isShared = otherNotesSet.has(note.toLowerCase());
    return (
      <span
        key={note}
        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
          isShared
            ? 'bg-[#C9A84C]/25 text-[#F0D080] border border-[#C9A84C]/60 font-bold shadow-sm'
            : 'bg-black/60 text-stone-300 border border-stone-800'
        }`}
      >
        {isShared && <Sparkles className="w-3 h-3 text-[#F0D080] shrink-0" />}
        <span>{note}</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080] text-xs font-semibold uppercase tracking-widest mb-2">
            <Scale className="w-3.5 h-3.5 text-[#F0D080]" />
            <span>Comparador Cara a Cara · 201 Perfumes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-stone-100 tracking-tight">
            Comparación de Fragancias
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Analiza notas, pirámides olfativas, acordes principales e intensidad en pantalla dividida.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            type="button"
            onClick={onClearCompare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs text-stone-400 hover:text-stone-200 border border-stone-800 transition self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Vaciar selección</span>
          </button>
        )}
      </div>

      {/* Selector Bars (Pick perfume for Left and Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111111] border border-stone-800 p-4 rounded-3xl shadow-xl">
        {/* Left Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F0D080] uppercase tracking-wider block">
            Perfume 1 (Lado Izquierdo):
          </label>
          <select
            value={selectedLeftId}
            onChange={(e) => setSelectedLeftId(e.target.value)}
            className="w-full bg-black border border-stone-800 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
          >
            {catalog.map((f) => (
              <option key={`left-${f.id}`} value={f.id}>
                {f.code} · {f.name} ({f.brand}) - {f.gender}
              </option>
            ))}
          </select>
        </div>

        {/* Right Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F0D080] uppercase tracking-wider block">
            Perfume 2 (Lado Derecho):
          </label>
          <select
            value={selectedRightId}
            onChange={(e) => setSelectedRightId(e.target.value)}
            className="w-full bg-black border border-stone-800 focus:border-[#C9A84C] rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none"
          >
            {catalog.map((f) => (
              <option key={`right-${f.id}`} value={f.id}>
                {f.code} · {f.name} ({f.brand}) - {f.gender}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Similarity & Common Notes Match Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-950 via-[#181308] to-stone-950 border border-[#C9A84C]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F0D080]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-serif-luxury text-stone-100">
              Afinidad Olfativa: <span className="text-[#F0D080]">{similarityScore}% de Coincidencia</span>
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Comparten <strong className="text-stone-200">{sharedNotes.length} ingredientes en común</strong> (resaltados con brillo dorado ✨).
            </p>
          </div>
        </div>

        {sharedNotes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end max-w-md">
            {sharedNotes.map((n) => (
              <span
                key={n}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#F0D080] font-bold"
              >
                ✨ {n}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SPLIT SCREEN COMPARISON COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* LEFT PERFUME CARD */}
        {leftFragrance && (
          <div className="rounded-3xl border border-stone-800 bg-[#0e0e0e] p-5 sm:p-7 space-y-6 shadow-2xl relative flex flex-col">
            {/* Top Bottle & Details */}
            <div className="flex gap-4 items-start">
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-black border border-[#C9A84C]/30 p-2 shrink-0 flex items-center justify-center shadow-lg relative group">
                <img
                  src={getPerfumeBottlePhoto(leftFragrance.name, leftFragrance.gender, leftFragrance.image, leftFragrance.code)}
                  alt={leftFragrance.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => onToggleFavorite(leftFragrance.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 border border-stone-800 text-stone-400 hover:text-rose-400"
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(leftFragrance.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black text-[#F0D080] border border-[#C9A84C]/40 inline-block">
                  {leftFragrance.code}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                  {leftFragrance.brand}
                </span>
                <h3
                  onClick={() => onSelectFragrance(leftFragrance)}
                  className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100 hover:text-[#F0D080] cursor-pointer transition break-words"
                >
                  {leftFragrance.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-stone-900 border border-stone-800 text-stone-300">
                    {leftFragrance.gender}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080]">
                    {leftFragrance.family}
                  </span>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-800">
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Intensidad</span>
                <span className="text-stone-200 font-semibold">{leftFragrance.intensity}</span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Dulzura</span>
                <span className="text-stone-200 font-semibold">{leftFragrance.sweetness}</span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Uso Recomendado</span>
                <span className="text-stone-200 font-semibold flex items-center gap-1">
                  {leftFragrance.environment === 'Día' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                  {leftFragrance.environment}
                </span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Subfamilia</span>
                <span className="text-stone-200 font-semibold truncate block">{leftFragrance.subfamily}</span>
              </div>
            </div>

            {/* Olfactory Pyramid Breakdown */}
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-stone-800/80">
              <h5 className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Pirámide Olfativa</span>
              </h5>

              {/* Salida */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#F0D080] block">Salida:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(leftFragrance.pyramid.top || []).map((n) => renderNoteBadge(n, rightNotes))}
                </div>
              </div>

              {/* Corazón */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-300 block">Corazón:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(leftFragrance.pyramid.heart || []).map((n) => renderNoteBadge(n, rightNotes))}
                </div>
              </div>

              {/* Fondo */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Fondo:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(leftFragrance.pyramid.base || []).map((n) => renderNoteBadge(n, rightNotes))}
                </div>
              </div>
            </div>

            {/* Acordes Principales (Fragrantica) */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#141414] border border-stone-800">
              <span className="text-xs uppercase tracking-wider text-[#F0D080] font-bold block">
                acordes principales
              </span>
              <div className="space-y-1 pt-1">
                {leftAccords.map((accord) => (
                  <div
                    key={accord.name}
                    style={{
                      backgroundColor: accord.color,
                      color: accord.textColor,
                      width: `${accord.percentage}%`
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm transition-all whitespace-normal break-words"
                  >
                    {accord.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-400 italic bg-black/40 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
              "{leftFragrance.description}"
            </p>

            <button
              type="button"
              onClick={() => onSelectFragrance(leftFragrance)}
              className="w-full mt-auto py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>Ver Ficha Completa ({leftFragrance.code})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* RIGHT PERFUME CARD */}
        {rightFragrance && (
          <div className="rounded-3xl border border-stone-800 bg-[#0e0e0e] p-5 sm:p-7 space-y-6 shadow-2xl relative flex flex-col">
            {/* Top Bottle & Details */}
            <div className="flex gap-4 items-start">
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-black border border-[#C9A84C]/30 p-2 shrink-0 flex items-center justify-center shadow-lg relative group">
                <img
                  src={getPerfumeBottlePhoto(rightFragrance.name, rightFragrance.gender, rightFragrance.image, rightFragrance.code)}
                  alt={rightFragrance.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => onToggleFavorite(rightFragrance.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 border border-stone-800 text-stone-400 hover:text-rose-400"
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(rightFragrance.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black text-[#F0D080] border border-[#C9A84C]/40 inline-block">
                  {rightFragrance.code}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                  {rightFragrance.brand}
                </span>
                <h3
                  onClick={() => onSelectFragrance(rightFragrance)}
                  className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-100 hover:text-[#F0D080] cursor-pointer transition break-words"
                >
                  {rightFragrance.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-stone-900 border border-stone-800 text-stone-300">
                    {rightFragrance.gender}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080]">
                    {rightFragrance.family}
                  </span>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-800">
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Intensidad</span>
                <span className="text-stone-200 font-semibold">{rightFragrance.intensity}</span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Dulzura</span>
                <span className="text-stone-200 font-semibold">{rightFragrance.sweetness}</span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Uso Recomendado</span>
                <span className="text-stone-200 font-semibold flex items-center gap-1">
                  {rightFragrance.environment === 'Día' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                  {rightFragrance.environment}
                </span>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-stone-800/80">
                <span className="text-[10px] uppercase text-stone-500 font-bold block">Subfamilia</span>
                <span className="text-stone-200 font-semibold truncate block">{rightFragrance.subfamily}</span>
              </div>
            </div>

            {/* Olfactory Pyramid Breakdown */}
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-stone-800/80">
              <h5 className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Pirámide Olfativa</span>
              </h5>

              {/* Salida */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#F0D080] block">Salida:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(rightFragrance.pyramid.top || []).map((n) => renderNoteBadge(n, leftNotes))}
                </div>
              </div>

              {/* Corazón */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-300 block">Corazón:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(rightFragrance.pyramid.heart || []).map((n) => renderNoteBadge(n, leftNotes))}
                </div>
              </div>

              {/* Fondo */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Fondo:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(rightFragrance.pyramid.base || []).map((n) => renderNoteBadge(n, leftNotes))}
                </div>
              </div>
            </div>

            {/* Acordes Principales (Fragrantica) */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#141414] border border-stone-800">
              <span className="text-xs uppercase tracking-wider text-[#F0D080] font-bold block">
                acordes principales
              </span>
              <div className="space-y-1 pt-1">
                {rightAccords.map((accord) => (
                  <div
                    key={accord.name}
                    style={{
                      backgroundColor: accord.color,
                      color: accord.textColor,
                      width: `${accord.percentage}%`
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm transition-all whitespace-normal break-words"
                  >
                    {accord.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-400 italic bg-black/40 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
              "{rightFragrance.description}"
            </p>

            <button
              type="button"
              onClick={() => onSelectFragrance(rightFragrance)}
              className="w-full mt-auto py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <span>Ver Ficha Completa ({rightFragrance.code})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
