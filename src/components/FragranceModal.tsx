import React, { useState, useEffect } from 'react';
import {
  CatalogFragrance,
  findSimilarFragrancesJaccard,
  TieredJaccardResult,
  getOccasionDescription,
  getFullFragranceReview,
  getPunctualFragranceBreakdown
} from '../data/fraganzaCatalog';
import {
  getRealNotePhoto,
  computeFragranticaAccords,
  BRAND_CONFIGS,
  getPerfumeBottlePhoto
} from '../data/fragranceVisuals';
import { getCustomizedFragrance } from '../services/catalogStore';
import { AdminFragranceEditorModal } from './AdminFragranceEditorModal';
import { AdminNotePhotoEditorModal } from './AdminNotePhotoEditorModal';
import {
  X,
  Heart,
  Sparkles,
  Flame,
  Info,
  ChevronRight,
  ShieldCheck,
  Layers,
  Clock,
  Compass,
  Droplets,
  Wind,
  Edit3,
  Camera,
  Sun,
  Moon
} from 'lucide-react';

interface FragranceModalProps {
  fragrance: CatalogFragrance | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectAnother: (fragrance: CatalogFragrance) => void;
  isAdmin?: boolean;
  onRequireAdminAuth?: () => void;
}

export const FragranceModal: React.FC<FragranceModalProps> = ({
  fragrance: initialFragrance,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectAnother,
  isAdmin = false,
  onRequireAdminAuth,
}) => {
  const [selectedNotePopup, setSelectedNotePopup] = useState<string | null>(null);
  const [isAdminEditorOpen, setIsAdminEditorOpen] = useState<boolean>(false);
  const [editingNoteForPhoto, setEditingNoteForPhoto] = useState<string | null>(null);
  const [, setNoteVersion] = useState<number>(0);
  const [currentFragrance, setCurrentFragrance] = useState<CatalogFragrance | null>(initialFragrance);

  // Day (White Mode) vs Night (Black Luxury Mode)
  const [themeMode, setThemeMode] = useState<'black' | 'white'>('black');

  useEffect(() => {
    if (initialFragrance) {
      const customized = getCustomizedFragrance(initialFragrance.code) || initialFragrance;
      setCurrentFragrance(customized);
      setThemeMode(customized.themeMode || (customized.environment === 'Día' ? 'white' : 'black'));
    } else {
      setCurrentFragrance(null);
    }
  }, [initialFragrance]);

  // Listen for admin catalog updates and custom note photos
  useEffect(() => {
    const handleUpdate = () => {
      if (initialFragrance) {
        const customized = getCustomizedFragrance(initialFragrance.code) || initialFragrance;
        setCurrentFragrance(customized);
        if (customized.themeMode) {
          setThemeMode(customized.themeMode);
        }
      }
      setNoteVersion((v) => v + 1);
    };
    window.addEventListener('fraganza_catalog_updated', handleUpdate);
    window.addEventListener('fraganza_notes_updated', handleUpdate);
    return () => {
      window.removeEventListener('fraganza_catalog_updated', handleUpdate);
      window.removeEventListener('fraganza_notes_updated', handleUpdate);
    };
  }, [initialFragrance]);

  if (!currentFragrance) return null;

  const fragrance = currentFragrance;

  // Similar perfumes calculated using Weighted Jaccard Similarity (Salida 25%, Corazón 35%, Fondo 40%)
  const similarItems: TieredJaccardResult[] = findSimilarFragrancesJaccard(fragrance, 4);

  // Fragrantica Accords (passes custom accords if customized by admin)
  const mainAccords = computeFragranticaAccords(
    fragrance.family,
    fragrance.allNotes,
    fragrance.sweetness,
    fragrance.intensity,
    fragrance.mainAccords
  );

  // Brand config
  const brandCfg = BRAND_CONFIGS[fragrance.brand] || {
    label: fragrance.brand.toUpperCase(),
    fontClass: 'tracking-widest font-sans font-bold',
    bgColor: '#ffffff',
    textColor: '#1a1a1a'
  };

  const bottlePhoto = getPerfumeBottlePhoto(fragrance.name, fragrance.gender, fragrance.image, fragrance.code);
  const breakdown = getPunctualFragranceBreakdown(fragrance);

  // Intensity meter values
  const intensityLevels = [
    { id: 'Suave', label: 'Suave', bars: 1, sillage: 'Íntimo (~0.5 m)', desc: 'Aura discreta y pegada a la piel' },
    { id: 'Moderada', label: 'Moderada', bars: 2, sillage: 'Elegante (~1.5 m)', desc: 'Proyección a la distancia de un brazo' },
    { id: 'Intensa', label: 'Intensa', bars: 3, sillage: 'Notable (~2.5 m)', desc: 'Estela que deja huella al pasar' },
    { id: 'Envolvente', label: 'Envolvente', bars: 4, sillage: 'Descomunal (>3 m)', desc: 'Máxima fijación y difusión' },
  ];

  const currentLevelIdx =
    fragrance.intensity === 'Suave'
      ? 1
      : fragrance.intensity === 'Moderada'
      ? 2
      : fragrance.intensity === 'Intensa'
      ? 3
      : 4;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div
          className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col transition-colors duration-300 ${
            themeMode === 'white'
              ? 'bg-white text-stone-900 border border-stone-200 shadow-stone-900/20'
              : 'bg-[#0c0c0c] text-stone-100 border border-[#C9A84C]/40 shadow-[#C9A84C]/20'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Controls */}
          <div
            className={`flex items-center justify-between p-3 sm:px-6 border-b z-20 transition-colors ${
              themeMode === 'white'
                ? 'bg-stone-50 border-stone-200 text-stone-900'
                : 'bg-[#0f0f0f] border-stone-800/80 text-stone-100'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                themeMode === 'white'
                  ? 'bg-white text-stone-900 border-stone-300'
                  : 'bg-black text-[#F0D080] border-[#C9A84C]/50'
              }`}>
                {fragrance.code}
              </span>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAdminEditorOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C9A84C] text-stone-950 text-xs font-bold shadow hover:brightness-110 transition"
                  title="Modificar foto real, acordes y notas de este perfume"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Editar Ficha & Acordes</span>
                  <span className="sm:hidden">Editar</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Day / Night (White / Black) Theme Mode Toggle */}
              <button
                type="button"
                onClick={() => setThemeMode(themeMode === 'black' ? 'white' : 'black')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  themeMode === 'white'
                    ? 'bg-stone-900 text-stone-100 border-stone-800 hover:bg-black'
                    : 'bg-white text-stone-950 border-stone-200 hover:bg-stone-100'
                }`}
                title="Alternar entre Fondo Blanco (Día) y Fondo Negro (Noche)"
              >
                {themeMode === 'white' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Modo Noche (Negro)</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Modo Día (Blanco)</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors border ${
                  themeMode === 'white'
                    ? 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border-stone-300'
                    : 'text-stone-400 hover:text-stone-100 bg-stone-900 hover:bg-black border-stone-800'
                }`}
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
            {/* TOP SECTION: Fragrantica layout with Bottle on Left and Brand/Accords on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left: Real Bottle Photo & Code */}
              <div className="md:col-span-5 space-y-3">
                <div
                  className={`relative w-full aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden border p-4 flex items-center justify-center group transition-colors ${
                    themeMode === 'white'
                      ? 'bg-white border-stone-200 shadow-xl'
                      : 'bg-gradient-to-b from-stone-900 via-[#0d0d0d] to-black border-[#C9A84C]/40 shadow-2xl'
                  }`}
                >
                  <img
                    src={bottlePhoto}
                    alt={fragrance.name}
                    className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${
                      themeMode === 'white'
                        ? 'mix-blend-multiply drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)]'
                        : 'drop-shadow-[0_8px_24px_rgba(201,168,76,0.15)]'
                    }`}
                  />

                  {/* Favorite button */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(fragrance.id)}
                    className={`absolute top-3 right-3 p-2 rounded-xl border shadow ${
                      themeMode === 'white'
                        ? 'bg-white/90 border-stone-300 text-stone-600 hover:text-rose-500'
                        : 'bg-black/80 border-stone-800 text-stone-300 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Gender badge */}
                  <span className={`absolute bottom-3 right-3 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                    fragrance.gender === 'Dama'
                      ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                      : fragrance.gender === 'Caballero'
                      ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                      : 'bg-amber-950/90 text-amber-200 border border-amber-800'
                  }`}>
                    {fragrance.gender}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAdminEditorOpen(true)}
                    className="w-full max-w-xs mx-auto py-2.5 rounded-xl bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#A07830] text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow hover:brightness-110 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Poner Foto Real / Editar Ficha</span>
                  </button>
                )}
              </div>

              {/* Right: Brand Card, Name & Fragrantica "Acordes Principales" */}
              <div className="md:col-span-7 space-y-4">
                {/* Brand Logo Card & Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div
                        className="inline-block px-3 py-1 rounded-md text-xs shadow font-black uppercase"
                        style={{ backgroundColor: brandCfg.bgColor, color: brandCfg.textColor }}
                      >
                        <span className={brandCfg.fontClass}>{brandCfg.label}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg border font-mono text-xs font-bold shadow ${
                        themeMode === 'white'
                          ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                          : 'bg-black/90 text-[#F0D080] border-[#C9A84C]/60'
                      }`}>
                        Código: {fragrance.code}
                      </span>
                    </div>
                    {/* Entire name without truncation */}
                    <h2 className={`text-2xl sm:text-3xl font-extrabold font-serif-luxury tracking-tight break-words whitespace-normal ${
                      themeMode === 'white' ? 'text-stone-950' : 'text-stone-100'
                    }`}>
                      {fragrance.name}
                    </h2>
                    <p className={`text-xs mt-1 break-words ${themeMode === 'white' ? 'text-stone-600' : 'text-stone-400'}`}>
                      {fragrance.family} · <span className={themeMode === 'white' ? 'text-amber-800 font-bold' : 'text-[#F0D080]'}>{fragrance.subfamily}</span>
                    </p>
                  </div>
                </div>

                {/* Acordes Principales (Fragrantica layout - sin texto de mayor a menor) */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  themeMode === 'white'
                    ? 'bg-stone-50 border-stone-200'
                    : 'bg-[#141414] border-stone-800'
                }`}>
                  <span className={`text-xs uppercase tracking-wider font-bold block ${
                    themeMode === 'white' ? 'text-stone-800' : 'text-[#F0D080]'
                  }`}>
                    acordes principales
                  </span>
                  <div className="space-y-1.5 pt-1">
                    {mainAccords.map((accord) => (
                      <div
                        key={accord.name}
                        style={{
                          backgroundColor: accord.color,
                          color: accord.textColor,
                          width: `${accord.percentage}%`
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-normal break-words"
                      >
                        {accord.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Intensity & Sillage Gauge */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F0D080] uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#C9A84C]" />
                      <span>Intensidad & Estela</span>
                    </span>
                    <span className="font-bold text-stone-100 px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px]">
                      {fragrance.intensity}
                    </span>
                  </div>

                  {/* 4 Segment Gauge */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {intensityLevels.map((lvl, idx) => {
                      const active = idx < currentLevelIdx;
                      return (
                        <div key={lvl.id} className="space-y-1">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              active
                                ? 'bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#F0D080] shadow-sm shadow-[#C9A84C]/40'
                                : 'bg-stone-800'
                            }`}
                          />
                          <span className={`text-[9px] block text-center uppercase tracking-tighter ${
                            active ? 'text-[#F0D080] font-bold' : 'text-stone-600'
                          }`}>
                            {lvl.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/60 gap-1">
                    <span>Radio de proyección: <strong className="text-stone-200">{intensityLevels[currentLevelIdx - 1]?.sillage}</strong></span>
                    <span>{intensityLevels[currentLevelIdx - 1]?.desc}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ¿A QUÉ HUELE ESTA FRAGANCIA? (Puntual, directo y sin relleno) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#C9A84C]/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F0D080]" />
                  <h3 className="text-sm sm:text-base font-bold font-serif-luxury text-[#F0D080] uppercase tracking-wider">
                    ¿A Qué Huele Esta Fragancia?
                  </h3>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  Perfil Olfativo Puntual
                </span>
              </div>

              {/* Punctual Sensory Breakdown */}
              <div className="space-y-3">
                <p className="text-sm text-stone-200 leading-relaxed font-sans font-medium break-words whitespace-normal">
                  {breakdown.resumen || getFullFragranceReview(fragrance)}
                </p>
              </div>

              {/* Sensory Breakdown Chips (Entire text visible, no truncation) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Sensación:</span>
                  <span className="text-stone-100 font-semibold block mt-0.5 break-words whitespace-normal">
                    {fragrance.sensation || 'Cálida / Especiada'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Nivel de Dulzor:</span>
                  <span className="text-[#F0D080] font-semibold block mt-0.5 break-words whitespace-normal">
                    {fragrance.sweetness || 'Moderado'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Piel Óptima:</span>
                  <span className="text-emerald-300 font-semibold block mt-0.5 break-words whitespace-normal">
                    {fragrance.skinCompat}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Personalidad:</span>
                  <span className="text-stone-100 font-semibold block mt-0.5 break-words whitespace-normal">
                    {fragrance.personality || 'Seductor, Urbano'}
                  </span>
                </div>
              </div>
            </div>

            {/* CUÁNDO USARLO (Sin líneas en los lados) */}
            <div className="p-5 rounded-3xl bg-[#0f0f0f] border border-stone-800 space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-[#F0D080] font-bold block">
                CUÁNDO USARLO
              </h4>
              <p className="text-sm text-stone-200 leading-relaxed break-words whitespace-normal">
                {getOccasionDescription(fragrance.occasion)}
              </p>
              <div className="pt-2 text-xs text-stone-400 flex flex-wrap items-center gap-3 border-t border-stone-800/80">
                <span>Ambiente: <strong className="text-stone-200">{fragrance.environment}</strong></span>
                <span>•</span>
                <span>Rango de edad recomendado: <strong className="text-stone-200">{fragrance.ageRange}</strong></span>
              </div>
            </div>

            {/* PIRÁMIDE OLFATIVA (Sin líneas en los lados) */}
            <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-[#C9A84C]/35 space-y-6">
              <div className="text-center space-y-1.5 border-b border-stone-800 pb-3">
                <h4 className="text-xs uppercase tracking-widest text-[#F0D080] font-bold">
                  PIRÁMIDE OLFATIVA
                </h4>
                <p className="text-xs text-stone-400">
                  Evolución cronológica de cada acorde sobre tu piel.
                </p>
                {isAdmin && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#F0D080] text-[11px] font-semibold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Modo Administrador: Haz clic en cualquier nota para copiar y pegar su foto</span>
                  </div>
                )}
              </div>

              {/* NOTAS DE SALIDA (TOP) */}
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-[#F0D080]">
                  <span>SALIDA (Top Notes)</span>
                  <span className="text-[10px] text-stone-500 font-normal">Primeros 15 minutos</span>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {fragrance.pyramid.top.map((note) => {
                    const visual = getRealNotePhoto(note);
                    return (
                      <div
                        key={note}
                        onClick={() => {
                          if (isAdmin) {
                            setEditingNoteForPhoto(note);
                          } else {
                            setSelectedNotePopup(note);
                          }
                        }}
                        className={`flex flex-col items-center p-2 rounded-2xl bg-[#141414] border ${
                          isAdmin ? 'border-[#C9A84C]/60 hover:border-[#F0D080]' : 'border-stone-800 hover:border-[#C9A84C]'
                        } cursor-pointer group transition-all relative`}
                        title={isAdmin ? `Administrador: Clic para copiar/pegar foto de ${note}` : `Ver detalles de ${note}`}
                      >
                        {isAdmin && (
                          <div className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-[#C9A84C] text-stone-950 flex items-center justify-center shadow-md">
                            <Camera className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                          <img
                            src={visual.photoUrl}
                            alt={note}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <span className="text-xs text-stone-200 mt-1.5 group-hover:text-[#F0D080] max-w-[90px] text-center break-words whitespace-normal leading-tight">
                          {note.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NOTAS DE CORAZÓN (HEART) */}
              <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-rose-300">
                  <span>CORAZÓN (Heart Notes)</span>
                  <span className="text-[10px] text-stone-500 font-normal">2 a 4 horas</span>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {fragrance.pyramid.heart.map((note) => {
                    const visual = getRealNotePhoto(note);
                    return (
                      <div
                        key={note}
                        onClick={() => {
                          if (isAdmin) {
                            setEditingNoteForPhoto(note);
                          } else {
                            setSelectedNotePopup(note);
                          }
                        }}
                        className={`flex flex-col items-center p-2 rounded-2xl bg-[#141414] border ${
                          isAdmin ? 'border-[#C9A84C]/60 hover:border-[#F0D080]' : 'border-stone-800 hover:border-rose-400'
                        } cursor-pointer group transition-all relative`}
                        title={isAdmin ? `Administrador: Clic para copiar/pegar foto de ${note}` : `Ver detalles de ${note}`}
                      >
                        {isAdmin && (
                          <div className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-[#C9A84C] text-stone-950 flex items-center justify-center shadow-md">
                            <Camera className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                          <img
                            src={visual.photoUrl}
                            alt={note}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <span className="text-xs text-stone-200 mt-1.5 group-hover:text-rose-300 max-w-[90px] text-center break-words whitespace-normal leading-tight">
                          {note.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NOTAS DE FONDO (BASE) */}
              <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-amber-300">
                  <span>BASE / FONDO (Base Notes)</span>
                  <span className="text-[10px] text-stone-500 font-normal">Más de 6 a 12 horas</span>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {fragrance.pyramid.base.map((note) => {
                    const visual = getRealNotePhoto(note);
                    return (
                      <div
                        key={note}
                        onClick={() => {
                          if (isAdmin) {
                            setEditingNoteForPhoto(note);
                          } else {
                            setSelectedNotePopup(note);
                          }
                        }}
                        className={`flex flex-col items-center p-2 rounded-2xl bg-[#141414] border ${
                          isAdmin ? 'border-[#C9A84C]/60 hover:border-[#F0D080]' : 'border-stone-800 hover:border-amber-400'
                        } cursor-pointer group transition-all relative`}
                        title={isAdmin ? `Administrador: Clic para copiar/pegar foto de ${note}` : `Ver detalles de ${note}`}
                      >
                        {isAdmin && (
                          <div className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-[#C9A84C] text-stone-950 flex items-center justify-center shadow-md">
                            <Camera className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden shadow group-hover:scale-105 transition-transform">
                          <img
                            src={visual.photoUrl}
                            alt={note}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <span className="text-xs text-stone-200 mt-1.5 group-hover:text-amber-300 max-w-[90px] text-center break-words whitespace-normal leading-tight">
                          {note.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FRAGANCIAS SIMILARES (Sin mención de Jaccard visual para el cliente) */}
            <div className="space-y-4 pt-6 border-t border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F0D080]" />
                    <span>Fragancias Similares</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Alternativas con mayor afinidad y notas compartidas en salida, corazón y fondo.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#181818] border border-[#C9A84C]/40 text-[11px] font-mono text-[#F0D080] self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
                  <span>Afinidad Olfativa</span>
                </div>
              </div>

              {similarItems.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-[#121212] border border-stone-800 text-xs text-stone-400">
                  No hay otras fragancias en este rango con afinidad de notas compartidas suficientes.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarItems.map(({ fragrance: sim, jaccardPercentage, sharedTopNotes, sharedHeartNotes, sharedBaseNotes, allSharedNotes }) => {
                    const simBottle = getPerfumeBottlePhoto(sim.name, sim.gender, sim.image, sim.code);
                    return (
                      <div
                        key={sim.id}
                        onClick={() => onSelectAnother(sim)}
                        className="p-3.5 rounded-2xl bg-[#121212] border border-stone-800 hover:border-[#C9A84C] cursor-pointer group transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
                      >
                        {/* Match Score Pill */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#F0D080] border border-stone-800 font-bold">
                            {sim.code}
                          </span>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e1708] border border-[#C9A84C]/60 text-[11px] font-bold text-[#F0D080]">
                            <Sparkles className="w-2.5 h-2.5 text-[#F0D080]" />
                            <span>{jaccardPercentage}% afinidad</span>
                          </div>
                        </div>

                        {/* Flacon bottle real photo */}
                        <div className="relative aspect-square rounded-xl bg-gradient-to-b from-stone-900 to-black border border-stone-800/80 p-2 overflow-hidden flex items-center justify-center">
                          <img
                            src={simBottle}
                            alt={sim.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                          />
                          <span className={`absolute bottom-1.5 right-1.5 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                            sim.gender === 'Dama'
                              ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                              : sim.gender === 'Caballero'
                              ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                              : 'bg-amber-950/90 text-amber-200 border border-amber-800'
                          }`}>
                            {sim.gender}
                          </span>
                        </div>

                        {/* Name & Brand with full text, NO truncation */}
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                            {sim.brand}
                          </span>
                          <h5 className="font-bold text-xs text-stone-100 group-hover:text-[#F0D080] break-words whitespace-normal">
                            {sim.name}
                          </h5>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {sim.family}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F0D080] rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(15, jaccardPercentage))}%` }}
                            />
                          </div>
                        </div>

                        {/* Shared Notes by Tier (Full text, no cutoffs) */}
                        <div className="pt-2 border-t border-stone-800/80 space-y-1 text-[10px]">
                          {sharedTopNotes.length > 0 && (
                            <div className="flex flex-col text-stone-300">
                              <span className="text-[#F0D080] font-semibold">Salida compartida:</span>
                              <span className="text-stone-400 break-words">{sharedTopNotes.join(', ')}</span>
                            </div>
                          )}
                          {sharedHeartNotes.length > 0 && (
                            <div className="flex flex-col text-stone-300">
                              <span className="text-rose-400 font-semibold">Corazón compartido:</span>
                              <span className="text-stone-400 break-words">{sharedHeartNotes.join(', ')}</span>
                            </div>
                          )}
                          {sharedBaseNotes.length > 0 && (
                            <div className="flex flex-col text-stone-300">
                              <span className="text-amber-400 font-semibold">Fondo compartido:</span>
                              <span className="text-stone-400 break-words">{sharedBaseNotes.join(', ')}</span>
                            </div>
                          )}
                          {allSharedNotes.length === 0 && (
                            <span className="text-stone-500 italic block">Similitud por familia y acordes</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* INGREDIENT DETAIL POPUP MODAL */}
          {selectedNotePopup && (() => {
            const noteVisual = getRealNotePhoto(selectedNotePopup);
            const isTop = fragrance.pyramid.top.includes(selectedNotePopup);
            const isHeart = fragrance.pyramid.heart.includes(selectedNotePopup);
            const isBase = fragrance.pyramid.base.includes(selectedNotePopup);

            return (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
                onClick={() => setSelectedNotePopup(null)}
              >
                <div
                  className="relative w-full max-w-sm bg-[#121212] border border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedNotePopup(null)}
                    className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-100 bg-stone-900 rounded-full border border-stone-800"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1.5 shadow-xl overflow-hidden border border-[#C9A84C]/40">
                    <img
                      src={noteVisual.photoUrl}
                      alt={noteVisual.name || selectedNotePopup}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <h4 className="text-xl font-bold font-serif-luxury text-stone-100 capitalize break-words">
                      {noteVisual.name || selectedNotePopup}
                    </h4>
                    {noteVisual.botanicalName && (
                      <p className="text-xs text-stone-400 italic">
                        {noteVisual.botanicalName}
                      </p>
                    )}
                    <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#F0D080]">
                      Grupo: {noteVisual.category.toUpperCase()}
                    </p>
                    <div className="flex justify-center gap-1.5 pt-1 text-[11px]">
                      {isTop && (
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-[#F0D080]/40 text-[#F0D080] font-semibold">
                          Salida (Top)
                        </span>
                      )}
                      {isHeart && (
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-rose-500/40 text-rose-300 font-semibold">
                          Corazón (Heart)
                        </span>
                      )}
                      {isBase && (
                        <span className="px-2 py-0.5 rounded bg-stone-900 border border-amber-500/40 text-amber-300 font-semibold">
                          Fondo (Base)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-black/50 rounded-2xl border border-stone-800 text-xs text-stone-300 leading-relaxed text-left space-y-1">
                    <span className="text-[#F0D080] font-bold text-[11px] block uppercase tracking-wide">
                      Perfil Aromático:
                    </span>
                    <p>{noteVisual.description}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          const targetNote = selectedNotePopup;
                          setSelectedNotePopup(null);
                          setEditingNoteForPhoto(targetNote);
                        }}
                        className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#F0D080] border border-[#C9A84C]/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Nota (Nombre, Descripción, Foto)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedNotePopup(null)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#A07830] to-[#C9A84C] text-stone-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
                    >
                      Cerrar Ficha
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Admin Quick Editor Modal */}
      {isAdmin && (
        <>
          <AdminFragranceEditorModal
            fragrance={fragrance}
            isOpen={isAdminEditorOpen}
            onClose={() => setIsAdminEditorOpen(false)}
            onSaved={(updated) => {
              setCurrentFragrance(updated);
            }}
          />

          <AdminNotePhotoEditorModal
            noteName={editingNoteForPhoto}
            isOpen={!!editingNoteForPhoto}
            onClose={() => setEditingNoteForPhoto(null)}
            onSaved={() => {
              setNoteVersion((v) => v + 1);
            }}
          />
        </>
      )}
    </>
  );
};
