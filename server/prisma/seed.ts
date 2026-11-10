import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedVariantInput {
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  color: string;
  colorHex: string;
  price?: number;
  stock: number;
  imageUrl: string;
}

interface SeedProductInput {
  name: string;
  slug: string;
  description: string;
  sizingNotes: string;
  category: 'Outerwear' | 'Tailored Knitwear' | 'Structured Leather' | 'Footwear';
  basePrice: number;
  featured: boolean;
  images: string[];
  variants: SeedVariantInput[];
}

const CATALOG_PRODUCTS: SeedProductInput[] = [
  {
    name: 'Monolith Double-Faced Cashmere Overcoat',
    slug: 'monolith-double-faced-cashmere-overcoat',
    description:
      'Hand-finished in our Milanese atelier from 620gsm double-faced Inner Mongolian cashmere. Cut with an elongated, architectural shoulder line, concealed horn button placket, and raw-edge artisanal pick stitching for weightless warmth and monolithic drape.',
    sizingNotes:
      'Engineered with an intentional dropped shoulder and structured silhouette. Take your usual size for an editorial drape, or size down for a closer fit.',
    category: 'Outerwear',
    basePrice: 1850,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-OW-001-OBS-XS',
        size: 'XS',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-OBS-S',
        size: 'S',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-OBS-XL',
        size: 'XL',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 0,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-STN-S',
        size: 'S',
        color: 'Travertine Stone',
        colorHex: '#C5BEB4',
        price: 1920,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-STN-M',
        size: 'M',
        color: 'Travertine Stone',
        colorHex: '#C5BEB4',
        price: 1920,
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-001-STN-L',
        size: 'L',
        color: 'Travertine Stone',
        colorHex: '#C5BEB4',
        price: 1920,
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Brutalist Technical Gabardine Trench',
    slug: 'brutalist-technical-gabardine-trench',
    description:
      'Constructed from high-density water-repellent Japanese cotton-nylon gabardine. Features an exaggerated storm flap, matte anodized gunmetal D-rings, and an internal modular waist cinch for sculptural volume control.',
    sizingNotes:
      'Relaxed storm-ready cut designed to layer effortlessly over tailored suiting or heavy gauge knitwear.',
    category: 'Outerwear',
    basePrice: 1290,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-OW-002-SLT-XS',
        size: 'XS',
        color: 'Anthracite Slate',
        colorHex: '#2C2D30',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-002-SLT-S',
        size: 'S',
        color: 'Anthracite Slate',
        colorHex: '#2C2D30',
        stock: 11,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-002-SLT-M',
        size: 'M',
        color: 'Anthracite Slate',
        colorHex: '#2C2D30',
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-002-SLT-L',
        size: 'L',
        color: 'Anthracite Slate',
        colorHex: '#2C2D30',
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-002-ALB-M',
        size: 'M',
        color: 'Alabaster Bone',
        colorHex: '#EAE6DF',
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-002-ALB-L',
        size: 'L',
        color: 'Alabaster Bone',
        colorHex: '#EAE6DF',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Architectural Ribbed Merino Mockneck',
    slug: 'architectural-ribbed-merino-mockneck',
    description:
      'Knitted on 5-gauge flatbed machines using extra-fine 17.5-micron ZQ-certified New Zealand merino wool. Engineered with directional saddle shoulders and high-tension structural ribbing that molds cleanly to the torso.',
    sizingNotes:
      'Precision sculptural knit fit. True to size with natural high-recovery elasticity.',
    category: 'Tailored Knitwear',
    basePrice: 540,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-TK-003-OBS-XS',
        size: 'XS',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-OBS-S',
        size: 'S',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-ALB-S',
        size: 'S',
        color: 'Alabaster',
        colorHex: '#F2EFE9',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-ALB-M',
        size: 'M',
        color: 'Alabaster',
        colorHex: '#F2EFE9',
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-003-ALB-XL',
        size: 'XL',
        color: 'Alabaster',
        colorHex: '#F2EFE9',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Deconstructed Cashmere-Silk Cardigan Jacket',
    slug: 'deconstructed-cashmere-silk-cardigan-jacket',
    description:
      'Bridging tailored suiting and fine knitwear, this unlined cardigan jacket blends 70% combed cashmere with 30% mulberry silk. Finished with architectural patch pockets, smoked mother-of-pearl closures, and clean tubular cuffs.',
    sizingNotes:
      'Boxy, slightly cropped architectural proportion. Designed to sit cleanly at the hip bone.',
    category: 'Tailored Knitwear',
    basePrice: 780,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-TK-004-GRY-XS',
        size: 'XS',
        color: 'Warm Pewter',
        colorHex: '#737373',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-004-GRY-S',
        size: 'S',
        color: 'Warm Pewter',
        colorHex: '#737373',
        stock: 11,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-004-GRY-M',
        size: 'M',
        color: 'Warm Pewter',
        colorHex: '#737373',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-004-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-TK-004-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Vanguard Geometric Box Calfskin Weekender',
    slug: 'vanguard-geometric-box-calfskin-weekender',
    description:
      'Hand-crafted in Florence from full-grain vegetable-tanned French box calfskin. Features folded origami gussets, hand-painted lacquered edges, solid brushed-brass hardware, and a suede-lined interior laptop compartment.',
    sizingNotes:
      'Dimensions: 50cm W × 32cm H × 22cm D. Cabin-approved dimensions across all international carriers. Sized in S (Compact Day), M (Standard Weekender), and L (Extended Grand Tour).',
    category: 'Structured Leather',
    basePrice: 1450,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-SL-005-OBS-S',
        size: 'S',
        color: 'Obsidian Calf',
        colorHex: '#0B0B0B',
        price: 1350,
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-005-OBS-M',
        size: 'M',
        color: 'Obsidian Calf',
        colorHex: '#0B0B0B',
        price: 1450,
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-005-OBS-L',
        size: 'L',
        color: 'Obsidian Calf',
        colorHex: '#0B0B0B',
        price: 1620,
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-005-BRZ-M',
        size: 'M',
        color: 'Burnished Umber',
        colorHex: '#4A3728',
        price: 1490,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Trapezoid Architectural Bridle Tote',
    slug: 'trapezoid-architectural-bridle-tote',
    description:
      'Sculpted from rigid 3.2mm Italian bridle leather that stands unaided like an architectural vessel. Minimalist blind-embossed Atelier Vanguard insignia, magnetic gusset closure, and detachable internal zip pouch.',
    sizingNotes:
      'Available in S (Mini Crossbody), M (Editorial Daily Tote), and L (Studio Folio Tote).',
    category: 'Structured Leather',
    basePrice: 960,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-SL-006-OBS-S',
        size: 'S',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        price: 890,
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-006-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        price: 960,
        stock: 11,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-006-GLD-M',
        size: 'M',
        color: 'Brushed Ochre',
        colorHex: '#C5A46D',
        price: 990,
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-SL-006-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        price: 1080,
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Monolithic Goodyear-Welted Combat Boot',
    slug: 'monolithic-goodyear-welted-combat-boot',
    description:
      'Constructed on our signature squared-chisel last using waxed horsehide leather and a custom 45mm cantilevered Vibram commando lug sole. Features concealed medial YKK Excella zips and full storm-welt construction.',
    sizingNotes:
      'Footwear mapped to international letter sizing: XS (EU 38-39), S (EU 40), M (EU 41-42), L (EU 43), XL (EU 44-45).',
    category: 'Footwear',
    basePrice: 890,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-FW-007-OBS-XS',
        size: 'XS',
        color: 'Matte Obsidian',
        colorHex: '#0B0B0B',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-007-OBS-S',
        size: 'S',
        color: 'Matte Obsidian',
        colorHex: '#0B0B0B',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-007-OBS-M',
        size: 'M',
        color: 'Matte Obsidian',
        colorHex: '#0B0B0B',
        stock: 13,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-007-OBS-L',
        size: 'L',
        color: 'Matte Obsidian',
        colorHex: '#0B0B0B',
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-007-OBS-XL',
        size: 'XL',
        color: 'Matte Obsidian',
        colorHex: '#0B0B0B',
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Square-Toe Architectural Mule Loafer',
    slug: 'square-toe-architectural-mule-loafer',
    description:
      'Minimalist whole-cut vamp crafted from supple aniline lambskin with a collapsible heel counter for convertible styling. Set upon a stacked bevelled leather sole with brushed brass toe taps.',
    sizingNotes:
      'Mapped to XS (EU 38-39), S (EU 40), M (EU 41-42), L (EU 43), XL (EU 44-45). Supple leather molds to the foot after two wears.',
    category: 'Footwear',
    basePrice: 670,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-FW-008-OBS-S',
        size: 'S',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-008-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-008-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-008-ALB-S',
        size: 'S',
        color: 'Chalk Alabaster',
        colorHex: '#F9F9F8',
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-FW-008-ALB-M',
        size: 'M',
        color: 'Chalk Alabaster',
        colorHex: '#F9F9F8',
        stock: 0,
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
  {
    name: 'Sculpted Virgin Wool Cropped Blazer',
    slug: 'sculpted-virgin-wool-cropped-blazer',
    description:
      'Tailored from high-twist Super 140s virgin wool barathea with internal horsehair canvas chest structure. Features peak lapels, a concealed single-button closure, and surgical-grade precision darts.',
    sizingNotes:
      'Cropped waist-length silhouette with sharp, padded architectural shoulders. True to size.',
    category: 'Outerwear',
    basePrice: 1120,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
    ],
    variants: [
      {
        sku: 'AV-OW-009-OBS-XS',
        size: 'XS',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-009-OBS-S',
        size: 'S',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-009-OBS-M',
        size: 'M',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      },
      {
        sku: 'AV-OW-009-OBS-L',
        size: 'L',
        color: 'Obsidian',
        colorHex: '#0B0B0B',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  },
];

async function main(): Promise<void> {
  console.log('🌱 Initiating Atelier Vanguard luxury database seed...');

  // Clean existing tables in safe dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users (Admin & Customer)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const clientPasswordHash = await bcrypt.hash('Client123!', 12);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Søren Lindqvist (Creative Director)',
      email: 'admin@ateliervanguard.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: 'Clara Vance',
      email: 'client@ateliervanguard.com',
      passwordHash: clientPasswordHash,
      role: 'CUSTOMER',
    },
  });

  console.log(`✅ Created users: ${adminUser.email} (ADMIN) & ${clientUser.email} (CUSTOMER)`);

  // 2. Seed Products & Variants
  const createdProducts = [];
  for (const item of CATALOG_PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        sizingNotes: item.sizingNotes,
        category: item.category,
        basePrice: item.basePrice,
        featured: item.featured,
        images: JSON.stringify(item.images),
        variants: {
          create: item.variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            price: v.price ?? item.basePrice,
            stock: v.stock,
            imageUrl: v.imageUrl,
          })),
        },
      },
      include: { variants: true },
    });
    createdProducts.push(product);
  }

  console.log(`✅ Seeded ${createdProducts.length} luxury products with ${createdProducts.reduce((acc, p) => acc + p.variants.length, 0)} total SKU variants.`);

  // 3. Seed Promo Codes (active & expired)
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 2);

  const pastDate = new Date('2024-01-01T00:00:00.000Z');

  await prisma.promoCode.createMany({
    data: [
      {
        code: 'VANGUARD10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minCartSpend: 150,
        expiresAt: futureDate,
        isActive: true,
      },
      {
        code: 'ATELIER50',
        discountType: 'FIXED',
        discountValue: 50,
        minCartSpend: 350,
        expiresAt: futureDate,
        isActive: true,
      },
      {
        code: 'ARCHIVE20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minCartSpend: 1000,
        expiresAt: futureDate,
        isActive: true,
      },
      {
        code: 'EXPIRED25',
        discountType: 'PERCENTAGE',
        discountValue: 25,
        minCartSpend: 100,
        expiresAt: pastDate,
        isActive: true,
      },
    ],
  });

  console.log('✅ Seeded Promo Codes: VANGUARD10, ATELIER50, ARCHIVE20, EXPIRED25');

  // 4. Seed initial Wishlist items for Customer
  if (createdProducts[0] && createdProducts[2]) {
    await prisma.wishlistItem.createMany({
      data: [
        { userId: clientUser.id, productId: createdProducts[0].id },
        { userId: clientUser.id, productId: createdProducts[2].id },
      ],
    });
  }

  // 5. Seed baseline Orders for Admin Dashboard visibility
  const firstVariant = createdProducts[0]?.variants[1];
  const thirdVariant = createdProducts[2]?.variants[1];

  if (firstVariant && thirdVariant) {
    await prisma.order.create({
      data: {
        userId: clientUser.id,
        customerName: clientUser.name,
        customerEmail: clientUser.email,
        customerPhone: '+33 1 42 68 55 00',
        shippingAddress: '24 Rue du Faubourg Saint-Honoré',
        shippingCity: 'Paris',
        shippingPostalCode: '75008',
        shippingCountry: 'France',
        paymentMethod: 'CARD •••• 4242',
        subtotal: 2390,
        discountAmount: 239,
        shippingFee: 0,
        finalTotal: 2151,
        promoCodeApplied: 'VANGUARD10',
        status: 'SHIPPED',
        items: {
          create: [
            {
              variantId: firstVariant.id,
              productName: createdProducts[0].name,
              sku: firstVariant.sku,
              size: firstVariant.size,
              color: firstVariant.color,
              unitPrice: firstVariant.price ?? createdProducts[0].basePrice,
              quantity: 1,
              imageUrl: firstVariant.imageUrl,
            },
            {
              variantId: thirdVariant.id,
              productName: createdProducts[2].name,
              sku: thirdVariant.sku,
              size: thirdVariant.size,
              color: thirdVariant.color,
              unitPrice: thirdVariant.price ?? createdProducts[2].basePrice,
              quantity: 1,
              imageUrl: thirdVariant.imageUrl,
            },
          ],
        },
      },
    });
  }

  console.log('✨ Atelier Vanguard seed completed with zero errors.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
