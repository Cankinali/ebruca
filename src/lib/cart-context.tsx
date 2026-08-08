'use client';

import {
  createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode,
} from 'react';
import { CartItem, Product } from './types';

const STORAGE_KEY = 'ebruca_sepet';
/** Sepet bu süreden eskiyse temizlenir — fiyat ve stok bayatlamış olabilir. */
const GECERLILIK_GUN = 7;

interface StoredCart {
  items: CartItem[];
  savedAt: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // İlk okuma bitene kadar yazma yapma; aksi halde boş başlangıç değeri
  // kayıtlı sepetin üzerine yazar.
  const yuklendi = useRef(false);

  // Sepeti localStorage'dan geri yükle. Sunucuda çalışmaz, bu yüzden
  // useState başlangıç değerinde değil, effect içinde okunur (hydration uyumu).
  useEffect(() => {
    try {
      const ham = localStorage.getItem(STORAGE_KEY);
      if (ham) {
        const kayit = JSON.parse(ham) as StoredCart;
        const yas = Date.now() - (kayit.savedAt ?? 0);
        if (Array.isArray(kayit.items) && yas < GECERLILIK_GUN * 86_400_000) {
          // localStorage sunucuda okunamaz. useState başlangıç değerinde
          // okursak istemcinin ilk render'ı sunucudan gelen HTML'den farklı
          // olur ve hydration hatası verir. Tek seferlik bu ek render,
          // doğru çözümün bedeli.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(kayit.items);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Bozuk kayıt — sessizce temizle, sepet boş başlasın.
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    yuklendi.current = true;
  }, []);

  // Her değişiklikte kaydet.
  useEffect(() => {
    if (!yuklendi.current) return;
    try {
      if (items.length === 0) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, savedAt: Date.now() }));
    } catch {
      // Kota dolu ya da özel mod — sepet yine bellekte çalışmaya devam eder.
    }
  }, [items]);

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, color, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems(prev =>
      prev.filter(
        i => !(i.product.id === productId && i.size === size && i.color === color)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      setItems(prev =>
        prev.map(i =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
