const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const BRANDS = [
  "Carolina Herrera", "Victorinox", "Creed", "Nautica", "Paco Rabanne",
  "Hugo Boss", "Paris Hilton", "Versace", "Davidoff", "Calvin Klein",
  "Antonio Banderas", "Givenchy", "Chanel", "Perry Ellis", "Giorgio Armani",
  "Bvlgari", "Issey Miyake", "Lacoste", "Ralph Lauren", "Gucci",
  "Jean Paul Gaultier", "Diesel", "Montblanc", "Moschino", "Cristiano Ronaldo",
  "Dior", "Bharara", "Louis Vuitton", "Tom Ford", "Yanbal", "Armaf",
  "Al Haramain", "Maison Francis Kurkdjian", "Ilmin", "Mancera", "Roger & Gallet",
  "Montale", "Le Labo", "Orientica", "Orto Parisi", "Xerjoff", "Bond No. 9",
  "Arrurrú", "Afnan", "Lattafa", "Stéphane Humbert Lucas 777", "Ahli",
  "Tommy Hilfiger", "Sofia Vergara", "Katy Perry", "J. Del Pozo", "Britney Spears",
  "Lancôme", "Nina Ricci", "Shakira", "Parfums de Marly", "Victoria's Secret",
  "Kim Kardashian", "Escada", "Amouage", "Burberry", "Cacharel", "Ariana Grande",
  "Bath & Body Works", "Viktor & Rolf", "DKNY", "Juicy Couture", "Lolita Lempicka",
  "Kenzo", "Billie Eilish", "Selena Gomez", "Yves Saint Laurent", "Clinique",
  "Ferrari", "Ésika", "Guess", "Valentino"
];

// Distinct curated bottle imagery for top perfumes / categories
const CURATED_IMAGES = {
  "c-015": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Bleu de Chanel
  "c-022": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Acqua Di Giò
  "c-042": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // Sauvage Dior
  "c-010": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80", // Eros Versace
  "u-002": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Baccarat Rouge 540
  "d-008": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Good Girl
  "d-013": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // La Vie Est Belle
  "d-017": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80", // Coco Mademoiselle
  "d-018": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80", // Light Blue
  "d-099": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80", // Libre YSL
  "u-008": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // Ombre Leather
};

const FAMILY_DEFAULT_IMAGES = {
  "Floral": [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80"
  ],
  "Dulce / Acaramelado": [
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  ],
  "Cítrico / Acuático": [
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  ],
  "Amaderado / Oriental": [
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80"
  ]
};

async function generate() {
  const buf = fs.readFileSync('public/assets/aistudio/catalogo_fraganza_test_35ab6155.pdf');
  const parser = new PDFParse({ data: buf });
  const doc = await parser.getText();
  const pages = doc.pages;

  function getBlockLines(blockIndex) {
    const start = blockIndex * 8;
    const lines = [];
    for (let p = 0; p < 8; p++) {
      const pIdx = start + p;
      if (pIdx >= pages.length) break;
      const raw = pages[pIdx].text.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of raw) {
        if (line.includes('CATÁLOGO SIMPLIFICADO') || 
            line.includes('Versión cliente') ||
            line.includes('ID Código Nombre') ||
            line.includes('Popularidad Género') ||
            line.includes('Aromas Clave') ||
            line.includes('Notas de Salida') ||
            line.includes('Notas de Corazón') ||
            line.includes('Notas de Fondo') ||
            line.includes('Sensación Olfativa') ||
            line.includes('Rango de Edad') ||
            line.includes('Ocasión de Uso') ||
            line.includes('Descriptores Clave') ||
            line.includes('Explicación Sencilla')) {
          continue;
        }
        lines.push(line);
      }
    }
    return lines;
  }

  const block1 = getBlockLines(0);
  const block2 = getBlockLines(1);
  const block3 = getBlockLines(2);
  const block4 = getBlockLines(3);
  const block5 = getBlockLines(4);
  const block6 = getBlockLines(5);
  const block7 = getBlockLines(6);
  const block8 = getBlockLines(7);
  const block9 = getBlockLines(8);
  const block10 = getBlockLines(9);
  const block11 = getBlockLines(10);

  const fragrances = [];

  for (let i = 0; i < 207; i++) {
    // 1. Base info
    const l1 = block1[i];
    const m1 = l1.match(/^(\d+)\s+([CUD]-\d{3})\s+(.+)$/);
    if (!m1) continue;
    const idNum = parseInt(m1[1]);
    const code = m1[2];
    const fullRest = m1[3].trim();

    let brand = "Fraganza";
    let name = fullRest;
    for (const b of BRANDS) {
      if (fullRest.endsWith(b)) {
        brand = b;
        name = fullRest.slice(0, -b.length).trim();
        break;
      }
    }

    // Gender authoritative from code prefix:
    // C- => Caballero, U- => Unisex, D- => Dama
    let gender = "Unisex";
    if (code.startsWith("C-")) gender = "Caballero";
    else if (code.startsWith("D-")) gender = "Dama";
    else if (code.startsWith("U-")) gender = "Unisex";

    // Block 2: Popularidad, Género en PDF, Familia, Subfamilia
    const l2 = block2[i] || "";
    const popularity = l2.startsWith("Alta") ? "Alta" : "Media";
    
    // Family General:
    let family = "Amaderada";
    let subfamily = "Oriental Amaderada";
    const fams = [
      "Oriental / Especiada", "Aromática / Verde", "Fresca / Acuática",
      "Gourmand / Dulce", "Cítrica (Fresca)", "Chipre (Elegante)",
      "Aromática / Fresca", "Amaderada", "Floral", "Chipre"
    ];
    for (const f of fams) {
      if (l2.includes(f)) {
        family = f;
        const idx = l2.indexOf(f);
        subfamily = l2.substring(idx + f.length).trim() || family;
        break;
      }
    }

    // 3. Aromas Clave Reconocibles
    const aromasClave = (block3[i] || "").split(',').map(s => s.trim()).filter(Boolean);

    // 4. Notas de Salida
    const topNotes = (block4[i] || "").split(',').map(s => s.trim()).filter(Boolean);

    // 5. Notas de Corazón
    const heartNotes = (block5[i] || "").split(',').map(s => s.trim()).filter(Boolean);

    // 6. Notas de Fondo y Dulzor
    const l6 = block6[i] || "";
    let sweetness = "Moderado";
    let baseStr = l6;
    if (l6.endsWith("Muy Dulce")) {
      sweetness = "Muy Dulce";
      baseStr = l6.slice(0, -"Muy Dulce".length).trim();
    } else if (l6.endsWith("Moderado")) {
      sweetness = "Moderado";
      baseStr = l6.slice(0, -"Moderado".length).trim();
    } else if (l6.endsWith("Fresco")) {
      sweetness = "Fresco";
      baseStr = l6.slice(0, -"Fresco".length).trim();
    } else if (l6.endsWith("Seco")) {
      sweetness = "Seco";
      baseStr = l6.slice(0, -"Seco".length).trim();
    }
    const baseNotes = baseStr.split(',').map(s => s.trim()).filter(Boolean);

    // 7. Sensación Olfativa, Intensidad, PH Piel
    const l7 = block7[i] || "";
    let skinCompat = "Versátil";
    let rest7 = l7;
    if (l7.endsWith("Piel Seca")) {
      skinCompat = "Piel Seca";
      rest7 = l7.slice(0, -"Piel Seca".length).trim();
    } else if (l7.endsWith("Piel Grasa")) {
      skinCompat = "Piel Grasa";
      rest7 = l7.slice(0, -"Piel Grasa".length).trim();
    } else if (l7.endsWith("Piel Mixta")) {
      skinCompat = "Piel Mixta";
      rest7 = l7.slice(0, -"Piel Mixta".length).trim();
    } else if (l7.endsWith("Versátil")) {
      skinCompat = "Versátil";
      rest7 = l7.slice(0, -"Versátil".length).trim();
    }

    let intensity = "Moderada";
    let sensation = rest7;
    if (rest7.endsWith("Envolvente")) {
      intensity = "Envolvente";
      sensation = rest7.slice(0, -"Envolvente".length).trim();
    } else if (rest7.endsWith("Intensa")) {
      intensity = "Intensa";
      sensation = rest7.slice(0, -"Intensa".length).trim();
    } else if (rest7.endsWith("Moderada")) {
      intensity = "Moderada";
      sensation = rest7.slice(0, -"Moderada".length).trim();
    } else if (rest7.endsWith("Suave")) {
      intensity = "Suave";
      sensation = rest7.slice(0, -"Suave".length).trim();
    }

    // 8. Rango de Edad, Estilo y Personalidad, Ambiente Ideal
    const l8 = block8[i] || "";
    let environment = "Indistinto";
    let rest8 = l8;
    if (l8.endsWith("Indistinto")) {
      environment = "Indistinto";
      rest8 = l8.slice(0, -"Indistinto".length).trim();
    } else if (l8.endsWith("Noche")) {
      environment = "Noche";
      rest8 = l8.slice(0, -"Noche".length).trim();
    } else if (l8.endsWith("Día")) {
      environment = "Día";
      rest8 = l8.slice(0, -"Día".length).trim();
    }

    let ageRange = "20-45 años";
    let personality = rest8;
    const mAge = rest8.match(/^(\d+-\d+\s+años|Todas las edades)\s+(.+)$/);
    if (mAge) {
      ageRange = mAge[1];
      personality = mAge[2];
    }

    // 9. Ocasión de Uso
    const l9 = block9[i] || "";
    let occasion = l9.replace(/\s+(Frío|Cálido|Versátil)\s*\/\s*.+$/, "").trim() || "Todo Uso / Diario";

    // 10. Descriptores Clave
    const l10 = block10[i] || "";
    const tags = l10.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    // 11. Explicación Sencilla
    const description = block11[i] || `Exclusiva fragancia ${name} de ${brand}, distinguida por sus notas de ${aromasClave.slice(0, 3).join(', ')}.`;

    // Map family to the 4 main groups requested by user:
    // 🌸 Floral, 🍯 Dulce / Acaramelado, 🍋 Cítrico / Acuático, 🌲 Amaderado / Oriental
    let mainCategory = "Amaderado / Oriental";
    if (family.includes("Floral") || subfamily.includes("Floral")) {
      mainCategory = "Floral";
    } else if (family.includes("Gourmand") || family.includes("Dulce") || sweetness === "Muy Dulce" && (aromasClave.some(a => a.toLowerCase().includes("vainilla") || a.toLowerCase().includes("caramelo") || a.toLowerCase().includes("chocolate")))) {
      mainCategory = "Dulce / Acaramelado";
    } else if (family.includes("Cítrica") || family.includes("Acuática") || family.includes("Fresca")) {
      mainCategory = "Cítrico / Acuático";
    } else {
      mainCategory = "Amaderado / Oriental";
    }

    const id = code.toLowerCase();
    const specificImage = CURATED_IMAGES[id];
    const famImages = FAMILY_DEFAULT_IMAGES[mainCategory] || FAMILY_DEFAULT_IMAGES["Amaderado / Oriental"];
    const image = specificImage || famImages[idNum % famImages.length];

    // Deduplicated list of all notes
    const allNotesSet = new Set([
      ...topNotes,
      ...heartNotes,
      ...baseNotes,
      ...aromasClave
    ]);
    const allNotes = Array.from(allNotesSet);

    fragrances.push({
      id,
      idNum,
      code,
      name,
      brand,
      gender,
      family,
      subfamily,
      mainCategory,
      popularity,
      aromasClave,
      pyramid: {
        top: topNotes.length > 0 ? topNotes : ["Cítricos", "Notas Frescas"],
        heart: heartNotes.length > 0 ? heartNotes : ["Flores", "Especias"],
        base: baseNotes.length > 0 ? baseNotes : ["Maderas", "Ámbar"]
      },
      allNotes,
      sweetness,
      sensation,
      intensity, // "Suave" | "Moderada" | "Intensa" | "Envolvente"
      skinCompat, // "Piel Seca" | "Piel Grasa" | "Piel Mixta" | "Versátil"
      ageRange,
      personality,
      environment,
      occasion,
      tags,
      description,
      image
    });
  }

  fs.writeFileSync('src/data/fraganzaCatalog.json', JSON.stringify(fragrances, null, 2));
  console.log(`Successfully generated and saved ${fragrances.length} fragrances to src/data/fraganzaCatalog.json!`);
}

generate().catch(console.error);
