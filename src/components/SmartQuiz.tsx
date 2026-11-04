import React, { useState } from 'react';
import { CatalogFragrance, CATALOG, MainCategory } from '../data/fraganzaCatalog';
import { getCustomizedCatalog } from '../services/catalogStore';
import { EXPANDED_SUBFAMILIES_FOR_QUIZ } from '../data/fragranticaNotesDictionary';
import { QuizResultCard } from './QuizResultCard';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Flame,
  Droplet,
  Flower2,
  Trees,
  Sun,
  Shield,
  Briefcase,
  Moon,
  Zap,
  RotateCcw,
  Search
} from 'lucide-react';

interface SmartQuizProps {
  onSelectFragrance: (fragrance: CatalogFragrance) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const SmartQuiz: React.FC<SmartQuizProps> = ({
  onSelectFragrance,
  favorites,
  onToggleFavorite,
}) => {
  // Current question index: 0 through 8
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [winner, setWinner] = useState<CatalogFragrance | null>(null);

  // User answers
  const [targetUser, setTargetUser] = useState<string>('Para mí');
  const [genderChoice, setGenderChoice] = useState<string>('Unisex / Sin preferencia');
  const [ageRange, setAgeRange] = useState<string>('21–30 años');
  const [skinType, setSkinType] = useState<string>('Normal');
  const [intensityChoice, setIntensityChoice] = useState<string>('Equilibrada');
  const [familyChoice, setFamilyChoice] = useState<MainCategory>('Amaderado / Oriental');
  const [subFamilyChoices, setSubFamilyChoices] = useState<string[]>([]);
  const [subfamilyFilter, setSubfamilyFilter] = useState<string>('');
  const [personalityChoice, setPersonalityChoice] = useState<string>('Elegante & Sofisticada');
  const [exclusionChoice, setExclusionChoice] = useState<string>('Estoy abierto/a a todo');
  const [occasionChoice, setOccasionChoice] = useState<string>('Ocasiones especiales');

  // Subfamilies map based on Question 5
  const subFamiliesMap: Record<MainCategory, string[]> = {
    'Floral': [
      'Rosa romántica',
      'Jazmín elegante',
      'Lavanda fresca',
      'Flores dulces avainilladas',
      'Peonía suave'
    ],
    'Dulce / Acaramelado': [
      'Vainilla cremosa',
      'Caramelo y pralinés',
      'Coco dulce',
      'Café y cacao',
      'Miel y tonka'
    ],
    'Cítrico / Acuático': [
      'Limón y bergamota',
      'Naranja y mandarina',
      'Brisa marina fresca',
      'Cítricos tropicales',
      'Pomelo intenso'
    ],
    'Amaderado / Oriental': [
      'Madera suave y elegante (sándalo, cedro)',
      'Cuero intenso',
      'Tabaco sofisticado',
      'Oud árabe',
      'Ámbar y especias orientales'
    ]
  };

  const handleSelectAnswer = (qIndex: number, answer: any) => {
    switch (qIndex) {
      case 0:
        setTargetUser(answer);
        setTimeout(() => setCurrentQ(1), 220);
        break;
      case 1:
        setGenderChoice(answer);
        setTimeout(() => setCurrentQ(2), 220);
        break;
      case 2:
        setAgeRange(answer);
        setTimeout(() => setCurrentQ(3), 220);
        break;
      case 3:
        setSkinType(answer);
        setTimeout(() => setCurrentQ(4), 220);
        break;
      case 4:
        setIntensityChoice(answer);
        setTimeout(() => setCurrentQ(5), 220);
        break;
      case 5:
        setFamilyChoice(answer);
        setSubFamilyChoices([]); // reset subfamilies for new family
        setTimeout(() => setCurrentQ(6), 220);
        break;
      case 6:
        // Sub-families selection (handled separately for 2 choices)
        break;
      case 7:
        setPersonalityChoice(answer);
        setTimeout(() => setCurrentQ(8), 220);
        break;
      case 8:
        setExclusionChoice(answer);
        setTimeout(() => setCurrentQ(9), 220);
        break;
      case 9:
        setOccasionChoice(answer);
        calculateAndFinish(answer);
        break;
      default:
        break;
    }
  };

  const handleToggleSubfamily = (sub: string) => {
    let next: string[];
    if (subFamilyChoices.includes(sub)) {
      next = subFamilyChoices.filter(s => s !== sub);
    } else {
      if (subFamilyChoices.length >= 2) {
        next = [subFamilyChoices[1], sub];
      } else {
        next = [...subFamilyChoices, sub];
      }
    }
    setSubFamilyChoices(next);

    // If 2 selected, allow auto advance after brief pause
    if (next.length === 2) {
      setTimeout(() => {
        setCurrentQ(7);
      }, 400);
    }
  };

  const calculateAndFinish = (finalOccasion: string) => {
    // Ultra-precise fragrance matching engine calibrated for Fraganza catalog
    const liveCatalog = getCustomizedCatalog();
    const scored = liveCatalog.map((perfume) => {
      let score = 50;

      // 1. Strict Gender filtering (absolute disqualification for opposite gender)
      if (genderChoice === 'Dama') {
        if (perfume.gender === 'Dama') score += 40;
        else if (perfume.gender === 'Unisex') score += 20;
        else score -= 500; // Strict exclusion
      } else if (genderChoice === 'Caballero') {
        if (perfume.gender === 'Caballero') score += 40;
        else if (perfume.gender === 'Unisex') score += 20;
        else score -= 500; // Strict exclusion
      } else {
        // Unisex / sin preferencia
        if (perfume.gender === 'Unisex') score += 35;
        else score += 15;
      }

      // 2. Main family category match (Question 5)
      if (perfume.mainCategory === familyChoice) {
        score += 60;
      } else if (perfume.family.toLowerCase().includes(familyChoice.toLowerCase().split(' ')[0])) {
        score += 25;
      }

      // 3. Sub-families & specific accords matching (Question 6)
      const allNotesLower = perfume.allNotes.join(' ').toLowerCase();
      const tagsLower = perfume.tags.join(' ').toLowerCase();

      subFamilyChoices.forEach((sub) => {
        // Find corresponding sub definition in dictionary for note samples
        const subTerms = sub.toLowerCase().replace(/[\(\),]/g, ' ').split(' ').filter((w) => w.length > 3);
        const matchesWord = subTerms.some((term) => allNotesLower.includes(term) || tagsLower.includes(term));
        if (matchesWord) score += 25;

        // Give high bonus if exact core note matches
        if (sub.includes('Rosa') && allNotesLower.includes('rosa')) score += 30;
        if (sub.includes('Jazmín') && allNotesLower.includes('jazm')) score += 30;
        if (sub.includes('Vainilla') && allNotesLower.includes('vainill')) score += 30;
        if (sub.includes('Caramelo') && (allNotesLower.includes('caramel') || allNotesLower.includes('dulce'))) score += 30;
        if (sub.includes('Bergamota') && (allNotesLower.includes('bergamot') || allNotesLower.includes('limón'))) score += 30;
        if (sub.includes('Brisa marina') && (allNotesLower.includes('mar') || allNotesLower.includes('acuát') || allNotesLower.includes('calone'))) score += 30;
        if (sub.includes('Oud') && (allNotesLower.includes('oud') || allNotesLower.includes('resina'))) score += 30;
        if (sub.includes('Madera') && (allNotesLower.includes('sándal') || allNotesLower.includes('cedro') || allNotesLower.includes('madera'))) score += 30;
        if (sub.includes('Cuero') && allNotesLower.includes('cuero')) score += 30;
        if (sub.includes('Ámbar') && allNotesLower.includes('ámbar')) score += 30;
      });

      // 4. Skin chemistry & Intensity calibration (Question 3 & 4)
      if (skinType === 'Piel Seca') {
        // Dry skin needs rich fixatives (amber, woods, vanilla, tonka) and high intensity
        if (perfume.skinCompat === 'Piel Seca') score += 30;
        if (allNotesLower.includes('ámbar') || allNotesLower.includes('cedro') || allNotesLower.includes('sándal') || allNotesLower.includes('vainill')) {
          score += 20;
        }
        if (perfume.intensity === 'Intensa' || perfume.intensity === 'Envolvente') score += 25;
      } else if (skinType === 'Piel Grasa') {
        // Oily skin projects and retains easily; thrives with fresh, citrus, aquatic, and moderate intensity
        if (perfume.skinCompat === 'Piel Grasa') score += 30;
        if (allNotesLower.includes('limón') || allNotesLower.includes('bergamot') || allNotesLower.includes('mar') || allNotesLower.includes('acuát')) {
          score += 20;
        }
        if (perfume.intensity === 'Suave' || perfume.intensity === 'Moderada') score += 25;
        if (perfume.sweetness === 'Muy Dulce' && perfume.intensity === 'Envolvente') score -= 30; // Prevents overly cloying
      } else {
        if (perfume.skinCompat === 'Versátil' || perfume.skinCompat === 'Piel Mixta') score += 25;
      }

      // 5. Desired Intensity (Question 4)
      if (intensityChoice === 'Suave / Fresca') {
        if (perfume.intensity === 'Suave') score += 35;
        else if (perfume.intensity === 'Moderada') score += 15;
        else score -= 40;
      } else if (intensityChoice === 'Equilibrada') {
        if (perfume.intensity === 'Moderada') score += 40;
        else score += 10;
      } else if (intensityChoice === 'Intensa') {
        if (perfume.intensity === 'Intensa') score += 40;
        else if (perfume.intensity === 'Envolvente') score += 35;
        else score -= 40;
      }

      // 6. Exclusion filter (Question 7 - Strict elimination of dislikes)
      if (exclusionChoice === 'Muy dulce o empalagoso') {
        if (perfume.sweetness === 'Muy Dulce' || perfume.mainCategory === 'Dulce / Acaramelado' || allNotesLower.includes('algodón')) {
          score -= 150;
        }
      } else if (exclusionChoice === 'Muy fuerte o abrumador') {
        if (perfume.intensity === 'Envolvente' || (perfume.intensity === 'Intensa' && allNotesLower.includes('oud'))) {
          score -= 150;
        }
      } else if (exclusionChoice === 'Muy floral') {
        if (perfume.mainCategory === 'Floral' || perfume.family.includes('Floral')) {
          score -= 150;
        }
      } else if (exclusionChoice === 'Muy cítrico') {
        if (perfume.mainCategory === 'Cítrico / Acuático' || allNotesLower.includes('limón') || allNotesLower.includes('pomelo')) {
          score -= 150;
        }
      } else if (exclusionChoice === 'Muy amaderado u oscuro') {
        if (perfume.mainCategory === 'Amaderado / Oriental' || allNotesLower.includes('oud') || allNotesLower.includes('cuero') || allNotesLower.includes('incienso')) {
          score -= 150;
        }
      }

      // 7. Personality & Personal Tastes alignment (Question 7)
      const personalityLower = (perfume.personality + ' ' + perfume.tags.join(' ') + ' ' + perfume.sensation).toLowerCase();
      if (personalityChoice === 'Elegante & Sofisticada') {
        if (personalityLower.includes('elegante') || personalityLower.includes('sofisticado') || personalityLower.includes('formal') || personalityLower.includes('maduro')) {
          score += 35;
        }
      } else if (personalityChoice === 'Seductora & Magnética') {
        if (personalityLower.includes('seductor') || personalityLower.includes('sensual') || personalityLower.includes('nocturno') || personalityLower.includes('misterioso')) {
          score += 35;
        }
      } else if (personalityChoice === 'Fresca & Vitalista') {
        if (personalityLower.includes('refrescante') || personalityLower.includes('fresco') || personalityLower.includes('activo') || personalityLower.includes('deportivo') || personalityLower.includes('energético')) {
          score += 35;
        }
      } else if (personalityChoice === 'Cálida & Acaramelada') {
        if (personalityLower.includes('dulce') || personalityLower.includes('acaramelad') || personalityLower.includes('cálida') || personalityLower.includes('romántico') || perfume.sweetness === 'Muy Dulce') {
          score += 35;
        }
      } else if (personalityChoice === 'Vanguardista & Pulcra') {
        if (personalityLower.includes('urbano') || personalityLower.includes('moderno') || personalityLower.includes('limpio') || personalityLower.includes('versátil')) {
          score += 35;
        }
      } else if (personalityChoice === 'Audaz & Envolvente') {
        if (personalityLower.includes('audaz') || personalityLower.includes('intenso') || personalityLower.includes('rebelde') || personalityLower.includes('envolvente') || perfume.intensity === 'Envolvente') {
          score += 35;
        }
      }

      // 8. Occasion match (Question 9)
      const occasionLower = (perfume.occasion + ' ' + perfume.description + ' ' + perfume.environment).toLowerCase();
      if (finalOccasion === 'Ocasiones especiales') {
        if (occasionLower.includes('fiesta') || occasionLower.includes('cita') || occasionLower.includes('noche') || occasionLower.includes('seductor')) {
          score += 40;
        }
      } else if (finalOccasion === 'Oficina / Trabajo') {
        if (occasionLower.includes('oficina') || occasionLower.includes('trabajo') || occasionLower.includes('formal') || occasionLower.includes('discreto') || occasionLower.includes('limpio')) {
          score += 40;
        }
      } else if (finalOccasion === 'Todo uso / Diario') {
        if (occasionLower.includes('diario') || occasionLower.includes('casual') || occasionLower.includes('versátil') || occasionLower.includes('día')) {
          score += 40;
        }
      } else if (finalOccasion === 'Deportivo / Activo') {
        if (occasionLower.includes('deporte') || occasionLower.includes('activo') || occasionLower.includes('fresco') || occasionLower.includes('gimnasio')) {
          score += 40;
        }
      }

      // 8. Age affinity (Question 2)
      const agePrefix = ageRange.split('–')[0];
      if (perfume.ageRange.includes(agePrefix)) {
        score += 20;
      }

      // 9. Popularity multiplier
      if (perfume.popularity === 'Alta') {
        score += 8;
      }

      return { perfume, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatch = scored[0]?.perfume || liveCatalog[0] || CATALOG[0];

    setWinner(topMatch);
    setIsFinished(true);

    // Launch luxury gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A84C', '#F0D080', '#A07830', '#ffffff']
      });
    } catch {}
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setIsFinished(false);
    setWinner(null);
    setSubFamilyChoices([]);
  };

  if (isFinished && winner) {
    return (
      <QuizResultCard
        winner={winner}
        occasionAnswer={occasionChoice}
        skinAnswer={skinType}
        intensityAnswer={intensityChoice}
        onSelectFragrance={onSelectFragrance}
        onRestartQuiz={restartQuiz}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Title & Subtitle */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#F0D080] text-xs font-semibold uppercase tracking-widest shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#F0D080]" />
          <span>Test Inteligente de Perfumería</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-stone-100 font-serif-luxury tracking-tight">
          Descubre Tu Fragancia Ideal
        </h1>
        <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Un algoritmo exclusivo calibrado con la biblioteca oficial de Fraganza. Selección automática al responder.
        </p>
      </div>

      {/* Main Question Card with Gold Glow */}
      <div className="relative rounded-3xl bg-[#0d0d0d] border border-[#C9A84C]/30 p-6 md:p-10 shadow-2xl shadow-[#C9A84C]/10 backdrop-blur-xl">
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A07830] via-[#F0D080] to-[#A07830]" />

        {/* Stepper Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-800/80 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#F0D080] font-bold">
              Pregunta {currentQ + 1} de 10
            </span>
          </div>

          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentQ
                    ? 'w-7 bg-[#F0D080] shadow-sm shadow-[#C9A84C]'
                    : idx < currentQ
                    ? 'w-3 bg-[#A07830]'
                    : 'w-3 bg-stone-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* PREGUNTA 0 */}
        {currentQ === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿A quién va dirigida la fragancia?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Permite al algoritmo calibrar sugerencias para uso personal o para obsequiar a alguien especial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Para mí', desc: 'Desea encontrar su nueva firma olfativa predilecta' },
                { title: 'Para otra persona', desc: 'Busca sorprender a alguien especial con una fragancia inolvidable' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => handleSelectAnswer(0, opt.title)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    targetUser === opt.title
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold font-serif-luxury text-stone-100">{opt.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 1 */}
        {currentQ === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Qué perfil o género de fragancia busca la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Filtraremos de inmediato nuestro catálogo según el perfil seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                { id: 'Dama', label: 'Dama', codeRef: 'D-', desc: 'Elegancia femenina, florales radiantes, dulces y frutales chic' },
                { id: 'Caballero', label: 'Caballero', codeRef: 'C-', desc: 'Varonil, maderas nobles, especias cálidas y acordes fougère' },
                { id: 'Unisex / Sin preferencia', label: 'Unisex / Sin preferencia', codeRef: 'U-', desc: 'Composiciones modernas y versátiles sin distinción de género' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectAnswer(1, opt.id)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    genderChoice === opt.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold font-serif-luxury text-stone-100">{opt.label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-900 text-[#F0D080] border border-stone-700">
                      {opt.codeRef}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 2 */}
        {currentQ === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿En qué rango de edad se encuentra la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Ayuda a calibrar entre propuestas juveniles dinámicas o creaciones maduras y señoriales.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { range: '15–20 años', desc: 'Chispeante, fresco y juvenil' },
                { range: '21–30 años', desc: 'Moderno, seductor y fiestero' },
                { range: '31–45 años', desc: 'Sofisticado, ejecutivo y seguro' },
                { range: '46 años o más', desc: 'Distinguido, aristocrático y clásico' }
              ].map((opt) => (
                <button
                  key={opt.range}
                  type="button"
                  onClick={() => handleSelectAnswer(2, opt.range)}
                  className={`p-5 rounded-2xl text-center border transition-all duration-300 ${
                    ageRange === opt.range
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <p className="font-serif-luxury font-bold text-base text-stone-100 mb-1">{opt.range}</p>
                  <p className="text-[11px] text-stone-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 3 */}
        {currentQ === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Qué tipo de piel posee la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                La química dérmica y el nivel de hidratación influyen directamente en la fijación y duración del perfume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'Piel Seca',
                  emoji: '🏜️',
                  title: 'Piel Seca',
                  desc: 'Absorbe el perfume rápido; recomendamos fórmulas con mayor fijación o acordes densos como ámbar, maderas nobles y vainilla.'
                },
                {
                  id: 'Piel Mixta',
                  emoji: '⚖️',
                  title: 'Piel Mixta',
                  desc: 'Zona T con mayor oleosidad; equilibrio óptimo para proyectar acordes aromáticos, especiados y notas intermedias.'
                },
                {
                  id: 'Normal',
                  emoji: '🌸',
                  title: 'Piel Normal',
                  desc: 'Equilibrio perfecto de pH e hidratación; proyecta fielmente cualquier composición olfativa de salida a fondo.'
                },
                {
                  id: 'Piel Grasa',
                  emoji: '✨',
                  title: 'Piel Grasa',
                  desc: 'Mayor oleosidad natural; intensifica y proyecta mucho más el perfume; las fragancias frescas y acuáticas duran horas prolongadas.'
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAnswer(3, item.id)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                    skinType === item.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-serif-luxury font-bold text-base text-stone-100">{item.title}</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 4 */}
        {currentQ === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Qué nivel de intensidad o proyección prefiere la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Define el radio de proyección y la huella sensorial que dejará en el ambiente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                {
                  id: 'Suave / Fresca',
                  icon: '🌿',
                  label: 'Suave / Fresca',
                  desc: 'Discreta, ligera, ideal para el día a día y cercanía sin saturar el espacio'
                },
                {
                  id: 'Equilibrada',
                  icon: '✨',
                  label: 'Equilibrada',
                  desc: 'Ni demasiado tenue ni abrumadora, altamente versátil y elegante en cualquier momento'
                },
                {
                  id: 'Intensa',
                  icon: '🔥',
                  label: 'Intensa',
                  desc: 'Proyección fuerte, gran estela duradera que deja huella inolvidable a su paso'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectAnswer(4, opt.id)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    intensityChoice === opt.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-serif-luxury font-bold text-base text-stone-100">{opt.label}</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 5 */}
        {currentQ === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Qué familia olfativa despierta mayor afinidad en la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Representa el pilar y carácter aromático predominante de la fragancia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'Floral' as MainCategory,
                  icon: '🌸',
                  title: 'Floral',
                  desc: 'Rosas románticas, jazmín noble, peonía fresca y lavanda'
                },
                {
                  id: 'Dulce / Acaramelado' as MainCategory,
                  icon: '🍯',
                  title: 'Dulce / Acaramelado',
                  desc: 'Vainilla cremosa, caramelo, haba tonka y pralinés adictivos'
                },
                {
                  id: 'Cítrico / Acuático' as MainCategory,
                  icon: '🍋',
                  title: 'Cítrico / Acuático',
                  desc: 'Bergamota viva, limón siciliano, brisa marina y frescor revitalizante'
                },
                {
                  id: 'Amaderado / Oriental' as MainCategory,
                  icon: '🌲',
                  title: 'Amaderado / Oriental',
                  desc: 'Sándalo cremoso, oud árabe, ámbar gris, especias cálidas y cuero'
                }
              ].map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => handleSelectAnswer(5, fam.id)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    familyChoice === fam.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{fam.icon}</span>
                    <span className="font-serif-luxury font-bold text-lg text-stone-100">{fam.title}</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{fam.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 6 (Sub-familia condicional, basada en la biblioteca olfativa) */}
        {currentQ === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                  ¿Cuáles de estos acordes aromáticos prefiere o disfruta más la persona?
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#F0D080] border border-[#C9A84C]/40">
                  Elige hasta dos ({subFamilyChoices.length}/2)
                </span>
              </div>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Aromas catalogados según la familia <span className="text-[#F0D080] font-semibold">{familyChoice}</span> (basados en la biblioteca olfativa oficial de Fraganza).
              </p>

              {/* Quick filter input */}
              <div className="relative mt-3">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subfamilyFilter}
                  onChange={(e) => setSubfamilyFilter(e.target.value)}
                  placeholder={`Filtrar notas de ${familyChoice} (ej. vainilla, oud, lavanda, bergamota)...`}
                  className="w-full bg-[#121212] border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 max-h-[50vh] overflow-y-auto pr-1">
              {(EXPANDED_SUBFAMILIES_FOR_QUIZ[familyChoice] || [])
                .filter((sub) => {
                  if (!subfamilyFilter.trim()) return true;
                  const q = subfamilyFilter.toLowerCase();
                  return (
                    sub.label.toLowerCase().includes(q) ||
                    sub.desc.toLowerCase().includes(q) ||
                    sub.subgroup.toLowerCase().includes(q) ||
                    sub.notesSample.some((n) => n.toLowerCase().includes(q))
                  );
                })
                .map((sub) => {
                  const selected = subFamilyChoices.includes(sub.label);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleToggleSubfamily(sub.label)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between space-y-2 group ${
                        selected
                          ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-stone-100 font-semibold shadow-lg shadow-[#C9A84C]/15 ring-1 ring-[#C9A84C]'
                          : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{sub.icon}</span>
                          <div>
                            <span className="text-sm font-bold block text-stone-100 group-hover:text-[#F0D080] transition-colors">
                              {sub.label}
                            </span>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C]/80">
                              {sub.subgroup}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                            selected
                              ? 'bg-[#C9A84C] border-[#C9A84C] text-stone-950 font-bold'
                              : 'border-stone-700 bg-stone-900'
                          }`}
                        >
                          {selected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {sub.desc}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1 border-t border-stone-800/60">
                        {sub.notesSample.map((n, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[9px] bg-stone-900/90 text-stone-300 border border-stone-800"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-stone-800/80">
              <span className="text-xs text-stone-500">
                {subFamilyChoices.length === 2
                  ? '¡2 seleccionados! Avanzando automáticamente...'
                  : 'Selecciona 1 o 2 opciones favoritas'}
              </span>
              {subFamilyChoices.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentQ(7)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-stone-950 text-xs font-bold transition-all shadow-md hover:brightness-110"
                >
                  Continuar con {subFamilyChoices.length} selección{subFamilyChoices.length > 1 ? 'es' : ''}
                </button>
              )}
            </div>
          </div>
        )}

        {/* PREGUNTA 7 (Estilo personal y gustos olfativos de la persona) */}
        {currentQ === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Qué estilo sensorial o personalidad define mejor a la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Define la impronta olfativa, carácter y presencia que más sintoniza con sus gustos personales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                {
                  id: 'Elegante & Sofisticada',
                  icon: '👑',
                  title: 'Elegante & Sofisticada',
                  desc: 'Busca distinción refinada, sobriedad, madurez segura y un porte pulcro que inspira respeto.'
                },
                {
                  id: 'Seductora & Magnética',
                  icon: '🔥',
                  title: 'Seductora & Magnética',
                  desc: 'Prefiere dejar una estela misteriosa, sensual y cautivadora que atraiga miradas en citas y veladas íntimas.'
                },
                {
                  id: 'Fresca & Vitalista',
                  icon: '🌿',
                  title: 'Fresca & Vitalista',
                  desc: 'De espíritu libre, enérgico y dinámico; ama la ligereza limpia de la brisa marina, el agua y la naturaleza vivificante.'
                },
                {
                  id: 'Cálida & Acaramelada',
                  icon: '🍯',
                  title: 'Cálida & Acaramelada',
                  desc: 'Disfruta de la dulzura reconfortante, notas golosas que provocan ternura, cercanía y una sensación acogedora.'
                },
                {
                  id: 'Vanguardista & Pulcra',
                  icon: '✨',
                  title: 'Vanguardista & Pulcra',
                  desc: 'Moderna, cosmopolita y urbana; adora los aromas limpios, minimalistas, no invasivos y de corte contemporáneo.'
                },
                {
                  id: 'Audaz & Envolvente',
                  icon: '💎',
                  title: 'Audaz & Envolvente',
                  desc: 'Extrovertida y con carácter firme; no teme llamar la atención con una estela opulenta, rica y protagónica.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectAnswer(7, opt.id)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between space-y-2 group ${
                    personalityChoice === opt.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{opt.icon}</span>
                    <p className="font-serif-luxury font-bold text-sm text-stone-100 group-hover:text-[#F0D080] transition-colors">
                      {opt.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 8 (Exclusión) */}
        {currentQ === 8 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿Existe alguna faceta o nota que la persona prefiera evitar?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Filtro de exclusión negativa para descartar acordes o intensidades que le resulten incómodas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[
                { title: 'Muy dulce o empalagoso', desc: 'Descartar caramelo excesivo o praliné pesado' },
                { title: 'Muy fuerte o abrumador', desc: 'Descartar estelas envolventes o intrusivas' },
                { title: 'Muy floral', desc: 'Descartar buqués florales dominantes' },
                { title: 'Muy cítrico', desc: 'Descartar cítricos punzantes o ácidos' },
                { title: 'Muy amaderado u oscuro', desc: 'Descartar maderas densas, cuero u oud' },
                { title: 'Estoy abierto/a a todo', desc: 'No excluir ninguna nota, evaluar todo el catálogo' }
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => handleSelectAnswer(8, opt.title)}
                  className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                    exclusionChoice === opt.title
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <p className="font-serif-luxury font-bold text-sm text-stone-100 mb-1">{opt.title}</p>
                  <p className="text-[11px] text-stone-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PREGUNTA 9 (Ocasión de uso) */}
        {currentQ === 9 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif-luxury text-stone-100">
                ¿En qué ocasión o escenario usará principalmente la fragancia la persona?
              </h2>
              <p className="text-stone-400 text-xs md:text-sm mt-1">
                Determinará el escenario de uso idóneo y el consejo personalizado del perfumista.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {
                  id: 'Todo uso / Diario',
                  icon: '🌅',
                  title: 'Todo uso / Diario',
                  desc: 'Para llevar siempre, cómoda y fresca en cualquier momento'
                },
                {
                  id: 'Oficina / Trabajo',
                  icon: '💼',
                  title: 'Oficina / Trabajo',
                  desc: 'Discreta, profesional y agradable en espacios cerrados'
                },
                {
                  id: 'Ocasiones especiales',
                  icon: '🌙',
                  title: 'Ocasiones especiales',
                  desc: 'Para citas, fiestas, salidas de noche o momentos especiales'
                },
                {
                  id: 'Deportivo / Activo',
                  icon: '🏃',
                  title: 'Deportivo / Activo',
                  desc: 'Fresca y energizante, perfecta durante el ejercicio o actividades al aire libre'
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAnswer(9, item.id)}
                  className={`p-6 rounded-2xl text-left border transition-all duration-300 ${
                    occasionChoice === item.id
                      ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-stone-100 shadow-xl shadow-[#C9A84C]/10 ring-1 ring-[#C9A84C]'
                      : 'bg-[#141414] border-stone-800 text-stone-300 hover:border-[#C9A84C]/40 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-serif-luxury font-bold text-lg text-stone-100">{item.title}</span>
                  </div>
                  <p className="text-xs text-stone-400 italic leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer controls: Back button */}
        {currentQ > 0 && (
          <div className="pt-8 mt-8 border-t border-stone-800/80 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentQ(currentQ - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-colors border border-stone-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Pregunta anterior</span>
            </button>
            <span className="text-[11px] text-stone-500">
              Fraganza · Algoritmo Olfativo v2.0
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
