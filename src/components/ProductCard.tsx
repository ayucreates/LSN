import { useState } from 'react';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import type { Product, ProductSize, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const SIZE_MAP: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COLOR_MAP: ProductColor[] = ['Red', 'Blue', 'Black', 'White', 'Green', 'Pink', 'Yellow', 'Navy', 'Maroon', 'Multicolor'];

function ColorDot({ color, selected }: { color: ProductColor; selected: boolean }) {
  const colorMap: Record<ProductColor, string> = {
    Red: 'bg-red-500',
    Blue: 'bg-blue-600',
    Black: 'bg-gray-900',
    White: 'bg-white border border-gray-300',
    Green: 'bg-green-500',
    Pink: 'bg-pink-400',
    Yellow: 'bg-yellow-400',
    Navy: 'bg-blue-900',
    Maroon: 'bg-red-800',
    Multicolor: 'bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400',
  };
  return (
    <div className={`w-5 h-5 rounded-full ${colorMap[color]} ${selected ? 'ring-2 ring-offset-1 ring-gold-500' : ''} cursor-pointer`} title={color} />
  );
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem, isGuest } = useCart();
  const { user, openLoginModal } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAdd = () => {
    const size = selectedSize ?? product.sizes[0];
    const color = selectedColor ?? product.colors[0];
    addItem(product, 1, size, color);
    if (!isGuest) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gold-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <button onClick={onClick} className="w-full text-left">
        <div className="aspect-[1/1] bg-gradient-to-br from-gold-50 to-gold-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-20 h-20 text-gold-300 group-hover:scale-110 transition-transform duration-300" />
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm tracking-wider">OUT OF STOCK</span>
            </div>
          )}
          {lowStock && inStock && (
            <div className="absolute top-2.5 left-2.5 bg-gold-500 text-white text-xs font-medium px-2.5 py-1 rounded">Only {product.stock} left</div>
          )}
          <button onClick={(e) => { e.stopPropagation(); if (!user) { openLoginModal('Unlock Your Wishlist', 'Save your favorite items by signing in'); return; } toggle(product); }} className="absolute top-2.5 right-2.5 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`} />
          </button>
        </div>
      </button>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <span className="text-[10px] sm:text-xs font-medium text-gold-600 uppercase tracking-wider mb-1">{product.category}</span>
        <button onClick={onClick} className="text-left">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug truncate hover:text-gold-700 transition-colors">{product.name}</h3>
        </button>

        <div className="flex items-center gap-2 mt-2 mb-2 sm:mt-2.5 sm:mb-3">
          <span className="text-sm sm:text-base font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          {lowStock && inStock && <span className="text-[10px] sm:text-xs text-amber-600 font-medium">Low stock</span>}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <select value={selectedSize || ''} onChange={(e) => setSelectedSize(e.target.value as ProductSize)}
            className="text-xs border border-gold-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white flex-1">
            <option value="" disabled>Size</option>
            {SIZE_MAP.filter((s) => product.sizes.includes(s)).map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <div className="flex gap-1.5">
            {COLOR_MAP.filter((c) => product.colors.includes(c)).slice(0, 3).map((color) => (
              <button key={color} onClick={() => setSelectedColor(color)}>
                <ColorDot color={color} selected={selectedColor === color} />
              </button>
            ))}
          </div>
          <button onClick={handleAdd} disabled={!inStock}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
              added ? 'bg-green-600 text-white'
                : inStock ? 'bg-gold-600 text-white hover:bg-gold-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {added ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
