import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../types';

interface RelatedProductsProps {
  current: Product;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function RelatedProducts({ current, products, onProductClick }: RelatedProductsProps) {
  const related = products.filter((p) => p.category === current.category && p.id !== current.id).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gold-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">More from {current.category}</h2>
          <p className="text-sm text-gray-500 mt-0.5">Discover similar styles you might love</p>
        </div>
        <button className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <button key={product.id} onClick={() => onProductClick(product)} className="group text-left">
            <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow">
              <ShoppingBag className="w-8 h-8 text-gold-300" />
            </div>
            <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider">{product.category}</span>
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gold-700 transition-colors">{product.name}</h3>
            <p className="text-sm font-bold text-gold-700">${product.price.toFixed(2)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
