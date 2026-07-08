import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Check, Heart, Minus, Plus, Ruler, Maximize2 } from 'lucide-react';
import type { Product, ProductSize, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Reviews } from '../components/Reviews';
import { SizeGuide } from '../components/SizeGuide';
import { RelatedProducts } from '../components/RelatedProducts';
import { trackView } from '../components/RecentlyViewed';
import { ImageLightbox } from '../components/ImageLightbox';

interface ProductDetailPageProps {
  product: Product;
  products: Product[];
  onNavigate: (page: string, product?: Product) => void;
}

const COLOR_MAP: Record<ProductColor, string> = {
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

export function ProductDetailPage({ product, products, onNavigate }: ProductDetailPageProps) {
  const { addItem } = useCart();
  const { openLoginModal, user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const { addToast } = useToast();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const wishlisted = isWishlisted(product.id);

  useEffect(() => { trackView(product); }, [product]);

  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!user) { openLoginModal('Complete Your Purchase', 'Sign in to add items to your cart'); return; }
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    addToast(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (!user) { openLoginModal('Unlock Your Wishlist', 'Save your favorite items by signing in'); return; }
    const nowWishlisted = !wishlisted;
    toggle(product);
    addToast(nowWishlisted ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`, nowWishlisted ? 'success' : 'info');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => onNavigate('shop')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <button onClick={() => setShowLightbox(true)} className="aspect-[4/5] bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg flex items-center justify-center relative group cursor-zoom-in">
          <ShoppingBag className="w-24 h-24 text-gold-300 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </div>
        </button>

        <div>
          <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>
          <p className="text-2xl font-bold text-gold-700 mb-4">₹{product.price.toFixed(2)}</p>

          <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-5 ${
            inStock ? (product.stock <= 10 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700') : 'bg-red-50 text-red-700'
          }`}>
            {inStock ? (product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock') : 'Out of Stock'}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-700">Size</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-0.5">
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                      selectedSize === size ? 'bg-gold-600 text-white border-gold-600' : 'border-gold-200 text-gray-700 hover:border-gold-500'
                    }`}>{size}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${COLOR_MAP[color]} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gold-500' : ''}`} title={color} />
                    <span className="text-sm text-gray-600">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1.5 rounded border border-gold-200 text-gray-600 hover:bg-gold-50"><Minus className="w-4 h-4" /></button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-1.5 rounded border border-gold-200 text-gray-600 hover:bg-gold-50"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded font-semibold transition-all text-sm ${
                added ? 'bg-green-600 text-white' : inStock ? 'bg-gold-600 text-white hover:bg-gold-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {added ? <><Check className="w-5 h-5" /> Added to Cart</> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button onClick={handleWishlist}
              className={`p-3 rounded border transition-colors ${
                wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gold-200 text-gray-500 hover:text-red-500 hover:border-red-300'
              }`}>
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gold-100">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div><span className="font-medium text-gray-700">Category:</span> {product.category}</div>
              <div><span className="font-medium text-gray-700">Stock:</span> {product.stock} units</div>
              <div><span className="font-medium text-gray-700">Created:</span> {new Date(product.createdAt).toLocaleDateString()}</div>
              <div><span className="font-medium text-gray-700">Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts current={product} products={products} onProductClick={(p) => onNavigate('product', p)} />
      <Reviews productId={product.id} />
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
      {showLightbox && <ImageLightbox onClose={() => setShowLightbox(false)} />}
    </div>
  );
}
