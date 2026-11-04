import React, { useState, useEffect, useRef } from 'react';
import { getStoredNotePhotos, saveCustomNotePhoto, resetCustomNotePhoto } from '../services/catalogStore';
import { getRealNotePhoto } from '../data/fragranceVisuals';
import { compressImage } from '../utils/imageCompressor';
import {
  X,
  Clipboard,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AdminNotePhotoEditorModalProps {
  noteName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (noteName: string, photoUrl: string) => void;
}

export const AdminNotePhotoEditorModal: React.FC<AdminNotePhotoEditorModalProps> = ({
  noteName,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !noteName) return null;

  const currentVisual = getRealNotePhoto(noteName);
  const storedPhotos = getStoredNotePhotos();
  const currentCustomUrl = storedPhotos[noteName.toLowerCase().trim()] || '';

  const [photoUrl, setPhotoUrl] = useState<string>(currentCustomUrl || currentVisual.photoUrl || '');
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const custom = getStoredNotePhotos()[noteName.toLowerCase().trim()];
    setPhotoUrl(custom || getRealNotePhoto(noteName).photoUrl || '');
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
    setPasteNotice('Optimizando y ajustando imagen...');
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
    // Check for pasted image file
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

    // Check for pasted text URL
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
        } catch {
          // Clipboard read permission might fail or contain only text
        }
      }

      // Try text URL in clipboard
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (text.startsWith('data:image/')) {
          await processAndApplyImage(text.trim(), '¡Imagen copiada pegada y optimizada con éxito!');
        } else {
          setPhotoUrl(text.trim());
          setPasteNotice('¡Enlace copiado pegado con éxito!');
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
        }
      } else {
        setPasteNotice('Copia una imagen en tu navegador (clic derecho > Copiar imagen) o copia su enlace, y presiona Ctrl+V aquí.');
      }
    } catch {
      setPasteNotice('Pulsa aquí y presiona Ctrl+V para insertar la imagen copiada.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!photoUrl.trim() || isProcessing) return;
    setIsProcessing(true);
    setSaveError(null);

    try {
      // Ensure image is compressed before saving
      let finalUrl = photoUrl.trim();
      if (finalUrl.startsWith('data:')) {
        finalUrl = await compressImage(finalUrl, 256, 256, 0.75);
      }

      await saveCustomNotePhoto(noteName, finalUrl);
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
      console.warn('Error saving note photo:', err);
      setSaveError('No se pudo guardar la foto. Se ha protegido el almacenamiento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    try {
      await resetCustomNotePhoto(noteName);
      setPhotoUrl(getRealNotePhoto(noteName).photoUrl);
      setSaveSuccess(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch {
      setPhotoUrl(getRealNotePhoto(noteName).photoUrl);
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
        className="relative w-full max-w-md bg-[#0f0f0f] border border-[#C9A84C]/50 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-5"
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
                Foto de la Nota Olfativa
              </span>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100 capitalize">
                {noteName}
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
            <span>¡Foto de nota actualizada correctamente!</span>
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

        {/* Visual Preview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/60 border border-stone-800">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 border border-[#C9A84C]/40 shrink-0 shadow-lg relative">
            <img
              src={photoUrl || currentVisual.photoUrl}
              alt={noteName}
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
            <span className="text-xs font-bold text-stone-200 block capitalize">
              {noteName}
            </span>
            <p className="text-[11px] text-stone-400 leading-tight">
              Esta foto se mostrará en la pirámide olfativa y en el buscador de ingredientes.
            </p>
          </div>
        </div>

        {/* Main Action: Paste Copied Image */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleClipboardButton}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/25 hover:brightness-110 transition active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando imagen...</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span>📋 Pegar Imagen Copiada (o presiona Ctrl + V)</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-stone-400 text-center">
            Tip: Ve a Google o Fragrantica, haz clic derecho en la foto de la nota, elige <strong>"Copiar imagen"</strong> y pulsa el botón de arriba.
          </p>

          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-stone-300 font-semibold block">
              O pega el enlace de la imagen aquí:
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://ejemplo.com/foto-ingrediente.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-stone-800 focus:border-[#C9A84C] text-xs text-stone-100 placeholder-stone-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            title="Restablecer a la foto botánica por defecto"
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
              {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
