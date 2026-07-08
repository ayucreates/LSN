import { useMemo, type ReactNode } from 'react';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { AdminPreview } from '../components/AdminPreview';

interface ShopPageProps {
  products: Product[];
  loading: boolean;
  onProductClick: (product: Product) => void;
  skeleton: ReactNode;
  sortBy: string;
}

export function ShopPage({ products, loading, onProductClick, skeleton, sortBy }: ShopPageProps) {
  const { isAdmin } = useAuth();

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default: return sorted;
    }
  }, [products, sortBy]);

  return (
    <div>
      {isAdmin && <div className="mb-6"><AdminPreview /></div>}

      <div className="py-8">

        <div className="px-4 sm:px-8 lg:px-12">
          {loading ? skeleton : sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sortedProducts.map((product) => <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
