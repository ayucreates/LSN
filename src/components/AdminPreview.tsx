import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Edit3, Trash2, X, Save, Plus } from 'lucide-react';
import type { Product, Order, OrderStatus, ProductCategory, ProductSize, ProductColor } from '../types';
import { api } from '../services/api';

type Tab = 'inventory' | 'orders';

const CATEGORIES: ProductCategory[] = ['Women Western', 'Women Ethnic', 'Kids', 'Accessories', 'Festive Collection', 'Gifting'];
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COLORS: ProductColor[] = ['Red', 'Blue', 'Black', 'White', 'Green', 'Pink', 'Yellow', 'Navy', 'Maroon', 'Multicolor'];

function emptyProduct() {
  return { name: '', description: '', price: 0, category: 'Women Western' as ProductCategory, sizes: ['M'] as ProductSize[], colors: ['Red'] as ProductColor[], stock: 0 };
}

export function AdminPreview() {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<ReturnType<typeof emptyProduct>>(emptyProduct());
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [prodRes, ordRes] = await Promise.all([api.fetchProducts(), api.getOrders()]);
    if (prodRes.success) setProducts(prodRes.data);
    if (ordRes.success) setOrders(ordRes.data);
    setLoading(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({ name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category, sizes: product.sizes, colors: product.colors });
  };

  const cancelEdit = () => { setEditingProduct(null); setEditForm({}); };

  const saveEdit = async () => {
    if (!editingProduct) return;
    const res = await api.updateProduct(editingProduct.id, editForm);
    if (res.success) { setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.data : p))); cancelEdit(); }
  };

  const handleDelete = async (productId: string) => {
    const res = await api.deleteProduct(productId);
    if (res.success) setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAdd = async () => {
    const res = await api.createProduct(addForm);
    if (res.success) { setProducts((prev) => [...prev, res.data]); setAdding(false); setAddForm(emptyProduct()); }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const res = await api.updateOrderStatus(orderId, status, trackingNumber);
    if (res.success) setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="bg-gold-50 border-2 border-gold-200 rounded-lg p-6"><p className="text-sm text-gold-700">Loading admin data...</p></div>;

  return (
    <div className="bg-gold-50 border-2 border-gold-200 rounded-lg overflow-hidden">
      <div className="bg-gold-100 px-6 py-3 border-b border-gold-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          <h2 className="text-sm font-bold text-gold-800 uppercase tracking-wider">Admin Dashboard</h2>
        </div>
        <span className="text-[10px] text-gold-600 bg-gold-200 px-2 py-0.5 rounded font-medium">Admin Only</span>
      </div>

      <div className="flex border-b border-gold-200">
        <button onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-white text-gold-800 border-b-2 border-gold-500' : 'text-gold-600 hover:bg-gold-100/50'}`}>
          <Package className="w-4 h-4" /> Inventory ({products.length})
        </button>
        <button onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-gold-800 border-b-2 border-gold-500' : 'text-gold-600 hover:bg-gold-100/50'}`}>
          <ShoppingCart className="w-4 h-4" /> Orders ({orders.length})
        </button>
      </div>

      <div className="bg-white">
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-end px-4 py-3 border-b border-gold-100">
              <button onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-gold-600 text-white px-3 py-1.5 rounded hover:bg-gold-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-100 bg-gold-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Stock</th>
                    <th className="text-right px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gold-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                       <td className="px-4 py-3 text-gray-500">{product.category}</td>
                       <td className="px-4 py-3 text-gray-700">₹{product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock > 0 ? product.stock : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => startEdit(product)} className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400"><ShoppingCart className="w-10 h-10 mx-auto mb-2" /><p className="text-sm font-medium">No orders yet</p></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-100 bg-gold-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Items</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Tracking</th>
                    <th className="text-left px-4 py-3 font-semibold text-gold-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-50">
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} onUpdateStatus={handleUpdateStatus} statusColor={statusColor} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Edit Product</h3>
              <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={editForm.name ?? ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editForm.description ?? ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                  <input type="number" step="0.01" min="0" value={editForm.price ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                  <input type="number" min="0" value={editForm.stock ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={editForm.category || ''} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as ProductCategory })}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={cancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
              <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gold-600 rounded hover:bg-gold-700"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Add New Product</h3>
              <button onClick={() => setAdding(false)} className="p-1 text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} rows={3}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" min="0" value={addForm.price || ''}
                    onChange={(e) => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                  <input type="number" min="0" value={addForm.stock || ''}
                    onChange={(e) => setAddForm({ ...addForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value as ProductCategory })}
                  className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sizes</label>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => setAddForm({ ...addForm, sizes: addForm.sizes.includes(s) ? addForm.sizes.filter((x) => x !== s) : [...addForm.sizes, s] })}
                      className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${addForm.sizes.includes(s) ? 'bg-gold-600 text-white border-gold-600' : 'border-gold-200 text-gray-600 hover:border-gold-500'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Colors</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setAddForm({ ...addForm, colors: addForm.colors.includes(c) ? addForm.colors.filter((x) => x !== c) : [...addForm.colors, c] })}
                      className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${addForm.colors.includes(c) ? 'bg-gold-600 text-white border-gold-600' : 'border-gold-200 text-gray-600 hover:border-gold-500'}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
              <button onClick={handleAdd} disabled={!addForm.name || !addForm.description}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gold-600 rounded hover:bg-gold-700 disabled:opacity-50">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, onUpdateStatus, statusColor }: {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus, tracking?: string) => Promise<void>;
  statusColor: (s: string) => string;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdateStatus(order.id, status, tracking || undefined);
    setSaving(false);
  };

  const hasChanges = status !== order.status || tracking !== (order.trackingNumber || '');

  return (
    <tr className="hover:bg-gold-50/30 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-gray-700">{order.id}</td>
      <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
        {order.items.map((item: any) => item.product?.name || item.productName).join(', ')}
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">₹{order.total.toFixed(2)}</td>
      <td className="px-4 py-3">
        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className={`text-xs font-medium rounded border px-2 py-1 ${statusColor(status)} border-transparent focus:border-gold-400 focus:ring-1 focus:ring-gold-400`}>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)}
          placeholder="Add tracking #"
          className="w-28 text-xs border border-gold-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gold-400" />
      </td>
      <td className="px-4 py-3">
        <button onClick={handleSave} disabled={!hasChanges || saving}
          className="text-xs font-medium text-gold-700 hover:text-gold-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
          {saving ? 'Saving...' : 'Update'}
        </button>
      </td>
    </tr>
  );
}
