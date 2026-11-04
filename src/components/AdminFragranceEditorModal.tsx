import React, { useState, useEffect, useRef } from 'react';
import { CatalogFragrance, ALL_UNIQUE_NOTES } from '../data/fraganzaCatalog';
import { saveAdminFragranceUpdate, resetAdminFragranceUpdate, getStoredOverrides, AccordItem } from '../services/catalogStore';
import { getPerfumeBottlePhoto, computeFragranticaAccords, getAccordColor, FRAGRANTICA_ACCORD_COLORS } from '../data/fragranceVisuals';
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
  Loader2,
  Sun,
  Moon,
  Plus,
  Trash2,
  Palette,
  Edit3,
  Search,
  Tag
} from 'lucide-react';

interface AdminFragranceEditorModalProps {
  fragrance: CatalogFragrance | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedFragrance: CatalogFragrance) => void;
}

const COMMON_FRAGRANTICA_ACCORDS = [
  'cítrico',
  'verde',
  'afrutados',
  'almizclado',
  'amaderado',
  'aromático',
  'atalcado',
  'fresco especiado',
  'fresco',
  'florales',
  'floral blanco',
  'dulce',
  'ámbar',
  'cuero',
  'acuático',
  'marino',
  'ozónico',
  'cálido especiado',
  'avainillado'
];

export const AdminFragranceEditorModal: React.FC<AdminFragranceEditorModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !fragrance) return null;

  const overrides = getStoredOverrides();
  const currentOverride = overrides[fragrance.code] || overrides[fragrance.id] || {};

  // Basic identification info (Name, Code, Original Brand/House)
  const [fragranceName, setFragranceName] = useState<string>(
    currentOverride.name || fragrance.name || ''
  );
  const [fragranceCode, setFragranceCode] = useState<string>(
    currentOverride.code || fragrance.code || ''
  );
  const [fragranceBrand, setFragranceBrand] = useState<string>(
    currentOverride.brand || fragrance.brand || ''
  );

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

  // Note picker state for pyramid builder
  const [selectedPyramidTarget, setSelectedPyramidTarget] = useState<'top' | 'heart' | 'base'>('top');
  const [notePickerSearch, setNotePickerSearch] = useState<string>('');

  // Day/Night and White/Black theme mode
  const [environment, setEnvironment] = useState<'Día' | 'Noche' | 'Indistinto'>(
    (currentOverride.environment as any) || fragrance.environment || 'Indistinto'
  );
  const [themeMode, setThemeMode] = useState<'black' | 'white'>(
    currentOverride.themeMode || fragrance.themeMode || 'black'
  );

  // Accords editor state - always sorted from highest to lowest percentage
  const initialAccords = (
    currentOverride.mainAccords ||
    computeFragranticaAccords(
      fragrance.family,
      fragrance.allNotes,
      fragrance.sweetness,
      fragrance.intensity
    )
  ).sort((a, b) => b.percentage - a.percentage);
  const [accordsList, setAccordsList] = useState<AccordItem[]>(initialAccords);
  const [newAccordName, setNewAccordName] = useState<string>('');

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
        } catch {}
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

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).');
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

  // Helpers for pyramid notes
  const cleanArray = (str: string) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const addNoteToPyramid = (noteName: string, targetLayer: 'top' | 'heart' | 'base' = selectedPyramidTarget) => {
    const clean = noteName.trim();
    if (!clean) return;

    if (targetLayer === 'top') {
      const arr = cleanArray(topNotes);
      if (!arr.some((n) => n.toLowerCase() === clean.toLowerCase())) {
        setTopNotes([...arr, clean].join(', '));
      }
    } else if (targetLayer === 'heart') {
      const arr = cleanArray(heartNotes);
      if (!arr.some((n) => n.toLowerCase() === clean.toLowerCase())) {
        setHeartNotes([...arr, clean].join(', '));
      }
    } else {
      const arr = cleanArray(baseNotes);
      if (!arr.some((n) => n.toLowerCase() === clean.toLowerCase())) {
        setBaseNotes([...arr, clean].join(', '));
      }
    }
  };

  const removeNoteFromPyramid = (noteName: string, targetLayer: 'top' | 'heart' | 'base') => {
    const target = noteName.trim().toLowerCase();
    if (targetLayer === 'top') {
      setTopNotes(cleanArray(topNotes).filter((n) => n.toLowerCase() !== target).join(', '));
    } else if (targetLayer === 'heart') {
      setHeartNotes(cleanArray(heartNotes).filter((n) => n.toLowerCase() !== target).join(', '));
    } else {
      setBaseNotes(cleanArray(baseNotes).filter((n) => n.toLowerCase() !== target).join(', '));
    }
  };

  // Accords handlers - automatically keeps accords sorted from greatest to least percentage
  const handleAddAccord = (nameToAdd?: string) => {
    const name = (nameToAdd || newAccordName).trim().toLowerCase();
    if (!name) return;

    if (accordsList.some((a) => a.name.toLowerCase() === name)) {
      setNewAccordName('');
      return;
    }

    const colorCfg = getAccordColor(name);
    const updated = [
      ...accordsList,
      {
        name,
        color: colorCfg.color,
        textColor: colorCfg.textColor,
        percentage: Math.max(50, 100 - accordsList.length * 5)
      }
    ].sort((a, b) => b.percentage - a.percentage);

    setAccordsList(updated);
    setNewAccordName('');
  };

  const handleRemoveAccord = (index: number) => {
    setAccordsList(accordsList.filter((_, i) => i !== index));
  };

  const handleAccordPercentChange = (index: number, val: number) => {
    const updated = [...accordsList];
    updated[index] = { ...updated[index], percentage: val };
    // Always auto-sort from highest to lowest percentage
    setAccordsList(updated.sort((a, b) => b.percentage - a.percentage));
  };

  const handleSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSaveError(null);

    const parsedTop = cleanArray(topNotes);
    const parsedHeart = cleanArray(heartNotes);
    const parsedBase = cleanArray(baseNotes);
    const allParsedNotes = Array.from(new Set([...parsedTop, ...parsedHeart, ...parsedBase]));
    const sortedAccords = [...accordsList].sort((a, b) => b.percentage - a.percentage);

    try {
      let finalImg = imageUrl.trim();
      if (finalImg.startsWith('data:')) {
        finalImg = await compressImage(finalImg, 600, 600, 0.8);
      }

      const finalName = fragranceName.trim() || fragrance.name;
      const finalCode = fragranceCode.trim().toUpperCase() || fragrance.code;
      const finalBrand = fragranceBrand.trim() || fragrance.brand;

      await saveAdminFragranceUpdate(fragrance.code, {
        name: finalName,
        code: finalCode,
        brand: finalBrand,
        image: finalImg || undefined,
        pyramid: {
          top: parsedTop,
          heart: parsedHeart,
          base: parsedBase,
        },
        allNotes: allParsedNotes,
        description: description.trim() || undefined,
        sensation: sensation.trim() || undefined,
        environment,
        themeMode,
        mainAccords: sortedAccords
      });

      const updatedFragrance: CatalogFragrance = {
        ...fragrance,
        name: finalName,
        code: finalCode,
        brand: finalBrand,
        image: finalImg || fragrance.image,
        pyramid: {
          top: parsedTop,
          heart: parsedHeart,
          base: parsedBase,
        },
        allNotes: allParsedNotes,
        description: description.trim() || fragrance.description,
        sensation: sensation.trim() || fragrance.sensation,
        environment,
        themeMode,
        mainAccords: sortedAccords
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
        setFragranceName(fragrance.name);
        setFragranceCode(fragrance.code);
        setFragranceBrand(fragrance.brand);
        setImageUrl('');
        setTopNotes(fragrance.pyramid.top.join(', '));
        setHeartNotes(fragrance.pyramid.heart.join(', '));
        setBaseNotes(fragrance.pyramid.base.join(', '));
        setDescription(fragrance.description);
        setSensation(fragrance.sensation);
        setEnvironment(fragrance.environment);
        setThemeMode('black');
        setAccordsList(computeFragranticaAccords(
          fragrance.family,
          fragrance.allNotes,
          fragrance.sweetness,
          fragrance.intensity
        ).sort((a, b) => b.percentage - a.percentage));
        setSaveSuccess(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1000);
      } catch (err: any) {
        setSaveError('No se pudo restablecer la fragancia.');
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
            <span>¡Cambios guardados con éxito! La nueva foto, notas y acordes se actualizaron en toda la app.</span>
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
          {/* DATOS DE IDENTIFICACIÓN: NOMBRE, CÓDIGO Y CASA DEL PERFUME */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#C9A84C]/40 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>Identificación del Perfume (Nombre, Código y Casa Creadora)</span>
              </label>
              <span className="text-[11px] text-stone-400">
                Personaliza la información oficial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Código */}
              <div className="sm:col-span-3 space-y-1">
                <label className="block text-[11px] font-semibold text-stone-300">
                  Código Fraganza:
                </label>
                <input
                  type="text"
                  value={fragranceCode}
                  onChange={(e) => setFragranceCode(e.target.value.toUpperCase())}
                  placeholder="Ej: C-069"
                  className="w-full bg-black/80 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#F0D080] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Nombre de la fragancia */}
              <div className="sm:col-span-5 space-y-1">
                <label className="block text-[11px] font-semibold text-stone-300">
                  Nombre de la Fragancia:
                </label>
                <input
                  type="text"
                  value={fragranceName}
                  onChange={(e) => setFragranceName(e.target.value)}
                  placeholder="Ej: Nitro Intense"
                  className="w-full bg-black/80 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Casa del perfume / Diseñador original */}
              <div className="sm:col-span-4 space-y-1">
                <label className="block text-[11px] font-semibold text-[#F0D080]">
                  Casa / Marca Original:
                </label>
                <input
                  type="text"
                  value={fragranceBrand}
                  onChange={(e) => setFragranceBrand(e.target.value)}
                  placeholder="Ej: Dumont, Dior, Creed..."
                  className="w-full bg-black/80 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-bold focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-stone-800/80">
              💡 <strong className="text-stone-300">Nota:</strong> Fraganza comercializa las fragancias, pero aquí puedes especificar la <strong className="text-[#F0D080]">casa perfumera creadora original</strong> (por ejemplo: <em>Nitro Intense es de Dumont</em>, <em>Aventus es de Creed</em>, <em>Sauvage es de Dior</em>).
            </p>
          </div>

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
              {/* Image Preview with Pure White mode blend */}
              <div className={`sm:col-span-4 relative aspect-square rounded-2xl overflow-hidden border p-2 flex items-center justify-center shadow-lg transition-colors ${
                themeMode === 'white' ? 'bg-white border-stone-300' : 'bg-black border-[#C9A84C]/40'
              }`}>
                <img
                  src={previewPhoto}
                  alt={fragranceName || fragrance.name}
                  className={`w-full h-full object-contain ${themeMode === 'white' ? 'mix-blend-multiply' : ''}`}
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#F0D080] animate-spin" />
                  </div>
                )}
                <span className={`absolute bottom-1.5 left-1.5 right-1.5 text-[9px] py-0.5 text-center rounded font-mono ${
                  themeMode === 'white' ? 'bg-stone-100/90 text-stone-800 border border-stone-200' : 'bg-black/80 backdrop-blur-sm text-stone-300'
                }`}>
                  {themeMode === 'white' ? 'Vista en Fondo Blanco Puro' : 'Vista en Fondo Negro'}
                </span>
              </div>

              {/* Paste & Upload Controls */}
              <div className="sm:col-span-8 space-y-3">
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
              </div>
            </div>
          </div>

          {/* DÍA / NOCHE & MODO BLANCO / NEGRO (FRAGRANTICA STYLE) */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-4">
            <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span>Ocasión & Modo Visual (Día / Noche)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Uso Diario vs Nocturno */}
              <div className="space-y-1.5">
                <span className="text-xs text-stone-300 font-semibold block">
                  Uso recomendado:
                </span>
                <div className="flex rounded-xl bg-black/80 p-1 border border-stone-800">
                  {(['Día', 'Noche', 'Indistinto'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEnvironment(mode)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                        environment === mode
                          ? 'bg-[#C9A84C] text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {mode === 'Día' ? '☀️ Día' : mode === 'Noche' ? '🌙 Noche' : '✨ Versátil'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fondo Blanco vs Fondo Negro */}
              <div className="space-y-1.5">
                <span className="text-xs text-stone-300 font-semibold block">
                  Fondo de la Ficha (Día / Noche):
                </span>
                <div className="flex rounded-xl bg-black/80 p-1 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setThemeMode('white')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      themeMode === 'white'
                        ? 'bg-white text-stone-900 shadow font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>⚪ Fondo Blanco (Día)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('black')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      themeMode === 'black'
                        ? 'bg-stone-800 text-[#F0D080] border border-[#C9A84C]/40 shadow font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>⚫ Fondo Negro (Noche)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACORDES PRINCIPALES */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Modificar Acordes Principales</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {accordsList.length} acordes
              </span>
            </div>

            {/* Quick accord badges to add */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-400 block font-medium">
                Haz clic para añadir acordes principales populares:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-black/60 rounded-xl border border-stone-800">
                {COMMON_FRAGRANTICA_ACCORDS.map((accName) => {
                  const palette = getAccordColor(accName);
                  const isAdded = accordsList.some((a) => a.name.toLowerCase() === accName);
                  return (
                    <button
                      key={accName}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddAccord(accName)}
                      style={{
                        backgroundColor: isAdded ? '#27272a' : palette.color,
                        color: isAdded ? '#71717a' : palette.textColor
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 flex items-center gap-1"
                    >
                      {!isAdded && <Plus className="w-3 h-3 shrink-0" />}
                      <span>{accName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Accord Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAccordName}
                onChange={(e) => setNewAccordName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAccord();
                  }
                }}
                placeholder="Escribe otro acorde (ej: tabaco, miel, té verde, cacao...)"
                className="flex-1 bg-black/70 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C9A84C]"
              />
              <button
                type="button"
                onClick={() => handleAddAccord()}
                className="px-4 py-2 rounded-xl bg-[#C9A84C] text-stone-950 font-bold text-xs hover:bg-[#F0D080] transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {/* Current Accords List with Percentage Sliders & Delete */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-stone-300 font-semibold block">
                Acordes asignados a este perfume (vista escalonada de acordes principales):
              </span>

              {accordsList.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-3 bg-black/40 rounded-xl border border-stone-800 text-center">
                  No hay acordes asignados. Selecciona o escribe acordes arriba.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {accordsList.map((acc, index) => {
                    const palette = getAccordColor(acc.name);
                    return (
                      <div
                        key={`${acc.name}-${index}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-black/80 border border-stone-800 text-xs"
                      >
                        <div
                          style={{ backgroundColor: palette.color, color: palette.textColor }}
                          className="px-3 py-1 rounded-md font-bold text-xs min-w-28 text-center shrink-0 shadow-sm"
                        >
                          {acc.name}
                        </div>

                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="range"
                            min="30"
                            max="100"
                            value={acc.percentage}
                            onChange={(e) => handleAccordPercentChange(index, Number(e.target.value))}
                            className="flex-1 accent-[#C9A84C] h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                          />
                          <span className="text-[11px] text-stone-400 font-mono w-8 text-right">
                            {acc.percentage}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveAccord(index)}
                          className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition"
                          title="Eliminar acorde"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* PIRÁMIDE OLFATIVA Y NOTAS (Salida, Corazón, Fondo) */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-wider text-[#F0D080] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Constructor de Pirámide Olfativa (Selecciona o Escribe)</span>
              </label>
              <span className="text-[11px] text-stone-400">
                Añade notas con un clic o edita el texto
              </span>
            </div>

            {/* Note Picker Selector Toolbar */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-stone-300 font-semibold">
                  1. Elige a qué nivel de la pirámide deseas agregar notas:
                </span>
                <div className="flex rounded-lg bg-stone-900 p-1 border border-stone-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedPyramidTarget('top')}
                    className={`px-3 py-1 rounded transition ${
                      selectedPyramidTarget === 'top'
                        ? 'bg-[#C9A84C] text-stone-950 shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Salida
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPyramidTarget('heart')}
                    className={`px-3 py-1 rounded transition ${
                      selectedPyramidTarget === 'heart'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Corazón
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPyramidTarget('base')}
                    className={`px-3 py-1 rounded transition ${
                      selectedPyramidTarget === 'base'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Fondo
                  </button>
                </div>
              </div>

              {/* Search & Click Notes */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={notePickerSearch}
                    onChange={(e) => setNotePickerSearch(e.target.value)}
                    placeholder="Buscar nota olfativa (ej: Vainilla, Bergamota, Sándalo, Rosa...)"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#C9A84C]"
                  />
                  {notePickerSearch && (
                    <button
                      type="button"
                      onClick={() => setNotePickerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-stone-950/80 rounded-xl border border-stone-800/80">
                  {ALL_UNIQUE_NOTES.filter((n) =>
                    !notePickerSearch.trim() || n.toLowerCase().includes(notePickerSearch.toLowerCase().trim())
                  )
                    .slice(0, 40)
                    .map((n) => {
                      const isCurrentInTop = cleanArray(topNotes).some((x) => x.toLowerCase() === n.toLowerCase());
                      const isCurrentInHeart = cleanArray(heartNotes).some((x) => x.toLowerCase() === n.toLowerCase());
                      const isCurrentInBase = cleanArray(baseNotes).some((x) => x.toLowerCase() === n.toLowerCase());
                      const isAlreadyInTarget =
                        selectedPyramidTarget === 'top'
                          ? isCurrentInTop
                          : selectedPyramidTarget === 'heart'
                          ? isCurrentInHeart
                          : isCurrentInBase;

                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => addNoteToPyramid(n, selectedPyramidTarget)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 border ${
                            isAlreadyInTarget
                              ? 'bg-stone-800/60 border-stone-700 text-stone-400 opacity-60'
                              : 'bg-stone-900 border-stone-700 hover:border-[#C9A84C] text-stone-200 hover:text-[#F0D080]'
                          }`}
                        >
                          <Plus className="w-3 h-3 text-[#C9A84C]" />
                          <span>{n}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Salida */}
            <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-stone-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F0D080] flex items-center gap-1.5">
                  <span>🍃 Notas de Salida (Primeros 15 min):</span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">
                  {cleanArray(topNotes).length} notas
                </span>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-6">
                {cleanArray(topNotes).length === 0 ? (
                  <span className="text-[11px] text-stone-600 italic">Sin notas de salida asignadas</span>
                ) : (
                  cleanArray(topNotes).map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#1e1708] text-[#F0D080] border border-[#C9A84C]/40 shadow-sm"
                    >
                      <span>{n}</span>
                      <button
                        type="button"
                        onClick={() => removeNoteFromPyramid(n, 'top')}
                        className="hover:text-rose-400 p-0.5 transition"
                        title="Quitar nota"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <input
                type="text"
                value={topNotes}
                onChange={(e) => setTopNotes(e.target.value)}
                placeholder="Ej: Bergamota, Mandarina, Pimienta Rosa"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            {/* Corazón */}
            <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-stone-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span>🌸 Notas de Corazón (2 a 4 horas):</span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">
                  {cleanArray(heartNotes).length} notas
                </span>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-6">
                {cleanArray(heartNotes).length === 0 ? (
                  <span className="text-[11px] text-stone-600 italic">Sin notas de corazón asignadas</span>
                ) : (
                  cleanArray(heartNotes).map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-rose-950/60 text-rose-200 border border-rose-800/50 shadow-sm"
                    >
                      <span>{n}</span>
                      <button
                        type="button"
                        onClick={() => removeNoteFromPyramid(n, 'heart')}
                        className="hover:text-rose-400 p-0.5 transition"
                        title="Quitar nota"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <input
                type="text"
                value={heartNotes}
                onChange={(e) => setHeartNotes(e.target.value)}
                placeholder="Ej: Rosa de Damasco, Jazmín Sambac, Lavanda"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Fondo */}
            <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-stone-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🪵 Notas de Fondo / Base (Fijación prolongada):</span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">
                  {cleanArray(baseNotes).length} notas
                </span>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-6">
                {cleanArray(baseNotes).length === 0 ? (
                  <span className="text-[11px] text-stone-600 italic">Sin notas de fondo asignadas</span>
                ) : (
                  cleanArray(baseNotes).map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-950/60 text-amber-200 border border-amber-800/50 shadow-sm"
                    >
                      <span>{n}</span>
                      <button
                        type="button"
                        onClick={() => removeNoteFromPyramid(n, 'base')}
                        className="hover:text-rose-400 p-0.5 transition"
                        title="Quitar nota"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <input
                type="text"
                value={baseNotes}
                onChange={(e) => setBaseNotes(e.target.value)}
                placeholder="Ej: Vainilla, Ámbar, Sándalo, Almizcle"
                className="w-full bg-black/70 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
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
                  <span>Guardar Ficha & Acordes</span>
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
