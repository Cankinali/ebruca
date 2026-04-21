import { Product, Category, Review } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Elbise',
    slug: 'elbise',
    image: '/uploads/cat-elbise.jpg',
    objectPosition: 'center 30%',
    productCount: 48,
  },
  {
    id: '2',
    name: 'Takım',
    slug: 'takim',
    image: '/uploads/cat-takim.jpg',
    objectPosition: 'center 15%',
    productCount: 32,
    subcategories: [
      { id: '2a', name: 'Etekli Takım', slug: 'etekli-takim' },
      { id: '2b', name: 'Pantolonlu Takım', slug: 'pantolonlu-takim' },
    ],
  },
  {
    id: '3',
    name: 'Alt Giyim',
    slug: 'alt-giyim',
    image: '/uploads/cat-alt-giyim.jpg',
    objectPosition: 'center 40%',
    productCount: 56,
    subcategories: [
      { id: '3a', name: 'Etek', slug: 'etek' },
      { id: '3b', name: 'Pantolon', slug: 'pantolon' },
    ],
  },
  {
    id: '4',
    name: 'Üst Giyim',
    slug: 'ust-giyim',
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=80',
    productCount: 64,
  },
  {
    id: '5',
    name: 'Dış Giyim',
    slug: 'dis-giyim',
    image: '/uploads/cat-dis-giyim.jpg',
    objectPosition: 'center 20%',
    productCount: 28,
  },
  {
    id: '6',
    name: 'Abiye',
    slug: 'abiye',
    image: '/uploads/cat-abiye.jpg',
    objectPosition: 'center 35%',
    productCount: 40,
  },
  {
    id: '7',
    name: 'Şal & Kemer',
    slug: 'sal-kemer',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
    productCount: 22,
  },
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'siyah-midi-elbise',
    name: 'Siyah Midi Elbise',
    brand: 'Ebruca',
    code: 'EBR-001',
    price: 1290,
    originalPrice: 1590,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    ],
    category: 'elbise',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Siyah'],
    description: 'Şık ve zarif siyah midi elbise. Her ortama uygun, modern kesim. Kaliteli kumaşıyla tüm gün konfor sağlar.',
    measurements: 'Boy: 110 cm | Göğüs: S/36 cm',
    stock: 'in_stock',
    isNew: true,
    isBestseller: true,
    tags: ['yeni sezon', 'trend'],
  },
  {
    id: '2',
    slug: 'ekru-blazer-takim',
    name: 'Ekru Blazer Takım',
    brand: 'Ebruca',
    code: 'EBR-002',
    price: 2450,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=800&q=80',
      'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=800&q=80',
    ],
    category: 'takim',
    subcategory: 'pantolonlu-takim',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ekru', 'Siyah'],
    description: 'Profesyonel görünüm için tasarlanmış ekru blazer takım. İş ve özel davetler için ideal.',
    measurements: 'Ceket boy: 70 cm | Pantolon boy: 100 cm',
    stock: 'in_stock',
    isNew: true,
    tags: ['ofis', 'şık'],
  },
  {
    id: '3',
    slug: 'bordo-midi-etek',
    name: 'Bordo Midi Etek',
    brand: 'Ebruca',
    code: 'EBR-003',
    price: 890,
    originalPrice: 1090,
    images: [
      'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=800&q=80',
    ],
    category: 'alt-giyim',
    subcategory: 'etek',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Bordo', 'Siyah', 'Haki'],
    description: 'Akıcı kumaşıyla şık midi etek. Günlük ve özel günler için uyumlu tasarım.',
    measurements: 'Boy: 80 cm',
    stock: 'low_stock',
    isBestseller: true,
  },
  {
    id: '4',
    slug: 'beyaz-sifon-bluz',
    name: 'Beyaz Şifon Bluz',
    brand: 'Ebruca',
    code: 'EBR-004',
    price: 590,
    images: [
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80',
    ],
    category: 'ust-giyim',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beyaz', 'Siyah', 'Pudra'],
    description: 'Hafif şifon kumaşıyla nefes aldıran bluz. Hem günlük hem özel günler için.',
    stock: 'in_stock',
    isNew: true,
  },
  {
    id: '5',
    slug: 'siyah-kaban',
    name: 'Siyah Yün Kaban',
    brand: 'Ebruca',
    code: 'EBR-005',
    price: 3290,
    originalPrice: 3990,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    ],
    category: 'dis-giyim',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Siyah', 'Camel'],
    description: 'Premium yün karışımlı kaban. Soğuk havalarda şıklıktan ödün vermeden ısının.',
    stock: 'in_stock',
    isBestseller: true,
    tags: ['kış', 'premium'],
  },
  {
    id: '6',
    slug: 'lacivert-abiye',
    name: 'Lacivert Uzun Abiye',
    brand: 'Ebruca',
    code: 'EBR-006',
    price: 2890,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    ],
    category: 'abiye',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Lacivert', 'Bordo', 'Yeşil'],
    description: 'Özel geceler için tasarlanmış uzun abiye. Zarif kesimi ve kaliteli kumaşıyla dikkat çekin.',
    measurements: 'Boy: 155 cm',
    stock: 'in_stock',
    isFeatured: true,
  },
  {
    id: '7',
    slug: 'camel-sal',
    name: 'Camel Kaşmir Şal',
    brand: 'Ebruca',
    code: 'EBR-007',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    ],
    category: 'sal-kemer',
    sizes: ['Standart'],
    colors: ['Camel', 'Siyah', 'Gri'],
    description: 'Yumuşak kaşmir dokunuşlu şal. Her kombine uyum sağlar.',
    stock: 'in_stock',
    isBestseller: true,
  },
  {
    id: '8',
    slug: 'pembe-midi-elbise',
    name: 'Pembe Çiçekli Midi Elbise',
    brand: 'Ebruca',
    code: 'EBR-008',
    price: 1190,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    ],
    category: 'elbise',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pembe', 'Mavi'],
    description: 'Çiçek desenli midi elbise. Bahar ve yaz mevsimi için ideal.',
    stock: 'in_stock',
    isNew: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Ayşe K.',
    rating: 5,
    comment: 'Ürün kalitesi gerçekten harika! Kumaşı çok kaliteli ve kargo çok hızlıydı. Kesinlikle tekrar sipariş vereceğim.',
    date: '2024-12-15',
    product: 'Siyah Midi Elbise',
  },
  {
    id: '2',
    name: 'Fatma D.',
    rating: 5,
    comment: 'Blazer takımı aldım, tam beden geldi. Kalıbı mükemmel, ofiste çok şık görünüyorum. Tavsiye ederim!',
    date: '2024-12-10',
    product: 'Ekru Blazer Takım',
  },
  {
    id: '3',
    name: 'Zeynep A.',
    rating: 4,
    comment: 'Şalın kumaşı çok yumuşak ve sıcak tutuyor. Rengi de fotoğraftaki gibi. Çok memnun kaldım.',
    date: '2024-12-05',
    product: 'Camel Kaşmir Şal',
  },
  {
    id: '4',
    name: 'Merve S.',
    rating: 5,
    comment: 'Abiye için uzun süre aradım, sonunda doğru yeri buldum! Çok şık ve kaliteli. Kargolama da süper hızlıydı.',
    date: '2024-11-28',
    product: 'Lacivert Uzun Abiye',
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category || p.subcategory === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured || p.isNew).slice(0, 8);
}

export function getBestsellers(): Product[] {
  return products.filter(p => p.isBestseller).slice(0, 8);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
