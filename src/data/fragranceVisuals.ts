// Real photographic assets for fragrance notes, perfume bottles, brand logos, and main accords
import { getFragranceBottlePhoto } from './fragranceBottleImages';
import { getStoredNotePhotos, getStoredCustomNotes } from '../services/catalogStore';

export interface RealNoteVisual {
  name: string;
  photoUrl: string;
  category: 'Cítricos' | 'Florales' | 'Frutales' | 'Gourmand & Dulces' | 'Maderas' | 'Especias' | 'Aromáticas & Verdes' | 'Acuáticas & Frescas' | 'Cuero & Resinas';
  description: string;
}

// Curated authentic real photography of actual ingredients on clean/neutral backgrounds
// (Real sliced fruits, actual flowers, natural wood barks, real spice pods, real minerals)
export const REAL_NOTE_PHOTOS: Record<string, RealNoteVisual> = {
  // --- FLORALES ---
  'Rosa': {
    name: 'Rosa',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Pétalos de rosa natural aterciopelada, noble, romántica y ligeramente atalcada.'
  },
  'Rosa de Damasco': {
    name: 'Rosa de Damasco',
    photoUrl: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Rosa damascena de Bulgaria, densa, licorosa, profunda y embriagadora.'
  },
  'Jazmín': {
    name: 'Jazmín',
    photoUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Flores blancas de jazmín sambac, narcóticas, luminosas, solares y aristocráticas.'
  },
  'Lavanda': {
    name: 'Lavanda',
    photoUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Espigas de lavanda silvestre de la Provenza, relajante, limpia y aromática.'
  },
  'Peonía': {
    name: 'Peonía',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Floración etérea de peonía rosada, fresca, acuosa y muy femenina.'
  },
  'Lirio': {
    name: 'Lirio',
    photoUrl: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Lirio blanco majestuoso con sutiles matices verdes y melosos.'
  },
  'Lirio de los Valles': {
    name: 'Lirio de los Valles',
    photoUrl: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Campanillas blancas silvestres de primavera, cristalinas, limpias y primaverales.'
  },
  'Iris': {
    name: 'Iris',
    photoUrl: 'https://images.unsplash.com/photo-1588628566587-dbd176de94b4?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Rizoma de iris noble de Florencia, ultra elegante, suavemente atalcado y distinguido.'
  },
  'Violeta': {
    name: 'Violeta',
    photoUrl: 'https://images.unsplash.com/photo-1550953159-663c1a0ad625?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Pétalos silvestres de violeta con aroma nostálgico, verde y aterciopelado.'
  },
  'Flor de Azahar': {
    name: 'Flor de Azahar',
    photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Flores de naranjo amargo, radiantes, limpias, mediterráneas y reconfortantes.'
  },
  'Gardenia': {
    name: 'Gardenia',
    photoUrl: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Pétalos de gardenia blanca, suntuosos, cremosos y opulentos.'
  },
  'Ylang-Ylang': {
    name: 'Ylang-Ylang',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Flor tropical exótica de Madagascar, cremosa, cálida y profundamente sensual.'
  },
  'Tuberosa / Nardo': {
    name: 'Tuberosa / Nardo',
    photoUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Flor narcótica nocturna, hipnótica, densa, carnal y suntuosa.'
  },
  'Flor de tiaré': {
    name: 'Flor de tiaré',
    photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Flor sagrada de Tahití con matices solares, cremosos y exóticos.'
  },
  'Flores': {
    name: 'Flores',
    photoUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Bouquet floral armonioso y polifacético de flores silvestres y nobles.'
  },
  'Geranio': {
    name: 'Geranio',
    photoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Floración aromática con faceta de rosa verde, fresca y mentolada.'
  },
  'Magnolia': {
    name: 'Magnolia',
    photoUrl: 'https://images.unsplash.com/photo-1588628566587-dbd176de94b4?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Pétalos amplios y luminosos con brillo cítrico de limón suave.'
  },
  'Hedione': {
    name: 'Hedione',
    photoUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=300&q=80',
    category: 'Florales',
    description: 'Molécula floral transparente derivada del jazmín que aporta difusión y luminosidad aérea.'
  },

  // --- CÍTRICOS ---
  'Limón / Cítricos': {
    name: 'Limón / Cítricos',
    photoUrl: 'https://images.unsplash.com/photo-1534948216015-843149f72be3?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'Limón amarillo jugoso recién cortado, efervescente, chispeante y enérgico.'
  },
  'Bergamota': {
    name: 'Bergamota',
    photoUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'La reina de los cítricos de Calabria, aromática, elegante, fresca y ligeramente especiada.'
  },
  'Naranja / Mandarina': {
    name: 'Naranja / Mandarina',
    photoUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'Gajos de mandarina madura y naranja jugosa, dulces, alegres y reconfortantes.'
  },
  'naranja tangerina': {
    name: 'naranja tangerina',
    photoUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'Cítrico dulce y vivaz de piel fina con aroma efervescente y alegre.'
  },
  'Pomelo / Toronja': {
    name: 'Pomelo / Toronja',
    photoUrl: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'Pomelo rosado con amargor sofisticado y explosión cítrica vigorizante.'
  },
  'Lima': {
    name: 'Lima',
    photoUrl: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=300&q=80',
    category: 'Cítricos',
    description: 'Lima verde cortada al momento, punzante, ultra fresca y ácida.'
  },

  // --- FRUTALES ---
  'Pera': {
    name: 'Pera',
    photoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Pera Williams madura, jugosa, dulce, crujiente y refrescante.'
  },
  'pera': {
    name: 'pera',
    photoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Pera jugosa cortada en mitades, néctar frutal acuoso y dulce.'
  },
  'Sandía': {
    name: 'Sandía',
    photoUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Rodajas de sandía fresca recién cortada, veraniega, dulce y ultra hidratante.'
  },
  'sandía': {
    name: 'sandía',
    photoUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Triángulos de sandía roja con semillas, dulce, acuosa y refrescante.'
  },
  'Fresa': {
    name: 'Fresa',
    photoUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Fresas silvestres rojas y jugosas, golosas, alegres y fragantes.'
  },
  'fresa': {
    name: 'fresa',
    photoUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Fresas maduras recién cosechadas de huerto, carnosas y dulces.'
  },
  'Manzana': {
    name: 'Manzana',
    photoUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Manzana verde crujiente Granny Smith, crujiente, refrescante y ácida.'
  },
  'manzana': {
    name: 'manzana',
    photoUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Mitad de manzana verde fresca con piel reluciente y néctar limpio.'
  },
  'Piña': {
    name: 'Piña',
    photoUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Piña tropical dorada, jugosa, ahumada, con el toque mítico de Aventus.'
  },
  'Melocotón': {
    name: 'Melocotón',
    photoUrl: 'https://images.unsplash.com/photo-1595126730719-1d9863268846?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Durazno maduro con piel aterciopelada y pulpa almibarada.'
  },
  'Frutos Rojos / Frutas': {
    name: 'Frutos Rojos / Frutas',
    photoUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Moras, frambuesas y grosellas silvestres cargadas de néctar goloso.'
  },
  'Frutos Rojos / Frutas Negra': {
    name: 'Frutos Rojos / Frutas Negra',
    photoUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Grosella negra intensa, moras oscuras y cassis profundo.'
  },
  'Maracuyá': {
    name: 'Maracuyá',
    photoUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Fruta de la pasión exótica, ácida, adictiva y chispeante.'
  },
  'Melón': {
    name: 'Melón',
    photoUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Melón dulce verde Cantaloupe, refrescante, acuático y veraniego.'
  },
  'Coco': {
    name: 'Coco',
    photoUrl: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Coco natural abierto con pulpa blanca fresca, agua de coco cremosa y tropical.'
  },
  'coco': {
    name: 'coco',
    photoUrl: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Mitad de coco fresco con cáscara leñosa y pulpa blanca lactónica.'
  },

  // --- DULCES & GOURMAND ---
  'Vainilla': {
    name: 'Vainilla',
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Vainas de vainilla Bourbon de Madagascar, cálida, cremosa, resinosa y sensual.'
  },
  'Caramelo / Dulces': {
    name: 'Caramelo / Dulces',
    photoUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Caramelo derretido mantecoso con un toque de azúcar tostado y toffee.'
  },
  'Praliné': {
    name: 'Praliné',
    photoUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Bombón de avellanas tostadas y chocolate con leche cremoso.'
  },
  'praliné': {
    name: 'praliné',
    photoUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Pasta praliné de frutos secos y cacao dulce aterciopelado.'
  },
  'Café': {
    name: 'Café',
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Granos de café espresso arábica tostado, energizante, cálido y adictivo.'
  },
  'Cacao / Chocolate': {
    name: 'Cacao / Chocolate',
    photoUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Polvo de cacao puro y chocolate negro intenso, profundo y suntuoso.'
  },
  'Haba Tonka': {
    name: 'Haba Tonka',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Semilla de cumarina natural con notas de almendra dulce, tabaco rubio y heno.'
  },
  'Algodón De Azúcar': {
    name: 'Algodón De Azúcar',
    photoUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Azúcar hilado etéreo que evoca ferias, infancia y nostalgia dulce.'
  },
  'Miel': {
    name: 'Miel',
    photoUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
    category: 'Gourmand & Dulces',
    description: 'Miel pura de azahar, dorada, rica, viscosa y reconfortante.'
  },

  // --- MADERAS ---
  'Maderas (Cedro/Sándalo)': {
    name: 'Maderas (Cedro/Sándalo)',
    photoUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Astillas de sándalo cremoso de Mysore y cedro seco de Virginia.'
  },
  'Notas Amaderadas': {
    name: 'Notas Amaderadas',
    photoUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Corteza de maderas nobles, secas, elegantes y arquitectónicas.'
  },
  'Pachulí': {
    name: 'Pachulí',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Hojas de patchouli fermentadas de Indonesia, terrosas, húmedas y sofisticadas.'
  },
  'Vetiver': {
    name: 'Vetiver',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Raíces terrosas de vetiver de Haití, ahumadas, verdes, masculinas y elegantes.'
  },
  'Oud': {
    name: 'Oud',
    photoUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Resina de madera de agar, el oro negro de Oriente, oscura, majestuosa y balsámica.'
  },
  'Pino / Ciprés': {
    name: 'Pino / Ciprés',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Bosque de coníferas tras la lluvia, verde resinoso, fresco y vigorizante.'
  },
  'Guayaco': {
    name: 'Guayaco',
    photoUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Madera de palo santo densa, resinosa, suavemente balsámica y ahumada.'
  },
  'Amberwood': {
    name: 'Amberwood',
    photoUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Madera ambarina moderna con difusión ultra duradera y estela envolvente.'
  },

  // --- ÁMBAR & RESINAS & CUERO ---
  'Ámbar': {
    name: 'Ámbar',
    photoUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Resina fósil dorada y cálida, envolvente, con acordes de ládano y benjuí.'
  },
  'ámbar': {
    name: 'ámbar',
    photoUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Gema ambarina translúcida con calidez balsámica que fija y embellece la estela.'
  },
  'Almizcle': {
    name: 'Almizcle',
    photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Almizcle blanco limpio, efecto segunda piel, sedoso, íntimo y reconfortante.'
  },
  'almizcle': {
    name: 'almizcle',
    photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Suaves fibras de almizcle blanco puro, evocando piel limpia y calidez humana.'
  },
  'Cuero': {
    name: 'Cuero',
    photoUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Piel curtida aristocrática, chaqueta de cuero fina, sobria, masculina y carismática.'
  },
  'Incienso / Resinas': {
    name: 'Incienso / Resinas',
    photoUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Lágrimas de olíbano sagrado, místico, ahumado, espiritual y sereno.'
  },
  'Musgo': {
    name: 'Musgo',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Musgo de roble sobre corteza húmeda, el pilar de la perfumería chipre clásica.'
  },

  // --- ESPECIAS ---
  'Especias (Canela/Pimienta)': {
    name: 'Especias (Canela/Pimienta)',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Ramas de canela de Ceilán y granos de pimienta negra molida, cálida y picante.'
  },
  'Cardamomo': {
    name: 'Cardamomo',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Vainas verdes de cardamomo guatemalteco, aromático, alcanforado y sensual.'
  },
  'Jengibre': {
    name: 'Jengibre',
    photoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Raíz fresca de jengibre rallada, picante, chispeante y revitalizante.'
  },
  'Pimienta Rosa': {
    name: 'Pimienta Rosa',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Bayas rosadas dulces y especiadas que aportan brillo inicial a la fragancia.'
  },

  // --- ACUÁTICAS & MARINAS & VERDES ---
  'Notas Marinas / Acuáticas': {
    name: 'Notas Marinas / Acuáticas',
    photoUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80',
    category: 'Acuáticas & Frescas',
    description: 'Brisa de mar abierto con salitre, olas rompiendo y frescor ilimitado.'
  },
  'notas acuosas': {
    name: 'notas acuosas',
    photoUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80',
    category: 'Acuáticas & Frescas',
    description: 'Gotas de agua fresca cristalina sobre flores y frutas de verano.'
  },
  'sal de mar': {
    name: 'sal de mar',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    category: 'Acuáticas & Frescas',
    description: 'Cristales de sal marina evaporada al sol que aportan una textura mineral única.'
  },
  'calone': {
    name: 'calone',
    photoUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80',
    category: 'Acuáticas & Frescas',
    description: 'Molécula marina que evoca brisa oceánica ozónica y melón acuoso.'
  },
  'Menta Fresca': {
    name: 'Menta Fresca',
    photoUrl: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=300&q=80',
    category: 'Aromáticas & Verdes',
    description: 'Hojas de menta piperita frotadas, heladas, tonificantes y energizantes.'
  },
  'Hierbas Verdes': {
    name: 'Hierbas Verdes',
    photoUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
    category: 'Aromáticas & Verdes',
    description: 'Romero silvestre, tomillo y salvia rozados por el viento en la montaña.'
  },
  'Notas Verdes': {
    name: 'Notas Verdes',
    photoUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
    category: 'Aromáticas & Verdes',
    description: 'Hojas verdes trituradas y rocío fresco de la mañana.'
  },
  'Té Verde': {
    name: 'Té Verde',
    photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80',
    category: 'Aromáticas & Verdes',
    description: 'Hojas de té Sencha al vapor, sereno, zen, transparente y ligeramente ahumado.'
  },
  'Cedro': {
    name: 'Cedro',
    photoUrl: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Virutas aromáticas de madera de cedro seco de Virginia, sobrio y arquitectónico.'
  },
  'Sándalo': {
    name: 'Sándalo',
    photoUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=300&q=80',
    category: 'Maderas',
    description: 'Madera de sándalo noble de Mysore, cremosa, láctea, suave y sagrada.'
  },
  'Canela': {
    name: 'Canela',
    photoUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Ramas enrolladas de canela pura de Ceilán, cálida, dulce y envolvente.'
  },
  'Pimienta': {
    name: 'Pimienta',
    photoUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=300&q=80',
    category: 'Especias',
    description: 'Granos de pimienta negra y rosa triturados, picante, vivaz y chispeante.'
  },
  'Frambuesa': {
    name: 'Frambuesa',
    photoUrl: 'https://images.unsplash.com/photo-1577069808027-142277d33b5c?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Frambuesas rojas frescas y aterciopeladas, ácidas, jugosas y golosas.'
  },
  'Cereza': {
    name: 'Cereza',
    photoUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=300&q=80',
    category: 'Frutales',
    description: 'Cerezas rojas oscuras maduras licorosas, profundas, dulces y seductoras.'
  },
  'Tabaco': {
    name: 'Tabaco',
    photoUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=300&q=80',
    category: 'Cuero & Resinas',
    description: 'Hojas aromáticas de tabaco rubio curado con matices de miel y heno seco.'
  },
  'Romero': {
    name: 'Romero',
    photoUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
    category: 'Aromáticas & Verdes',
    description: 'Ramitas de romero silvestre mediterráneo, herbal, alcanforado y tónico.'
  }
};

// Fallback high-resolution botanical real photos by family category
export const CATEGORY_FALLBACK_PHOTOS: Record<string, string> = {
  'Florales': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80',
  'Cítricos': 'https://images.unsplash.com/photo-1534948216015-843149f72be3?auto=format&fit=crop&w=300&q=80',
  'Frutales': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=300&q=80',
  'Gourmand & Dulces': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
  'Maderas': 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=300&q=80',
  'Especias': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=300&q=80',
  'Aromáticas & Verdes': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=300&q=80',
  'Acuáticas & Frescas': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=80',
  'Cuero & Resinas': 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&w=300&q=80'
};

// Helper to determine the authentic real photo URL of any note with precise visual alignment
export interface NotePhotoResult {
  name?: string;
  photoUrl: string;
  category: string;
  description: string;
  botanicalName?: string;
}

export function getRealNotePhoto(noteName: string): NotePhotoResult {
  const trimmed = noteName.trim();
  const lower = trimmed.toLowerCase();

  // 0. Check rich custom notes saved by admin
  try {
    const customNotes = getStoredCustomNotes();
    const custom = customNotes[lower];
    if (custom) {
      return {
        name: custom.displayName || trimmed,
        photoUrl: custom.photoUrl || (CATEGORY_FALLBACK_PHOTOS as any)[custom.category] || CATEGORY_FALLBACK_PHOTOS['Florales'],
        category: custom.category || 'Florales',
        description: custom.description || `Nota olfativa oficial: ${trimmed}`,
        botanicalName: custom.botanicalName
      };
    }
    const legacyPhotos = getStoredNotePhotos();
    if (legacyPhotos[lower]) {
      return {
        name: trimmed,
        photoUrl: legacyPhotos[lower],
        category: 'Florales',
        description: `Nota olfativa oficial: ${trimmed}`
      };
    }
  } catch (e) {}

  // 1. Direct match in dictionary
  if (REAL_NOTE_PHOTOS[trimmed]) {
    return REAL_NOTE_PHOTOS[trimmed];
  }

  // 2. Case-insensitive lookup
  for (const [key, val] of Object.entries(REAL_NOTE_PHOTOS)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }

  // 3. Precise individual ingredient matching
  // --- FRUTAS ESPECÍFICAS ---
  if (lower.includes('sandía') || lower.includes('sandia')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Sandía'].photoUrl,
      category: 'Frutales',
      description: `Rodajas frescas de sandía roja jugosa: ${trimmed}`
    };
  }
  if (lower.includes('manzana')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Manzana'].photoUrl,
      category: 'Frutales',
      description: `Mitades de manzana verde crujiente: ${trimmed}`
    };
  }
  if (lower.includes('fresa')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Fresa'].photoUrl,
      category: 'Frutales',
      description: `Fresas rojas naturales aromáticas: ${trimmed}`
    };
  }
  if (lower.includes('pera')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Pera'].photoUrl,
      category: 'Frutales',
      description: `Pera Williams dulce cortada: ${trimmed}`
    };
  }
  if (lower.includes('coco')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Coco'].photoUrl,
      category: 'Frutales',
      description: `Coco natural abierto con pulpa fresca: ${trimmed}`
    };
  }
  if (lower.includes('frambues') || lower.includes('mora') || lower.includes('cassis') || lower.includes('grosell')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Frambuesa'] ? REAL_NOTE_PHOTOS['Frambuesa'].photoUrl : REAL_NOTE_PHOTOS['Frutos Rojos / Frutas'].photoUrl,
      category: 'Frutales',
      description: `Frutos rojos y bayas silvestres fragantes: ${trimmed}`
    };
  }
  if (lower.includes('cereza') || lower.includes('cherry')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Cereza'].photoUrl,
      category: 'Frutales',
      description: `Cerezas rojas oscuras maduras: ${trimmed}`
    };
  }
  if (lower.includes('piña') || lower.includes('pina')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Piña'].photoUrl,
      category: 'Frutales',
      description: `Piña tropical dorada y jugosa: ${trimmed}`
    };
  }
  if (lower.includes('melocotón') || lower.includes('durazno')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Melocotón'].photoUrl,
      category: 'Frutales',
      description: `Durazno y melocotón almibarado: ${trimmed}`
    };
  }
  if (lower.includes('maracuyá') || lower.includes('maracuya')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Maracuyá'].photoUrl,
      category: 'Frutales',
      description: `Fruta de la pasión exótica y cítrica: ${trimmed}`
    };
  }

  // --- CÍTRICOS ESPECÍFICOS ---
  if (lower.includes('limón') || lower.includes('limon') || lower.includes('lemon')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Limón / Cítricos'].photoUrl,
      category: 'Cítricos',
      description: `Limón amarillo natural recién cortado: ${trimmed}`
    };
  }
  if (lower.includes('bergamot')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Bergamota'].photoUrl,
      category: 'Cítricos',
      description: `Bergamota noble de Calabria fresca: ${trimmed}`
    };
  }
  if (lower.includes('naranj') || lower.includes('mandarin') || lower.includes('tangerin')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Naranja / Mandarina'].photoUrl,
      category: 'Cítricos',
      description: `Cítrico jugoso de naranja o mandarina: ${trimmed}`
    };
  }
  if (lower.includes('pomelo') || lower.includes('toronja')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Pomelo / Toronja'].photoUrl,
      category: 'Cítricos',
      description: `Pomelo rosado efervescente: ${trimmed}`
    };
  }
  if (lower.includes('lima')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Lima'].photoUrl,
      category: 'Cítricos',
      description: `Lima verde cortada al momento: ${trimmed}`
    };
  }

  // --- FLORALES ESPECÍFICOS ---
  if (lower.includes('rosa') || lower.includes('rose')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Rosa'].photoUrl,
      category: 'Florales',
      description: `Pétalos de rosa natural aterciopelada: ${trimmed}`
    };
  }
  if (lower.includes('jazm') || lower.includes('hedione')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Jazmín'].photoUrl,
      category: 'Florales',
      description: `Flores blancas de jazmín sambac: ${trimmed}`
    };
  }
  if (lower.includes('lavanda')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Lavanda'].photoUrl,
      category: 'Florales',
      description: `Espigas de lavanda silvestre provenzal: ${trimmed}`
    };
  }
  if (lower.includes('peoní') || lower.includes('peonia')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Peonía'].photoUrl,
      category: 'Florales',
      description: `Floración etérea de peonía rosada: ${trimmed}`
    };
  }
  if (lower.includes('iris') || lower.includes('orris')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Iris'].photoUrl,
      category: 'Florales',
      description: `Rizoma de iris noble atalcado: ${trimmed}`
    };
  }
  if (lower.includes('violeta')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Violeta'].photoUrl,
      category: 'Florales',
      description: `Pétalos silvestres de violeta: ${trimmed}`
    };
  }
  if (lower.includes('azahar') || lower.includes('neroli')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Flor de Azahar'].photoUrl,
      category: 'Florales',
      description: `Flores de azahar de naranjo amargo: ${trimmed}`
    };
  }
  if (lower.includes('gardenia')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Gardenia'].photoUrl,
      category: 'Florales',
      description: `Pétalos de gardenia blanca cremosa: ${trimmed}`
    };
  }
  if (lower.includes('tuberosa') || lower.includes('nardo')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Tuberosa / Nardo'].photoUrl,
      category: 'Florales',
      description: `Tuberosa blanca narcótica y opulenta: ${trimmed}`
    };
  }
  if (lower.includes('tiaré') || lower.includes('tiare')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Flor de tiaré'].photoUrl,
      category: 'Florales',
      description: `Flor sagrada de tiaré de Tahití: ${trimmed}`
    };
  }

  // --- DULCES & GOURMAND ---
  if (lower.includes('vainill') || lower.includes('vanilla')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Vainilla'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Vainas aromáticas de vainilla Bourbon de Madagascar: ${trimmed}`
    };
  }
  if (lower.includes('caramel')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Caramelo / Dulces'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Caramelo dorado mantecoso fundido: ${trimmed}`
    };
  }
  if (lower.includes('praliné') || lower.includes('praline')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Praliné'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Bombón praliné de avellanas y chocolate: ${trimmed}`
    };
  }
  if (lower.includes('café') || lower.includes('cafe')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Café'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Granos enteros tostados de café arábica: ${trimmed}`
    };
  }
  if (lower.includes('cacao') || lower.includes('chocolat')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Cacao / Chocolate'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Cacao puro y chocolate oscuro: ${trimmed}`
    };
  }
  if (lower.includes('tonka')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Haba Tonka'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Semillas oscuras de haba tonka con cumarina: ${trimmed}`
    };
  }
  if (lower.includes('miel')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Miel'].photoUrl,
      category: 'Gourmand & Dulces',
      description: `Miel dorada pura y viscosa: ${trimmed}`
    };
  }

  // --- MADERAS & RESINAS ---
  if (lower.includes('cedro') || lower.includes('cedar')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Cedro'].photoUrl,
      category: 'Maderas',
      description: `Madera noble de cedro aromático seco: ${trimmed}`
    };
  }
  if (lower.includes('sándal') || lower.includes('sandal')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Sándalo'].photoUrl,
      category: 'Maderas',
      description: `Madera de sándalo noble cremosa: ${trimmed}`
    };
  }
  if (lower.includes('pachul') || lower.includes('patchouli')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Pachulí'].photoUrl,
      category: 'Maderas',
      description: `Hojas de patchouli fermentadas y terrosas: ${trimmed}`
    };
  }
  if (lower.includes('vetiver')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Vetiver'].photoUrl,
      category: 'Maderas',
      description: `Raíces terrosas y ahumadas de vetiver: ${trimmed}`
    };
  }
  if (lower.includes('oud') || lower.includes('agarwood')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Oud'].photoUrl,
      category: 'Maderas',
      description: `Madera de agar resinosa sagrada de Oriente: ${trimmed}`
    };
  }
  if (lower.includes('ámbar') || lower.includes('ambar') || lower.includes('amber')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Ámbar'].photoUrl,
      category: 'Cuero & Resinas',
      description: `Gema de resina fósil ambarina dorada: ${trimmed}`
    };
  }
  if (lower.includes('almizcle') || lower.includes('musk')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Almizcle'].photoUrl,
      category: 'Cuero & Resinas',
      description: `Almizcle blanco puro y sedoso: ${trimmed}`
    };
  }
  if (lower.includes('cuero') || lower.includes('leather')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Cuero'].photoUrl,
      category: 'Cuero & Resinas',
      description: `Piel de cuero curtido elegante: ${trimmed}`
    };
  }
  if (lower.includes('tabaco')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Tabaco'].photoUrl,
      category: 'Cuero & Resinas',
      description: `Hojas aromáticas de tabaco rubio curado: ${trimmed}`
    };
  }

  // --- ESPECIAS ---
  if (lower.includes('canela')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Canela'].photoUrl,
      category: 'Especias',
      description: `Ramas de canela pura aromática: ${trimmed}`
    };
  }
  if (lower.includes('pimient')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Pimienta'].photoUrl,
      category: 'Especias',
      description: `Granos enteros de pimienta aromática: ${trimmed}`
    };
  }
  if (lower.includes('cardamom')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Cardamomo'].photoUrl,
      category: 'Especias',
      description: `Vainas verdes aromáticas de cardamomo: ${trimmed}`
    };
  }
  if (lower.includes('jengibre')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Jengibre'].photoUrl,
      category: 'Especias',
      description: `Raíz fresca de jengibre especiado: ${trimmed}`
    };
  }

  // --- ACUÁTICAS & VERDES ---
  if (lower.includes('sal')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['sal de mar'].photoUrl,
      category: 'Acuáticas & Frescas',
      description: `Cristales minerales de sal marina: ${trimmed}`
    };
  }
  if (lower.includes('mar') || lower.includes('acuát') || lower.includes('acuat') || lower.includes('agua') || lower.includes('calone')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Notas Marinas / Acuáticas'].photoUrl,
      category: 'Acuáticas & Frescas',
      description: `Olas marinas y brisa oceánica refrescante: ${trimmed}`
    };
  }
  if (lower.includes('menta')) {
    return {
      photoUrl: REAL_NOTE_PHOTOS['Menta Fresca'].photoUrl,
      category: 'Aromáticas & Verdes',
      description: `Hojas verdes de menta fresca: ${trimmed}`
    };
  }

  // Category fallback
  return {
    name: trimmed,
    photoUrl: CATEGORY_FALLBACK_PHOTOS['Florales'],
    category: 'Florales',
    description: `Nota botánica natural del catálogo Fraganza: ${trimmed}`
  };
}

// Brand Logo styles and badges
export const BRAND_CONFIGS: Record<string, { label: string; fontClass: string; bgColor: string; textColor: string }> = {
  'Escada': { label: 'ESCADA', fontClass: 'tracking-[0.25em] font-sans font-medium', bgColor: '#ffffff', textColor: '#1a1a1a' },
  'Carolina Herrera': { label: 'CAROLINA HERRERA', fontClass: 'tracking-[0.2em] font-serif font-bold', bgColor: '#ffffff', textColor: '#0f0f0f' },
  'Paco Rabanne': { label: 'paco rabanne', fontClass: 'tracking-tight lowercase font-mono font-bold', bgColor: '#ffffff', textColor: '#111111' },
  'Dior': { label: 'DIOR', fontClass: 'tracking-[0.25em] font-serif font-bold', bgColor: '#ffffff', textColor: '#000000' },
  'Chanel': { label: 'CHANEL', fontClass: 'tracking-[0.3em] font-sans font-black', bgColor: '#ffffff', textColor: '#000000' },
  'Tom Ford': { label: 'TOM FORD', fontClass: 'tracking-[0.2em] font-sans font-bold', bgColor: '#ffffff', textColor: '#111111' },
  'Creed': { label: 'CREED', fontClass: 'tracking-[0.3em] font-serif font-extrabold', bgColor: '#ffffff', textColor: '#1c1917' },
  'Versace': { label: 'VERSACE', fontClass: 'tracking-[0.25em] font-sans font-bold', bgColor: '#ffffff', textColor: '#0a0a0a' },
  'Hugo Boss': { label: 'BOSS', fontClass: 'tracking-[0.25em] font-sans font-black', bgColor: '#ffffff', textColor: '#000000' },
  'Lancôme': { label: 'LANCÔME', fontClass: 'tracking-[0.25em] font-serif font-bold', bgColor: '#ffffff', textColor: '#1c1917' },
  'Yves Saint Laurent': { label: 'YVES SAINT LAURENT', fontClass: 'tracking-[0.2em] font-serif font-semibold', bgColor: '#ffffff', textColor: '#0a0a0a' },
  'Lattafa': { label: 'LATTAFA', fontClass: 'tracking-[0.3em] font-serif font-black', bgColor: '#ffffff', textColor: '#a16207' },
  'Armaf': { label: 'ARMAF', fontClass: 'tracking-[0.25em] font-sans font-black', bgColor: '#ffffff', textColor: '#0f172a' },
  "Victoria's Secret": { label: "VICTORIA'S SECRET", fontClass: 'tracking-[0.2em] font-serif font-medium', bgColor: '#ffffff', textColor: '#ec4899' },
  'Bvlgari': { label: 'BVLGARI', fontClass: 'tracking-[0.3em] font-serif font-bold', bgColor: '#ffffff', textColor: '#000000' },
  'Calvin Klein': { label: 'Calvin Klein', fontClass: 'tracking-wide font-sans font-light', bgColor: '#ffffff', textColor: '#18181b' },
  'Fraganza': { label: 'FRAGANZA', fontClass: 'tracking-[0.3em] font-serif font-bold', bgColor: '#ffffff', textColor: '#b45309' }
};

// Full authentic Fragrantica color palette dictionary
export const FRAGRANTICA_ACCORD_COLORS: Record<string, { color: string; textColor: string }> = {
  'cítrico': { color: '#ffff33', textColor: '#000000' },
  'verde': { color: '#16a34a', textColor: '#ffffff' },
  'afrutados': { color: '#f87171', textColor: '#ffffff' },
  'almizclado': { color: '#ede9fe', textColor: '#312e81' },
  'amaderado': { color: '#8d5b3a', textColor: '#ffffff' },
  'aromático': { color: '#5eead4', textColor: '#134e4a' },
  'atalcado': { color: '#f5ebe0', textColor: '#3d3029' },
  'fresco especiado': { color: '#a3e635', textColor: '#1a2e05' },
  'fresco': { color: '#cffafe', textColor: '#164e63' },
  'florales': { color: '#f472b6', textColor: '#831843' },
  'floral': { color: '#f472b6', textColor: '#831843' },
  'floral blanco': { color: '#fbcfe8', textColor: '#831843' },
  'floral amarillo': { color: '#fef08a', textColor: '#713f12' },
  'dulce': { color: '#be123c', textColor: '#ffffff' },
  'ámbar': { color: '#d97706', textColor: '#ffffff' },
  'cálido especiado': { color: '#b45309', textColor: '#ffffff' },
  'especiado': { color: '#ea580c', textColor: '#ffffff' },
  'cuero': { color: '#44403c', textColor: '#fafaf9' },
  'acuático': { color: '#38bdf8', textColor: '#082f49' },
  'marino': { color: '#0284c7', textColor: '#ffffff' },
  'ozónico': { color: '#bae6fd', textColor: '#0369a1' },
  'terroso': { color: '#78716c', textColor: '#ffffff' },
  'musgo': { color: '#4d7c0f', textColor: '#ffffff' },
  'avainillado': { color: '#fde047', textColor: '#713f12' },
  'vainilla': { color: '#fde047', textColor: '#713f12' },
  'ahumado': { color: '#52525b', textColor: '#fafafa' },
  'balsámico': { color: '#9a3412', textColor: '#ffffff' },
  'animal': { color: '#3f3f46', textColor: '#fafafa' },
  'lavanda': { color: '#c4b5fd', textColor: '#3b0764' },
  'metálico': { color: '#94a3b8', textColor: '#0f172a' },
  'canela': { color: '#b45309', textColor: '#ffffff' },
  'caramelo': { color: '#c2410c', textColor: '#ffffff' },
  'café': { color: '#713f12', textColor: '#ffffff' },
  'chocolate': { color: '#582f0e', textColor: '#ffffff' },
  'licoroso': { color: '#881337', textColor: '#ffffff' },
  'alcanforado': { color: '#a7f3d0', textColor: '#064e3b' },
};

export function getAccordColor(name: string): { color: string; textColor: string } {
  const lower = name.toLowerCase().trim();
  if (FRAGRANTICA_ACCORD_COLORS[lower]) {
    return FRAGRANTICA_ACCORD_COLORS[lower];
  }
  for (const [key, val] of Object.entries(FRAGRANTICA_ACCORD_COLORS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return val;
    }
  }
  return { color: '#eab308', textColor: '#000000' };
}

// Generates Fragrantica-style "Acordes Principales" with precise colors and percentage widths
export interface MainAccord {
  name: string;
  color: string;
  textColor: string;
  percentage: number;
}

export function computeFragranticaAccords(
  family: string,
  allNotes: string[],
  sweetness: string,
  intensity: string,
  customAccords?: { name: string; percentage?: number; color?: string; textColor?: string }[]
): MainAccord[] {
  // If custom accords provided by admin, use them directly
  if (customAccords && customAccords.length > 0) {
    const total = customAccords.length;
    return customAccords.map((acc, idx) => {
      const palette = getAccordColor(acc.name);
      // Cascading staircase percentage: 100% down to 50%
      const stepPercent = Math.max(48, Math.round(100 - (idx / Math.max(1, total - 1)) * 48));
      return {
        name: acc.name.toLowerCase().trim(),
        color: acc.color || palette.color,
        textColor: acc.textColor || palette.textColor,
        percentage: acc.percentage ?? stepPercent
      };
    });
  }

  const notesLower = allNotes.join(' ').toLowerCase();
  const rawList: { name: string; priority: number }[] = [];

  // 1. Cítrico
  if (notesLower.includes('limón') || notesLower.includes('bergamot') || notesLower.includes('mandarina') || notesLower.includes('naranja') || notesLower.includes('pomelo') || family.includes('Cítric')) {
    rawList.push({ name: 'cítrico', priority: 100 });
  }

  // 2. Verde
  if (notesLower.includes('hoja') || notesLower.includes('verde') || notesLower.includes('gálbano') || notesLower.includes('té verde') || notesLower.includes('menta') || notesLower.includes('hierba') || notesLower.includes('vetiver')) {
    rawList.push({ name: 'verde', priority: 96 });
  }

  // 3. Afrutados
  if (notesLower.includes('pera') || notesLower.includes('sandía') || notesLower.includes('fresa') || notesLower.includes('manzana') || notesLower.includes('grosella') || notesLower.includes('fruta') || notesLower.includes('melocotón') || notesLower.includes('piña') || notesLower.includes('cereza') || notesLower.includes('mango') || notesLower.includes('frambuesa') || family.includes('Frutal')) {
    rawList.push({ name: 'afrutados', priority: 92 });
  }

  // 4. Almizclado
  if (notesLower.includes('almizcle') || notesLower.includes('musk') || notesLower.includes('ambret') || notesLower.includes('cashmeran')) {
    rawList.push({ name: 'almizclado', priority: 88 });
  }

  // 5. Amaderado
  if (family.includes('Amaderad') || notesLower.includes('cedro') || notesLower.includes('sándalo') || notesLower.includes('madera') || notesLower.includes('oud') || notesLower.includes('guayaco') || notesLower.includes('ciprés')) {
    rawList.push({ name: 'amaderado', priority: 84 });
  }

  // 6. Aromático
  if (notesLower.includes('lavanda') || notesLower.includes('romero') || notesLower.includes('salvia') || notesLower.includes('albahaca') || notesLower.includes('tomillo') || notesLower.includes('estragón') || family.includes('Aromátic')) {
    rawList.push({ name: 'aromático', priority: 80 });
  }

  // 7. Atalcado
  if (notesLower.includes('iris') || notesLower.includes('violeta') || notesLower.includes('heliotropo') || notesLower.includes('polvo') || notesLower.includes('orris')) {
    rawList.push({ name: 'atalcado', priority: 76 });
  }

  // 8. Fresco Especiado
  if (notesLower.includes('jengibre') || notesLower.includes('cardamomo') || notesLower.includes('pimienta rosa') || notesLower.includes('cilantro')) {
    rawList.push({ name: 'fresco especiado', priority: 72 });
  }

  // 9. Fresco
  if (notesLower.includes('fresc') || notesLower.includes('agua') || sweetness === 'Fresco' || family.includes('Acuát')) {
    rawList.push({ name: 'fresco', priority: 68 });
  }

  // 10. Florales / Floral blanco
  if (family.includes('Floral') || notesLower.includes('rosa') || notesLower.includes('jazm') || notesLower.includes('peonía') || notesLower.includes('flor') || notesLower.includes('neroli') || notesLower.includes('azahar') || notesLower.includes('magnolia')) {
    rawList.push({ name: 'florales', priority: 64 });
  }

  // 11. Ámbar
  if (notesLower.includes('ámbar') || notesLower.includes('benjuí') || notesLower.includes('ládano') || notesLower.includes('resina')) {
    rawList.push({ name: 'ámbar', priority: 60 });
  }

  // 12. Dulce / Vainilla
  if (sweetness === 'Muy Dulce' || sweetness === 'Moderado' || notesLower.includes('vainill') || notesLower.includes('caramel') || notesLower.includes('praliné') || notesLower.includes('azúcar') || notesLower.includes('haba tonka')) {
    rawList.push({ name: 'dulce', priority: 56 });
  }

  // 13. Cuero
  if (notesLower.includes('cuero') || notesLower.includes('gamuza') || notesLower.includes('abedul')) {
    rawList.push({ name: 'cuero', priority: 52 });
  }

  // 14. Marino / Acuático / Ozónico
  if (notesLower.includes('mar') || notesLower.includes('sal') || notesLower.includes('ozón') || notesLower.includes('calone')) {
    rawList.push({ name: 'marino', priority: 48 });
  }

  // Fallbacks if fewer than 3
  if (rawList.length === 0) {
    rawList.push({ name: 'cítrico', priority: 100 });
    rawList.push({ name: 'fresco', priority: 90 });
    rawList.push({ name: 'amaderado', priority: 80 });
  } else if (rawList.length === 1) {
    rawList.push({ name: 'aromático', priority: 80 });
    rawList.push({ name: 'amaderado', priority: 70 });
  }

  // Remove duplicates
  const seen = new Set<string>();
  const uniqueList = rawList.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

  // Take all detected (up to 10) and compute cascading staircase widths
  const selected = uniqueList.slice(0, 10);
  const totalCount = selected.length;

  return selected.map((item, idx) => {
    const palette = getAccordColor(item.name);
    // Signature Fragrantica staircase: top is 100%, each step is slightly shorter down to ~50%
    const stepPercent = Math.max(48, Math.round(100 - (idx / Math.max(1, totalCount - 1)) * 48));
    return {
      name: item.name,
      color: palette.color,
      textColor: palette.textColor,
      percentage: stepPercent
    };
  });
}

// Curated real perfume bottle portraits with crystal reflections and authentic shapes
export const LUXURY_BOTTLE_PHOTOS: Record<string, string> = {
  // Escada (from reference image)
  'Escada Sorbetto Rosso': '/assets/aistudio/image_8ef76aa6.png',
  'Sorbetto Rosso': '/assets/aistudio/image_8ef76aa6.png',

  // Carolina Herrera
  '212 VIP Men': 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',
  'CH Men': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  'Good Girl': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'Bad Boy': 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',
  '212 Sexy': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',

  // Paco Rabanne
  'Invictus': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  '1 Million': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'Olympea': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'Pure XS': 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',

  // Creed & Niche
  'Silver Mountain Water': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'Aventus': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'Baccarat Rouge 540': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',

  // Dior & Chanel & Versace
  'Sauvage': 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',
  'Eros': 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
  'Dylan Blue': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'Coco Mademoiselle': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'Bleu de Chanel': 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',
  'La Vie Est Belle': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'Black Opium': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  'Libre': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'Acqua Di Gio': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
};

export function getPerfumeBottlePhoto(
  perfumeNameOrCode: string,
  gender: string = 'Unisex',
  existingImage?: string,
  code?: string
): string {
  const targetId = code || perfumeNameOrCode;
  const catalogBottle = getFragranceBottlePhoto(targetId, gender, existingImage);
  if (catalogBottle) {
    return catalogBottle;
  }

  // Check exact custom bottle
  for (const [key, url] of Object.entries(LUXURY_BOTTLE_PHOTOS)) {
    if (perfumeNameOrCode.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(perfumeNameOrCode.toLowerCase())) {
      return url;
    }
  }

  if (existingImage && existingImage.startsWith('http')) {
    return existingImage;
  }

  // Gender tailored luxury real bottle photography
  if (gender === 'Dama') {
    return 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80';
  } else if (gender === 'Caballero') {
    return 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';
}
