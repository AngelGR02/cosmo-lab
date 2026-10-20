/* ============================================================
   COSMO LAB — configuración y catálogo
   Este es el ÚNICO archivo que tocas para: cambiar precios,
   enlaces de contacto, o agregar productos a cada carrusel.
   ============================================================ */

window.COSMO_CONFIG = {
  brand: 'Cosmo Lab',

  // Contacto
  orderChannel: 'whatsapp',   // 'whatsapp' o 'facebook': a dónde llevan los botones "Pedir"
  whatsappUrl: 'https://wa.me/5218344263172',
  whatsappLabel: '834 426 3172',
  instagramUrl: 'https://www.instagram.com/cosmolab.victoria/',
  instagramLabel: '@cosmolab.victoria',
  facebookUrl: 'https://www.facebook.com/share/1NKmqPGVhC/',
  mapsUrl: 'https://maps.app.goo.gl/AnmAx6eNyCE8FYDi6',

  currency: 'MXN',
  comingSoon: ['Mouse pads', 'y más']
};

/* ------------------------------------------------------------
   CATEGORÍAS (cada una es una pestaña con su propio carrusel)
   id          se usa para enlazar los productos (campo "category")
   price       precio base; los productos con price: null lo usan
   pricePrefix texto antes del precio ('Desde ')
   spec        dato corto junto al precio (medida, capacidad…)
   features    lista de características (opcional)
   includes    qué incluye (opcional)
   priceTable  tabla de precios por opciones (opcional)
   sections    bloques extra de texto, ej. colores (opcional)
   ratio       proporción de las imágenes de la categoría ('2 / 3' por defecto)
   ------------------------------------------------------------ */
window.COSMO_CATEGORIES = [
  {
    id: 'laminas',
    name: 'Láminas',
    fullName: 'Láminas de aluminio',
    tagline: 'Totalmente personalizadas: tu diseño, en lámina de aluminio.',
    price: 200,
    priceLabel: 'Precio por lámina',
    spec: { label: 'Medida', value: '20 × 30 cm' },
    features: [
      'Colores vibrantes y duraderos',
      'Resistentes al agua, rayones y sol',
      'Acabado liso y de alta calidad',
      'Impresión de alta definición',
      'Ideales para decoración, regalos y más'
    ],
    includes: ['Imán', 'Placa metálica adhesiva']
  },
  {
    id: 'termos',
    name: 'Termos',
    fullName: 'Vaso térmico 20 oz',
    tagline: 'Totalmente personalizado, con el diseño que tú quieras.',
    price: 250,
    priceLabel: 'Precio por vaso',
    spec: { label: 'Capacidad', value: '20 oz · 600 ml' },
    features: [
      '3 horas caliente y 9 horas frío',
      'Doble pared de acero inoxidable',
      'Libre de BPA, seguro para tus bebidas',
      'Tapa antiderrames con sello de silicón'
    ],
    includes: ['Tapa antiderrames con sello de silicón', 'Popote de acero inoxidable', 'Cepillo limpia popote']
  },
  {
    id: 'playeras',
    name: 'Playeras',
    fullName: 'Playeras personalizadas',
    tagline: 'Estampado DTF con el diseño que tú elijas.',
    price: 170,
    pricePrefix: 'Desde ',
    priceLabel: 'Precio',
    priceTable: [
      { group: 'Adulto', note: 'Caballero / dama · Tallas CH, M, G, XL', rows: [
        { label: '1 estampado (frente o espalda)', price: 230 },
        { label: '2 estampados (espalda + mini en pecho)', price: 250 }
      ]},
      { group: 'Niño', note: 'Tallas 6 a 8 · 10 a 12', rows: [
        { label: '1 estampado (frente o espalda)', price: 170 },
        { label: '2 estampados (espalda + mini en pecho)', price: 190 }
      ]}
    ]
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    fullName: 'Hoodies personalizados',
    tagline: 'Diseño mini en el pecho y diseño grande atrás.',
    price: 400,
    priceLabel: 'Precio por hoodie',
    spec: { label: 'Tallas', value: 'CH · M · G · XG' },
    features: [
      'Con gorro y bolsa tipo canguro, calientitos',
      'Tela de 250 g/m²: 68% algodón y 32% poliéster',
      'Resistentes al uso diario y al lavado',
      'Colores vibrantes y duraderos',
      'Ideales para regalos, eventos o tu marca'
    ],
    sections: [
      { title: 'Colores disponibles', text: 'Blanco, jaspe, negro, marino, rey, kaki y rojo. Sujetos a disponibilidad.' }
    ]
  },
  {
    id: 'tazas',
    name: 'Tazas',
    fullName: 'Taza 11 oz personalizada',
    tagline: 'El diseño que tú elijas, listo para regalar.',
    price: 110,
    priceLabel: 'Precio por taza',
    spec: { label: 'Capacidad', value: '11 oz · 325 ml' },
    features: [
      'Diseño que tú elijas',
      'Ideal para regalo',
      'Impresión de alta calidad',
      'Diseños únicos y originales'
    ],
    includes: ['Empaque']
  }
];

/* ------------------------------------------------------------
   PRODUCTOS (lo que aparece en cada carrusel)
   Para agregar uno: copia un bloque, cambia los datos y guarda
   la imagen en assets/ (ideal en proporción 2:3, vertical).

   id        único, sin espacios
   category  id de la categoría de arriba
   title     nombre que se muestra
   image     ruta de la imagen
   price     null = usa el precio de la categoría · o un número
   focus     parte visible si se recorta ('50% 50%' = centro)
   ratio     proporción de ESTA imagen si es distinta a la de su categoría:
             '2 / 3' = vertical (láminas), '1 / 1' = cuadrada (promocionales)
   active    false = lo oculta sin borrarlo
   ------------------------------------------------------------ */
window.COSMO_CATALOG = [
  // ---- Láminas ----
  // La ficha promocional va primero. Las láminas miden 20 × 30 cm (2:3): todas las imágenes
  // de abajo ya están recortadas a esa proporción.
  { id: 'laminas-promo', category: 'laminas', title: 'Láminas de aluminio sublimadas',
    image: 'assets/products/laminas-promo.webp', price: null, focus: '50% 50%', ratio: '1 / 1', active: true },
  { id: 'doctor-doom', category: 'laminas', title: 'Doctor Doom',
    image: 'assets/designs/doctor-doom.webp', price: null, focus: '50% 50%', active: true },
  { id: 'darth-maul', category: 'laminas', title: 'Darth Maul',
    image: 'assets/designs/star-wars-darth-maul.webp', price: null, focus: '50% 50%', active: true },
  { id: 'trench', category: 'laminas', title: 'Trench',
    image: 'assets/designs/trench.webp', price: null, focus: '50% 50%', active: true },
  { id: 'spider-man', category: 'laminas', title: 'Spider-Man',
    image: 'assets/designs/spider-man.webp', price: null, focus: '50% 50%', active: true },
  { id: 'modern-clix', category: 'laminas', title: 'Modern Clix',
    image: 'assets/designs/modern-clix.webp', price: null, focus: '50% 50%', active: true },
  { id: 'link', category: 'laminas', title: 'Link',
    image: 'assets/designs/link.webp', price: null, focus: '50% 50%', active: true },
  { id: 'monkey-d-luffy', category: 'laminas', title: 'Monkey D. Luffy',
    image: 'assets/designs/monkey-d-luffy.webp', price: null, focus: '50% 50%', active: true },
  { id: 'nata-montana', category: 'laminas', title: 'Nata Montana',
    image: 'assets/designs/nata-montana.webp', price: null, focus: '50% 50%', active: true },
  { id: 'neo-metal-sonic', category: 'laminas', title: 'Neo Metal Sonic',
    image: 'assets/designs/neo-metal-sonic.webp', price: null, focus: '50% 50%', active: true },
  { id: 'pokemon-iniciales', category: 'laminas', title: 'Pokémon iniciales',
    image: 'assets/designs/pokemon-iniciales.webp', price: null, focus: '50% 50%', active: true },
  { id: 'rock-lee', category: 'laminas', title: 'Rock Lee',
    image: 'assets/designs/rock-lee.webp', price: null, focus: '50% 50%', active: true },
  { id: 'akatsuki', category: 'laminas', title: 'Akatsuki',
    image: 'assets/designs/akatsuki.webp', price: null, focus: '50% 50%', active: true },
  { id: 'anakin-skywalker', category: 'laminas', title: 'Anakin Skywalker',
    image: 'assets/designs/anakin-skywalker.webp', price: null, focus: '50% 50%', active: true },
  { id: 'blastoise', category: 'laminas', title: 'Blastoise',
    image: 'assets/designs/blastoise.webp', price: null, focus: '50% 50%', active: true },
  { id: 'breaking-bad', category: 'laminas', title: 'Breaking Bad',
    image: 'assets/designs/breaking-bad.webp', price: null, focus: '50% 50%', active: true },
  { id: 'darth-vader', category: 'laminas', title: 'Darth Vader',
    image: 'assets/designs/darth-vader.webp', price: null, focus: '50% 50%', active: true },
  { id: 'doom', category: 'laminas', title: 'Doom',
    image: 'assets/designs/doom.webp', price: null, focus: '50% 50%', active: true },
  { id: 'dr-eggman', category: 'laminas', title: 'Dr. Eggman',
    image: 'assets/designs/dr-eggman.webp', price: null, focus: '50% 50%', active: true },
  { id: 'gengar-flores', category: 'laminas', title: 'Gengar entre flores',
    image: 'assets/designs/gengar-flores.webp', price: null, focus: '50% 50%', active: true },
  { id: 'gengar', category: 'laminas', title: 'Gengar',
    image: 'assets/designs/gengar.webp', price: null, focus: '50% 50%', active: true },
  { id: 'goku-ultra-instinct', category: 'laminas', title: 'Goku Ultra Instinct',
    image: 'assets/designs/goku-ultra-instinct.webp', price: null, focus: '50% 50%', active: true },
  { id: 'jack-skellington', category: 'laminas', title: 'Jack Skellington',
    image: 'assets/designs/jack-skellington.webp', price: null, focus: '50% 50%', active: true },
  { id: 'jinx', category: 'laminas', title: 'Jinx',
    image: 'assets/designs/jinx.webp', price: null, focus: '50% 50%', active: true },

  // ---- Termos ----
  { id: 'vaso-20oz-azul', category: 'termos', title: 'Vaso térmico 20 oz',
    image: 'assets/products/vaso-termico-20oz.webp', price: null, focus: '50% 50%', active: true },

  // ---- Playeras ----
  { id: 'playeras-dtf', category: 'playeras', title: 'Playeras DTF: precios y modelos',
    image: 'assets/products/playeras-precios.webp', price: null, focus: '50% 50%', active: true },
  { id: 'playera-doom', category: 'playeras', title: 'Doom (playera negra)',
    image: 'assets/products/playera-doom.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },
  { id: 'playera-porsche-911', category: 'playeras', title: 'Porsche 911 Turbo (playera blanca)',
    image: 'assets/products/playera-porsche-911.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },
  { id: 'playera-luffy-wanted', category: 'playeras', title: 'Monkey D. Luffy Wanted (playera blanca)',
    image: 'assets/products/playera-luffy-wanted.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },
  { id: 'playera-supra', category: 'playeras', title: 'Supra (playera negra)',
    image: 'assets/products/playera-supra.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },
  { id: 'playera-out-of-office', category: 'playeras', title: 'Out of Office (playera negra)',
    image: 'assets/products/playera-out-of-office.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },
  { id: 'playera-skyline', category: 'playeras', title: 'Skyline Fast & Furious (playera negra)',
    image: 'assets/products/playera-skyline.webp', price: null, focus: '50% 50%', ratio: '1200 / 1097', active: true },

  // ---- Hoodies ----
  { id: 'hoodie-personalizado', category: 'hoodies', title: 'Hoodie personalizado',
    image: 'assets/products/hoodie-personalizado.webp', price: null, focus: '50% 50%', ratio: '1 / 1', active: true },

  // ---- Tazas ----
  { id: 'taza-11oz', category: 'tazas', title: 'Taza 11 oz personalizada',
    image: 'assets/products/taza-11oz.webp', price: null, focus: '50% 50%', ratio: '1 / 1', active: true }
];
