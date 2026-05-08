import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Elbise',
    slug: 'elbise',
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272255/ebruca/categories/cat-elbise.jpg',
    objectPosition: 'center 30%',
  },
  {
    id: '2',
    name: 'Takım',
    slug: 'takim',
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272257/ebruca/categories/cat-takim.jpg',
    objectPosition: 'center 15%',
    subcategories: [
      { id: '2a', name: 'Etekli Takım', slug: 'etekli-takim' },
      { id: '2b', name: 'Pantolonlu Takım', slug: 'pantolonlu-takim' },
    ],
  },
  {
    id: '3',
    name: 'Alt Giyim',
    slug: 'alt-giyim',
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272251/ebruca/categories/cat-alt-giyim.jpg',
    objectPosition: 'center 40%',
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
  },
  {
    id: '6',
    name: 'Abiye',
    slug: 'abiye',
    image: 'https://res.cloudinary.com/dgwcd1hnd/image/upload/v1778272249/ebruca/categories/cat-abiye.jpg',
    objectPosition: 'center 35%',
  },
];

// Örnek ürünler kaldırıldı — tüm ürünler veritabanından gelir
export const products: Product[] = [];

export function getProductsByCategory(category: string): Product[] {
  const children: Record<string, string[]> = {
    'alt-giyim': ['etek', 'pantolon'],
    'takim':     ['etekli-takim', 'pantolonlu-takim'],
  };
  const slugs = [category, ...(children[category] ?? [])];
  return products.filter(p => slugs.includes(p.category) || slugs.includes(p.subcategory ?? ''));
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return [];
}

export function getBestsellers(): Product[] {
  return [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
