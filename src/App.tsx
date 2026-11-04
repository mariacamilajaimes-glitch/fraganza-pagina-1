import React, { useState, useEffect } from 'react';
import { CatalogFragrance, CATALOG } from './data/fraganzaCatalog';
import { getCustomizedCatalog } from './services/catalogStore';
import { SmartQuiz } from './components/SmartQuiz';
import { AdvancedSearch } from './components/AdvancedSearch';
import { FamilyExplorer } from './components/FamilyExplorer';
import { FragranceModal } from './components/FragranceModal';
import { OfficialCatalogView } from './components/OfficialCatalogView';
import { SupabaseDrawer } from './components/SupabaseDrawer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { getPerfumeBottlePhoto } from './data/fragranceVisuals';
import {
  Sparkles,
  Search,
  Compass,
  Heart,
  Layers,
  Database,
  Flame,
  ChevronRight,
  Droplet,
  ArrowRight,
  Star,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'search' | 'families' | 'catalog' | 'favorites'>('quiz');
  const [selectedFragrance, setSelectedFragrance] = useState<CatalogFragrance | null>(null);
  const [isSupabaseDrawerOpen, setIsSupabaseDrawerOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fraganza_admin_logged') === 'true';
    } catch {
      return false;
    }
  });

  // Global page theme (dark / light) adapted to phone/system OS settings
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('fraganza_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('fraganza_theme_mode', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('theme-dark');
      } else {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.classList.remove('theme-light');
      }
    } catch {}
  }, [theme]);

  // Dynamic listener for phone / OS theme preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      const userLocked = localStorage.getItem('fraganza_theme_mode');
      if (!userLocked) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'light' ? '☀️ Modo Día activado para toda la página' : '🌙 Modo Noche activado para toda la página');
      return next;
    });
  };

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fraganza_fav_codes');
      return saved ? JSON.parse(saved) : ['u-002', 'c-015', 'd-008'];
    } catch {
      return ['u-002', 'c-015', 'd-008'];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logoClicks, setLogoClicks] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('fraganza_fav_codes', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Secret admin shortcut (Ctrl + Shift + A or Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBrandClick = () => {
    setActiveTab('quiz');
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 3) {
      setIsAdminModalOpen(true);
      setLogoClicks(0);
    }
    setTimeout(() => {
      setLogoClicks(0);
    }, 1500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fId) => fId !== id));
      showToast('Eliminada de tus favoritos');
    } else {
      setFavorites([...favorites, id]);
      showToast('Añadida a tus favoritos ❤️');
    }
  };

  const [catalogList, setCatalogList] = useState<CatalogFragrance[]>(() => getCustomizedCatalog());

  useEffect(() => {
    const handleUpdate = () => {
      setCatalogList(getCustomizedCatalog());
    };
    window.addEventListener('fraganza_catalog_updated', handleUpdate);
    return () => window.removeEventListener('fraganza_catalog_updated', handleUpdate);
  }, []);

  const savedFragrances = catalogList.filter((f) => favorites.includes(f.id));

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-[#f7f6f2] text-stone-900' : 'theme-dark bg-[#0a0a0a] text-stone-100'} flex flex-col selection:bg-[#C9A84C] selection:text-stone-950 font-sans transition-colors duration-300`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] border border-[#C9A84C]/50 text-stone-100 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Administrator Top Banner (Only visible when admin is logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#A07830] text-stone-950 text-xs py-1.5 px-4 font-bold flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-950" />
            <span>Panel Administrador Fraganza (mariacamila.jaimes@unet.edu.ve)</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSupabaseDrawerOpen(true)}
              className="px-3 py-1 rounded-lg bg-stone-950 text-[#F0D080] text-xs font-bold hover:bg-stone-900 transition-colors flex items-center gap-1.5 shadow"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Gestor Supabase & Agregar Perfume</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('fraganza_admin_logged');
                setIsAdmin(false);
                showToast('Sesión de administrador cerrada');
              }}
              className="text-stone-950 hover:underline text-xs"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Header with Official Fraganza Logo and Dedicated Navigation Bar */}
      <header className={`sticky ${isAdmin ? 'top-8' : 'top-0'} z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-stone-800/80 shadow-xl transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tier 1: Brand & Top Utilities */}
          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-stone-800/40">
            {/* Logo Brand (Clicking 3 times opens secret Admin Login) */}
            <div
              onClick={handleBrandClick}
              className="flex items-center gap-3 cursor-pointer group select-none"
              title="FRAGANZA - Alta Perfumería"
            >
              <img
                src="/assets/aistudio/fraganza_logo_d0313cc4.png"
                alt="Fraganza Logo"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(201,168,76,0.35)] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#F0D080] via-[#C9A84C] to-[#A07830] leading-none">
                  FRAGANZA
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-stone-400 font-medium mt-1">
                  Alta Perfumería
                </span>
              </div>
            </div>

            {/* Right-side quick controls */}
            <div className="flex items-center gap-2">
              {/* Favorites quick trigger */}
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                title="Ver Favoritos Guardados"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-[#C9A84C] text-stone-950 border-[#C9A84C] font-bold shadow-md shadow-[#C9A84C]/20'
                    : 'text-stone-300 hover:text-stone-100 border-stone-800 hover:border-[#C9A84C]/40 bg-[#121212]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-stone-950 text-stone-950' : 'text-rose-400'}`} />
                <span className="hidden sm:inline">Favoritos</span>
                {favorites.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'favorites' ? 'bg-stone-950 text-[#F0D080]' : 'bg-rose-500 text-white'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Day / Night Global Theme Toggle */}
              <button
                type="button"
                onClick={handleToggleTheme}
                title={theme === 'dark' ? 'Cambiar a Modo Día (Blanco)' : 'Cambiar a Modo Noche (Oscuro)'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer text-stone-300 hover:text-stone-100 border-stone-800 hover:border-[#C9A84C]/50 bg-[#121212]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Día</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Noche</span>
                  </>
                )}
              </button>

              {/* Admin Access Button (Only visible when admin is logged in) */}
              {isAdmin && (
                <button
                  onClick={() => setIsSupabaseDrawerOpen(true)}
                  title="Panel Administrador: Cambiar Fotos y Notas"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#F0D080] bg-[#C9A84C]/20 border border-[#C9A84C] hover:bg-[#C9A84C]/30 transition-colors shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F0D080]" />
                  <span className="hidden md:inline">Panel Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Tier 2: The 4 Navigation Tabs (Under Fraganza Logo) */}
          <div className="py-2.5 overflow-x-auto no-scrollbar">
            <nav className="flex items-center justify-start sm:justify-center gap-2 min-w-max mx-auto">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25 ring-1 ring-[#C9A84C]'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414] border border-transparent hover:border-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Inteligente</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'search'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25 ring-1 ring-[#C9A84C]'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414] border border-transparent hover:border-stone-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscador por Notas</span>
              </button>

              <button
                onClick={() => setActiveTab('families')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'families'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25 ring-1 ring-[#C9A84C]'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414] border border-transparent hover:border-stone-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Familias Olfativas</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold shadow-lg shadow-[#C9A84C]/25 ring-1 ring-[#C9A84C]'
                    : 'text-stone-300 hover:text-stone-100 hover:bg-[#141414] border border-transparent hover:border-stone-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catálogo</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {activeTab === 'quiz' && (
          <SmartQuiz
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'search' && (
          <AdvancedSearch
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'families' && (
          <FamilyExplorer
            onSelectFragrance={(f) => setSelectedFragrance(f)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Catalog Tab (All perfumes with Gender filtering and authentic bottle photos) */}
        {activeTab === 'catalog' && (
          <OfficialCatalogView
            onSelectFragrance={(perfume) => setSelectedFragrance(perfume)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isAdmin={isAdmin}
            onRequireAdminAuth={() => setIsAdminModalOpen(true)}
          />
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold block mb-1">
                Tu Selección Exclusiva
              </span>
              <h2 className="text-3xl font-bold font-serif-luxury text-stone-100">
                Fragancias Favoritas Guardadas
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Tus perfumes favoritos guardados para consulta y exploración olfativa.
              </p>
            </div>

            {savedFragrances.length === 0 ? (
              <div className="bg-[#0e0e0e] border border-stone-800 rounded-3xl p-12 text-center space-y-4">
                <Heart className="w-12 h-12 text-rose-500/40 mx-auto" />
                <h3 className="text-lg font-bold font-serif-luxury text-stone-200">
                  Aún no has guardado ninguna fragancia
                </h3>
                <p className="text-stone-400 text-xs max-w-md mx-auto">
                  Explora el test inteligente o el catálogo y pulsa el corazón para guardar tus fragancias predilectas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFragrances.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => setSelectedFragrance(perfume)}
                    className="bg-[#0e0e0e] rounded-2xl border border-stone-800 hover:border-[#C9A84C]/40 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer group"
                  >
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-black border border-stone-800 p-2 flex items-center justify-center">
                      <img
                        src={getPerfumeBottlePhoto(perfume.name, perfume.gender, perfume.image, perfume.code)}
                        alt={perfume.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-[#F0D080]">
                        {perfume.code}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(perfume.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/80 border border-stone-700 text-rose-500"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold block">
                        {perfume.brand}
                      </span>
                      <h4 className="text-base font-bold font-serif-luxury text-stone-100 break-words whitespace-normal group-hover:text-[#F0D080] leading-snug">
                        {perfume.name}
                      </h4>
                      <span className="text-xs text-stone-400 block mt-0.5">{perfume.family}</span>
                    </div>

                    <button className="w-full py-2 rounded-xl bg-[#181818] group-hover:bg-[#C9A84C] group-hover:text-stone-950 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-stone-800">
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Fragrance Modal */}
      <FragranceModal
        fragrance={selectedFragrance}
        onClose={() => setSelectedFragrance(null)}
        isFavorite={selectedFragrance ? favorites.includes(selectedFragrance.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onSelectAnother={(f) => setSelectedFragrance(f)}
        isAdmin={isAdmin}
        onRequireAdminAuth={() => setIsAdminModalOpen(true)}
      />

      {/* Supabase Drawer (Protected for Administrator only) */}
      <SupabaseDrawer
        isOpen={isSupabaseDrawerOpen}
        onClose={() => setIsSupabaseDrawerOpen(false)}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthenticated={() => {
          setIsAdmin(true);
          setIsSupabaseDrawerOpen(true);
          showToast('👑 Bienvenido al Panel de Administrador Fraganza');
        }}
      />

      {/* Luxury Footer */}
      <footer className="bg-[#080808] border-t border-stone-800/80 py-12 mt-16 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-5">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/assets/aistudio/fraganza_logo_d0313cc4.png"
              alt="Fraganza"
              className="h-10 w-auto object-contain opacity-80"
            />
            <span className="font-serif-luxury text-stone-300 font-bold tracking-widest text-base">
              FRAGANZA
            </span>
          </div>

          <p className="max-w-xl mx-auto text-stone-400 leading-relaxed text-xs">
            Experiencia digital de recomendación olfativa para perfumería fina. Algoritmo inteligente con pirámides olfativas de salida, corazón y fondo, medidores de intensidad y compatibilidad dérmica.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] text-stone-400 pt-2">
            <span>Damas: 105 Fragancias (D-001 ... D-105)</span>
            <span>•</span>
            <span>Caballeros: 74 Fragancias (C-001 ... C-074)</span>
            <span>•</span>
            <span>Unisex: 28 Fragancias (U-001 ... U-028)</span>
          </div>

          {/* Admin Panel Link (Only visible when admin is logged in) */}
          {isAdmin && (
            <div className="pt-3 border-t border-stone-900/80 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsSupabaseDrawerOpen(true)}
                className="text-[#C9A84C] hover:text-[#F0D080] text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel Administrador Activo (Gestor Supabase)</span>
              </button>
            </div>
          )}

          <div className="text-[10px] text-stone-600 pt-1 flex items-center justify-center gap-1">
            <span>© {new Date().getFullYear()} Fraganza · Todos los derechos reservados · Proyecto Oficial de Perfumería</span>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-stone-800 hover:text-stone-700 cursor-default select-none focus:outline-none"
              title=""
            >
              ·
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
