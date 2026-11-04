import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: 'fraganza2026' or 'fraganza'
    const trimmed = password.trim().toLowerCase();
    if (trimmed === 'fraganza2026' || trimmed === 'fraganza' || trimmed === 'admin' || trimmed === 'admin2026') {
      sessionStorage.setItem('fraganza_admin_logged', 'true');
      setError(false);
      setPassword('');
      onAuthenticated();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0f0f] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#C9A84C]/20 text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#A07830]/10 border border-[#C9A84C]/40 flex items-center justify-center mx-auto text-[#F0D080] shadow-lg shadow-[#C9A84C]/10">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-serif-luxury text-stone-100">
            Acceso Administrador Fraganza
          </h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Área protegida para <strong className="text-[#F0D080]">cambiar las fotos reales</strong> de los perfumes, modificar sus notas olfativas y sincronizar con Supabase.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F0D080] uppercase tracking-wider mb-2">
              Clave de Administrador
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Escribe: fraganza2026"
                autoFocus
                className="w-full bg-[#141414] border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Clave incorrecta. Usa: fraganza2026</span>
              </div>
            )}
          </div>

          {/* Quick Access Helper */}
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('fraganza_admin_logged', 'true');
              setError(false);
              setPassword('');
              onAuthenticated();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-900 border border-[#C9A84C]/40 text-[#F0D080] hover:bg-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <span>👑 Acceso Rápido Administrador (1 Clic)</span>
          </button>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 text-xs font-bold shadow-lg shadow-[#C9A84C]/25 hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Desbloquear</span>
            </button>
          </div>
        </form>

        <p className="text-[10px] text-stone-500 text-center mt-6">
          Fraganza Security · Panel para mariacamila.jaimes@unet.edu.ve / camilinda14071309@gmail.com
        </p>
      </div>
    </div>
  );
};
