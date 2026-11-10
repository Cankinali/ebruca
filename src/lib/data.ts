import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Elbise',
    slug: 'elbise',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-elbise-v3.jpg',
    objectPosition: 'center',
  },
  {
    id: '2',
    name: 'Takım',
    slug: 'takim',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-takim-v3.jpg',
    objectPosition: 'center',
    subcategories: [
      { id: '2a', name: 'Etekli Takım', slug: 'etekli-takim' },
      { id: '2b', name: 'Pantolonlu Takım', slug: 'pantolonlu-takim' },
    ],
  },
  {
    id: '3',
    name: 'Alt Giyim',
    slug: 'alt-giyim',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-alt-giyim-v2.jpg',
    objectPosition: 'center 50%',
    subcategories: [
      { id: '3a', name: 'Etek', slug: 'etek' },
      { id: '3b', name: 'Pantolon', slug: 'pantolon' },
    ],
  },
  {
    id: '4',
    name: 'Üst Giyim',
    slug: 'ust-giyim',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-ust-giyim-v3.jpg',
    objectPosition: 'center',
  },
  {
    id: '5',
    name: 'Dış Giyim',
    slug: 'dis-giyim',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-dis-giyim-v3.jpg',
    objectPosition: 'center',
  },
  {
    id: '6',
    name: 'Şal & Eşarp',
    slug: 'sal-esarp',
    image: 'https://cdn.ebruca.com/ebruca/categories/cat-sal-esarp-v3.jpg',
    objectPosition: 'center',
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
