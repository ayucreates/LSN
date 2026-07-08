import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem, checkoutError } = useCart();
  const { openLoginModal, user } = useAuth();
  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) { openLoginModal(); return; }
    closeCart();
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-500" /> Cart ({items.length})
          </h2>
          <button onClick={closeCart} className="p-1 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <ShoppingBag className="w-12 h-12 text-gold-200" />
            <p className="text-sm font-medium">Your cart is empty</p>
            <button onClick={() => { closeCart(); }} className="text-sm text-gold-600 hover:text-gold-700 font-medium">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 pb-4 border-b border-gold-100 last:border-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-50 to-gold-100 rounded flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-gold-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                    <p className="text-xs text-gray-500">{item.selectedSize} / {item.selectedColor}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="p-0.5 rounded border border-gold-200 text-gray-600 hover:bg-gold-50"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="p-0.5 rounded border border-gold-200 text-gray-600 hover:bg-gold-50"><Plus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gold-200 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-gray-400">Shipping & taxes calculated at checkout</p>
              {checkoutError && <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{checkoutError}</p>}
              <button onClick={handleCheckout} disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-sm font-semibold bg-gold-600 text-white hover:bg-gold-700 transition-all">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
