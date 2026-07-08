import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { ProductSize, ProductColor } from '../types';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const { user, openLoginModal } = useAuth();

  const handleAdd = (product: any) => {
    if (!user) { openLoginModal(); return; }
    addItem(product, 1, product.sizes[0] as ProductSize, product.colors[0] as ProductColor);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => onNavigate('shop')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" /> My Wishlist
          </h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gold-200 p-12 text-center text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <p className="text-sm mt-1">Save items you love to find them easily later</p>
          <button onClick={() => onNavigate('shop')} className="mt-4 bg-gold-600 text-white font-semibold px-5 py-2 rounded hover:bg-gold-700 transition-colors text-sm">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <div key={product.id} className="group bg-white rounded-lg border border-gold-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => onNavigate('product')} className="w-full text-left">
                <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gold-300" />
                </div>
              </button>
              <div className="p-3">
                <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider">{product.category}</span>
                <h3 className="text-sm font-medium text-gray-900 mt-0.5 truncate">{product.name}</h3>
                <p className="text-sm font-bold text-gold-700 mt-1">₹{product.price.toFixed(2)}</p>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => handleAdd(product)}
                    className="flex-1 text-xs font-medium bg-gold-600 text-white py-1.5 rounded hover:bg-gold-700 transition-colors">
                    Add to Cart
                  </button>
                  <button onClick={() => remove(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
