import React, { useState, useEffect } from 'react';
import { CatalogFragrance, MainCategory } from '../data/fraganzaCatalog';
import { getPerfumeBottlePhoto } from '../data/fragranceVisuals';
import { getCustomizedCatalog } from '../services/catalogStore';
import {
  Flower2,
  Citrus,
  Trees,
  Candy,
  ChevronRight,
  Heart,
  Sparkles,
  Filter
} from 'lucide-react';

interface FamilyExplorerProps {
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const FamilyExplorer: React.FC<FamilyExplorerProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<MainCategory | 'Todas'>('Todas');
  const [genderFilter, setGenderFilter] = useState<'Todos' | 'Dama' | 'Caballero' | 'Unisex'>('Todos');
  const [catalogList, setCatalogList] = useState<CatalogFragrance[]>(() => getCustomizedCatalog());

  useEffect(() => {
    const handleUpdate = () => {
      setCatalogList(getCustomizedCatalog());
    };
    window.addEventListener('fraganza_catalog_updated', handleUpdate);
    return () => window.removeEventListener('fraganza_catalog_updated', handleUpdate);
  }, []);

  const families = [
    {
      id: 'Floral' as MainCategory,
      emoji: '🌸',
      title: 'Floral',
      subtitle: 'Rosas, Jazmín, Peonía, Lavanda',
      desc: 'El corazón clásico y romántico de la perfumería fina. Acordes de pétalos nobles, flores blancas y elegancia aterciopelada.',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Cítrico / Acuático' as MainCategory,
      emoji: '🍋',
      title: 'Cítrico / Acuático',
      subtitle: 'Bergamota, Limón, Brisa Marina, Frescor',
      desc: 'Energía chispeante, sol mediterráneo y notas ozónicas cristalinas que aportan vitalidad inmediata y sensación de limpieza pura.',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Amaderado / Oriental' as MainCategory,
      emoji: '🌲',
      title: 'Amaderado / Oriental',
      subtitle: 'Sándalo, Oud, Ámbar, Especias, Cuero',
      desc: 'Presencia majestuosa, acordes cálidos y resinas profundas. Aportan distinción imponente, madurez y duración inigualable.',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Dulce / Acaramelado' as MainCategory,
      emoji: '🍯',
      title: 'Dulce / Acaramelado',
      subtitle: 'Vainilla, Caramelo, Tonka, Pralinés',
      desc: 'La sensualidad irresistible del universo gourmand. Notas golosas y licorosas que generan un aura magnética y adictiva.',
      image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const filteredFragrances = catalogList.filter((f) => {
    if (selectedFamily !== 'Todas' && f.mainCategory !== selectedFamily) return false;
    if (genderFilter !== 'Todos' && f.gender !== genderFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
          <span>Familias Olfativas de Fraganza</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight">
          Explora por Universos Aromáticos
        </h2>
        <p className="text-stone-400 text-sm max-w-xl mx-auto">
          Adéntrate en las cuatro grandes familias olfativas para descubrir perfumes con carácter afín a tu estilo.
        </p>
      </div>

      {/* 4 Family Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {families.map((fam) => {
          const isSelected = selectedFamily === fam.id;
          const count = catalogList.filter((f) => f.mainCategory === fam.id).length;

          return (
            <div
              key={fam.id}
              onClick={() => setSelectedFamily(isSelected ? 'Todas' : fam.id)}
              className={`relative rounded-3xl overflow-hidden border p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 group shadow-xl ${
                isSelected
                  ? 'bg-[#181818] border-[#C9A84C] shadow-2xl shadow-[#C9A84C]/25 ring-1 ring-[#C9A84C]'
                  : 'bg-[#0e0e0e] border-stone-800 hover:border-[#C9A84C]/50 hover:bg-[#141414]'
              }`}
            >
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-stone-800/80">
                <img
                  src={fam.image}
                  alt={fam.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-md flex items-center justify-center text-2xl border border-stone-700">
                  {fam.emoji}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold font-serif-luxury text-stone-100">{fam.title}</h3>
                    <span className="text-[11px] text-[#F0D080] font-medium block">{count} creaciones</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold text-[#F0D080] tracking-wide">{fam.subtitle}</p>
                <p className="text-[11px] text-stone-300 leading-relaxed break-words whitespace-normal">{fam.desc}</p>
              </div>

              <button
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#C9A84C] text-stone-950 border-[#C9A84C]'
                    : 'bg-[#161616] group-hover:bg-[#C9A84C] group-hover:text-stone-950 text-stone-300 border-stone-800 group-hover:border-[#C9A84C]'
                }`}
              >
                <span>{isSelected ? 'Familia Seleccionada ✓' : 'Explorar Familia'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Filter Bar by Gender within Family */}
      <div className="bg-[#0e0e0e] p-5 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-xs uppercase tracking-widest text-stone-300 font-bold">
            Filtrar por Perfil:
          </span>
          {selectedFamily !== 'Todas' && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A84C]/20 text-[#F0D080] border border-[#C9A84C]/40">
              {selectedFamily}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {(['Todos', 'Dama', 'Caballero', 'Unisex'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                genderFilter === g
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-md shadow-[#C9A84C]/20'
                  : 'bg-[#181818] text-stone-300 hover:bg-[#222] border border-stone-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Fragrances in Family Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-stone-400">
          <span>
            Mostrando <span className="text-[#F0D080] font-bold">{filteredFragrances.length}</span> perfumes
          </span>
          {selectedFamily !== 'Todas' && (
            <button
              onClick={() => setSelectedFamily('Todas')}
              className="text-[#C9A84C] hover:underline"
            >
              Ver todas las familias
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFragrances.map((perfume) => {
            const isFav = favorites.includes(perfume.id);

            return (
              <div
                key={perfume.id}
                onClick={() => onSelectFragrance(perfume)}
                className="bg-[#0e0e0e] rounded-2xl border border-stone-800 hover:border-[#C9A84C]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer group"
              >
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gradient-to-b from-stone-900 to-black border border-stone-800 p-2 flex items-center justify-center">
                  <img
                    src={getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code)}
                    alt={perfume.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-[#F0D080] border border-[#C9A84C]/30">
                    {perfume.code}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(perfume.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/80 border border-stone-700 text-stone-300 hover:text-rose-400"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold block">
                      {perfume.brand}
                    </span>
                    <h4 className="text-lg font-bold font-serif-luxury text-stone-100 group-hover:text-[#F0D080] transition-colors break-words whitespace-normal leading-snug">
                      {perfume.name}
                    </h4>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-900 text-stone-300 border border-stone-800">
                      {perfume.gender}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-900 text-stone-300 border border-stone-800">
                      {perfume.subfamily || perfume.family}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#C9A84C]/10 text-[#F0D080] border border-[#C9A84C]/30">
                      {perfume.intensity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed break-words whitespace-normal">
                    {perfume.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
                  <span className="text-stone-500">{perfume.skinCompat}</span>
                  <span className="text-[#F0D080] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ficha y Similares <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
