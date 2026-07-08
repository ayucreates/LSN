import { ShoppingBag, Clock } from 'lucide-react';
import type { Product } from '../types';

const STORAGE_KEY = 'recently_viewed';

function loadViewed(): Product[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveViewed(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.slice(0, 8)));
}

export function trackView(product: Product) {
  const viewed = loadViewed().filter((p) => p.id !== product.id);
  viewed.unshift(product);
  saveViewed(viewed);
}

interface RecentlyViewedProps {
  onProductClick: (product: Product) => void;
}

export function RecentlyViewed({ onProductClick }: RecentlyViewedProps) {
  const viewed = loadViewed().slice(0, 4);
  if (viewed.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gold-500" />
        <h2 className="text-sm font-semibold text-gray-900">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {viewed.map((product) => (
          <button key={product.id} onClick={() => onProductClick(product)} className="group flex items-center gap-3 bg-white rounded-lg border border-gold-200 p-2 hover:shadow-sm transition-shadow text-left">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-50 to-gold-100 rounded flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-gold-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gold-600 font-semibold">${product.price.toFixed(2)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
