import React, { useState, useEffect, useRef } from 'react';
import {
  getStoredCustomNote,
  saveCustomNoteDetail,
  resetCustomNoteDetail,
  CustomNoteDetail
} from '../services/catalogStore';
import { getRealNotePhoto } from '../data/fragranceVisuals';
import { compressImage } from '../utils/imageCompressor';
import {
  X,
  Clipboard,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2,
  BookOpen,
  Layers,
  Save,
  Tag
} from 'lucide-react';

interface AdminNotePhotoEditorModalProps {
  noteName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (noteName: string, photoUrl: string) => void;
}

const NOTE_CATEGORIES = [
  'Florales',
  'Cítricos',
  'Frutales',
  'Gourmand & Dulces',
  'Maderas',
  'Especias',
  'Aromáticas & Verdes',
  'Acuáticas & Frescas',
  'Cuero & Resinas',
  'Almizcle, Ámbar, Aromas Animálicos',
];

export const AdminNotePhotoEditorModal: React.FC<AdminNotePhotoEditorModalProps> = ({
  noteName,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !noteName) return null;

  const currentVisual = getRealNotePhoto(noteName);
  const existingCustom = getStoredCustomNote(noteName);

  const [displayName, setDisplayName] = useState<string>(
    existingCustom?.displayName || currentVisual.name || noteName
  );
  const [botanicalName, setBotanicalName] = useState<string>(
    existingCustom?.botanicalName || currentVisual.botanicalName || ''
  );
  const [category, setCategory] = useState<string>(
    existingCustom?.category || currentVisual.category || 'Florales'
  );
  const [description, setDescription] = useState<string>(
    existingCustom?.description || currentVisual.description || ''
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    existingCustom?.photoUrl || currentVisual.photoUrl || ''
  );

  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const custom = getStoredCustomNote(noteName);
    const vis = getRealNotePhoto(noteName);

    setDisplayName(custom?.displayName || vis.name || noteName);
    setBotanicalName(custom?.botanicalName || vis.botanicalName || '');
    setCategory(custom?.category || vis.category || 'Florales');
    setDescription(custom?.description || vis.description || '');
    setPhotoUrl(custom?.photoUrl || vis.photoUrl || '');

    setPasteNotice(null);
    setSaveSuccess(false);
    setSaveError(null);
    setIsProcessing(false);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [noteName, isOpen]);

  // Compress and apply new image source safely
  const processAndApplyImage = async (rawSrc: string, successMsg: string) => {
    setIsProcessing(true);
    setPasteNotice('Optimizando y ajustando foto de la nota...');
    try {
      const compressed = await compressImage(rawSrc, 256, 256, 0.75);
      setPhotoUrl(compressed || rawSrc);
      setPasteNotice(successMsg);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
    } catch {
      setPhotoUrl(rawSrc);
      setPasteNotice(successMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Ctrl+V paste anywhere in modal
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                processAndApplyImage(reader.result, '¡Imagen copiada pegada y optimizada con éxito!');
              }
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    }

    const text = e.clipboardData?.getData('text')?.trim();
    if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
      if (text.startsWith('data:image/')) {
        processAndApplyImage(text, '¡Imagen pegada y optimizada con éxito!');
      } else {
        setPhotoUrl(text);
        setPasteNotice('¡Enlace de imagen pegado con éxito!');
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
      }
    }
  };

  // Button to read from clipboard directly
  const handleClipboardButton = async () => {
    setIsProcessing(true);
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find((t) => t.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  processAndApplyImage(reader.result, '¡Imagen copiada pegada y optimizada con éxito!');
                }
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        } catch {}
      }

      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (text.startsWith('data:image/')) {
          await processAndApplyImage(text.trim(), '¡Imagen copiada pegada y optimizada con éxito!');
        } else {
          setPhotoUrl(text.trim());
          setPasteNotice('¡Enlace de imagen pegado con éxito!');
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
        }
      } else {
        setPasteNotice('Copia una imagen en tu navegador (clic derecho > Copiar imagen) y pulsa aquí o presiona Ctrl+V.');
      }
    } catch {
      setPasteNotice('Pulsa aquí y presiona Ctrl + V para insertar la imagen copiada.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSaveError(null);

    try {
      let finalUrl = photoUrl.trim();
      if (finalUrl.startsWith('data:')) {
        finalUrl = await compressImage(finalUrl, 256, 256, 0.75);
      }

      const detail: CustomNoteDetail = {
        originalName: noteName,
        displayName: displayName.trim() || noteName,
        botanicalName: botanicalName.trim() || undefined,
        category: category.trim() || 'Florales',
        description: description.trim() || `Nota olfativa oficial: ${noteName}`,
        photoUrl: finalUrl
      };

      await saveCustomNoteDetail(detail);
      setSaveSuccess(true);

      if (onSaved) {
        onSaved(noteName, finalUrl);
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      console.warn('Error saving custom note:', err);
      setSaveError('No se pudo guardar la nota. Se ha protegido el almacenamiento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    try {
      await resetCustomNoteDetail(noteName);
      const original = getRealNotePhoto(noteName);
      setDisplayName(original.name || noteName);
      setBotanicalName(original.botanicalName || '');
      setCategory(original.category || 'Florales');
      setDescription(original.description || '');
      setPhotoUrl(original.photoUrl || '');
      setSaveSuccess(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch {
      // Safe reset
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onPaste={handlePaste}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-[#C9A84C]/50 rounded-3xl p-5 sm:p-7 shadow-2xl text-stone-100 space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F0D080]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#F0D080] font-bold block">
                Editor de Notas Olfativas
              </span>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100 capitalize">
                {displayName || noteName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>¡Nota olfativa actualizada en todo el catálogo!</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{saveError}</span>
          </div>
        )}

        {pasteNotice && (
          <div className="p-3 rounded-2xl bg-[#1e1708] border border-[#C9A84C]/60 text-[#F0D080] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#F0D080] shrink-0" />
            <span className="break-words">{pasteNotice}</span>
          </div>
        )}

        {/* Note Visual Card (Fragrantica Preview) */}
        <div className="p-4 rounded-2xl bg-black/60 border border-stone-800 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 border border-[#C9A84C]/40 shrink-0 shadow-lg relative">
              <img
                src={photoUrl || currentVisual.photoUrl}
                alt={displayName}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = currentVisual.photoUrl;
                }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <Loader2 className="w-5 h-5 text-[#F0D080] animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-100 capitalize">
                {displayName || noteName}
              </h4>
              {botanicalName && (
                <p className="text-[11px] text-stone-400 italic">
                  {botanicalName}
                </p>
              )}
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F0D080]">
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Name & Botanical Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Nombre de la Nota:</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ej: Almizcle"
              className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 placeholder-stone-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Nombre Botánico / Científico:</span>
            </label>
            <input
              type="text"
              value={botanicalName}
              onChange={(e) => setBotanicalName(e.target.value)}
              placeholder="Ej: Moschus Moschiferus"
              className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 placeholder-stone-600 focus:outline-none italic"
            />
          </div>
        </div>

        {/* 2. Olfactory Family / Grupo */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Grupo / Familia Olfativa de la Nota:</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 focus:outline-none"
          >
            {NOTE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Perfil Aromático / Descripción General */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-stone-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Perfil Aromático / Descripción General:</span>
            </span>
            <span className="text-[10px] text-stone-500">Enciclopedia Olfativa</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del aroma, fuentes botánicas o sintéticas, sensación olfativa..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 placeholder-stone-600 focus:outline-none resize-none"
          />
        </div>

        {/* 4. Foto Real de la Nota (Pegar o URL) */}
        <div className="space-y-2 pt-1 border-t border-stone-800">
          <label className="text-[11px] font-semibold text-stone-300 block">
            Foto Real de la Nota:
          </label>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleClipboardButton}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/25 hover:brightness-110 transition active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizando imagen...</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span>📋 Pegar Imagen Copiada (o presiona Ctrl + V)</span>
              </>
            )}
          </button>

          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto-ingrediente.jpg"
            className="w-full px-3 py-2 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 placeholder-stone-600 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            title="Restablecer a valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#F0D080] text-stone-950 text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Guardar Ficha de Nota</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
