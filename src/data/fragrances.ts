export interface OlfactoryPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export type GenderCategory = 'Femenino' | 'Masculino' | 'Unisex';

export type OlfactoryFamily =
  | 'Cítrica'
  | 'Amaderada'
  | 'Oriental / Especiada'
  | 'Floral'
  | 'Gourmand'
  | 'Acuática / Marina'
  | 'Aromática Fougère'
  | 'Chipre / Cuero';

export type ConcentrationType =
  | 'Eau de Cologne (EDC)'
  | 'Eau de Toilette (EDT)'
  | 'Eau de Parfum (EDP)'
  | 'Parfum / Extrait';

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  year?: number;
  gender: GenderCategory;
  family: OlfactoryFamily;
  concentration: ConcentrationType;
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  votesCount: number;
  image: string;
  pyramid: OlfactoryPyramid;
  accords: { name: string; percentage: number; color: string }[];
  longevity: 'Moderada (4-6h)' | 'Larga (7-10h)' | 'Muy Larga (10-14h)' | 'Eterna (14h+)';
  sillage: 'Íntima' | 'Moderada' | 'Notable' | 'Poderosa';
  seasons: ('Primavera' | 'Verano' | 'Otoño' | 'Invierno')[];
  occasions: string[];
  vibe: string;
  description: string;
  layeringTip?: string;
  tags: string[];
}

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'baccarat-rouge-540',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    year: 2015,
    gender: 'Unisex',
    family: 'Oriental / Especiada',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.9,
    votesCount: 2840,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Azafrán', 'Jazmín de Egipto'],
      heart: ['Madera de Cedro', 'Amberwood'],
      base: ['Resina de Abeto', 'Ámbar Gris']
    },
    accords: [
      { name: 'Ámbar', percentage: 95, color: '#d97706' },
      { name: 'Amaderado', percentage: 80, color: '#b45309' },
      { name: 'Cálido Especiado', percentage: 70, color: '#ea580c' },
      { name: 'Metálico Dulce', percentage: 65, color: '#f59e0b' }
    ],
    longevity: 'Eterna (14h+)',
    sillage: 'Poderosa',
    seasons: ['Otoño', 'Invierno', 'Primavera'],
    occasions: ['Eventos elegantes', 'Citas nocturnas', 'Ocasiones especiales'],
    vibe: 'Opulento, misterioso y cautivadoramente adictivo',
    description: 'Una sinfonía olfativa luminosa y sofisticada que acaricia la piel como un halo de ámbar floral y maderas preciosas.',
    layeringTip: 'Combina de maravilla con bases cítricas puras para atenuar la dulzura y añadir un chispeante aire diurno.',
    tags: ['nicho', 'lujo', 'viral', 'elegante', 'algodón de azúcar mineral']
  },
  {
    id: 'sauvage-elixir',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    year: 2021,
    gender: 'Masculino',
    family: 'Aromática Fougère',
    concentration: 'Parfum / Extrait',
    priceTier: '$$$',
    rating: 4.8,
    votesCount: 3120,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Canela', 'Nuez Moscada', 'Cardamomo', 'Pomelo'],
      heart: ['Lavanda de Nyons'],
      base: ['Regaliz', 'Sándalo', 'Ámbar', 'Pachulí', 'Vetiver de Haití']
    },
    accords: [
      { name: 'Cálido Especiado', percentage: 95, color: '#c2410c' },
      { name: 'Amaderado', percentage: 85, color: '#78350f' },
      { name: 'Lavanda', percentage: 75, color: '#8b5cf6' },
      { name: 'Fresco Especiado', percentage: 65, color: '#0284c7' }
    ],
    longevity: 'Eterna (14h+)',
    sillage: 'Poderosa',
    seasons: ['Otoño', 'Invierno'],
    occasions: ['Citas nocturnas', 'Eventos elegantes', 'Clima frío'],
    vibe: 'Magnético, imponente y ultra masculino',
    description: 'Una concentración extrema de maderas nobles y especias licorosas. Una firma olfativa inolvidable con presencia descomunal.',
    layeringTip: 'Por su potencia, aplícalo solo o en layering sutil con fragancias de lavanda clásica.',
    tags: ['intenso', 'nocturno', 'seductor', 'duración extrema']
  },
  {
    id: 'acqua-di-gio-profondo',
    name: 'Acqua Di Giò Profondo',
    brand: 'Giorgio Armani',
    year: 2020,
    gender: 'Masculino',
    family: 'Acuática / Marina',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$',
    rating: 4.7,
    votesCount: 2210,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Notas Marinas', 'Aquozone', 'Bergamota Verde', 'Mandarina Verde'],
      heart: ['Romero', 'Lavanda', 'Ciprés', 'Lentisco'],
      base: ['Notas Minerales', 'Pachulí de Guatemala', 'Almizcle']
    },
    accords: [
      { name: 'Acuático Marino', percentage: 95, color: '#0284c7' },
      { name: 'Aromático', percentage: 80, color: '#10b981' },
      { name: 'Cítrico', percentage: 75, color: '#eab308' },
      { name: 'Mineral Fresco', percentage: 70, color: '#64748b' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Notable',
    seasons: ['Primavera', 'Verano'],
    occasions: ['Uso diario / Oficina', 'Casual / Fin de semana', 'Gimnasio / Frescura'],
    vibe: 'Fresco, atlético, distinguido y revitalizante',
    description: 'Una inmersión profunda en el océano azul marino. Combina frescor ozónico con acordes minerales y toques aromáticos elegantes.',
    layeringTip: 'Ideal para revitalizar perfumes amaderados en días calurosos.',
    tags: ['fresco', 'marino', 'veraniego', 'oficina', 'versátil']
  },
  {
    id: 'black-opium',
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    year: 2014,
    gender: 'Femenino',
    family: 'Gourmand',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$',
    rating: 4.7,
    votesCount: 4100,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Pera', 'Pimienta Rosa', 'Flor de Azahar del Naranjo'],
      heart: ['Café Negro', 'Jazmín', 'Almendra Amarga', 'Regaliz'],
      base: ['Vainilla', 'Pachulí', 'Cedro', 'Madera de Cachemira']
    },
    accords: [
      { name: 'Vainilla Café', percentage: 95, color: '#78350f' },
      { name: 'Dulce Cálido', percentage: 85, color: '#f59e0b' },
      { name: 'Balsámico', percentage: 70, color: '#b45309' },
      { name: 'Floral Blanco', percentage: 60, color: '#ec4899' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Notable',
    seasons: ['Otoño', 'Invierno'],
    occasions: ['Citas nocturnas', 'Fiesta / Clubbing', 'Eventos elegantes'],
    vibe: 'Sensual, rebelde, adictivo y electrizante',
    description: 'El primer café floral de YSL. Un chute de energía adictivo con café negro contrastado con sensual vainilla y flores blancas.',
    layeringTip: 'Prueba a combinarlo con una bruma de vainilla pura para intensificar su fondo cremoso.',
    tags: ['gourmand', 'café', 'dulce', 'sensual', 'nocturno']
  },
  {
    id: 'good-girl',
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    year: 2016,
    gender: 'Femenino',
    family: 'Oriental / Especiada',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$',
    rating: 4.8,
    votesCount: 3890,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Almendra', 'Café', 'Bergamota', 'Limón'],
      heart: ['Nardos', 'Jazmín Sambac', 'Flor de Azahar', 'Raíz de Lirio'],
      base: ['Haba Tonka', 'Cacao', 'Vainilla', 'Praliné', 'Sándalo', 'Ámbar']
    },
    accords: [
      { name: 'Dulce Cacao', percentage: 90, color: '#581c87' },
      { name: 'Floral Blanco', percentage: 85, color: '#ec4899' },
      { name: 'Cálido Especiado', percentage: 75, color: '#d97706' },
      { name: 'Ambarado', percentage: 70, color: '#f59e0b' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Notable',
    seasons: ['Otoño', 'Invierno', 'Primavera'],
    occasions: ['Citas nocturnas', 'Eventos elegantes', 'Fiesta / Clubbing'],
    vibe: 'Dual, sofisticado, atrevido y empoderado',
    description: 'Una audaz mezcla de elementos oscuros y claros: la dulzura seductora del haba tonka tostada y el cacao frente a la luminosidad del nardo.',
    layeringTip: 'Combina perfectamente con lociones corporales de almendra o jazmín.',
    tags: ['icono', 'tonka', 'cacao', 'tacón', 'seductor']
  },
  {
    id: 'bleu-de-chanel',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    year: 2010,
    gender: 'Masculino',
    family: 'Amaderada',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.85,
    votesCount: 4500,
    image: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Pomelo', 'Limón', 'Menta', 'Pimienta Rosa', 'Bergamota'],
      heart: ['Jengibre', 'Nuez Moscada', 'Jazmín', 'Iso E Super'],
      base: ['Incienso', 'Vetiver', 'Cedro', 'Sándalo', 'Pachulí', 'Ládano']
    },
    accords: [
      { name: 'Cítrico Refinado', percentage: 90, color: '#eab308' },
      { name: 'Amaderado Cálido', percentage: 88, color: '#78350f' },
      { name: 'Aromático Especiado', percentage: 80, color: '#0ea5e9' },
      { name: 'Ahumado Suave', percentage: 65, color: '#475569' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Notable',
    seasons: ['Primavera', 'Verano', 'Otoño', 'Invierno'],
    occasions: ['Uso diario / Oficina', 'Eventos elegantes', 'Citas nocturnas'],
    vibe: 'El epítome de la elegancia versátil contemporánea',
    description: 'El perfume comodín definitivo. Combina la vivacidad de los cítricos con la nobleza del cedro y un fondo misterioso de incienso y sándalo.',
    layeringTip: 'Es la base perfecta; prácticamente cualquier fragancia cítrica o amaderada se complementa con Bleu.',
    tags: ['versátil', 'firma', 'elegante', 'oficina', 'masculino chic']
  },
  {
    id: 'libre-ysl',
    name: 'Libre',
    brand: 'Yves Saint Laurent',
    year: 2019,
    gender: 'Femenino',
    family: 'Floral',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$',
    rating: 4.75,
    votesCount: 3340,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Lavanda Francesa', 'Mandarina', 'Grosellas Negras', 'Petitgrain'],
      heart: ['Flor de Azahar de Marruecos', 'Lavanda', 'Jazmín'],
      base: ['Vainilla de Madagascar', 'Almizcle', 'Cedro', 'Ámbar Gris']
    },
    accords: [
      { name: 'Floral Blanco', percentage: 90, color: '#ec4899' },
      { name: 'Lavanda Dulce', percentage: 85, color: '#8b5cf6' },
      { name: 'Cítrico Luminoso', percentage: 75, color: '#f59e0b' },
      { name: 'Vainilla Sedosa', percentage: 70, color: '#d97706' }
    ],
    longevity: 'Muy Larga (10-14h)',
    sillage: 'Notable',
    seasons: ['Primavera', 'Otoño', 'Invierno'],
    occasions: ['Uso diario / Oficina', 'Eventos elegantes', 'Citas nocturnas'],
    vibe: 'Libre, poderosa, sofisticada y magnética',
    description: 'La tensión entre la sensualidad ardiente de la flor de azahar marroquí y la audacia andrógina de la lavanda francesa.',
    layeringTip: 'Superponla con notas de almizcle blanco para enfatizar su faceta más íntima y aterciopelada.',
    tags: ['lavanda', 'floral audaz', 'empoderada', 'alta fijación']
  },
  {
    id: 'oud-wood',
    name: 'Oud Wood',
    brand: 'Tom Ford Private Blend',
    year: 2007,
    gender: 'Unisex',
    family: 'Amaderada',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.8,
    votesCount: 2600,
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Cardamomo', 'Pimienta de Sichuan', 'Palo de Rosa'],
      heart: ['Madera de Oud (Agarwood)', 'Sándalo', 'Vetiver'],
      base: ['Haba Tonka', 'Vainilla', 'Ámbar']
    },
    accords: [
      { name: 'Amaderado Noble', percentage: 98, color: '#78350f' },
      { name: 'Cálido Especiado', percentage: 80, color: '#b45309' },
      { name: 'Oud Suave', percentage: 75, color: '#451a03' },
      { name: 'Ahumado Balsámico', percentage: 70, color: '#d97706' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Moderada',
    seasons: ['Otoño', 'Invierno'],
    occasions: ['Eventos elegantes', 'Citas nocturnas', 'Reuniones ejecutivas'],
    vibe: 'Aristocrático, sereno, enigmático y lujoso',
    description: 'Uno de los ingredientes más raros y caros del mundo de la perfumería: la madera de oud, envuelta en cardamomo, palo de rosa y sándalo.',
    layeringTip: 'Se eleva majestuosamente combinado con fragancias de rosas o cuero.',
    tags: ['nicho', 'oud', 'lujo supremo', 'madera noble']
  },
  {
    id: 'light-blue-pour-femme',
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    year: 2001,
    gender: 'Femenino',
    family: 'Cítrica',
    concentration: 'Eau de Toilette (EDT)',
    priceTier: '$$',
    rating: 4.6,
    votesCount: 3950,
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Limón Siciliano', 'Manzana Verde', 'Cedro', 'Campanilla'],
      heart: ['Bambú', 'Jazmín', 'Rosa Blanca'],
      base: ['Cedro', 'Almizcle', 'Ámbar']
    },
    accords: [
      { name: 'Cítrico Crujiente', percentage: 95, color: '#eab308' },
      { name: 'Afrutado Fresco', percentage: 85, color: '#84cc16' },
      { name: 'Amaderado Suave', percentage: 70, color: '#a16207' },
      { name: 'Fresco Alimonado', percentage: 65, color: '#38bdf8' }
    ],
    longevity: 'Moderada (4-6h)',
    sillage: 'Moderada',
    seasons: ['Primavera', 'Verano'],
    occasions: ['Uso diario / Oficina', 'Casual / Fin de semana', 'Gimnasio / Frescura'],
    vibe: 'Alegre, chispeante, solar y mediterráneo',
    description: 'La alegría de vivir el verano en Capri. La vivacidad del limón de Sicilia y la manzana Granny Smith fusionada con bambú y madera de cedro.',
    layeringTip: 'Añade una vaporización de este perfume sobre cualquier fragancia frutal pesada para aportarle brillo veraniego.',
    tags: ['fresco', 'limón siciliano', 'verano mediterráneo', 'icónico']
  },
  {
    id: 'versace-eros',
    name: 'Eros',
    brand: 'Versace',
    year: 2012,
    gender: 'Masculino',
    family: 'Aromática Fougère',
    concentration: 'Eau de Toilette (EDT)',
    priceTier: '$$',
    rating: 4.65,
    votesCount: 4800,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Menta Glacial', 'Manzana Verde', 'Limón Italiano'],
      heart: ['Haba Tonka', 'Ambroxan', 'Geranio'],
      base: ['Vainilla de Madagascar', 'Cedro de Virginia', 'Vetiver', 'Musgo de Roble']
    },
    accords: [
      { name: 'Vainilla Dulce', percentage: 90, color: '#d97706' },
      { name: 'Menta Fresca', percentage: 88, color: '#10b981' },
      { name: 'Aromático Verde', percentage: 75, color: '#14b8a6' },
      { name: 'Ambarado', percentage: 70, color: '#f59e0b' }
    ],
    longevity: 'Muy Larga (10-14h)',
    sillage: 'Poderosa',
    seasons: ['Primavera', 'Otoño', 'Invierno'],
    occasions: ['Fiesta / Clubbing', 'Citas nocturnas', 'Casual / Fin de semana'],
    vibe: 'Enérgico, pasional, vibrante y triunfante',
    description: 'Inspirado en la mitología griega y el dios del amor. Una explosión de menta crujiente con manzana verde y un irresistible secado de vainilla tonka.',
    layeringTip: 'Tiene una proyección gigante; úsalo con mesura o combínalo con acordes acuáticos limpios.',
    tags: ['clubbing', 'fiesta', 'vainilla y menta', 'proyección alta']
  },
  {
    id: 'coco-mademoiselle',
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    year: 2001,
    gender: 'Femenino',
    family: 'Chipre / Cuero',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.9,
    votesCount: 4950,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Naranja Dulce', 'Mandarina', 'Bergamota', 'Flor de Azahar'],
      heart: ['Rosa Turca', 'Jazmín', 'Mimosa', 'Ylang-Ylang'],
      base: ['Pachulí', 'Almizcle Blanco', 'Vainilla', 'Vetiver', 'Haba Tonka', 'Opopónaco']
    },
    accords: [
      { name: 'Cítrico Sofisticado', percentage: 92, color: '#f59e0b' },
      { name: 'Pachulí Elegante', percentage: 90, color: '#78350f' },
      { name: 'Floral Dulce', percentage: 85, color: '#ec4899' },
      { name: 'Terroso Suave', percentage: 70, color: '#854d0e' }
    ],
    longevity: 'Muy Larga (10-14h)',
    sillage: 'Notable',
    seasons: ['Primavera', 'Otoño', 'Invierno'],
    occasions: ['Eventos elegantes', 'Uso diario / Oficina', 'Citas nocturnas'],
    vibe: 'Innegablemente distinguido, audaz y chic parisino',
    description: 'La esencia de una mujer libre y audaz. Un acorde de pachulí puro facetado por notas florales cristalinas y cítricos efervescentes.',
    layeringTip: 'Un clásico atemporal que brilla por sí solo; no necesita refuerzo.',
    tags: ['alta costura', 'pachulí', 'parís', 'femenino emblemático']
  },
  {
    id: 'silver-mountain-water',
    name: 'Silver Mountain Water',
    brand: 'Creed',
    year: 1995,
    gender: 'Unisex',
    family: 'Cítrica',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.7,
    votesCount: 1980,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Bergamota', 'Mandarina'],
      heart: ['Té Verde', 'Grosellas Negras'],
      base: ['Almizcle', 'Petitgrain', 'Sándalo', 'Gálbano']
    },
    accords: [
      { name: 'Té Verde Puro', percentage: 94, color: '#10b981' },
      { name: 'Cítrico Fresco', percentage: 88, color: '#84cc16' },
      { name: 'Afrutado Helado', percentage: 75, color: '#06b6d4' },
      { name: 'Almizcle Metálico', percentage: 70, color: '#94a3b8' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Moderada',
    seasons: ['Primavera', 'Verano'],
    occasions: ['Uso diario / Oficina', 'Casual / Fin de semana', 'Gimnasio / Frescura'],
    vibe: 'Cristalino, puro como arroyos alpinos suizos, aristocrático',
    description: 'Inspirado en el aire gélido y los arroyos de los Alpes Suizos. Un soplo de té verde fresco mezclado con grosella negra y almizcle limpio.',
    layeringTip: 'Capas de Silver Mountain Water sobre fragancias amaderadas crean un contraste frío-cálido fascinante.',
    tags: ['nicho', 'creed', 'té verde', 'alpinismo de lujo', 'puro']
  },
  {
    id: 'angels-share',
    name: "Angels' Share",
    brand: 'Kilian Paris',
    year: 2020,
    gender: 'Unisex',
    family: 'Gourmand',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.95,
    votesCount: 2400,
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Coñac Añejo'],
      heart: ['Canela', 'Haba Tonka', 'Roble'],
      base: ['Praliné', 'Vainilla', 'Sándalo']
    },
    accords: [
      { name: 'Licor Coñac', percentage: 98, color: '#b45309' },
      { name: 'Canela Dulce', percentage: 92, color: '#9a3412' },
      { name: 'Vainilla Roble', percentage: 88, color: '#d97706' },
      { name: 'Gourmand Cálido', percentage: 85, color: '#78350f' }
    ],
    longevity: 'Muy Larga (10-14h)',
    sillage: 'Notable',
    seasons: ['Otoño', 'Invierno'],
    occasions: ['Citas nocturnas', 'Eventos elegantes', 'Ocasiones especiales'],
    vibe: 'Embrujador, cálido, seductor y refinadamente bohemio',
    description: 'Homenaje a la herencia del coñac de la familia Hennessy. Contiene esencia de coñac destilado con caramelo, canela y roble añejado en barricas.',
    layeringTip: 'Sobre una base amaderada seca añade una capa licorosa y acogedora inigualable.',
    tags: ['coñac', 'canela', 'licor', 'gourmand nicho', 'adictivo']
  },
  {
    id: 'la-vie-est-belle',
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    year: 2012,
    gender: 'Femenino',
    family: 'Floral',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$',
    rating: 4.7,
    votesCount: 4300,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Grosellas Negras', 'Pera'],
      heart: ['Iris Palissandre', 'Jazmín', 'Flor de Azahar'],
      base: ['Praliné', 'Vainilla', 'Pachulí', 'Haba Tonka']
    },
    accords: [
      { name: 'Dulce Praliné', percentage: 95, color: '#f59e0b' },
      { name: 'Iris Atalcado', percentage: 85, color: '#a855f7' },
      { name: 'Vainilla', percentage: 80, color: '#d97706' },
      { name: 'Pachulí Suave', percentage: 70, color: '#854d0e' }
    ],
    longevity: 'Eterna (14h+)',
    sillage: 'Poderosa',
    seasons: ['Otoño', 'Invierno', 'Primavera'],
    occasions: ['Uso diario / Oficina', 'Eventos elegantes', 'Casual / Fin de semana'],
    vibe: 'Sonriente, luminoso, cálido y reconfortante',
    description: 'La vida es bella. Una declaración universal a la belleza de la vida capitaneada por el iris noble y un corazón gourmand de praliné crocante.',
    layeringTip: 'Ideal para personas que buscan una estela dulce y memorable que dure todo el día.',
    tags: ['iris', 'praliné', 'superventas', 'dulce floral']
  },
  {
    id: 'montblanc-explorer',
    name: 'Explorer',
    brand: 'Montblanc',
    year: 2019,
    gender: 'Masculino',
    family: 'Amaderada',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$',
    rating: 4.65,
    votesCount: 3100,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Bergamota de Calabria', 'Pimienta Rosa', 'Salvia'],
      heart: ['Vetiver de Haití', 'Cuero'],
      base: ['Ambroxan', 'Akigalawood', 'Pachulí de Indonesia', 'Cacao']
    },
    accords: [
      { name: 'Cítrico Amaderado', percentage: 90, color: '#eab308' },
      { name: 'Aromático Especiado', percentage: 82, color: '#0ea5e9' },
      { name: 'Ambarado Moderno', percentage: 78, color: '#b45309' },
      { name: 'Cuero Sutil', percentage: 65, color: '#78350f' }
    ],
    longevity: 'Larga (7-10h)',
    sillage: 'Notable',
    seasons: ['Primavera', 'Verano', 'Otoño'],
    occasions: ['Uso diario / Oficina', 'Casual / Fin de semana', 'Citas nocturnas'],
    vibe: 'Aventurero, dinámico, profesional y muy elogiado',
    description: 'Una invitación a un viaje fantástico por el mundo: bergamota italiana, vetiver haitiano y pachulí de Sulawesi. Gran alternativa versátil para el día a día.',
    layeringTip: 'Funciona como base fresca y elegante para colonias cítricas más ligeras.',
    tags: ['aventura', 'oficina', 'masculino', 'cumplidos garantizados']
  },
  {
    id: 'neroli-portofino',
    name: 'Neroli Portofino',
    brand: 'Tom Ford Private Blend',
    year: 2011,
    gender: 'Unisex',
    family: 'Cítrica',
    concentration: 'Eau de Parfum (EDP)',
    priceTier: '$$$$',
    rating: 4.6,
    votesCount: 1850,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    pyramid: {
      top: ['Bergamota', 'Mandarina', 'Limón', 'Naranja Amarga', 'Lavanda', 'Romero'],
      heart: ['Flor de Azahar del Naranjo', 'Neroli Tunecino', 'Jazmín', 'Pitosporo'],
      base: ['Ámbar', 'Angélica', 'Almizcle']
    },
    accords: [
      { name: 'Cítrico Efervescente', percentage: 98, color: '#f59e0b' },
      { name: 'Floral Blanco', percentage: 85, color: '#fbbf24' },
      { name: 'Aromático Fresco', percentage: 80, color: '#10b981' },
      { name: 'Jabón de Lujo', percentage: 75, color: '#38bdf8' }
    ],
    longevity: 'Moderada (4-6h)',
    sillage: 'Moderada',
    seasons: ['Primavera', 'Verano'],
    occasions: ['Uso diario / Oficina', 'Casual / Fin de semana', 'Gimnasio / Frescura'],
    vibe: 'Limpio, lujoso, soleado en la Riviera Italiana',
    description: 'Reinvención moderna del clásico agua de colonia italiana. Brisa marina, aguas cristalinas y follaje exuberante de la costa de Portofino.',
    layeringTip: 'Perfecto para aplicar en mañanas cálidas sobre una crema corporal neutra.',
    tags: ['neroli', 'riviera', 'lujo veraniego', 'limpio']
  }
];

export interface RecommendationCriteria {
  gender: GenderCategory | 'Cualquiera';
  familyPreference?: OlfactoryFamily | 'Cualquiera';
  occasions: string[];
  seasons: string[];
  longevityPreference: string;
  intensityPreference: string;
  notesLove: string[];
  budget: '$' | '$$' | '$$$' | '$$$$' | 'Cualquiera';
}

export function scoreFragrance(fragrance: Fragrance, criteria: RecommendationCriteria): { score: number; matchReasons: string[] } {
  let score = 50; // base score
  const matchReasons: string[] = [];

  // Gender match
  if (criteria.gender === 'Cualquiera' || fragrance.gender === 'Unisex' || fragrance.gender === criteria.gender) {
    score += 15;
    if (fragrance.gender === criteria.gender) {
      matchReasons.push(`Diseñado especialmente para perfil ${fragrance.gender.toLowerCase()}`);
    } else if (fragrance.gender === 'Unisex') {
      matchReasons.push('Formulación unisex equilibrada y versátil');
    }
  } else {
    score -= 25;
  }

  // Family match
  if (criteria.familyPreference && criteria.familyPreference !== 'Cualquiera') {
    if (fragrance.family === criteria.familyPreference) {
      score += 20;
      matchReasons.push(`Pertenece a tu familia olfativa favorita: ${fragrance.family}`);
    }
  }

  // Occasion matches
  const sharedOccasions = fragrance.occasions.filter(o => criteria.occasions.includes(o));
  if (sharedOccasions.length > 0) {
    score += Math.min(20, sharedOccasions.length * 10);
    matchReasons.push(`Perfecto para: ${sharedOccasions.slice(0, 2).join(', ')}`);
  }

  // Season matches
  const sharedSeasons = fragrance.seasons.filter(s => criteria.seasons.includes(s));
  if (sharedSeasons.length > 0) {
    score += Math.min(15, sharedSeasons.length * 6);
    matchReasons.push(`Ideal para la temporada de ${sharedSeasons.join(' y ')}`);
  }

  // Budget match
  if (criteria.budget !== 'Cualquiera') {
    if (fragrance.priceTier === criteria.budget) {
      score += 10;
      matchReasons.push('Se ajusta exactamente a tu rango de presupuesto');
    }
  }

  // Notes loved
  if (criteria.notesLove.length > 0) {
    const allNotes = [...fragrance.pyramid.top, ...fragrance.pyramid.heart, ...fragrance.pyramid.base].map(n => n.toLowerCase());
    const matchedNotes = criteria.notesLove.filter(n => allNotes.some(note => note.includes(n.toLowerCase())));
    if (matchedNotes.length > 0) {
      score += Math.min(15, matchedNotes.length * 8);
      matchReasons.push(`Contiene tus notas deseadas: ${matchedNotes.join(', ')}`);
    }
  }

  // Longevity & intensity
  if (criteria.intensityPreference === 'Alta' && (fragrance.sillage === 'Poderosa' || fragrance.sillage === 'Notable')) {
    score += 8;
    matchReasons.push(`Estela y proyección destacadas (${fragrance.sillage})`);
  } else if (criteria.intensityPreference === 'Discreta' && (fragrance.sillage === 'Íntima' || fragrance.sillage === 'Moderada')) {
    score += 8;
    matchReasons.push(`Aroma sutil y no invasivo (${fragrance.sillage})`);
  }

  // Rating boost
  if (fragrance.rating >= 4.8) {
    score += 5;
  }

  const finalScore = Math.min(99, Math.max(40, score));
  return { score: finalScore, matchReasons };
}

export const POPULAR_NOTES = [
  'Vainilla', 'Bergamota', 'Lavanda', 'Cedro', 'Sándalo', 'Jazmín',
  'Café', 'Canela', 'Pera', 'Menta', 'Pachulí', 'Ámbar', 'Rosa',
  'Notas Marinas', 'Limón', 'Flor de Azahar', 'Almizcle', 'Cuero'
];

export const LAYERING_COMBOS = [
  {
    title: 'Brisa Marina con Maderas Cálidas',
    fragrance1: 'Acqua Di Giò Profondo',
    fragrance2: 'Bleu de Chanel',
    description: 'Aplica primero Bleu de Chanel en puntos de pulso cálidos (cuello y pecho), y luego rocía Acqua Di Giò en la ropa y muñecas para crear una frescura acuática sobre un fondo amaderado distinguido.',
    effect: 'Elegancia veraniega con una longevidad extendida.'
  },
  {
    title: 'Ámbar Gourmet y Dulzura Hipnótica',
    fragrance1: 'Baccarat Rouge 540',
    fragrance2: "Angels' Share",
    description: 'La combinación definitiva para noches frías. El coñac y la canela de Angels Share complementan el halo mineral y de ámbar gris de Baccarat Rouge 540.',
    effect: 'Una estela magnética digna de un salón de alta perfumería.'
  },
  {
    title: 'Frescura Cítrica Floral Solar',
    fragrance1: 'Light Blue',
    fragrance2: 'Neroli Portofino',
    description: 'Rocía Neroli Portofino como primera capa para los acordes de azahar y flores blancas, y remata con Light Blue para potenciar la manzana crujiente y el limón siciliano.',
    effect: 'Un auténtico viaje olfativo a la costa italiana.'
  }
];

export const PERSONALITY_ARCHETYPES = [
  {
    id: 'el-seductor-magnetico',
    title: 'El Seductor Magnético',
    description: 'Te atraen los aromas con presencia imponente, cálidos, especiados y con un toque nocturno que deja huella donde vas.',
    recommendedFragrance: 'Sauvage Elixir / Good Girl',
    families: ['Oriental / Especiada', 'Gourmand'],
    icon: 'Flame'
  },
  {
    id: 'el-espiritu-fresco-vital',
    title: 'El Espíritu Fresco & Vital',
    description: 'Prefieres la sensación de limpieza revitalizante, energía cítrica, brisas marinas y mañanas soleadas llenas de actividad.',
    recommendedFragrance: 'Acqua Di Giò Profondo / Light Blue',
    families: ['Cítrica', 'Acuática / Marina'],
    icon: 'Waves'
  },
  {
    id: 'la-elegancia-aristocratica',
    title: 'La Elegancia Aristocrática',
    description: 'Buscas distinción sin esfuerzo, equilibrio impecable, maderas nobles y notas clásicas reinventadas que hablan de buen gusto.',
    recommendedFragrance: 'Bleu de Chanel / Coco Mademoiselle / Oud Wood',
    families: ['Amaderada', 'Chipre / Cuero'],
    icon: 'Crown'
  },
  {
    id: 'el-alma-mistica-gourmand',
    title: 'El Alma Mística & Bohemio Chic',
    description: 'Amas los aromas opulentos, licorosos, con ámbar, vainillas gourmand y notas que despiertan curiosidad y misterio.',
    recommendedFragrance: "Baccarat Rouge 540 / Angels' Share",
    families: ['Gourmand', 'Oriental / Especiada'],
    icon: 'Sparkles'
  }
];
