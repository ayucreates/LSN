import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Truck, CreditCard, CheckCircle, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { ShippingAddress } from '../types';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

type Step = 'address' | 'payment' | 'review' | 'confirm';

const COUPONS: Record<string, { discount: number; label: string; minAmount: number }> = {
  SAROJINI10: { discount: 0.1, label: '10% off', minAmount: 0 },
  FASHION20: { discount: 0.2, label: '20% off', minAmount: 1000 },
};

function formatCard(value: string) {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
}
function formatExpiry(value: string) {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, subtotal, checkout, checkoutStatus, checkoutError, clearCart } = useCart();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState<ShippingAddress>({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const total = subtotal - discount;

  const validate = () => {
    const e: Partial<ShippingAddress> = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!address.phone.trim() || address.phone.length < 10) e.phone = 'Valid phone required';
    if (!address.address.trim()) e.address = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!address.pincode.trim() || address.pincode.length < 6) e.pincode = 'Valid pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError('Enter a coupon code'); return; }
    const coupon = COUPONS[code];
    if (!coupon) { setCouponError('Invalid coupon code'); return; }
    if (subtotal < coupon.minAmount) { setCouponError(`Minimum order ₹${coupon.minAmount} required`); return; }
    setAppliedCoupon({ code, discount: coupon.discount, label: coupon.label });
    setCouponError('');
    addToast(`Coupon "${code}" applied! ${coupon.label}`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  const handlePlaceOrder = async () => {
    await checkout();
    if (checkoutStatus === 'success') {
      setStep('confirm');
      addToast('Order placed successfully!');
    }
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <button onClick={() => onNavigate('shop')} className="mt-4 text-sm text-gold-600 hover:text-gold-700 font-medium">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => {
        if (step === 'address') onNavigate('shop');
        else if (step === 'payment') setStep('address');
        else if (step === 'review') setStep('payment');
      }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center justify-center gap-2 mb-8">
        {(['address', 'payment', 'review'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? 'bg-gold-600 text-white'
                : (['payment', 'review'].includes(step) && ['payment', 'review'].indexOf(step as any) >= i) ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>{i + 1}</div>
            <span className={`text-xs font-medium hidden sm:block ${step === s ? 'text-gold-700' : 'text-gray-400'}`}>
              {s === 'address' ? 'Shipping' : s === 'payment' ? 'Payment' : 'Review'}
            </span>
            {i < 2 && <div className="w-6 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      {step === 'address' && (
        <div className="bg-white rounded-lg border border-gold-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-gold-500" /> Shipping Address</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (validate()) setStep('payment'); }} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className={`w-full border ${errors.name ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
                {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className={`w-full border ${errors.phone ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
                {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <input type="text" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })}
                className={`w-full border ${errors.address ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
              {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={`w-full border ${errors.city ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
                {errors.city && <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className={`w-full border ${errors.state ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
                {errors.state && <p className="text-xs text-red-500 mt-0.5">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pincode</label>
                <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className={`w-full border ${errors.pincode ? 'border-red-400' : 'border-gold-200'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400`} />
                {errors.pincode && <p className="text-xs text-red-500 mt-0.5">{errors.pincode}</p>}
              </div>
            </div>
            <button type="submit" className="bg-gold-600 text-white font-semibold px-6 py-2.5 rounded hover:bg-gold-700 transition-colors text-sm mt-2">
              Continue to Payment
            </button>
          </form>
        </div>
      )}

      {step === 'payment' && (
        <div className="bg-white rounded-lg border border-gold-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gold-500" /> Payment Details</h2>
          <p className="text-xs text-gray-400 mb-4">This is a mock payment form — no real charges will be made.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242"
                className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name on Card</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe"
                className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123"
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
            </div>
            <button onClick={() => setStep('review')} disabled={!cardNumber || !cardName || !cardExpiry || cardCvv.length < 3}
              className="bg-gold-600 text-white font-semibold px-6 py-2.5 rounded hover:bg-gold-700 transition-colors text-sm mt-2 disabled:opacity-50">
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gold-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-gold-500" /> Order Summary</h2>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center py-3 border-b border-gold-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.selectedSize} / {item.selectedColor} × {item.quantity}</p>
                </div>
                  <p className="text-sm font-semibold text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gold-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Truck className="w-5 h-5 text-gold-500" /> Shipping To</h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{address.name}</p>
              <p>{address.phone}</p>
              <p>{address.address}</p>
              <p>{address.city}, {address.state} - {address.pincode}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gold-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Tag className="w-5 h-5 text-gold-500" /> Coupon</h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{appliedCoupon.code} — {appliedCoupon.label}</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-xs text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code"
                  className="flex-1 border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 uppercase" />
                <button onClick={handleApplyCoupon} className="bg-gold-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-gold-700 transition-colors">Apply</button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            <p className="text-xs text-gray-400 mt-2">Try: <span className="font-mono">SAROJINI10</span> (10% off) or <span className="font-mono">FASHION20</span> (20% off over ₹1000)</p>
          </div>

          <div className="bg-white rounded-lg border border-gold-200 p-6">
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Discount ({appliedCoupon.label})</span><span className="text-green-600">-₹{discount.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Shipping</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gold-200 mt-2">
              <span>Total</span><span>₹{Math.max(0, total).toFixed(2)}</span>
            </div>
          </div>

          {checkoutError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{checkoutError}</div>}

          <button onClick={handlePlaceOrder} disabled={checkoutStatus === 'processing'}
            className="w-full bg-gold-600 text-white font-semibold py-3 rounded hover:bg-gold-700 transition-colors disabled:opacity-50 text-sm">
            {checkoutStatus === 'processing' ? 'Placing Order...' : `Pay ₹${Math.max(0, total).toFixed(2)}`}
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="bg-white rounded-lg border border-green-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-6">Thank you for your purchase. You'll receive an email confirmation shortly.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => { clearCart(); onNavigate('orders'); }} className="bg-gold-600 text-white font-semibold px-6 py-2.5 rounded hover:bg-gold-700 transition-colors text-sm">
              View Orders
            </button>
            <button onClick={() => { clearCart(); onNavigate('shop'); }} className="border border-gold-200 text-gray-700 font-semibold px-6 py-2.5 rounded hover:bg-gold-50 transition-colors text-sm">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
