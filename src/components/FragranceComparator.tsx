import React from 'react';
import { Fragrance, FRAGRANCES } from '../data/fragrances';
import { X, Layers, Plus, Star, Sparkles, Clock, Wind, Trash2 } from 'lucide-react';

interface FragranceComparatorProps {
  compareList: Fragrance[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onAddFragrance: (fragrance: Fragrance) => void;
  onSelectFragrance: (fragrance: Fragrance) => void;
}

export const FragranceComparator: React.FC<FragranceComparatorProps> = ({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onAddFragrance,
  onSelectFragrance,
}) => {
  const availableToAdd = FRAGRANCES.filter(
    (f) => !compareList.some((c) => c.id === f.id)
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Herramienta de Análisis
          </span>
          <h2 className="text-3xl font-bold font-serif-luxury text-stone-100">
            Comparador Cara a Cara
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Compara notas, pirámides, longevidad y acordes entre tus fragancias favoritas.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={onClearCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar comparador
          </button>
        )}
      </div>

      {/* Main comparison grid */}
      {compareList.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-10 text-center space-y-4">
          <Layers className="w-10 h-10 text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold font-serif-luxury text-stone-200">
            No tienes fragancias en el comparador
          </h3>
          <p className="text-stone-400 text-xs max-w-md mx-auto">
            Selecciona hasta 3 fragancias desde el recomendador o catálogo para colocarlas una junto a la otra.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-3">
              O añade una rápidamente:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {availableToAdd.slice(0, 4).map((f) => (
                <button
                  key={f.id}
                  onClick={() => onAddFragrance(f)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 border border-stone-700 flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Slot selector if less than 3 */}
          {compareList.length < 3 && availableToAdd.length > 0 && (
            <div className="flex items-center gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800 text-xs">
              <span className="text-stone-400 font-medium">Añadir otra fragancia a la comparativa:</span>
              <select
                onChange={(e) => {
                  const found = availableToAdd.find((f) => f.id === e.target.value);
                  if (found) onAddFragrance(found);
                }}
                defaultValue=""
                className="bg-stone-950 border border-stone-800 rounded-lg py-1.5 px-3 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="" disabled>Selecciona una fragancia...</option>
                {availableToAdd.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.brand})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Side-by-side Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareList.map((fragrance) => (
              <div
                key={fragrance.id}
                className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 space-y-6 relative flex flex-col shadow-2xl"
              >
                <button
                  onClick={() => onRemoveFromCompare(fragrance.id)}
                  className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-200 bg-stone-950 rounded-full border border-stone-800 transition-colors"
                  title="Quitar"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Head Card */}
                <div className="flex gap-4 items-center">
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-16 h-20 rounded-xl object-cover border border-stone-800 shrink-0"
                  />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                      {fragrance.brand}
                    </span>
                    <h3
                      onClick={() => onSelectFragrance(fragrance)}
                      className="text-lg font-bold font-serif-luxury text-stone-100 hover:text-amber-300 cursor-pointer transition-colors"
                    >
                      {fragrance.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{fragrance.rating}</span>
                      <span className="text-stone-500 text-[10px]">({fragrance.votesCount})</span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-3 pt-3 border-t border-stone-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Concentración</span>
                    <span className="text-stone-200 font-medium">{fragrance.concentration}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Familia Olfativa</span>
                    <span className="text-amber-300 font-medium">{fragrance.family}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Género / Perfil</span>
                    <span className="text-stone-200 font-medium">{fragrance.gender}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Duración</span>
                    <span className="text-stone-200 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {fragrance.longevity}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Estela / Sillage</span>
                    <span className="text-stone-200 font-medium flex items-center gap-1">
                      <Wind className="w-3 h-3 text-amber-400" />
                      {fragrance.sillage}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-800/60">
                    <span className="text-stone-500">Rango de Precio</span>
                    <span className="text-stone-200 font-bold">{fragrance.priceTier}</span>
                  </div>
                </div>

                {/* Olfactory Pyramid Compare */}
                <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 text-xs space-y-2.5">
                  <p className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                    Pirámide Olfativa
                  </p>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Salida</span>
                    <p className="text-stone-300 text-xs">{fragrance.pyramid.top.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Corazón</span>
                    <p className="text-rose-300 text-xs">{fragrance.pyramid.heart.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Fondo</span>
                    <p className="text-amber-500 text-xs">{fragrance.pyramid.base.join(', ')}</p>
                  </div>
                </div>

                {/* Accords Bar Comparison */}
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                    Acordes Dominantes
                  </p>
                  <div className="space-y-1.5">
                    {fragrance.accords.slice(0, 3).map((a, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] text-stone-300">
                          <span>{a.name}</span>
                          <span className="text-stone-500">{a.percentage}%</span>
                        </div>
                        <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${a.percentage}%`, backgroundColor: a.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onSelectFragrance(fragrance)}
                  className="w-full mt-auto py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
                >
                  Ver Ficha Completa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
