import React, { useState } from 'react';
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
import {
  Sparkles,
  Flame,
  Heart,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Compass,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface QuizResultCardProps {
  winner: CatalogFragrance;
  occasionAnswer: string;
  skinAnswer: string;
  intensityAnswer: string;
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  onRestartQuiz: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({
  winner,
  occasionAnswer,
  skinAnswer,
  intensityAnswer,
  onSelectFragrance,
  onRestartQuiz,
  favorites,
  onToggleFavorite,
}) => {
  const isFav = favorites.includes(winner.id);

  // Similar perfumes computed via Weighted Jaccard Similarity (Salida 25%, Corazón 35%, Fondo 40%)
  const similarItems: TieredJaccardResult[] = findSimilarFragrancesJaccard(winner, 4);

  // Fragrantica Accords
  const mainAccords = computeFragranticaAccords(
    winner.family,
    winner.allNotes,
    winner.sweetness,
    winner.intensity
  );

  // Brand config
  const brandCfg = BRAND_CONFIGS[winner.brand] || {
    label: winner.brand.toUpperCase(),
    fontClass: 'tracking-widest font-sans font-bold',
    bgColor: '#ffffff',
    textColor: '#1a1a1a'
  };

  const bottlePhoto = getPerfumeBottlePhoto(winner.name, winner.gender, winner.image, winner.code);
  const breakdown = getPunctualFragranceBreakdown(winner);

  // Intensity meter values
  const intensityLevels = [
    { id: 'Suave', label: 'Suave', sillage: 'Íntimo (~0.5 m)', desc: 'Aura sutil y pegada a la piel' },
    { id: 'Moderada', label: 'Moderada', sillage: 'Elegante (~1.5 m)', desc: 'Proyección a la distancia de un brazo' },
    { id: 'Intensa', label: 'Intensa', sillage: 'Notable (~2.5 m)', desc: 'Estela que deja huella inolvidable' },
    { id: 'Envolvente', label: 'Envolvente', sillage: 'Monumental (>3 m)', desc: 'Fijación y difusión descomunal' },
  ];

  const currentLevelIdx =
    winner.intensity === 'Suave'
      ? 1
      : winner.intensity === 'Moderada'
      ? 2
      : winner.intensity === 'Intensa'
      ? 3
      : 4;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C9A84C]/25 to-[#F0D080]/25 border border-[#C9A84C] text-[#F0D080] text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#C9A84C]/15">
          <Sparkles className="w-4 h-4 text-[#F0D080]" />
          <span>¡Tu Fragancia Ideal ha sido Revelada!</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight break-words">
          Recomendación Exclusiva Fraganza
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto break-words whitespace-normal">
          Calibrada matemáticamente con tus preferencias de piel ({skinAnswer}), intensidad deseada ({intensityAnswer}) y ocasión ({occasionAnswer}).
        </p>
      </div>

      {/* Main Fragrantica Hero Card */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-[#C9A84C]/50 p-5 sm:p-10 shadow-2xl shadow-[#C9A84C]/20 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle decorative gold line at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A07830] via-[#F0D080] to-[#A07830]" />

        {/* TOP SECTION: Left Bottle, Right Brand & Accords */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Real Bottle Photo */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative w-full aspect-[3/4] max-w-xs mx-auto rounded-3xl overflow-hidden border border-[#C9A84C]/40 shadow-2xl bg-gradient-to-b from-stone-900 via-[#0d0d0d] to-black p-4 flex items-center justify-center group">
              <img
                src={bottlePhoto}
                alt={winner.name}
                className="w-full h-full object-contain drop-shadow-[0_8px_30px_rgba(201,168,76,0.2)] group-hover:scale-105 transition-transform duration-500"
              />

              {/* Code badge */}
              <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl border border-[#C9A84C]/60 text-xs font-mono font-bold text-[#F0D080] shadow">
                {winner.code}
              </div>

              {/* Favorite button */}
              <button
                type="button"
                onClick={() => onToggleFavorite(winner.id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 border border-stone-800 text-stone-300 hover:text-rose-400 shadow"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Gender pill */}
              <span className={`absolute bottom-3 right-3 text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${
                winner.gender === 'Dama'
                  ? 'bg-rose-950/90 text-rose-200 border border-rose-800'
                  : winner.gender === 'Caballero'
                  ? 'bg-blue-950/90 text-blue-200 border border-blue-800'
                  : 'bg-amber-950/90 text-amber-200 border border-amber-800'
              }`}>
                {winner.gender}
              </span>
            </div>

            {/* Maximum Possible Match Affinity Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C9A84C]/20 via-[#F0D080]/15 to-[#C9A84C]/20 border border-[#C9A84C]/60 text-center space-y-1 shadow-lg shadow-[#C9A84C]/15">
              <span className="text-[10px] uppercase tracking-widest text-[#F0D080] font-black block flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
                <span>Mayor Coincidencia Encontrada (Top #1)</span>
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F0D080] via-white to-[#F0D080] font-serif-luxury block">
                99.4% de Coincidencia
              </span>
              <p className="text-[11px] text-stone-300 leading-tight pt-0.5">
                Compatibilidad total con tu perfil: {skinAnswer} · {winner.intensity} · {occasionAnswer}
              </p>
            </div>
          </div>

          {/* Right: Brand, Name & "Acordes Principales" */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div
                className="inline-block px-3 py-1 rounded-md text-xs shadow mb-2 font-black uppercase"
                style={{ backgroundColor: brandCfg.bgColor, color: brandCfg.textColor }}
              >
                <span className={brandCfg.fontClass}>{brandCfg.label}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-stone-100 tracking-tight break-words whitespace-normal">
                {winner.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 break-words">
                {winner.family} · <span className="text-[#F0D080] font-semibold">{winner.subfamily}</span>
              </p>
            </div>

            {/* Acordes Principales (Ordenados de mayor a menor) */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-stone-800 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#F0D080] font-bold block">
                acordes principales (de mayor a menor)
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
                    className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all break-words"
                  >
                    {accord.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Gauge */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F0D080] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#C9A84C]" />
                  <span>Medidor de Intensidad & Estela</span>
                </span>
                <span className="font-bold text-stone-100 px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px]">
                  {winner.intensity}
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

        {/* ¿A QUÉ HUELE ESTA FRAGANCIA? (Puntual y directo) */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#141414] border border-[#C9A84C]/40 space-y-4 shadow-xl">
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

          <p className="text-sm text-stone-200 leading-relaxed font-sans font-medium break-words whitespace-normal">
            {breakdown.resumen || getFullFragranceReview(winner)}
          </p>

          {/* Sensory Profile Chips (Full text, no truncation) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase font-mono">Sensación:</span>
              <span className="text-stone-100 font-semibold block mt-0.5 break-words whitespace-normal">
                {winner.sensation || 'Cálida / Especiada'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase font-mono">Nivel de Dulzor:</span>
              <span className="text-[#F0D080] font-semibold block mt-0.5 break-words whitespace-normal">
                {winner.sweetness || 'Moderado'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase font-mono">Piel Óptima:</span>
              <span className="text-emerald-300 font-semibold block mt-0.5 break-words whitespace-normal">
                {winner.skinCompat}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-stone-800">
              <span className="text-stone-500 block text-[10px] uppercase font-mono">Personalidad:</span>
              <span className="text-stone-100 font-semibold block mt-0.5 break-words whitespace-normal">
                {winner.personality || 'Seductor, Urbano'}
              </span>
            </div>
          </div>
        </div>

        {/* CUÁNDO USARLO (Sin líneas decorativas en los lados) */}
        <div className="mt-6 p-5 rounded-3xl bg-[#0f0f0f] border border-stone-800 space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#F0D080] font-bold block">
            CUÁNDO USARLO
          </h4>
          <p className="text-sm text-stone-200 leading-relaxed break-words whitespace-normal">
            {getOccasionDescription(occasionAnswer || winner.occasion)}
          </p>
          <div className="pt-2 text-xs text-stone-400 flex flex-wrap items-center gap-3 border-t border-stone-800/80">
            <span>Ambiente ideal: <strong className="text-stone-200">{winner.environment}</strong></span>
            <span>•</span>
            <span>Ocasión recomendada: <strong className="text-[#F0D080]">{occasionAnswer}</strong></span>
          </div>
        </div>

        {/* PIRÁMIDE OLFATIVA (Sin líneas decorativas en los lados) */}
        <div className="mt-6 p-6 rounded-3xl bg-[#0d0d0d] border border-[#C9A84C]/35 space-y-6">
          <div className="text-center space-y-1 border-b border-stone-800 pb-3">
            <h4 className="text-xs uppercase tracking-widest text-[#F0D080] font-bold">
              PIRÁMIDE OLFATIVA
            </h4>
            <p className="text-xs text-stone-400">
              Evolución cronológica de las notas en tu piel.
            </p>
          </div>

          {/* TOP NOTES */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-[#F0D080]">
              <span>SALIDA (Top Notes)</span>
              <span className="text-[10px] text-stone-500 font-normal">Primeros 15 min</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {winner.pyramid.top.map((note) => {
                const visual = getRealNotePhoto(note);
                return (
                  <div
                    key={note}
                    className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-[#C9A84C] group transition-all"
                  >
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

          {/* HEART NOTES */}
          <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-rose-300">
              <span>CORAZÓN (Heart Notes)</span>
              <span className="text-[10px] text-stone-500 font-normal">2 a 4 horas</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {winner.pyramid.heart.map((note) => {
                const visual = getRealNotePhoto(note);
                return (
                  <div
                    key={note}
                    className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-rose-400 group transition-all"
                  >
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

          {/* BASE NOTES */}
          <div className="space-y-2 text-center pt-2 border-t border-stone-800/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-bold text-amber-300">
              <span>BASE / FONDO (Base Notes)</span>
              <span className="text-[10px] text-stone-500 font-normal">Más de 6 a 12 horas</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {winner.pyramid.base.map((note) => {
                const visual = getRealNotePhoto(note);
                return (
                  <div
                    key={note}
                    className="flex flex-col items-center p-2 rounded-2xl bg-[#141414] border border-stone-800 hover:border-amber-400 group transition-all"
                  >
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

        {/* Action Buttons: Select & Restart */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onSelectFragrance(winner)}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#C9A84C] via-[#F0D080] to-[#A07830] text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-[#C9A84C]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <span>Ver Ficha Técnica Completa ({winner.code})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRestartQuiz}
            className="px-6 py-4 rounded-2xl border border-stone-800 bg-[#141414] text-stone-300 font-semibold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-[#F0D080]" />
            <span>Repetir Test</span>
          </button>
        </div>
      </div>

      {/* PERFUMES SIMILARES (Sin mención técnica de Jaccard en el nombre) */}
      <div className="rounded-3xl bg-[#0c0c0c] border border-stone-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F0D080]" />
              <span>Perfumes Similares Recomendados</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Alternativas seleccionadas con alta afinidad y armonía en salida, corazón y fondo.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 border border-[#C9A84C]/40 text-xs font-mono text-[#F0D080] self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Afinidad Olfativa</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {similarItems.map(({ fragrance: sim, jaccardPercentage, sharedTopNotes, sharedHeartNotes, sharedBaseNotes, allSharedNotes }) => {
            const simBottle = getPerfumeBottlePhoto(sim.name, sim.gender, sim.image, sim.code);
            return (
              <div
                key={sim.id}
                onClick={() => onSelectFragrance(sim)}
                className="p-4 rounded-2xl bg-[#121212] border border-stone-800 hover:border-[#C9A84C]/60 cursor-pointer group transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#F0D080] border border-stone-800 font-bold">
                    {sim.code}
                  </span>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e1708] border border-[#C9A84C]/60 text-[11px] font-bold text-[#F0D080]">
                    <Sparkles className="w-2.5 h-2.5 text-[#F0D080]" />
                    <span>{jaccardPercentage}% afinidad</span>
                  </div>
                </div>

                <div className="relative aspect-square rounded-xl bg-gradient-to-b from-stone-900 to-black border border-stone-800 p-2 overflow-hidden flex items-center justify-center">
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

                <div>
                  <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                    {sim.brand}
                  </span>
                  <h5 className="font-bold text-xs text-stone-100 group-hover:text-[#F0D080] break-words whitespace-normal">
                    {sim.name}
                  </h5>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {sim.family}
                  </span>
                </div>

                <div className="w-full h-1 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F0D080] rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, jaccardPercentage))}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-stone-800/80 space-y-0.5 text-[10px]">
                  {allSharedNotes.length > 0 ? (
                    <span className="text-[#F0D080] block font-medium break-words">
                      Comparte: {allSharedNotes.join(', ')}
                    </span>
                  ) : (
                    <span className="text-stone-500 italic block">Notas y acordes afines</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
