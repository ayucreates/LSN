import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, save } from '../db.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = await getDb();
    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);

    if (!result[0]?.values.length) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const row = result[0].values[0];
    const colNames = result[0].columns;
    const idIdx = colNames.indexOf('id');
    const nameIdx = colNames.indexOf('name');
    const emailIdx = colNames.indexOf('email');
    const passwordIdx = colNames.indexOf('password');
    const roleIdx = colNames.indexOf('role');

    const valid = await bcrypt.compare(password, row[passwordIdx] as string);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = { id: row[idIdx] as string, name: row[nameIdx] as string, email: row[emailIdx] as string, role: row[roleIdx] as string };
    const token = generateToken({ userId: user.id, role: user.role });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const db = await getDb();
    const existing = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (existing[0]?.values.length) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = `u${Date.now()}`;
    db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [id, name, email, hashed, 'customer']);
    save();

    const token = generateToken({ userId: id, role: 'customer' });
    res.status(201).json({ user: { id, name, email, role: 'customer' }, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
