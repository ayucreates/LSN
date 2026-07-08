import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextValue {
  items: Product[];
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
  add: (product: Product) => void;
  remove: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = 'wishlist_items';

function loadWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = useCallback((productId: string) => items.some((i) => i.id === productId), [items]);
  const add = useCallback((product: Product) => setItems((prev) => (prev.some((i) => i.id === product.id) ? prev : [...prev, product])), []);
  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.id !== productId)), []);
  const toggle = useCallback((product: Product) => {
    const exists = items.some((i) => i.id === product.id);
    setItems((prev) => exists ? prev.filter((i) => i.id !== product.id) : [...prev, product]);
    addToast(exists ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`, exists ? 'info' : 'success');
  }, [items, addToast]);
  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, add, remove, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
