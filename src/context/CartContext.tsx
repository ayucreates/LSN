import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Product, ProductSize, ProductColor } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  checkoutStatus: 'idle' | 'processing' | 'success' | 'error';
  checkoutError: string | null;
  isGuest: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: Product,
    quantity: number,
    size: ProductSize,
    color: ProductColor,
  ) => void;
  removeItem: (productId: string, size: ProductSize, color: ProductColor) => void;
  updateQuantity: (
    productId: string,
    size: ProductSize,
    color: ProductColor,
    quantity: number,
  ) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | {
      type: 'REMOVE_ITEM';
      payload: { productId: string; size: ProductSize; color: ProductColor };
    }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; size: ProductSize; color: ProductColor; quantity: number };
    }
  | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (i) =>
          i.product.id === action.payload.product.id &&
          i.selectedSize === action.payload.selectedSize &&
          i.selectedColor === action.payload.selectedColor,
      );
      if (existing) {
        return state.map((i) =>
          i.product.id === existing.product.id &&
          i.selectedSize === existing.selectedSize &&
          i.selectedColor === existing.selectedColor
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i,
        );
      }
      return [...state, action.payload];
    }
    case 'REMOVE_ITEM':
      return state.filter(
        (i) =>
          !(
            i.product.id === action.payload.productId &&
            i.selectedSize === action.payload.size &&
            i.selectedColor === action.payload.color
          ),
      );
    case 'UPDATE_QUANTITY':
      return state.map((i) =>
        i.product.id === action.payload.productId &&
        i.selectedSize === action.payload.size &&
        i.selectedColor === action.payload.color
          ? { ...i, quantity: action.payload.quantity }
          : i,
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const { user, openLoginModal } = useAuth();
  const { addToast } = useToast();

  const isGuest = !user;

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, quantity: number, size: ProductSize, color: ProductColor) => {
      if (!user) {
        openLoginModal('Complete Your Purchase', 'Sign in to add items to your cart');
        return;
      }
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedSize: size, selectedColor: color } });
      setIsOpen(true);
      addToast(`${product.name} added to cart!`);
    },
    [user, openLoginModal, addToast],
  );

  const removeItem = useCallback(
    (productId: string, size: ProductSize, color: ProductColor) => {
      dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });
    },
    [],
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      size: ProductSize,
      color: ProductColor,
      quantity: number,
    ) => {
      if (quantity <= 0) {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, color } });
        return;
      }
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, color, quantity } });
    },
    [],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const checkout = useCallback(async () => {
    if (!user) {
      openLoginModal('Complete Your Purchase', 'Sign in to proceed with checkout');
      return;
    }
    setCheckoutStatus('processing');
    setCheckoutError(null);
    try {
      const res = await api.createOrder(user.id, items);
      if (res.success) {
        setCheckoutStatus('success');
        dispatch({ type: 'CLEAR' });
        addToast('Order placed successfully!');
      } else {
        setCheckoutStatus('error');
        setCheckoutError(res.error);
      }
    } catch {
      setCheckoutStatus('error');
      setCheckoutError('An unexpected error occurred during checkout.');
    }
  }, [user, items, openLoginModal]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        checkoutStatus,
        checkoutError,
        isGuest,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
