import React, { useState, useEffect, useRef } from 'react';
import { CatalogFragrance } from '../data/fraganzaCatalog';
import { saveAdminFragranceUpdate, resetAdminFragranceUpdate, getStoredOverrides } from '../services/catalogStore';
import { getPerfumeBottlePhoto } from '../data/fragranceVisuals';
import { compressImage } from '../utils/imageCompressor';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Layers,
  Save,
  Clipboard,
  Loader2
} from 'lucide-react';

interface AdminFragranceEditorModalProps {
  fragrance: CatalogFragrance | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedFragrance: CatalogFragrance) => void;
}

export const AdminFragranceEditorModal: React.FC<AdminFragranceEditorModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !fragrance) return null;

  const overrides = getStoredOverrides();
  const currentOverride = overrides[fragrance.code] || overrides[fragrance.id] || {};

  const [imageUrl, setImageUrl] = useState<string>(
    currentOverride.image || fragrance.image || ''
  );
  const [topNotes, setTopNotes] = useState<string>(
    (currentOverride.pyramid?.top || fragrance.pyramid.top || []).join(', ')
  );
  const [heartNotes, setHeartNotes] = useState<string>(
    (currentOverride.pyramid?.heart || fragrance.pyramid.heart || []).join(', ')
  );
  const [baseNotes, setBaseNotes] = useState<string>(
    (currentOverride.pyramid?.base || fragrance.pyramid.base || []).join(', ')
  );
  const [description, setDescription] = useState<string>(
    currentOverride.description || fragrance.description || ''
  );
  const [sensation, setSensation] = useState<string>(
    currentOverride.sensation || fragrance.sensation || ''
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Helper to process and compress images
  const processAndSetImage = async (rawSrc: string, notice: string) => {
    setIsProcessing(true);
    setPasteNotice('Optimizando y ajustando foto del perfume...');
    try {
      const compressed = await compressImage(rawSrc, 600, 600, 0.8);
      setImageUrl(compressed || rawSrc);
      setPasteNotice(notice);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
    } catch {
      setImageUrl(rawSrc);
      setPasteNotice(notice);
    } finally {
      setIsProcessing(false);
    }
  };

  // Paste image directly from clipboard (Ctrl+V)
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
                processAndSetImage(reader.result, '¡Foto copiada pegada y optimizada con éxito!');
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
        processAndSetImage(text, '¡Foto pegada y optimizada con éxito!');
      } else {
        setImageUrl(text);
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
                  processAndSetImage(reader.result, '¡Foto copiada pegada y optimizada con éxito!');
                }
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        } catch {
          // Clipboard read may not be permitted or text only
        }
      }

      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (text.startsWith('data:image/')) {
          await processAndSetImage(text.trim(), '¡Foto copiada pegada y optimizada con éxito!');
        } else {
          setImageUrl(text.trim());
          setPasteNotice('¡Enlace de imagen pegado con éxito!');
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPasteNotice(null), 3500);
        }
      } else {
        setPasteNotice('Copia una imagen en tu navegador (clic derecho > Copiar imagen) y pulsa aquí o presiona Ctrl+V.');
      }
    } catch {
      setPasteNotice('Haz clic en esta ventana y presiona Ctrl + V para pegar la imagen copiada.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle local image file upload and convert to base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('La imagen no debe superar los 15MB.');
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        processAndSetImage(reader.result, '¡Foto de archivo cargada y optimizada con éxito!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSaveError(null);

    const cleanArray = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const parsedTop = cleanArray(topNotes);
    const parsedHeart = cleanArray(heartNotes);
    const parsedBase = cleanArray(baseNotes);
    const allParsedNotes = Array.from(new Set([...parsedTop, ...parsedHeart, ...parsedBase]));

    try {
      let finalImg = imageUrl.trim();
      if (finalImg.startsWith('data:')) {
        finalImg = await compressImage(finalImg, 600, 600, 0.8);
      }

      await saveAdminFragranceUpdate(fragrance.code, {
        image: finalImg || undefined,
        pyramid: {
          top: parsedTop,
          heart: parsedHeart,
          base: parsedBase,
        },
        allNotes: allParsedNotes,
        description: description.trim() || undefined,
        sensation: sensation.trim() || undefined,
      });

      const updatedFragrance: CatalogFragrance = {
        ...fragrance,
        image: finalImg || fragrance.image,
        pyramid: {
          top: parsedTop,
          heart: parsedHeart,
          base: parsedBase,
        },
        allNotes: allParsedNotes,
        description: description.trim() || fragrance.description,
        sensation: sensation.trim() || fragrance.sensation,
      };

      setSaveSuccess(true);
      if (onSaved) {
        onSaved(updatedFragrance);
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      console.warn('Error saving fragrance update:', err);
      setSaveError('No se pudo guardar la actualización. Se ha protegido el almacenamiento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm(`¿Restablecer ${fragrance.code} (${fragrance.name}) a los valores originales de fábrica?`)) {
      setIsProcessing(true);
      try {
        await resetAdminFragranceUpdate(fragrance.code);
        setImageUrl('');
        setTopNotes(fragrance.pyramid.top.join(', '));
        setHeartNotes(fragrance.pyramid.heart.join(', '));
        setBaseNotes(fragrance.pyramid.base.join(', '));
        setDescription(fragrance.description);
        setSensation(fragrance.sensation);
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
    }
  };

  const previewPhoto = imageUrl || getPerfumeBottlePhoto(fragrance.name, fragrance.gender, fragrance.image, fragrance.code);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onPaste={handlePaste}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0e0e0e] border border-[#C9A84C]/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#C9A84C]/25 text-stone-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#F0D080]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#F0D080] font-bold block">
                Editor Administrador Exclusivo
              </span>
              <h3 className="text-xl font-bold font-serif-luxury text-stone-100 flex items-center gap-2">
                <span>{fragrance.code}</span>
                <span>·</span>
                <span>{fragrance.name}</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="my-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>¡Cambios guardados con éxito! La nueva foto y notas se actualizaron en toda la app.</span>
          </div>
        )}

        {saveError && (
          <div className="my-4 p-3 rounded-2xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{saveError}</span>
          </div>
        )}

        {pasteNotice && (
          <div className="my-4 p-3 rounded-2xl bg-[#1e1708] border border-[#C9A84C]/60 text-[#F0D080] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#F0D080] shrink-0" />
            <span className="break-words">{pasteNotice}</span>
          </div>
        )}

        <div className="space-y-6 pt-4">
          {/* FOTO REAL DEL PERFUME */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Foto Real del Frasco / Perfume</span>
              </label>
              <span className="text-[11px] text-stone-400">
                Copia y pega la imagen directamente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Image Preview */}
              <div className="sm:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-black border border-[#C9A84C]/40 p-2 flex items-center justify-center shadow-lg">
                <img
                  src={previewPhoto}
                  alt={fragrance.name}
                  className="w-full h-full object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#F0D080] animate-spin" />
                  </div>
                )}
                <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-[9px] text-stone-300 py-0.5 text-center rounded font-mono">
                  Vista Previa Real
                </span>
              </div>

              {/* Paste & Upload Controls */}
              <div className="sm:col-span-8 space-y-3">
                {/* 1. Paste Copied Image Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleClipboardButton}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A07830] via-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4 text-stone-950" />
                      <span>📋 Pegar Imagen Copiada (o presiona Ctrl + V)</span>
                    </>
                  )}
                </button>

                {/* 2. URL Input */}
                <div>
                  <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                    O pega la dirección URL copiada de la imagen:
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/foto-real-perfume.jpg"
                    className="w-full bg-black/70 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                {/* 3. Secondary File Upload */}
                <div className="pt-1 border-t border-stone-800/80">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-200 transition">
                    <Upload className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>O seleccionar archivo desde tu dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {fileError && (
                    <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fileError}
                    </p>
                  )}
                </div>

                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[11px] text-stone-500 hover:text-rose-400 underline block"
                  >
                    Quitar foto personalizada (volver a original)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PIRÁMIDE OLFATIVA Y NOTAS (Salida, Corazón, Fondo) */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Colocar Notas Olfativas (Pirámide)</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                Separadas por comas (,)
              </span>
            </div>

            {/* Salida */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#F0D080]">
                Notas de Salida (Primeros 15 min):
              </label>
              <input
                type="text"
                value={topNotes}
                onChange={(e) => setTopNotes(e.target.value)}
                placeholder="Ej: Bergamota, Mandarina, Pimienta Rosa"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            {/* Corazón */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-rose-300">
                Notas de Corazón (2 a 4 horas):
              </label>
              <input
                type="text"
                value={heartNotes}
                onChange={(e) => setHeartNotes(e.target.value)}
                placeholder="Ej: Rosa de Damasco, Jazmín Sambac, Lavanda"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Fondo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300">
                Notas de Fondo / Base (Fijación prolongada):
              </label>
              <input
                type="text"
                value={baseNotes}
                onChange={(e) => setBaseNotes(e.target.value)}
                placeholder="Ej: Vainilla, Ámbar, Sándalo, Almizcle"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* DESCRIPCIÓN SENSORIAL PUNTUAL */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-3">
            <label className="block text-xs uppercase font-bold tracking-wider text-[#F0D080]">
              Descripción Sensorial Puntual:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción concisa y puntual de cómo huele este perfume..."
              className="w-full bg-black/70 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-[#C9A84C] resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSave}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C9A84C]/30 hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Foto Real & Notas</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleResetToDefault}
              className="px-4 py-3.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
