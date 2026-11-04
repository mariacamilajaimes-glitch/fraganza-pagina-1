import React, { useState } from 'react';
import {
  Fragrance,
  FRAGRANCES,
  GenderCategory,
  OlfactoryFamily,
  RecommendationCriteria,
  scoreFragrance,
  POPULAR_NOTES,
} from '../data/fragrances';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

interface RecommendationQuizProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCompare: (fragrance: Fragrance) => void;
  compareList: Fragrance[];
}

export const RecommendationQuiz: React.FC<RecommendationQuizProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
  onAddToCompare,
  compareList,
}) => {
  const [step, setStep] = useState<number>(1);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Criteria state
  const [criteria, setCriteria] = useState<RecommendationCriteria>({
    gender: 'Cualquiera',
    familyPreference: 'Cualquiera',
    occasions: ['Uso diario / Oficina'],
    seasons: ['Primavera', 'Verano'],
    longevityPreference: 'Equilibrada',
    intensityPreference: 'Alta',
    notesLove: ['Vainilla', 'Bergamota'],
    budget: 'Cualquiera',
  });

  const toggleOccasion = (occasion: string) => {
    setCriteria((prev) => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter((o) => o !== occasion)
        : [...prev.occasions, occasion],
    }));
  };

  const toggleSeason = (season: string) => {
    setCriteria((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }));
  };

  const toggleNote = (note: string) => {
    setCriteria((prev) => ({
      ...prev,
      notesLove: prev.notesLove.includes(note)
        ? prev.notesLove.filter((n) => n !== note)
        : [...prev.notesLove, note],
    }));
  };

  // Calculate results
  const rankedFragrances = FRAGRANCES.map((fragrance) => {
    const { score, matchReasons } = scoreFragrance(fragrance, criteria);
    return {
      fragrance,
      score,
      matchReasons,
    };
  }).sort((a, b) => b.score - a.score);

  const resetQuiz = () => {
    setStep(1);
    setQuizFinished(false);
    setCriteria({
      gender: 'Cualquiera',
      familyPreference: 'Cualquiera',
      occasions: ['Uso diario / Oficina'],
      seasons: ['Primavera', 'Verano'],
      longevityPreference: 'Equilibrada',
      intensityPreference: 'Alta',
      notesLove: ['Vainilla', 'Bergamota'],
      budget: 'Cualquiera',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Asesor Inteligente de Perfumería</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight">
          Encuentra tu Fragancia Firma
        </h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-sm md:text-base">
          Responde unas breves preguntas sobre tus gustos, ocasiones y notas olfativas preferidas. Nuestro motor emparejará tu perfil con las mejores creaciones del mundo.
        </p>
      </div>

      {!quizFinished ? (
        /* Quiz Steps Card */
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle gold gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

          {/* Stepper Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-800 mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Paso {step} de 5
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-amber-400'
                      : s < step
                      ? 'w-4 bg-amber-600/70'
                      : 'w-4 bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Gender / Profile */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
                  ¿Para qué perfil buscas la fragancia?
                </h3>
                <p className="text-stone-400 text-xs md:text-sm mt-1">
                  Puedes seleccionar una inclinación específica o elegir Unisex / Cualquiera para explorar sin barreras.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'Femenino', label: 'Para Ella (Femenino)', desc: 'Notas florales, dulces, sensuales y luminosas' },
                  { id: 'Masculino', label: 'Para Él (Masculino)', desc: 'Notas amaderadas, fougère, cuero y frescas' },
                  { id: 'Unisex', label: 'Unisex', desc: 'Aromas equilibrados, modernos y versátiles' },
                  { id: 'Cualquiera', label: 'Abierto a Todo', desc: 'Quiero ver las mejores creaciones sin filtro' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCriteria({ ...criteria, gender: item.id as any })}
                    className={`p-5 rounded-xl text-left border transition-all ${
                      criteria.gender === item.id
                        ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-stone-100">{item.label}</span>
                      {criteria.gender === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Occasions */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
                  ¿En qué momentos u ocasiones planeas usarla?
                </h3>
                <p className="text-stone-400 text-xs md:text-sm mt-1">
                  Selecciona todas las que apliquen para afinar la versatilidad de la recomendación.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Uso diario / Oficina',
                  'Citas nocturnas',
                  'Eventos elegantes',
                  'Casual / Fin de semana',
                  'Fiesta / Clubbing',
                  'Gimnasio / Frescura',
                  'Ocasiones especiales',
                ].map((occ) => {
                  const selected = criteria.occasions.includes(occ);
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => toggleOccasion(occ)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-amber-500/15 border-amber-500 text-stone-100 font-medium'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <span className="text-sm">{occ}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          selected
                            ? 'bg-amber-500 border-amber-500 text-stone-950'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Seasons & Intensity */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
                    ¿Qué clima o estación prefieres?
                  </h3>
                  <p className="text-stone-400 text-xs md:text-sm mt-1">
                    El calor resalta cítricos y acuáticos; el frío magnifica ámbar, especias y maderas.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Primavera', 'Verano', 'Otoño', 'Invierno'].map((s) => {
                    const selected = criteria.seasons.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSeason(s)}
                        className={`p-3.5 rounded-xl border text-center transition-all ${
                          selected
                            ? 'bg-amber-500/15 border-amber-500 text-stone-100 font-semibold'
                            : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <span className="text-sm">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity */}
              <div className="pt-4 border-t border-stone-800/80 space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Intensidad y Proyección Deseada
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Discreta', label: 'Discreta / Íntima', desc: 'Aroma sutil que solo perciben al abrazarte' },
                    { id: 'Equilibrada', label: 'Equilibrada / Versátil', desc: 'Elegante estela que te acompaña en la oficina' },
                    { id: 'Alta', label: 'Intensa / Presencia Total', desc: 'Deja huella en la habitación, duración extrema' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCriteria({ ...criteria, intensityPreference: lvl.id })}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        criteria.intensityPreference === lvl.id
                          ? 'bg-amber-500/15 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{lvl.label}</p>
                      <p className="text-xs text-stone-400">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Olfactory Family Preference */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
                  ¿Tienes alguna familia olfativa predilecta?
                </h3>
                <p className="text-stone-400 text-xs md:text-sm mt-1">
                  Si no estás seguro, puedes seleccionar &quot;Descubrir cualquiera&quot; para una exploración guiada.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Cualquiera', desc: 'Sorpréndeme con la mejor combinación' },
                  { name: 'Amaderada', desc: 'Cedro, sándalo, vetiver y maderas nobles' },
                  { name: 'Oriental / Especiada', desc: 'Canela, azafrán, ámbar y misterio cálido' },
                  { name: 'Cítrica', desc: 'Limón de Sicilia, bergamota, mandarina vibrante' },
                  { name: 'Acuática / Marina', desc: 'Brisa marina, notas ozónicas y frescor limpio' },
                  { name: 'Gourmand', desc: 'Vainilla, café negro, praliné y dulzura irresistible' },
                  { name: 'Floral', desc: 'Rosa de mayo, jazmín, lavanda y azahar blanco' },
                  { name: 'Aromática Fougère', desc: 'Lavanda clásica, salvia y frescura masculina' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCriteria({ ...criteria, familyPreference: item.name as any })}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      criteria.familyPreference === item.name
                        ? 'bg-amber-500/15 border-amber-500 text-stone-100 ring-1 ring-amber-500'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{item.name}</span>
                      {criteria.familyPreference === item.name && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <span className="text-xs text-stone-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Notes & Budget */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif-luxury text-stone-100">
                    Selecciona las notas olfativas que te fascinan
                  </h3>
                  <p className="text-stone-400 text-xs md:text-sm mt-1">
                    Haz clic en los ingredientes que disfrutas percibir en tu piel.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_NOTES.map((note) => {
                    const selected = criteria.notesLove.includes(note);
                    return (
                      <button
                        key={note}
                        type="button"
                        onClick={() => toggleNote(note)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          selected
                            ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-stone-950/70 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        {selected ? `✓ ${note}` : `+ ${note}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Presupuesto */}
              <div className="pt-4 border-t border-stone-800 space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Rango de Presupuesto
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'Cualquiera', label: 'Sin límite' },
                    { id: '$', label: '$ Económico' },
                    { id: '$$', label: '$$ Accesible' },
                    { id: '$$$', label: '$$$ Diseñador' },
                    { id: '$$$$', label: '$$$$ Lujo / Nicho' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setCriteria({ ...criteria, budget: b.id as any })}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                        criteria.budget === b.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-stone-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setQuizFinished(true)}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 text-xs md:text-sm font-extrabold transition-all shadow-xl shadow-amber-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Ver Mis Recomendaciones
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-6 animate-in fade-in duration-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/80 p-5 rounded-2xl border border-stone-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
                <Award className="w-4 h-4" /> Resultados de Afinidad Olfativa
              </span>
              <p className="text-sm text-stone-300 mt-1">
                Hemos clasificado las fragancias que mejor encajan con tu estilo de vida y notas deseadas.
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors border border-stone-700 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ajustar respuestas
            </button>
          </div>

          {/* Top Fragrances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedFragrances.map(({ fragrance, score, matchReasons }, index) => {
              const isFav = favorites.includes(fragrance.id);
              const isInComp = compareList.some((c) => c.id === fragrance.id);

              return (
                <div
                  key={fragrance.id}
                  className="bg-stone-900/90 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden group shadow-xl relative"
                >
                  {/* Top Match Badge */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <Flame className="w-3.5 h-3.5 fill-stone-950" />
                      Mejor Coincidencia
                    </div>
                  )}

                  {/* Affinity Score Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-stone-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-400 text-xs font-bold">
                    {score}% Afinidad
                  </div>

                  {/* Bottle Image */}
                  <div
                    onClick={() => onSelectFragrance(fragrance)}
                    className="relative w-full h-52 bg-stone-950 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={fragrance.image}
                      alt={fragrance.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                        {fragrance.brand}
                      </span>
                      <h3 className="text-lg font-bold text-stone-100 font-serif-luxury truncate">
                        {fragrance.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-stone-300 border border-stone-700">
                        {fragrance.family}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-stone-300 border border-stone-700">
                        {fragrance.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-amber-300/80 border border-stone-700">
                        {fragrance.concentration}
                      </span>
                    </div>

                    {/* Match Reasons */}
                    <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-xs space-y-1.5">
                      <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                        ¿Por qué coincide contigo?
                      </p>
                      {matchReasons.slice(0, 2).map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1.5 text-stone-300 text-[11px]">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Notes preview */}
                    <div className="text-xs text-stone-400">
                      <span className="text-stone-500 font-semibold">Notas clave: </span>
                      {fragrance.pyramid.heart.slice(0, 3).join(', ')}, {fragrance.pyramid.base[0]}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                      <button
                        onClick={() => onSelectFragrance(fragrance)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
                      >
                        Ver Pirámide
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onAddToCompare(fragrance)}
                        title="Añadir a comparar"
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          isInComp
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleFavorite(fragrance.id)}
                        title="Guardar en favoritos"
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          isFav
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
