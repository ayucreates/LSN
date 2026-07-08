import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Order } from '../types';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

const STATUS_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  shipped: { icon: Truck, label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'bg-green-100 text-green-800' },
};

export function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.getOrders(user?.id);
      if (res.success) setOrders(res.data);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => onNavigate('shop')} className="text-sm text-gold-600 hover:text-gold-700 font-medium">Continue Shopping</button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gold-200 p-12 text-center text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1">Start shopping to see your orders here</p>
          <button onClick={() => onNavigate('shop')} className="mt-4 bg-gold-600 text-white font-semibold px-5 py-2 rounded hover:bg-gold-700 transition-colors text-sm">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white rounded-lg border border-gold-200 overflow-hidden">
                <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className="w-full text-left p-5 hover:bg-gold-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold-50 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 12)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gold-100 px-5 py-4 space-y-3 bg-gold-50/30">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</p>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.product?.name || item.productName} <span className="text-gray-400">× {item.quantity}</span></span>
                          <span className="text-gray-700">₹{(item.product?.price || item.productPrice || 0) * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gold-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gold-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-400" />
                        {order.trackingNumber ? (
                          <span className="text-gray-600">Tracking: <span className="font-mono text-gold-700">{order.trackingNumber}</span></span>
                        ) : (
                          <span className="text-gray-400">Awaiting dispatch</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
