import { Router } from 'express';
import { getDb, save } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shipping } = req.body;
    if (!items?.length) {
      res.status(400).json({ error: 'Order must contain at least one item', success: false });
      return;
    }

    const db = await getDb();
    const user = (req as any).user;
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    let total = 0;
    for (const item of items) {
      total += item.product.price * item.quantity;
    }

    db.run('INSERT INTO orders (id, userId, total, status, trackingNumber, shippingName, shippingPhone, shippingAddress, shippingCity, shippingState, shippingPincode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, user.userId, total, 'pending', null, shipping?.name || null, shipping?.phone || null, shipping?.address || null, shipping?.city || null, shipping?.state || null, shipping?.pincode || null, now, now]);

    for (const item of items) {
      db.run('INSERT INTO order_items (id, orderId, productId, productName, productPrice, quantity, selectedSize, selectedColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [`oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, orderId, item.product.id, item.product.name, item.product.price, item.quantity, item.selectedSize, item.selectedColor]);

      const stockResult = db.exec('SELECT stock FROM products WHERE id = ?', [item.product.id]);
      if (stockResult[0]?.values.length) {
        const currentStock = stockResult[0].values[0][0] as number;
        const newStock = Math.max(0, currentStock - item.quantity);
        db.run('UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?', [newStock, now, item.product.id]);
      }
    }
    save();

    const order = { id: orderId, userId: user.userId, items, total, status: 'pending', trackingNumber: null, shipping: shipping || null, createdAt: now, updatedAt: now };
    res.status(201).json({ data: order, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to create order', success: false });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const user = (req as any).user;
    const isAdmin = user.role === 'admin';

    let orderRows;
    if (isAdmin) {
      orderRows = db.exec('SELECT * FROM orders ORDER BY createdAt DESC');
    } else {
      orderRows = db.exec('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [user.userId]);
    }

    if (!orderRows[0]) return res.json({ data: [], error: null, success: true });

    const orderCols = orderRows[0].columns;
    const orders: any[] = [];

    for (const row of orderRows[0].values) {
      const order: Record<string, any> = {};
      orderCols.forEach((name, i) => { order[name] = row[i]; });

      const itemRows = db.exec('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
      if (itemRows[0]) {
        const itemCols = itemRows[0].columns;
        order.items = itemRows[0].values.map((itemRow: any[]) => {
          const item: Record<string, any> = {};
          itemCols.forEach((name, i) => { item[name] = itemRow[i]; });
          item.product = { id: item.productId, name: item.productName, price: item.productPrice };
          return item;
        });
      } else {
        order.items = [];
      }
      orders.push(order);
    }

    res.json({ data: orders, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders', success: false });
  }
});

router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const { status, trackingNumber } = req.body;
    const validStatuses = ['pending', 'shipped', 'delivered'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be pending, shipped, or delivered', success: false });
      return;
    }

    const existing = db.exec('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!existing[0]?.values.length) {
      res.status(404).json({ error: 'Order not found', success: false });
      return;
    }

    const now = new Date().toISOString();
    if (trackingNumber !== undefined) {
      db.run('UPDATE orders SET status = ?, trackingNumber = ?, updatedAt = ? WHERE id = ?', [status, trackingNumber, now, req.params.id]);
    } else {
      db.run('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?', [status, now, req.params.id]);
    }
    save();

    const result = db.exec('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const colNames = result[0].columns;
    const row = result[0].values[0];
    const order: Record<string, any> = {};
    colNames.forEach((name, i) => { order[name] = row[i]; });
    order.items = [];

    res.json({ data: order, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update order', success: false });
  }
});

export default router;
