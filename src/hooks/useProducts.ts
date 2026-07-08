import { useState, useEffect } from 'react';
import type { Product, FilterState } from '../types';
import { api } from '../services/api';

export function useProducts(filters: FilterState) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await api.fetchProducts({
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        priceRange: filters.priceRange,
        searchQuery: filters.searchQuery || undefined,
      });
      if (cancelled) return;
      if (res.success) {
        setProducts(res.data);
      } else {
        setError(res.error);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [filters]);

  return { products, loading, error };
}
