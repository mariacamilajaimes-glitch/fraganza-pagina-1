import React, { useState, useEffect } from 'react';
import { Fragrance, FRAGRANCES } from '../data/fragrances';
import { Heart, Star, Layers, Trash2, Edit3, Check, Sparkles, ChevronRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectFragrance: (fragrance: Fragrance) => void;
  onAddToCompare: (fragrance: Fragrance) => void;
  compareList: Fragrance[];
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onSelectFragrance,
  onAddToCompare,
  compareList,
}) => {
  // Load notes from localStorage
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('fraganza_personal_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  const saveNote = (id: string) => {
    const updated = { ...personalNotes, [id]: tempNote };
    setPersonalNotes(updated);
    try {
      localStorage.setItem('fraganza_personal_notes', JSON.stringify(updated));
    } catch {}
    setEditingId(null);
  };

  const savedFragrances = FRAGRANCES.filter((f) => favorites.includes(f.id));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
          Tu Colección Personal
        </span>
        <h2 className="text-3xl font-bold font-serif-luxury text-stone-100">
          Fragancias Favoritas
        </h2>
        <p className="text-stone-400 text-sm mt-1">
          Guarda tus perfumes preferidos, añade notas personales sobre cómo evolucionan en tu piel y planifica tus próximas adquisiciones.
        </p>
      </div>

      {savedFragrances.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-rose-500/40 mx-auto" />
          <h3 className="text-lg font-bold font-serif-luxury text-stone-200">
            Aún no has guardado ninguna fragancia
          </h3>
          <p className="text-stone-400 text-xs max-w-md mx-auto">
            Explora el recomendador o el catálogo y pulsa el corazón en los perfumes que llamen tu atención.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedFragrances.map((fragrance) => {
            const isInComp = compareList.some((c) => c.id === fragrance.id);
            const userNote = personalNotes[fragrance.id] || '';

            return (
              <div
                key={fragrance.id}
                className="bg-stone-900/90 rounded-2xl border border-stone-800 p-6 flex flex-col justify-between space-y-5 shadow-xl relative"
              >
                <div className="flex gap-4">
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-20 h-24 rounded-xl object-cover border border-stone-800 shrink-0 cursor-pointer"
                    onClick={() => onSelectFragrance(fragrance)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                        {fragrance.brand}
                      </span>
                      <button
                        onClick={() => onToggleFavorite(fragrance.id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3
                      onClick={() => onSelectFragrance(fragrance)}
                      className="text-lg font-bold font-serif-luxury text-stone-100 hover:text-amber-300 cursor-pointer truncate"
                    >
                      {fragrance.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{fragrance.rating}</span>
                      <span className="text-stone-500 text-[11px]">• {fragrance.concentration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300">
                        {fragrance.family}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300">
                        {fragrance.gender}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Note Box */}
                <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Tu Nota Personal
                    </span>
                    {editingId !== fragrance.id && (
                      <button
                        onClick={() => {
                          setEditingId(fragrance.id);
                          setTempNote(userNote);
                        }}
                        className="text-[10px] text-stone-400 hover:text-stone-200 underline"
                      >
                        {userNote ? 'Editar' : '+ Añadir nota'}
                      </button>
                    )}
                  </div>

                  {editingId === fragrance.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder="Ej: Probar en primavera, tiene fijación de 8 horas, aroma a sándalo elegante..."
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-[11px] rounded bg-stone-800 text-stone-300"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => saveNote(fragrance.id)}
                          className="px-2.5 py-1 text-[11px] rounded bg-amber-500 text-stone-950 font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-stone-300 italic text-[11px]">
                      {userNote || 'Sin notas registradas. Haz clic en añadir nota para guardar tus impresiones de cata.'}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => onSelectFragrance(fragrance)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Ver Pirámide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAddToCompare(fragrance)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isInComp
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isInComp ? 'En comparador' : 'Comparar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
