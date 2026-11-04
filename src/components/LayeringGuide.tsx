import React from 'react';
import { LAYERING_COMBOS, PERSONALITY_ARCHETYPES, FRAGRANCES, Fragrance } from '../data/fragrances';
import { Sparkles, Layers, BookOpen, Flame, Waves, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

interface LayeringGuideProps {
  onSelectFragranceByName: (name: string) => void;
}

export const LayeringGuide: React.FC<LayeringGuideProps> = ({ onSelectFragranceByName }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Alta Perfumería & Técnicas de Autor</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight">
          El Arte del Layering & Consejos
        </h2>
        <p className="text-stone-400 max-w-2xl mx-auto text-sm md:text-base">
          Aprende a superponer acordes para crear una firma olfativa única e intransferible que nadie más en el mundo llevará.
        </p>
      </div>

      {/* Rules of Layering */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif-luxury">
            La Regla de la Densidad
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Aplica siempre la fragancia más densa y pesada primero (maderas, ámbar, vainillas u oud) en los puntos de pulso. Luego, rocía la fragancia más ligera o cítrica por encima.
          </p>
        </div>

        <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif-luxury">
            Nunca Frotar las Muñecas
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Frotar las muñecas genera calor por fricción que rompe las delicadas moléculas de las notas de salida (cítricos y flores volátiles), alterando la evolución natural del perfume.
          </p>
        </div>

        <div className="bg-stone-900/80 p-6 rounded-2xl border border-stone-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-stone-100 font-serif-luxury">
            Hidratación = Duración
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Las moléculas de fragancia se adhieren a los lípidos de la piel. Aplicar una crema hidratante sin aroma o vaselina neutra en cuello y muñecas duplica la duración de tu colonia.
          </p>
        </div>
      </div>

      {/* Layering Recipes */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Recetas Maestras Recomendadas
          </span>
          <h3 className="text-2xl font-bold font-serif-luxury text-stone-100">
            Dúos Olfativos que Sorprenden
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LAYERING_COMBOS.map((combo, idx) => (
            <div
              key={idx}
              className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Receta #{idx + 1}
                </span>

                <h4 className="text-lg font-bold font-serif-luxury text-stone-100">
                  {combo.title}
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                        Capa 1 (Base cálida)
                      </span>
                      <button
                        onClick={() => onSelectFragranceByName(combo.fragrance1)}
                        className="text-xs font-semibold text-amber-300 hover:underline text-left"
                      >
                        {combo.fragrance1}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center text-stone-600 text-xs font-bold">+</div>

                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                        Capa 2 (Toque chispeante)
                      </span>
                      <button
                        onClick={() => onSelectFragranceByName(combo.fragrance2)}
                        className="text-xs font-semibold text-amber-300 hover:underline text-left"
                      >
                        {combo.fragrance2}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {combo.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-semibold block text-amber-300 mb-0.5">Efecto:</span>
                {combo.effect}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fragrance Archetypes */}
      <div className="space-y-6 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Psicología del Olfato
          </span>
          <h3 className="text-2xl font-bold font-serif-luxury text-stone-100">
            Arquetipos de Personalidad Olfativa
          </h3>
          <p className="text-stone-400 text-sm mt-1">
            ¿Qué mensaje transmite tu aroma antes de que pronuncies una sola palabra?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERSONALITY_ARCHETYPES.map((arch) => (
            <div
              key={arch.id}
              className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400">
                  {arch.icon === 'Flame' && <Flame className="w-5 h-5" />}
                  {arch.icon === 'Waves' && <Waves className="w-5 h-5" />}
                  {arch.icon === 'Crown' && <Crown className="w-5 h-5" />}
                  {arch.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                </div>

                <h4 className="text-base font-bold font-serif-luxury text-stone-100">
                  {arch.title}
                </h4>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {arch.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {arch.families.map((fam, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 text-[10px] rounded bg-stone-800 text-stone-300"
                    >
                      {fam}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/80">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Inspiración icónica:
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  {arch.recommendedFragrance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
