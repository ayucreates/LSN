import { Router } from 'express';
import { getDb, save } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const { categories, sizes, colors, minPrice, maxPrice, search } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (categories) {
      const cats = (categories as string).split(',');
      sql += ` AND (${cats.map(() => 'category = ?').join(' OR ')})`;
      params.push(...cats);
    }
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }
    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      params.push(`%${(search as string).toLowerCase()}%`, `%${(search as string).toLowerCase()}%`);
    }

    const result = db.exec(sql, params);
    if (!result[0]) return res.json({ data: [], error: null, success: true });

    const colNames = result[0].columns;
    const products = result[0].values.map((row: any[]) => {
      const obj: Record<string, any> = {};
      colNames.forEach((name, i) => {
        if (name === 'sizes' || name === 'colors') {
          try { obj[name] = JSON.parse(row[i] as string); } catch { obj[name] = []; }
        } else {
          obj[name] = row[i];
        }
      });
      return obj;
    });

    if (sizes) {
      const sizeFilter = (sizes as string).split(',');
      const filtered = products.filter((p: any) => p.sizes?.some((s: string) => sizeFilter.includes(s)));
      return res.json({ data: filtered, error: null, success: true });
    }
    if (colors) {
      const colorFilter = (colors as string).split(',');
      const filtered = products.filter((p: any) => p.colors?.some((c: string) => colorFilter.includes(c)));
      return res.json({ data: filtered, error: null, success: true });
    }

    res.json({ data: products, error: null, success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', success: false });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!result[0]?.values.length) {
      res.status(404).json({ error: 'Product not found', success: false });
      return;
    }
    const colNames = result[0].columns;
    const row = result[0].values[0];
    const product: Record<string, any> = {};
    colNames.forEach((name, i) => {
      if (name === 'sizes' || name === 'colors') {
        try { product[name] = JSON.parse(row[i] as string); } catch { product[name] = []; }
      } else {
        product[name] = row[i];
      }
    });
    res.json({ data: product, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to fetch product', success: false });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const { name, description, price, category, sizes, colors, stock } = req.body;
    if (!name || !description || price === undefined || !category) {
      res.status(400).json({ error: 'Name, description, price, and category are required', success: false });
      return;
    }
    const id = `p${Date.now()}`;
    const now = new Date().toISOString();
    db.run('INSERT INTO products (id, name, description, price, category, sizes, colors, stock, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, category, JSON.stringify(sizes || ['M']), JSON.stringify(colors || ['Red']), stock || 0, 'admin', now, now]);
    save();

    const result = db.exec('SELECT * FROM products WHERE id = ?', [id]);
    const colNames = result[0].columns;
    const row = result[0].values[0];
    const product: Record<string, any> = {};
    colNames.forEach((name, i) => {
      if (name === 'sizes' || name === 'colors') { try { product[name] = JSON.parse(row[i] as string); } catch { product[name] = []; } }
      else { product[name] = row[i]; }
    });
    res.status(201).json({ data: product, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to create product', success: false });
  }
});

router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db.exec('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing[0]?.values.length) {
      res.status(404).json({ error: 'Product not found', success: false });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];
    const { name, description, price, stock, category, sizes, colors } = req.body;

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price !== undefined) { updates.push('price = ?'); params.push(price); }
    if (stock !== undefined) { updates.push('stock = ?'); params.push(stock); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (sizes !== undefined) { updates.push('sizes = ?'); params.push(JSON.stringify(sizes)); }
    if (colors !== undefined) { updates.push('colors = ?'); params.push(JSON.stringify(colors)); }

    if (!updates.length) {
      res.status(400).json({ error: 'No fields to update', success: false });
      return;
    }

    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(req.params.id);

    db.run(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    save();

    const result = db.exec('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const colNames = result[0].columns;
    const row = result[0].values[0];
    const product: Record<string, any> = {};
    colNames.forEach((name, i) => {
      if (name === 'sizes' || name === 'colors') {
        try { product[name] = JSON.parse(row[i] as string); } catch { product[name] = []; }
      } else {
        product[name] = row[i];
      }
    });
    res.json({ data: product, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update product', success: false });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db.exec('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing[0]?.values.length) {
      res.status(404).json({ error: 'Product not found', success: false });
      return;
    }
    db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    save();
    res.json({ data: true, error: null, success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete product', success: false });
  }
});

export default router;
