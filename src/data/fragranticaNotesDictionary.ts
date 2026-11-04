// DICCIONARIO ENCICLOPÉDICO DE NOTAS OLFATIVAS ESTILO FRAGRANTICA
// Clasificación precisa por familias olfativas, perfiles sensoriales y descripciones

export interface NoteDetail {
  name: string;
  family: 'Floral' | 'Dulce / Acaramelado' | 'Cítrico / Acuático' | 'Amaderado / Oriental';
  subgroup: string;
  icon: string;
  description: string;
  sensoryProfile: string;
  pyramidTypical: 'Salida' | 'Corazón' | 'Fondo' | 'Versátil';
}

export const FRAGRANTICA_NOTES: Record<string, NoteDetail> = {
  // === FAMILIA FLORAL ===
  'Rosa': {
    name: 'Rosa',
    family: 'Floral',
    subgroup: 'Reina de las Flores',
    icon: '🌹',
    description: 'Aroma floral romántico, aterciopelado, ligeramente dulce y atalcado. La flor más icónica de la alta perfumería mundial.',
    sensoryProfile: 'Romántica, seductora, femenina y atemporal con facetas verdes y ligeramente melosas.',
    pyramidTypical: 'Corazón'
  },
  'Jazmín': {
    name: 'Jazmín',
    family: 'Floral',
    subgroup: 'Flores Blancas Nobles',
    icon: '🌸',
    description: 'Flor blanca opulenta, narcótica, cálida e intensamente sensual. Aporta luz radiante y lujo a cualquier creación.',
    sensoryProfile: 'Intensamente floral, dulce, limpio, aristocrático e hipnótico.',
    pyramidTypical: 'Corazón'
  },
  'Lavanda': {
    name: 'Lavanda',
    family: 'Floral',
    subgroup: 'Aromática Fougère',
    icon: '🪻',
    description: 'Hierba floral provenzal limpia, fresca, calmante y herbal con toques ligeramente alcanforados.',
    sensoryProfile: 'Frescura limpia, pulcra, relajante y con distinción clásica europea.',
    pyramidTypical: 'Salida'
  },
  'Peonía': {
    name: 'Peonía',
    family: 'Floral',
    subgroup: 'Florales Frescos',
    icon: '🌺',
    description: 'Floración primaveral delicada, acuosa, translúcida y chispeante, a menudo comparada con una rosa matinal con rocío.',
    sensoryProfile: 'Jovial, etérea, luminosa, femenina y suavemente empolvada.',
    pyramidTypical: 'Corazón'
  },
  'Lirio': {
    name: 'Lirio',
    family: 'Floral',
    subgroup: 'Flores Blancas Acuosas',
    icon: '🪷',
    description: 'Aroma verde, cristalino, vegetal y majestuoso de lirio de los valles o flor de lis con fondo limpio.',
    sensoryProfile: 'Puro, etéreo, húmedo, primaveral y sofisticadamente elegante.',
    pyramidTypical: 'Corazón'
  },
  'Violeta': {
    name: 'Violeta',
    family: 'Floral',
    subgroup: 'Florales Atalcados',
    icon: '💜',
    description: 'Flor misteriosa con una estela dulce, atalcada y ligeramente terrosa reminiscente de caramelos violeta tradicionales.',
    sensoryProfile: 'Atalcada, retro-chic, misteriosa y suavemente nostálgica.',
    pyramidTypical: 'Corazón'
  },
  'Iris': {
    name: 'Iris',
    family: 'Floral',
    subgroup: 'Florales Atalcados Nobles',
    icon: '🪻',
    description: 'El polvo de la raíz de orris confiere el acorde atalcado más costoso y distinguido de la perfumería internacional.',
    sensoryProfile: 'Terciopelo puro, sedoso, atalcado señorial y con matices de madera fría y gamuza.',
    pyramidTypical: 'Corazón'
  },
  'Orquídea': {
    name: 'Orquídea',
    family: 'Floral',
    subgroup: 'Florales Exóticos',
    icon: '🌸',
    description: 'Flor exótica oscura o luminosa con matices picantes, avainillados y carnales de alta gama.',
    sensoryProfile: 'Sensual, profunda, exótica, magnética y opulenta.',
    pyramidTypical: 'Corazón'
  },
  'Tiaré': {
    name: 'Tiaré',
    family: 'Floral',
    subgroup: 'Florales Tropicales',
    icon: '🌼',
    description: 'Flor sagrada de Tahití con matices solares, cremosos y exóticos con recuerdo a aceite de monoi.',
    sensoryProfile: 'Solar, tropical, playera, cálida y envolvente.',
    pyramidTypical: 'Corazón'
  },
  'Azucena': {
    name: 'Azucena',
    family: 'Floral',
    subgroup: 'Flores Blancas Nobles',
    icon: '🪷',
    description: 'Fragancia blanca y majestuosa con acento especiado, meloso y balsámico.',
    sensoryProfile: 'Radiante, especiada-floral, limpia y aristocrática.',
    pyramidTypical: 'Corazón'
  },
  'Ylang-Ylang': {
    name: 'Ylang-Ylang',
    family: 'Floral',
    subgroup: 'Florales Exóticos',
    icon: '🌺',
    description: 'Flor amarilla de las islas comoras; cremosa, embriagadora, con matices de plátano maduro y jazmín silvestre.',
    sensoryProfile: 'Sensual, cremosa, solar y profundamente embriagadora.',
    pyramidTypical: 'Corazón'
  },
  'Gardenia': {
    name: 'Gardenia',
    family: 'Floral',
    subgroup: 'Flores Blancas Cremosas',
    icon: '💮',
    description: 'Floración blanca untuosa y voluptuosa con facetas verdes que evocan terciopelo húmedo.',
    sensoryProfile: 'Cremosa, seductora, sofisticada y rica.',
    pyramidTypical: 'Corazón'
  },
  'Loto': {
    name: 'Loto',
    family: 'Floral',
    subgroup: 'Florales Acuáticos',
    icon: '🪷',
    description: 'Acorde acuático sagrado que evoca tranquilidad zen, aguas calmas y pureza cristalina.',
    sensoryProfile: 'Fresco, zen, acuático, sereno y transparente.',
    pyramidTypical: 'Salida'
  },
  'Madreselva': {
    name: 'Madreselva',
    family: 'Floral',
    subgroup: 'Florales Dulces',
    icon: '🌿',
    description: 'Flor silvestre nectarífera con perfume dulce, floral verde y toques de miel fresca.',
    sensoryProfile: 'Alegre, silvestre, dulce frutal y muy luminosa.',
    pyramidTypical: 'Corazón'
  },
  'Camelia': {
    name: 'Camelia',
    family: 'Floral',
    subgroup: 'Florales Frescos',
    icon: '🌸',
    description: 'Aroma limpio, fresco y sutil que aporta transparencia zen y frescura primaveral.',
    sensoryProfile: 'Sutil, juvenil, limpia y relajante.',
    pyramidTypical: 'Salida'
  },
  'Ciclamen': {
    name: 'Ciclamen',
    family: 'Floral',
    subgroup: 'Florales Acuosos',
    icon: '🌷',
    description: 'Flor de invierno con facetas acuáticas de rocío fresco y almizcle blanco.',
    sensoryProfile: 'Aire alpino fresco, transparente y cristalino.',
    pyramidTypical: 'Salida'
  },

  // === FAMILIA DULCE / ACARAMELADO (GOURMAND) ===
  'Vainilla': {
    name: 'Vainilla',
    family: 'Dulce / Acaramelado',
    subgroup: 'Vainillas Puras & Gourmand',
    icon: '🍦',
    description: 'La reina de los aromas dulces reconfortantes. Extraída de las vainas de orquídea vanilla planifolia de Madagascar.',
    sensoryProfile: 'Cremosa, cálida, dulce, balsámica, reconfortante y altamente adictiva.',
    pyramidTypical: 'Fondo'
  },
  'Caramelo / Dulces': {
    name: 'Caramelo / Dulces',
    family: 'Dulce / Acaramelado',
    subgroup: 'Azúcares & Pralinés',
    icon: '🍬',
    description: 'Acorde goloso de azúcar tostada con mantequilla derretida y toffee. Genera atracción inmediata y sonrisa sensorial.',
    sensoryProfile: 'Goloso, derretido, tentador, alegre y sumamente cálido.',
    pyramidTypical: 'Fondo'
  },
  'Praliné': {
    name: 'Praliné',
    family: 'Dulce / Acaramelado',
    subgroup: 'Frutos Secos Caramelizados',
    icon: '🍫',
    description: 'Avellanas y almendras finamente tostadas envueltas en azúcar moreno y chocolate fino.',
    sensoryProfile: 'Textura cremosa tostada, chocolatosa y de alta costura.',
    pyramidTypical: 'Fondo'
  },
  'Almendra': {
    name: 'Almendra',
    family: 'Dulce / Acaramelado',
    subgroup: 'Frutos Secos Suaves',
    icon: '🥜',
    description: 'Nota lechosa, tibia y delicada con recuerdo a mazapán fino y crema de almendras.',
    sensoryProfile: 'Aterciopelada, cálida, tierna y ligeramente crujiente.',
    pyramidTypical: 'Salida'
  },
  'Almendra Amarga': {
    name: 'Almendra Amarga',
    family: 'Dulce / Acaramelado',
    subgroup: 'Licorosos & Frutos Secos',
    icon: '🍸',
    description: 'Nota elegante y punzante con recuerdo a licor amaretto y cianuro dulce, famosa en composiciones de nicho como Baccarat Rouge.',
    sensoryProfile: 'Licorosa, sofisticada, intensa, hipnótica y ligeramente balsámica.',
    pyramidTypical: 'Salida'
  },
  'Chocolate / Cacao': {
    name: 'Chocolate / Cacao',
    family: 'Dulce / Acaramelado',
    subgroup: 'Cacao & Bombones',
    icon: '🍫',
    description: 'Cacao puro y chocolate oscuro con recuerdos agridulces, cálidos y opulentos.',
    sensoryProfile: 'Profundo, seductor, nocturno, goloso y voluptuoso.',
    pyramidTypical: 'Fondo'
  },
  'Café': {
    name: 'Café',
    family: 'Dulce / Acaramelado',
    subgroup: 'Bebidas Aromáticas Cálidas',
    icon: '☕',
    description: 'Grano de café arábica tostado al punto justo. Aporta energía viva, calidez nocturna y un contraste irresistible con la vainilla.',
    sensoryProfile: 'Tostado, amargo-dulce, vigorizante, nocturno y moderno.',
    pyramidTypical: 'Corazón'
  },
  'Miel': {
    name: 'Miel',
    family: 'Dulce / Acaramelado',
    subgroup: 'Néctares Dorados',
    icon: '🍯',
    description: 'Néctar dorado viscoso con notas animales cálidas de cera de abejas y flores silvestres.',
    sensoryProfile: 'Pesada, opulenta, sensual, cálida y de fijación prolongada.',
    pyramidTypical: 'Fondo'
  },
  'Haba Tonka': {
    name: 'Haba Tonka',
    family: 'Dulce / Acaramelado',
    subgroup: 'Balsámicos Cálidos',
    icon: '🌰',
    description: 'Semilla sudamericana rica en cumarina natural con facetas de vainilla oscura, almendra amarga, tabaco suave y heno.',
    sensoryProfile: 'Cálida, amaderada-dulce, envolvente y adictiva.',
    pyramidTypical: 'Fondo'
  },
  'Coco': {
    name: 'Coco',
    family: 'Dulce / Acaramelado',
    subgroup: 'Tropical Gourmand',
    icon: '🥥',
    description: 'Leche y pulpa de coco cremosa que transporta inmediatamente a playas paradisíacas y atardeceres dorados.',
    sensoryProfile: 'Lactónico, playero, suave, cremoso y exótico.',
    pyramidTypical: 'Corazón'
  },
  'Marshmallow': {
    name: 'Marshmallow',
    family: 'Dulce / Acaramelado',
    subgroup: 'Golosinas & Nubes',
    icon: '☁️',
    description: 'Esponjosa nube de azúcar avainillada con textura aireada y sensación de ternura irresistible.',
    sensoryProfile: 'Polvoso, ultra-dulce, esponjoso, juvenil y tierno.',
    pyramidTypical: 'Fondo'
  },
  'Pistacho': {
    name: 'Pistacho',
    family: 'Dulce / Acaramelado',
    subgroup: 'Frutos Secos Gourmet',
    icon: '🍨',
    description: 'Acorde viral gourmet que evoca helado artesanal de pistacho verde, cremosidad láctea y toque tostado.',
    sensoryProfile: 'Cremoso, untuoso, verde-dulce y altamente apetecible.',
    pyramidTypical: 'Salida'
  },
  'Dátiles': {
    name: 'Dátiles',
    family: 'Dulce / Acaramelado',
    subgroup: 'Frutas Confitadas Árabes',
    icon: '🌴',
    description: 'Fruta deshidratada del desierto oriental impregnada en sirope de miel y canela profunda.',
    sensoryProfile: 'Meloso, resinoso, denso, oriental y lujoso.',
    pyramidTypical: 'Corazón'
  },
  'Leche': {
    name: 'Leche',
    family: 'Dulce / Acaramelado',
    subgroup: 'Notas Lactónicas',
    icon: '🥛',
    description: 'Acorde lactónico cremoso que envuelve la piel como una caricia reconfortante de mantequilla y vainilla.',
    sensoryProfile: 'Cremoso, reconfortante, infantil, sedoso y calmante.',
    pyramidTypical: 'Corazón'
  },

  // === FAMILIA CÍTRICO / ACUÁTICO (FRESCA / HESPÉRIDE / MARINA) ===
  'Limón / Cítricos': {
    name: 'Limón / Cítricos',
    family: 'Cítrico / Acuático',
    subgroup: 'Hespérides Chispeantes',
    icon: '🍋',
    description: 'Explosión cítrica revitalizante de cáscaras recién exprimidas. Aporta dinamismo, frescura pura y una sonrisa inmediata.',
    sensoryProfile: 'Ácido, chispeante, brillante, limpio y energizante.',
    pyramidTypical: 'Salida'
  },
  'Bergamota': {
    name: 'Bergamota',
    family: 'Cítrico / Acuático',
    subgroup: 'Cítricos Nobles',
    icon: '🍈',
    description: 'El cítrico noble de Calabria (Italia); ácido, floral, picante y aromático con matiz de té Earl Grey.',
    sensoryProfile: 'Elegante, cítrico con cuerpo, sofisticado y radiante.',
    pyramidTypical: 'Salida'
  },
  'Naranja / Mandarina': {
    name: 'Naranja / Mandarina',
    family: 'Cítrico / Acuático',
    subgroup: 'Hespérides Dulces',
    icon: '🍊',
    description: 'Zumo jugoso, dulce y vibrante con recuerdos soleados mediterráneos llenos de optimismo.',
    sensoryProfile: 'Dulce-cítrico, alegre, festivo, jugoso y revitalizante.',
    pyramidTypical: 'Salida'
  },
  'Notas Marinas / Acuáticas': {
    name: 'Notas Marinas / Acuáticas',
    family: 'Cítrico / Acuático',
    subgroup: 'Oceánicas & Acuáticas',
    icon: '🌊',
    description: 'Sensación de brisa marina salada, olas rompiendo en las rocas y aire ozónico cargado de libertad.',
    sensoryProfile: 'Salino, fresco, expansivo, aireado, azul y rejuvenecedor.',
    pyramidTypical: 'Salida'
  },
  'Menta Fresca': {
    name: 'Menta Fresca',
    family: 'Cítrico / Acuático',
    subgroup: 'Aromáticas Heladas',
    icon: '🍃',
    description: 'Hojas verdes de menta piperita con efecto frío inmediato sobre la piel y sensación vigorizante.',
    sensoryProfile: 'Gélida, herbal, crujiente, limpia y de gran impacto.',
    pyramidTypical: 'Salida'
  },
  'Sal De Mar': {
    name: 'Sal De Mar',
    family: 'Cítrico / Acuático',
    subgroup: 'Minerales Marinos',
    icon: '🧂',
    description: 'Cristales de sal mineral secados al sol sobre la piel humedecida por el océano.',
    sensoryProfile: 'Mineral, salina, cruda, veraniega y profundamente evocadora.',
    pyramidTypical: 'Salida'
  },
  'Posidonia (Alga Marina)': {
    name: 'Posidonia (Alga Marina)',
    family: 'Cítrico / Acuático',
    subgroup: 'Marina Profunda',
    icon: '🌿',
    description: 'Alga noble del fondo del Mediterráneo; aporta notas yodadas oceánicas reales y carácter varonil distintivo.',
    sensoryProfile: 'Profunda, marina salada, yodada, salvaje y oceánica.',
    pyramidTypical: 'Corazón'
  },
  'Pepino': {
    name: 'Pepino',
    family: 'Cítrico / Acuático',
    subgroup: 'Verdes Acuáticos',
    icon: '🥒',
    description: 'Pulpa verde fresca cargada de agua vegetal pura con sensación de hidratación extrema.',
    sensoryProfile: 'Verde, acuoso, refrescante, sutil y desintoxicante.',
    pyramidTypical: 'Salida'
  },
  'Melón': {
    name: 'Melón',
    family: 'Cítrico / Acuático',
    subgroup: 'Frutas Acuosas',
    icon: '🍈',
    description: 'Fruta jugosa y dulce que aporta volumen acuático, frescura veraniega y alegría casual.',
    sensoryProfile: 'Dulce-acuoso, veraniego, alegre y coqueto.',
    pyramidTypical: 'Salida'
  },
  'Yuzu': {
    name: 'Yuzu',
    family: 'Cítrico / Acuático',
    subgroup: 'Cítricos Exóticos',
    icon: '🍋',
    description: 'Cítrico japonés híbrido entre mandarina y pomelo amargo; aporta una sofisticación zen ultramoderna.',
    sensoryProfile: 'Exótico, punzante, amargo-cítrico y muy limpio.',
    pyramidTypical: 'Salida'
  },
  'Pomelo': {
    name: 'Pomelo',
    family: 'Cítrico / Acuático',
    subgroup: 'Hespérides Amargos',
    icon: '🍊',
    description: 'Toronja rosada con equilibrio perfecto entre acidez chispeante, amargor elegante y frescor.',
    sensoryProfile: 'Vibrante, tónico, amargo y dinámico.',
    pyramidTypical: 'Salida'
  },
  'Notas De Hielo': {
    name: 'Notas De Hielo',
    family: 'Cítrico / Acuático',
    subgroup: 'Acordes Gélidos',
    icon: '🧊',
    description: 'Moléculas olfativas heladas que emulan agua a punto de congelación y brisa polar.',
    sensoryProfile: 'Glaciar, ultra-fresco, cristalino y cortante.',
    pyramidTypical: 'Salida'
  },
  'Notas Verdes': {
    name: 'Notas Verdes',
    family: 'Cítrico / Acuático',
    subgroup: 'Hierbas Cortadas',
    icon: '🌱',
    description: 'Aroma vigoroso de hojas recién trituradas, tallos tiernos y césped fresco bañado por la lluvia.',
    sensoryProfile: 'Clorofila, natural, campestre, energizante y vivo.',
    pyramidTypical: 'Salida'
  },

  // === FAMILIA AMADERADO / ORIENTAL (MADERAS, ESPECIAS, CUERO, RESINAS) ===
  'Maderas (Cedro/Sándalo)': {
    name: 'Maderas (Cedro/Sándalo)',
    family: 'Amaderado / Oriental',
    subgroup: 'Maderas Nobles',
    icon: '🪵',
    description: 'Fusión de cedro seco arquitectónico y sándalo indio cremoso. Es la columna vertebral de la perfumería clásica y de nicho.',
    sensoryProfile: 'Elegante, sólida, cremosa, masculina/unisex y de gran señorío.',
    pyramidTypical: 'Fondo'
  },
  'Agarwood (Oud)': {
    name: 'Agarwood (Oud)',
    family: 'Amaderado / Oriental',
    subgroup: 'Oud & Resinas Árabes',
    icon: '🪵',
    description: 'La madera más codiciada de Oriente Medio, producto de la resina del árbol de Aquilaria. Aporta misterio, poder y lujo ilimitado.',
    sensoryProfile: 'Ahumado, animálico, opulento, oscuro, resinoso y magnético.',
    pyramidTypical: 'Fondo'
  },
  'Cuero': {
    name: 'Cuero',
    family: 'Amaderado / Oriental',
    subgroup: 'Cueros & Gamuzas',
    icon: '🧥',
    description: 'Evoca el interior de un automóvil de lujo, una chaqueta de cuero de diseño o guantes de ante fino.',
    sensoryProfile: 'Viril, atrevido, ahumado, seco, sofisticado y nocturno.',
    pyramidTypical: 'Fondo'
  },
  'Ámbar': {
    name: 'Ámbar',
    family: 'Amaderado / Oriental',
    subgroup: 'Acordes Ambarados',
    icon: '🔮',
    description: 'Acorde dorado mítico compuesto por ládano, benjuí y vainilla. Irradia calidez solar, sensualidad y misterio.',
    sensoryProfile: 'Resinoso, cálido, dorado, sensual y de estela envolvente.',
    pyramidTypical: 'Fondo'
  },
  'Especias (Canela/Pimienta)': {
    name: 'Especias (Canela/Pimienta)',
    family: 'Amaderado / Oriental',
    subgroup: 'Especias Cálidas & Frías',
    icon: '🌶️',
    description: 'Contraste entre el picante vibrante de la pimienta negra/rosa y el calor dulce de la canela de Ceilán.',
    sensoryProfile: 'Caliente, picante, vibrante, seductor y estimulante.',
    pyramidTypical: 'Corazón'
  },
  'Cardamomo': {
    name: 'Cardamomo',
    family: 'Amaderado / Oriental',
    subgroup: 'Especias Aromáticas',
    icon: '🫚',
    description: 'Especia noble de Guatemala e India con facetas frías, cítricas, aromáticas y ligeramente resinosas.',
    sensoryProfile: 'Fresco-especiado, elegante, misterioso y cautivador.',
    pyramidTypical: 'Salida'
  },
  'Jengibre': {
    name: 'Jengibre',
    family: 'Amaderado / Oriental',
    subgroup: 'Raíces Especiadas',
    icon: '🫚',
    description: 'Raíz fresca recién rallada con efervescencia cítrica, calor picante y mordisco vivaz.',
    sensoryProfile: 'Efervescente, picante, tónico y moderno.',
    pyramidTypical: 'Salida'
  },
  'Pachulí': {
    name: 'Pachulí',
    family: 'Amaderado / Oriental',
    subgroup: 'Maderas Terrosas',
    icon: '🍂',
    description: 'Hojas fermentadas de pogostemon cablin; aroma terroso, achocolatado, profundo y bohemio.',
    sensoryProfile: 'Húmedo, terroso noble, amaderado oscuro y aristocrático.',
    pyramidTypical: 'Fondo'
  },
  'Incienso / Resinas': {
    name: 'Incienso / Resinas',
    family: 'Amaderado / Oriental',
    subgroup: 'Inciensos Espirituales',
    icon: '🕯️',
    description: 'Lágrimas de resina de olíbano quemadas en templos milenarios; humo frío y espiritualidad mística.',
    sensoryProfile: 'Místico, balsámico, ahumado frío, introspectivo y elegante.',
    pyramidTypical: 'Fondo'
  },
  'Tabaco': {
    name: 'Tabaco',
    family: 'Amaderado / Oriental',
    subgroup: 'Hojas Curadas',
    icon: '🍂',
    description: 'Hojas rubias secadas al sol con matices de ciruela pasa, miel silvestre y humo dulce de pipa.',
    sensoryProfile: 'Cálido, seco, masculino, señorial y sumamente distinguido.',
    pyramidTypical: 'Fondo'
  },
  'Ambroxan': {
    name: 'Ambroxan',
    family: 'Amaderado / Oriental',
    subgroup: 'Ámbar Gris Sintético',
    icon: '✨',
    description: 'Molécula prodigiosa derivada de la salvia que reproduce el ámbar gris natural; genera estelas descomunales y elogios continuos.',
    sensoryProfile: 'Ambarado, mineral, sensual, limpio y rey absoluto de la proyección moderna.',
    pyramidTypical: 'Fondo'
  },
  'Guayaco': {
    name: 'Guayaco',
    family: 'Amaderado / Oriental',
    subgroup: 'Maderas Exóticas',
    icon: '🪵',
    description: 'Madera del árbol de la vida sudamericano con facetas alquitranadas, ahumadas y toques de rosa amaderada.',
    sensoryProfile: 'Ahumado, leñoso, noble y muy masculino.',
    pyramidTypical: 'Fondo'
  },
  'Almizcle': {
    name: 'Almizcle',
    family: 'Amaderado / Oriental',
    subgroup: 'Almizcles Blancos & Animales',
    icon: '🤍',
    description: 'El fijador supremo. Evoca la piel limpia humana, el confort del algodón blanco recién lavado y la intimidad seductora.',
    sensoryProfile: 'Suave, íntimo, pulcro, aterciopelado y de fijación ininterrumpida.',
    pyramidTypical: 'Fondo'
  },
  'Pino / Ciprés': {
    name: 'Pino / Ciprés',
    family: 'Amaderado / Oriental',
    subgroup: 'Bosques Resinosos',
    icon: '🌲',
    description: 'Agujas de pino silvestre y madera de ciprés italiano empapadas por la lluvia matutina en el bosque.',
    sensoryProfile: 'Balsámico, resinoso verde, alpino, sobrio y viril.',
    pyramidTypical: 'Fondo'
  }
};

// Sub-families expanded for Question 6 (incorporating ALL notes from PDF & Fragrantica)
export const EXPANDED_SUBFAMILIES_FOR_QUIZ: Record<'Floral' | 'Dulce / Acaramelado' | 'Cítrico / Acuático' | 'Amaderado / Oriental', {
  id: string;
  label: string;
  icon: string;
  subgroup: string;
  notesSample: string[];
  desc: string;
}[]> = {
  'Floral': [
    {
      id: 'Rosa romántica y aterciopelada',
      label: 'Rosa romántica',
      icon: '🌹',
      subgroup: 'Rosas Nobles',
      notesSample: ['Rosa', 'Rosa de Damasco', 'Rosa Centifolia'],
      desc: 'Pétalos nobles, románticos y aterciopelados con sutil toque de rocío'
    },
    {
      id: 'Jazmín blanco elegante y narcótico',
      label: 'Jazmín elegante',
      icon: '🌸',
      subgroup: 'Flores Blancas',
      notesSample: ['Jazmín', 'Azucena', 'Flores'],
      desc: 'Luz radiante, floral opulento, sensual y aristocrático'
    },
    {
      id: 'Lavanda fresca provenzal y limpia',
      label: 'Lavanda fresca',
      icon: '🪻',
      subgroup: 'Aromáticas',
      notesSample: ['Lavanda', 'Hierbas Verdes'],
      desc: 'Frescura limpia, clásica europea, relajante y distinguida'
    },
    {
      id: 'Flores dulces avainilladas y miel',
      label: 'Flores dulces avainilladas',
      icon: '🍯',
      subgroup: 'Floral Gourmand',
      notesSample: ['Flores', 'Vainilla', 'Miel', 'Madreselva'],
      desc: 'Buqué floral bañado en néctar de vainilla cremosa y miel'
    },
    {
      id: 'Peonía suave y magnolia cristalina',
      label: 'Peonía suave',
      icon: '🌺',
      subgroup: 'Florales Frescos',
      notesSample: ['Peonía', 'Camelia', 'Magnolia'],
      desc: 'Floración etérea, luminosa, jugosa y femenina'
    },
    {
      id: 'Lirio acuático y flor de loto zen',
      label: 'Lirio & Loto acuático',
      icon: '🪷',
      subgroup: 'Florales Acuáticos',
      notesSample: ['Lirio', 'Loto', 'Nenúfar'],
      desc: 'Sensación zen de aguas calmas, transparencia y pureza'
    },
    {
      id: 'Violeta misteriosa e iris atalcado',
      label: 'Violeta & Iris atalcado',
      icon: '💜',
      subgroup: 'Atalcados Nobles',
      notesSample: ['Violeta', 'Iris', 'Polvo'],
      desc: 'Aura sedosa, atalcada de lujo señorial y misterio atemporal'
    },
    {
      id: 'Orquídea exótica y flor de tiaré',
      label: 'Orquídea & Tiaré exótico',
      icon: '💮',
      subgroup: 'Tropicales Exóticos',
      notesSample: ['Orquídea', 'Tiaré', 'Ylang-Ylang'],
      desc: 'Aroma playero, cálido, solar y profundamente embriagador'
    },
    {
      id: 'Tuberosa opulenta y flor de azahar',
      label: 'Tuberosa & Azahar',
      icon: '🌼',
      subgroup: 'Florales Intensos',
      notesSample: ['Tuberosa', 'Azahar', 'Gardenia'],
      desc: 'Presencia magnética, estela floral intensa que no pasa desapercibida'
    }
  ],

  'Dulce / Acaramelado': [
    {
      id: 'Vainilla cremosa de Madagascar',
      label: 'Vainilla cremosa',
      icon: '🍦',
      subgroup: 'Vainillas Puras',
      notesSample: ['Vainilla', 'Vainilla Bourbon'],
      desc: 'Cremosa, reconfortante, cálida y golosa de máxima fijación'
    },
    {
      id: 'Caramelo derretido y pralinés dorados',
      label: 'Caramelo & Pralinés',
      icon: '🍬',
      subgroup: 'Azúcares Tostados',
      notesSample: ['Caramelo / Dulces', 'Praliné', 'Caramel'],
      desc: 'Toffee derretido con avellanas tostadas y mantequilla tibia'
    },
    {
      id: 'Coco dulce y crema láctea batida',
      label: 'Coco dulce & Lácteo',
      icon: '🥥',
      subgroup: 'Tropical Gourmand',
      notesSample: ['Coco', 'Crema De Coco', 'Leche'],
      desc: 'Pulpa de coco untuosa, textura cremosa de batido y dulzor veraniego'
    },
    {
      id: 'Café tostado y chocolate cacao oscuro',
      label: 'Café & Cacao puro',
      icon: '☕',
      subgroup: 'Gourmand Nocturno',
      notesSample: ['Café', 'Chocolate / Cacao', 'Kulfi'],
      desc: 'Grano de café tostado energizante y cacao amargo-dulce seductor'
    },
    {
      id: 'Miel silvestre y haba tonka tostada',
      label: 'Miel & Haba Tonka',
      icon: '🍯',
      subgroup: 'Néctares Balsámicos',
      notesSample: ['Miel', 'Haba Tonka', 'Dátiles'],
      desc: 'Néctar dorado viscoso con notas balsámicas de almendra y heno'
    },
    {
      id: 'Malvavisco nube y algodón de azúcar',
      label: 'Marshmallow & Algodón',
      icon: '☁️',
      subgroup: 'Golosinas Tiernas',
      notesSample: ['Marshmallow', 'Algodón de Azúcar', 'Zefir'],
      desc: 'Esponjosa nube azucarada suave, tierna y divertida'
    },
    {
      id: 'Pistacho helado y avellana crujiente',
      label: 'Pistacho & Avellana',
      icon: '🍨',
      subgroup: 'Frutos Secos Gourmet',
      notesSample: ['Pistacho', 'Avellana', 'Frutos Secos'],
      desc: 'Helado cremoso de pistacho artesanal de tendencia viral'
    },
    {
      id: 'Dátiles orientales y licor dulce de ron',
      label: 'Dátiles & Licores Dulces',
      icon: '🍸',
      subgroup: 'Gourmand Licoroso',
      notesSample: ['Dátiles', 'Ron', 'Licor'],
      desc: 'Dulzor opulento árabe bañado en licor dorado y canela'
    }
  ],

  'Cítrico / Acuático': [
    {
      id: 'Limón siciliano y bergamota de Calabria',
      label: 'Limón & Bergamota',
      icon: '🍋',
      subgroup: 'Cítricos Chispeantes',
      notesSample: ['Limón / Cítricos', 'Bergamota', 'Verbena'],
      desc: 'Chispa ácida luminosa, elegante y llena de vitalidad inmediata'
    },
    {
      id: 'Naranja jugosa y mandarina dulce',
      label: 'Naranja & Mandarina',
      icon: '🍊',
      subgroup: 'Hespérides Dulces',
      notesSample: ['Naranja / Mandarina', 'Clementina'],
      desc: 'Zumo jugoso mediterráneo, alegre y cargado de sol y frescor'
    },
    {
      id: 'Brisa marina fresca y notas ozónicas',
      label: 'Brisa marina & Océano',
      icon: '🌊',
      subgroup: 'Acuáticos Salinos',
      notesSample: ['Notas Marinas / Acuáticas', 'Sal De Mar', 'Ozono'],
      desc: 'El aroma de las olas rompiendo, brisa pura y salitre estimulante'
    },
    {
      id: 'Algas profundas, posidonia y calypso',
      label: 'Algas & Profundidad marina',
      icon: '⚓',
      subgroup: 'Marina Profunda',
      notesSample: ['Posidonia (Alga Marina)', 'Yodo', 'Calypso'],
      desc: 'Inmersión oceánica profunda, fresca, yodada y de gran misterio'
    },
    {
      id: 'Pomelo amargo y toronja rosada',
      label: 'Pomelo & Toronja',
      icon: '🍊',
      subgroup: 'Cítricos Tónicos',
      notesSample: ['Pomelo', 'Toronja'],
      desc: 'Amargor tónico sofisticado, limpio y sumamente moderno'
    },
    {
      id: 'Menta fresca helada y notas de hielo',
      label: 'Menta helada & Hielo',
      icon: '🧊',
      subgroup: 'Gélidos Glaciares',
      notesSample: ['Menta Fresca', 'Notas De Hielo'],
      desc: 'Efecto frío bajo cero vigorizante que renueva cuerpo y mente'
    },
    {
      id: 'Té verde revitalizante y notas verdes',
      label: 'Té verde & Hierbas',
      icon: '🍵',
      subgroup: 'Verdes Aromáticos',
      notesSample: ['Té Verde', 'Notas Verdes', 'Césped'],
      desc: 'Frescura campestre limpia, hojas verdes y serenidad pura'
    },
    {
      id: 'Melón fresco acuático y pepino crujiente',
      label: 'Melón acuático & Pepino',
      icon: '🥒',
      subgroup: 'Acuáticos Frutales',
      notesSample: ['Melón', 'Pepino', 'Bambú'],
      desc: 'Hidratación pura crujiente, dulce y relajada'
    }
  ],

  'Amaderado / Oriental': [
    {
      id: 'Madera suave y elegante (sándalo, cedro)',
      label: 'Sándalo & Cedro noble',
      icon: '🪵',
      subgroup: 'Maderas Nobles',
      notesSample: ['Maderas (Cedro/Sándalo)', 'Roble'],
      desc: 'Cremoso, señorial, arquitectónico, versátil y de elegancia pura'
    },
    {
      id: 'Oud árabe tradicional y maderas ahumadas',
      label: 'Oud árabe (Agarwood)',
      icon: '👑',
      subgroup: 'Maderas Sagradas',
      notesSample: ['Agarwood (Oud)', 'Incienso / Resinas'],
      desc: 'La madera más valiosa de Oriente Medio, opulenta y misteriosa'
    },
    {
      id: 'Cuero intenso toscano y gamuza suave',
      label: 'Cuero intenso & Gamuza',
      icon: '🧥',
      subgroup: 'Cueros Nobles',
      notesSample: ['Cuero', 'Gamuza'],
      desc: 'Carácter viril, chaqueta de cuero de diseñador, sobrio y audaz'
    },
    {
      id: 'Ámbar cálido dorado y ambroxan rey de proyección',
      label: 'Ámbar & Ambroxan',
      icon: '🔮',
      subgroup: 'Ambarados Modernos',
      notesSample: ['Ámbar', 'Ambroxan', 'Amberwood'],
      desc: 'Calor radiante dorado, sensualidad y estela descomunal de cumplidos'
    },
    {
      id: 'Canela caliente, pimienta y clavo',
      label: 'Especias cálidas (Canela)',
      icon: '🌶️',
      subgroup: 'Especias Ígneas',
      notesSample: ['Especias (Canela/Pimienta)', 'Clavo'],
      desc: 'Calidez especiada excitante, picante, pasional y nocturna'
    },
    {
      id: 'Cardamomo verde y jengibre picante',
      label: 'Cardamomo & Jengibre',
      icon: '🫚',
      subgroup: 'Especias Frías',
      notesSample: ['Cardamomo', 'Jengibre'],
      desc: 'Especia fría aristocrática con efervescencia moderna y cautivadora'
    },
    {
      id: 'Incienso místico, mirra y resinas balsámicas',
      label: 'Incienso & Resinas',
      icon: '🕯️',
      subgroup: 'Resinas Místicas',
      notesSample: ['Incienso / Resinas', 'Benzoin', 'Ládano'],
      desc: 'Humo sagrado oriental, introspectivo, balsámico y solemne'
    },
    {
      id: 'Tabaco rubio curado y hojas secas de papiro',
      label: 'Tabaco rubio & Papiro',
      icon: '🍂',
      subgroup: 'Hojas Nobles',
      notesSample: ['Tabaco', 'Papiro', 'Tinto De Tabaco'],
      desc: 'Tabaco aromático de pipa con facetas dulces de ciruela y madera seca'
    },
    {
      id: 'Pachulí terroso noble y vetiver ahumado',
      label: 'Pachulí & Vetiver',
      icon: '🌱',
      subgroup: 'Maderas Terrosas',
      notesSample: ['Pachulí', 'Vetiver', 'Cipriol (Nagarmota)'],
      desc: 'Profundidad terrosa bohemia chic con elegancia atemporal'
    },
    {
      id: 'Pino silvestre alpino y ciprés mediterráneo',
      label: 'Pino & Ciprés boscoso',
      icon: '🌲',
      subgroup: 'Bosques Resinosos',
      notesSample: ['Pino / Ciprés', 'Guayaco'],
      desc: 'Resina balsámica verde, aire de montaña y fuerza natural'
    }
  ]
};

// Helper function to get detail or generate fallback
export function getNoteDetail(noteName: string): NoteDetail {
  if (FRAGRANTICA_NOTES[noteName]) {
    return FRAGRANTICA_NOTES[noteName];
  }

  // Look for partial key match
  const lower = noteName.toLowerCase();
  for (const [key, detail] of Object.entries(FRAGRANTICA_NOTES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return detail;
    }
  }

  // Fallback
  return {
    name: noteName,
    family: 'Amaderado / Oriental',
    subgroup: 'Nota Característica',
    icon: '✨',
    description: `Nota olfativa distintiva catalogada en la pirámide de Fraganza. Aporta complejidad sensorial, equilibrio y firma olfativa única a la fragancia.`,
    sensoryProfile: `Matiz aromático noble que complementa la composición de salida, corazón o fijación en piel.`,
    pyramidTypical: 'Versátil'
  };
}
