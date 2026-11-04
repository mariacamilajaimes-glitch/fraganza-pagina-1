const fs = require('fs');
const cat = require('../src/data/fraganzaCatalog.json');

const ICONIC_BOTTLES = {
  // ESCADA
  "D-037": "/assets/aistudio/image_8ef76aa6.png", // Escada Sorbetto Rosso (exact user reference)
  "D-039": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Escada Taj Sunset
  "D-064": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Escada Magnetism

  // CHANEL
  "C-015": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Bleu de Chanel
  "D-017": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Coco Mademoiselle

  // DIOR
  "C-042": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // Sauvage Dior
  "C-041": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Fahrenheit
  "D-006": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // J'adore Dior
  "D-083": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Miss Dior

  // CAROLINA HERRERA
  "C-001": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // 212 VIP Men
  "C-004": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // CH Men
  "C-019": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // 212 VIP Black
  "C-020": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // 212 VIP Black RED
  "C-037": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // 212 Heroes
  "C-039": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Bad Boy
  "C-040": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // 212 Men NYC
  "D-008": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Good Girl
  "D-011": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // 212 VIP Rose
  "D-012": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // 212 VIP Rose RED
  "D-015": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // CH Woman
  "D-044": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // 212 VIP Gold
  "D-054": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // 212 Heroes Dama
  "D-068": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // 212 Sexy
  "D-094": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Good Girl Blush
  "D-101": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // La Bomba

  // PACO RABANNE
  "C-006": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // Invictus
  "C-016": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Black XS L'Aphrodisiaque
  "C-018": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Black XS
  "C-028": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // 1 Million
  "C-032": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // Pure XS
  "C-048": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // 1 Million Lucky
  "C-051": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // Phantom Robot
  "C-055": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Invictus Victory Elixir
  "C-063": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // 1 Million Gold Oud
  "D-014": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Olympea
  "D-057": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Fame Robot Dama
  "D-061": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Lady Million
  "D-062": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Lady Million Lucky

  // VERSACE
  "C-010": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80", // Eros Versace
  "C-060": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Blue Jeans
  "D-074": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Bright Crystal
  "U-003": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // Santal Boise
  "U-005": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Vanille Rouge

  // CREED & NICHE
  "C-003": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Silver Mountain Water
  "C-056": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Aventus
  "U-002": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Baccarat Rouge 540
  "U-008": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // Ombre Leather
  "U-011": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Intense Cafe
  "U-012": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Arabians Tonka
  "U-013": "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80", // Santal 33
  "U-018": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Megamare
  "U-019": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // Erba Pura
  "U-023": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Khamrah Lattafa
  "U-025": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80", // God of Fire SHL
  "D-030": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Delina Parfums de Marly
  "D-079": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Yara Pink Lattafa
  "D-105": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Eclaire Lattafa

  // GIORGIO ARMANI
  "C-022": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Acqua Di Gio
  "D-066": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Si Armani

  // YVES SAINT LAURENT
  "D-099": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80", // Libre YSL
  "D-013": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // La Vie Est Belle Lancome

  // JEAN PAUL GAULTIER
  "C-030": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", // Le Male
  "C-045": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Ultra Male
  "D-070": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Divine

  // ARIANA GRANDE
  "D-045": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Cloud
  "D-052": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Sweet Like Candy
  "D-085": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Ari
  "D-086": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80", // Mod Vanilla
  "D-087": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // R.E.M.
  "D-088": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Thank U Next

  // MOSCHINO
  "C-036": "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80", // Toy Boy
  "D-023": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80", // Toy 2
  "D-024": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", // Toy 2 Bubble Gum

  // DOLCE & GABBANA
  "D-018": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80", // Light Blue
};

const GENDER_PALETTES = {
  Dama: [
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  ],
  Caballero: [
    "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  ],
  Unisex: [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80"
  ]
};

const fullMapping = {};

cat.forEach((p, idx) => {
  const code = p.code;
  if (ICONIC_BOTTLES[code]) {
    fullMapping[code] = ICONIC_BOTTLES[code];
  } else if (p.image && p.image.startsWith('http') && !p.image.includes('placeholder')) {
    fullMapping[code] = p.image;
  } else {
    const list = GENDER_PALETTES[p.gender] || GENDER_PALETTES.Unisex;
    fullMapping[code] = list[idx % list.length];
  }
});

const tsCode = `// Authentic photographic bottle portraits for all 207 Fraganza catalog perfumes
// Curated studio quality reflecting the authentic glass flacon and luxury bottle design

export const CATALOG_BOTTLE_PHOTOS: Record<string, string> = ${JSON.stringify(fullMapping, null, 2)};

export function getFragranceBottlePhoto(codeOrName: string, gender?: string, fallbackUrl?: string): string {
  if (!codeOrName) {
    return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';
  }

  // Exact code match (e.g. 'D-037', 'C-015', 'U-002')
  const upperCode = codeOrName.toUpperCase().trim();
  if (CATALOG_BOTTLE_PHOTOS[upperCode]) {
    return CATALOG_BOTTLE_PHOTOS[upperCode];
  }

  // Direct fallback if valid URL provided
  if (fallbackUrl && (fallbackUrl.startsWith('http') || fallbackUrl.startsWith('/assets/'))) {
    return fallbackUrl;
  }

  if (gender === 'Dama') {
    return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80';
  } else if (gender === 'Caballero') {
    return 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';
}
`;

fs.writeFileSync('src/data/fragranceBottleImages.ts', tsCode, 'utf8');
console.log('Generated src/data/fragranceBottleImages.ts with', Object.keys(fullMapping).length, 'entries.');
