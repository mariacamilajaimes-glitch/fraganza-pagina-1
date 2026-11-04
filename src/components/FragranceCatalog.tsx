import React, { useState, useMemo } from 'react';
import {
  Fragrance,
  FRAGRANCES,
  GenderCategory,
  OlfactoryFamily,
} from '../data/fragrances';
import {
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  Layers,
  ChevronRight,
  FilterX,
  Sparkles,
} from 'lucide-react';

interface FragranceCatalogProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCompare: (fragrance: Fragrance) => void;
  compareList: Fragrance[];
}

export const FragranceCatalog: React.FC<FragranceCatalogProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
  onAddToCompare,
  compareList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('Todos');
  const [selectedFamily, setSelectedFamily] = useState<string>('Todas');
  const [selectedSeason, setSelectedSeason] = useState<string>('Todas');
  const [selectedPrice, setSelectedPrice] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'alpha'>('rating');

  const filteredFragrances = useMemo(() => {
    return FRAGRANCES.filter((f) => {
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(query);
        const matchesBrand = f.brand.toLowerCase().includes(query);
        const matchesFamily = f.family.toLowerCase().includes(query);
        const allNotes = [...f.pyramid.top, ...f.pyramid.heart, ...f.pyramid.base].join(' ').toLowerCase();
        const matchesNotes = allNotes.includes(query);
        const matchesTags = f.tags.some(t => t.toLowerCase().includes(query));

        if (!matchesName && !matchesBrand && !matchesFamily && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Gender
      if (selectedGender !== 'Todos') {
        if (selectedGender === 'Femenino' && f.gender !== 'Femenino') return false;
        if (selectedGender === 'Masculino' && f.gender !== 'Masculino') return false;
        if (selectedGender === 'Unisex' && f.gender !== 'Unisex') return false;
      }

      // Family
      if (selectedFamily !== 'Todas' && f.family !== selectedFamily) {
        return false;
      }

      // Season
      if (selectedSeason !== 'Todas' && !f.seasons.includes(selectedSeason as any)) {
        return false;
      }

      // Price
      if (selectedPrice !== 'Todos' && f.priceTier !== selectedPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.votesCount - a.votesCount;
      if (sortBy === 'alpha') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchTerm, selectedGender, selectedFamily, selectedSeason, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGender('Todos');
    setSelectedFamily('Todas');
    setSelectedSeason('Todas');
    setSelectedPrice('Todos');
    setSortBy('rating');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedGender !== 'Todos' ||
    selectedFamily !== 'Todas' ||
    selectedSeason !== 'Todas' ||
    selectedPrice !== 'Todos';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Catalog Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Biblioteca Olfativa
          </span>
          <h2 className="text-3xl font-bold font-serif-luxury text-stone-100">
            Catálogo de Colonias y Perfumes
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Explora las composiciones más aclamadas de diseñador y alta perfumería.
          </p>
        </div>

        {/* Total count badge */}
        <div className="text-xs text-stone-400 bg-stone-900 px-3.5 py-1.5 rounded-full border border-stone-800 self-start md:self-auto">
          Mostrando <span className="text-amber-400 font-bold">{filteredFragrances.length}</span> de {FRAGRANCES.length} fragancias
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-stone-900/80 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, casa (Chanel, Dior, TF...), notas (vainilla, jazmín, cedro)..."
            className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* Gender */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Perfil / Género
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Todos">Todos los perfiles</option>
              <option value="Femenino">Para Ella (Femenino)</option>
              <option value="Masculino">Para Él (Masculino)</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Family */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Familia Olfativa
            </label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Todas">Todas las familias</option>
              <option value="Cítrica">Cítrica</option>
              <option value="Amaderada">Amaderada</option>
              <option value="Oriental / Especiada">Oriental / Especiada</option>
              <option value="Floral">Floral</option>
              <option value="Gourmand">Gourmand</option>
              <option value="Acuática / Marina">Acuática / Marina</option>
              <option value="Aromática Fougère">Aromática Fougère</option>
              <option value="Chipre / Cuero">Chipre / Cuero</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Estación
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Todas">Cualquier estación</option>
              <option value="Primavera">Primavera</option>
              <option value="Verano">Verano</option>
              <option value="Otoño">Otoño</option>
              <option value="Invierno">Invierno</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Gama de Precio
            </label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Todos">Todos los precios</option>
              <option value="$">$ Económico</option>
              <option value="$$">$$ Accesible</option>
              <option value="$$$">$$$ Prestigio</option>
              <option value="$$$$">$$$$ Lujo / Nicho</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="rating">Mayor Calificación</option>
              <option value="popular">Más Populares</option>
              <option value="alpha">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between border-t border-stone-800 text-xs">
            <span className="text-stone-400">Filtros aplicados activos</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium"
            >
              <FilterX className="w-3.5 h-3.5" />
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Fragrance Cards Grid */}
      {filteredFragrances.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/50 rounded-2xl border border-stone-800 p-8 space-y-3">
          <p className="text-stone-300 font-serif-luxury text-lg">
            No encontramos fragancias con esos criterios
          </p>
          <p className="text-stone-500 text-xs max-w-md mx-auto">
            Prueba a ampliar los filtros de familia olfativa, género o busca por una nota más general.
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFragrances.map((fragrance) => {
            const isFav = favorites.includes(fragrance.id);
            const isInComp = compareList.some((c) => c.id === fragrance.id);

            return (
              <div
                key={fragrance.id}
                className="bg-stone-900/90 rounded-2xl border border-stone-800 hover:border-amber-500/30 transition-all duration-300 flex flex-col overflow-hidden group shadow-xl"
              >
                {/* Image preview */}
                <div
                  onClick={() => onSelectFragrance(fragrance)}
                  className="relative w-full h-56 bg-stone-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90" />

                  <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-400 border border-amber-500/30">
                    {fragrance.concentration.split(' ')[0]}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(fragrance.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-stone-900/80 backdrop-blur-sm rounded-full text-stone-300 hover:text-rose-400 transition-colors border border-stone-700"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-1 text-amber-400 text-xs mb-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold">{fragrance.rating}</span>
                      <span className="text-stone-400 text-[10px]">({fragrance.votesCount})</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-300/80 font-semibold block">
                      {fragrance.brand}
                    </span>
                    <h3 className="text-lg font-bold text-stone-100 font-serif-luxury truncate">
                      {fragrance.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-stone-300 border border-stone-700">
                        {fragrance.family}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-stone-300 border border-stone-700">
                        {fragrance.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] bg-stone-800 text-stone-400 border border-stone-700">
                        {fragrance.priceTier}
                      </span>
                    </div>

                    <p className="text-stone-400 text-xs line-clamp-2">
                      {fragrance.description}
                    </p>

                    {/* Pyramid brief */}
                    <div className="text-[11px] text-stone-400 space-y-1 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800/80">
                      <div>
                        <span className="text-amber-400 font-semibold">Salida:</span>{' '}
                        {fragrance.pyramid.top.join(', ')}
                      </div>
                      <div>
                        <span className="text-rose-400 font-semibold">Corazón:</span>{' '}
                        {fragrance.pyramid.heart.join(', ')}
                      </div>
                      <div>
                        <span className="text-stone-300 font-semibold">Fondo:</span>{' '}
                        {fragrance.pyramid.base.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => onSelectFragrance(fragrance)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/30 text-xs font-bold transition-all"
                    >
                      <span>Ver Detalles</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onAddToCompare(fragrance)}
                      title="Comparar"
                      className={`p-2 rounded-xl border text-xs transition-colors ${
                        isInComp
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
