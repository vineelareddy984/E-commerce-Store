import { Product, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'furniture',
    name: 'Teak & Heritage Carvings',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop',
    description: 'Imperial Saharanpur teak carvings, Kashmiri walnut timber frameworks, and brass joints built to last generations.',
    count: 3
  },
  {
    id: 'apparel',
    name: 'Heritage Handlooms & Weaves',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    description: 'Precious handloom pashminas, Varanasi mulberry silks, and delicate gold zari work.',
    count: 3
  },
  {
    id: 'objects',
    name: 'Sacred Rituals & Accents',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=600&auto=format&fit=crop',
    description: 'Lost-wax Aligarh brassware, Jaipur blue-pottery clay-slips, and hand-beaten deep copper urlis.',
    count: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kashmir-lounge-01',
    name: 'Kashmir Walnut Armchair No.1',
    tagline: 'Warm organic ivory raw silk cradled by hand-sculptured Kashmiri walnut.',
    description: 'A masterpiece connecting modern lounge comfort with centuries-old Kashmiri carving heritage. Hand-carved from rare quartersawn seasoned Walnut wood sourced sustainably from private orchards in Srinagar. The plush seating is dressed in pure hand-spun raw Tussar silk. Every frame features subtle hand-filed corner bevels and is sealed with organic linseed oil, showcasing the magnificent dark wood grain knots beautifully.',
    price: 1650,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Oatmeal Silk Raw', hex: '#EAE1CE' },
      { name: 'Saffron Maroon Velvet', hex: '#7A1C1C' },
      { name: 'Imperial Basalt Black', hex: '#1C1C1C' }
    ],
    sizes: ['Standard Lounge', 'High-Back Royal'],
    stock: 6,
    rating: 4.9,
    numReviews: 31,
    featured: true,
    bestSeller: true,
    details: [
      'W 86cm × D 90cm × H 74cm (Seat Height: 39cm)',
      'Frame hand-carved in Srinagar from solid mountain-seasoned Walnut wood',
      'Upholstered with heavy 100% organic raw Tussar silk thread matrices',
      'Traditional mortise-and-tenon wood joinery with zero metal screws',
      'Equipped with heavy protective felt scratchpads'
    ],
    reviews: [
      {
        id: 'rev-01',
        userName: 'Alistair M.',
        rating: 5,
        date: 'May 14, 2026',
        comment: 'Even more breathtaking in person. The walnut timber has a marvelous weight, and the raw silk grain has a beautiful organic sheen.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'
      },
      {
        id: 'rev-02',
        userName: 'Elena R.',
        rating: 5,
        date: 'April 02, 2026',
        comment: 'A true heirloom piece. It matches our minimal warm interiors incredibly while bringing in grand luxury. Absolutely divine.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'brass-lamp-02',
    name: 'Aligarh Lost-Wax Brass Diya Lamp',
    tagline: 'Hand-burnished solid unlacquered brass illuminating warm sacred rays.',
    description: 'Designed as an elegant study of traditional Aligarh lost-wax carving methods. Sand-cast in heavy raw brass with custom-milled geometric light filters that cast delicate shadow screens on surrounding walls. Left completely raw and unlacquered, allowing your fingers and atmospheric air to weave a beautiful vintage deep-gold oxidation patina over the years.',
    price: 360,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Raw Royal Brass', hex: '#E2B842' },
      { name: 'Antique Bronze Verdigris', hex: '#637A6D' }
    ],
    sizes: ['Single Tier', 'Double Tier Royal'],
    stock: 12,
    rating: 4.8,
    numReviews: 42,
    featured: true,
    bestSeller: false,
    details: [
      'Base Diameter: 18cm × Height: 45cm × Weight: 4.2kg',
      'Cast entirely from raw solid brass alloys in Aligarh chambers',
      'Brown heritage braided silk electrical cord (2.5m length)',
      'Integrated brass turn-knob dimming hardware',
      'Includes one dimmable ultra-warm ST64 Amber 1800K LED filament bulb'
    ],
    reviews: [
      {
        id: 'rev-03',
        userName: 'Marcus K.',
        rating: 5,
        date: 'June 01, 2026',
        comment: 'The weight is incredible and the glow is absolutely meditative. The raw brass turns a gorgeous deep antique bronze where touched most.',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'teak-pedestal-03',
    name: 'Teakwood Heritage Carved Stool',
    tagline: 'Solid Teak block stool with hand- chiseled geometric fluting.',
    description: 'A monument constructed from solid trunk flitches of premium old-growth Burma Teak. Features geometric grooves inspired by ancient temple carvings of Hampi. Highly robust and versatile, it functions perfectly as an occasional drink stand, bedside table, or raw sculptural statement piece. Finished in zero-VOC natural hard wax to highlight golden teak fibers.',
    price: 320,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Oiled Golden Teak', hex: '#B2763A' },
      { name: 'Charred Coal Teak', hex: '#2A2521' }
    ],
    sizes: ['38cm Height', '48cm Height'],
    stock: 7,
    rating: 4.7,
    numReviews: 19,
    featured: false,
    bestSeller: true,
    details: [
      'Top Diameter: 32cm × custom height choice',
      'Precisely milled from a single dry-aged reclaimed Burma Teak trunk',
      'Features high-density protective wool pad feet underneath',
      'Carved entirely by local third-generation carpentry master craftsmen',
      'Wood checks and small organic cracks will safely mature without structural changes'
    ],
    reviews: [
      {
        id: 'rev-04',
        userName: 'Arjun S.',
        rating: 5,
        date: 'Feb 19, 2026',
        comment: 'Extremely heavy, solid wood with a mesmerizing smell of fresh oils. The jali-like fluting lines are carved with magnificent precision.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'royal-pashmina-04',
    name: 'Royal Srinagar Kani Pashmina Shawl',
    tagline: 'Hand-spun Ladakhi pure cashmere handwoven over two years.',
    description: 'The absolute zenith of handloom textiles. Hand-spun using the softest winter undercoat (Pashm) of Changthangi mountain goats in Ladakh, and handwoven in Srinagar using the mythical "Kani" wooden stick-eyetip method. Departs the factory with unique hand-numbered tags referencing the local weaving workshop, and contains intricate patterns reflecting classical Kashmir chinars.',
    price: 950,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Natural Sand Dune', hex: '#D7BF9D' },
      { name: 'Burgundy Crimson', hex: '#5A1F26' },
      { name: 'Imperial Amber Gold', hex: '#CCA43B' }
    ],
    sizes: ['200cm × 100cm Standard'],
    stock: 4,
    rating: 5.0,
    numReviews: 18,
    featured: true,
    bestSeller: true,
    details: [
      '100% authenticated hand-spun Changthangi mountain Pashmina cashmere',
      'Woven by hand on traditional wooden handlooms in Srinagar (Kashmir)',
      'Sublime featherlight profile (weighs only 140 grams total)',
      'Unbelievably soft touch with deep insulating warmth properties',
      'Delivered inside a custom-carved sandalwood preservation chest'
    ],
    reviews: [
      {
        id: 'rev-05',
        userName: 'Priya N.',
        rating: 5,
        date: 'June 02, 2026',
        comment: 'An absolute dream. It passes through a wedding ring effortlessly! The handwoven intricate border took my breath away. A masterpiece.',
        avatarUrl: 'https://images.unsplash.com/photo-1590548784585-645d2b674831?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'banarasi-silk-05',
    name: 'Varanasi Brocade Silk Robe',
    tagline: 'Pure mulberry silk woven with deep 24k gold zari threads.',
    description: 'A luxurious comfort piece woven inside handloom rows of Varanasi. Handcrafted with fine mulberry silk and finished with continuous gold brocade threads called zari, showcasing elegant traditional Mughalgarden floral bootis. Features deep side pockets, a matching gold-trimmed belt wrap, and double-sided silk lining for deep soothing relaxation.',
    price: 680,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Royal Peacock Sabyas', hex: '#004F53' },
      { name: 'Kinnari Crimson', hex: '#9C2535' },
      { name: 'Golden Marigold Shanti', hex: '#DB9E24' }
    ],
    sizes: ['Free Size (S-M)', 'Free Size (L-XL)'],
    stock: 8,
    rating: 4.9,
    numReviews: 29,
    featured: false,
    bestSeller: true,
    details: [
      '100% fine hand-selected Mulberry Silk warp',
      'Intricate master zari threads wrapped in pure silver and plated with 24k gold',
      'Includes premium heavy silk waist tie chord and satin back stitching',
      'Extremely smooth skin touch with rich royal sheen properties',
      'Meticulously handmade; professional dry clean only'
    ],
    reviews: [
      {
        id: 'rev-06',
        userName: 'Meera V.',
        rating: 5,
        date: 'May 08, 2026',
        comment: 'The gold thread shimmer is majestic, and the mulberry silk is of an elite grade. Wearing it feels like stepping back into royalty.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'copper-urli-06',
    name: 'Hand-Beaten Deep Copper Urli',
    tagline: 'Traditional heavy-gauge pure copper flower float bowl.',
    description: 'Bring a deep sense of stillness to your vestibule. Hand-hammered from pristine, extra-heavy pure copper sheets by coppersmiths in Rajasthan. Used traditionally to float sweet water jasmine flower heads and burning butter diyas at your entranceway. Features master sand-finished heavy-cast brass handles securely riveted into the bowl body.',
    price: 110,
    category: 'objects',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Hammered Copper Red', hex: '#C26343' },
      { name: 'Antique Fire Patina', hex: '#4A322C' }
    ],
    sizes: ['30cm Diameter', '45cm Grand Imperial'],
    stock: 24,
    rating: 4.8,
    numReviews: 53,
    featured: true,
    bestSeller: false,
    details: [
      'Diameter: 30cm or 45cm × Height: 12cm',
      'Milled from 100% pure premium thick electrical-grade copper sheeting',
      'Sand-cast solid brass handles with classic brass floral reinforcing rivets',
      'Polished manually with organic tamarind paste and left raw',
      'Cleans easily using local lemon pulp or copper tarnish solutions'
    ],
    reviews: [
      {
        id: 'rev-07',
        userName: 'Abhishek Y.',
        rating: 5,
        date: 'March 27, 2026',
        comment: 'This is incredibly substantial and beautifully beaten. The reflections under overhead focus lights are magical. We float rose petals and candles.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'blue-pottery-07',
    name: 'Jaipur Cobal Floral Blue Pottery Vase',
    tagline: 'Classic floral clay-slip glaze, hand-painted in Jaipur studios.',
    description: 'A striking showcase of legendary Jaipur ceramic craft. Unlike typical pots, this is constructed without clay from special mixtures of ground quartz, glass powders, and fullers earth. Hand-painted with deep cobalt oxide botanical graphics and sealed in high-heat glass melts, leaving a gorgeous, glossy semi-translucent deep-blue facade.',
    price: 95,
    category: 'objects',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Jaipur Cobalt Blue', hex: '#0B2C7A' },
      { name: 'Turquoise Lotus White', hex: '#2CC9C0' }
    ],
    sizes: ['Single Medium Vase', 'Matched Sovereign Pair'],
    stock: 14,
    rating: 4.8,
    numReviews: 22,
    featured: false,
    bestSeller: true,
    details: [
      'Height: 28cm × Width: 14cm (Single Vase)',
      'Traditional quartz-glass paste mixture glazed at intense kiln levels',
      'Exquisite traditional hand-painted floral chintz design elements',
      '100% water-proof internally with a felted soft baseline grid protector',
      'Arrives cushioned inside a customized hand-woven cane box'
    ],
    reviews: []
  },
  {
    id: 'brass-kulhar-08',
    name: 'The Royal Brass Kulhar Set',
    tagline: 'Insulated double-walled solid brass cups for ginger chai rituals.',
    description: 'Inspired by the warm heritage of terracotta tea kulhars used at Indian railway platforms, re-imagined as an elite luxury coffee & tea service. Features a double-walled solid brass insulating construct that retains heat perfectly while remaining cold to the touch. Finished with an organic diamond pattern grip and smooth, mirror-polished clean brass interiors.',
    price: 85,
    category: 'objects',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Mirror Solid Brass', hex: '#DBB957' },
      { name: 'Brushed Charcoal Ochre', hex: '#5E523A' }
    ],
    sizes: ['Set of 2 (180ml)', 'Set of 4 (180ml)'],
    stock: 30,
    rating: 4.8,
    numReviews: 12,
    featured: false,
    bestSeller: false,
    details: [
      'Height: 8.5cm × Lip Diameter: 6.8cm (Capacity: 180ml each)',
      'Constructed with surgical-grade interior alloys and high-purity brass outer jackets',
      'Double-walled vacuum protection ensures heat stays trapped inside',
      'Classic diamond knurled texture provides an exceptionally secure hand grip',
      'BPA, lead, and chemical coating free'
    ],
    reviews: []
  }
];
