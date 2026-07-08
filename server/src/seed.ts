import { getDb, save } from './db.js';
import bcrypt from 'bcryptjs';

export async function seed(): Promise<void> {
  const db = await getDb();

  const userCount = db.exec('SELECT COUNT(*) as count FROM users');
  if (userCount[0]?.values[0]?.[0] !== 0) return;

  const hashedPassword = await bcrypt.hash('admin', 10);
  const hashedCustomerPw = await bcrypt.hash('customer', 10);

  db.run(`INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`, [
    'u1', 'Store Admin', 'admin@littlesarojini.in', hashedPassword, 'admin',
  ]);
  db.run(`INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`, [
    'u2', 'Priya Sharma', 'customer@littlesarojini.in', hashedCustomerPw, 'customer',
  ]);

  const products = [
    { id: 'p1', name: 'Trendy Printed Top', description: 'Stylish printed top with breathable cotton fabric. Perfect for casual outings and daily wear.', price: 399, category: 'Women Western', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Red', 'Blue', 'Black', 'White', 'Green'], stock: 50 },
    { id: 'p2', name: 'Cotton Kurti with Palazzo', description: 'Beautiful cotton kurti set with matching palazzo. Comfortable ethnic wear for everyday elegance.', price: 699, category: 'Women Ethnic', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Pink', 'Blue', 'Green', 'Maroon', 'Multicolor'], stock: 35 },
    { id: 'p3', name: 'Gift Hamper Set', description: 'Curated gift hamper with assorted goodies. The perfect present for any occasion.', price: 499, category: 'Gifting', sizes: ['Free Size'], colors: ['Red', 'Blue', 'Multicolor'], stock: 45 },
    { id: 'p4', name: 'Kids Festive Dress Set', description: 'Adorable festive dress set for little ones. Perfect for celebrations and family gatherings.', price: 899, category: 'Kids', sizes: ['XS', 'S', 'M', 'L'], colors: ['Pink', 'Red', 'Blue', 'Multicolor'], stock: 25 },
    { id: 'p5', name: 'Embroidered Suit Set', description: 'Elegant embroidered suit set with delicate threadwork. A must-have for festive occasions.', price: 1299, category: 'Women Ethnic', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Maroon', 'Blue', 'Pink', 'Green', 'Yellow'], stock: 30 },
    { id: 'p6', name: 'Denim Jacket', description: 'Trendy denim jacket with classic styling. Layer it over dresses, tops or tees for an edgy look.', price: 999, category: 'Women Western', sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue', 'Black', 'Navy'], stock: 20 },
    { id: 'p7', name: 'Premium Gift Box', description: 'Beautifully packaged gift box with handpicked items. A thoughtful surprise for someone special.', price: 799, category: 'Gifting', sizes: ['Free Size'], colors: ['Red', 'Pink', 'Multicolor'], stock: 28 },
    { id: 'p8', name: 'Floral Print Dress', description: 'Charming floral print dress in lightweight fabric. Your go-to for sunny days and casual outings.', price: 599, category: 'Women Western', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Pink', 'Blue', 'Yellow', 'Multicolor'], stock: 55 },
    { id: 'p9', name: 'Designer Dupatta', description: 'Beautiful designer dupatta with elegant borders and soft finish. Elevate any ethnic look.', price: 299, category: 'Accessories', sizes: ['Free Size'], colors: ['Red', 'Pink', 'Green', 'Blue', 'Multicolor'], stock: 65 },
    { id: 'p10', name: 'Festive Lehenga Choli', description: 'Stunning lehenga choli set for festive celebrations. Beautiful design at an affordable price.', price: 1499, category: 'Festive Collection', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Maroon', 'Blue', 'Pink', 'Multicolor'], stock: 15 },
    { id: 'p11', name: 'Gift Voucher Pack', description: 'Set of themed gift vouchers with beautiful envelopes. Give the gift of choice to your loved ones.', price: 599, category: 'Gifting', sizes: ['Free Size'], colors: ['Red', 'Pink', 'Blue', 'Multicolor'], stock: 70 },
    { id: 'p12', name: 'Kids Printed T-Shirt', description: 'Fun printed t-shirt for kids with soft cotton fabric. Bright colors and playful designs.', price: 299, category: 'Kids', sizes: ['XS', 'S', 'M', 'L'], colors: ['Red', 'Blue', 'Green', 'Yellow', 'Multicolor'], stock: 80 },
    { id: 'p13', name: 'Trendy Handbag', description: 'Chic handbag for daily use. Spacious enough for essentials with stylish design.', price: 499, category: 'Accessories', sizes: ['Free Size'], colors: ['Black', 'Red', 'Blue', 'Multicolor'], stock: 40 },
    { id: 'p14', name: 'Fashion Jewelry Set', description: 'Trendy layered necklace and earring set. Complete your look with these stylish accessories.', price: 199, category: 'Accessories', sizes: ['Free Size'], colors: ['Gold', 'Silver', 'Multicolor'], stock: 90 },
    { id: 'p15', name: 'Straight Cut Kurti', description: 'Elegant straight cut kurti in soft fabric. Versatile piece for both casual and formal occasions.', price: 449, category: 'Women Ethnic', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Pink', 'Blue', 'Maroon', 'Green', 'Yellow'], stock: 48 },
    { id: 'p16', name: "Boy's Formal Shirt", description: 'Smart formal shirt for boys. Perfect for school events, parties, and family functions.', price: 399, category: 'Kids', sizes: ['XS', 'S', 'M', 'L'], colors: ['White', 'Blue', 'Navy'], stock: 35 },
    { id: 'p17', name: 'Party Wear Gown', description: 'Stunning party wear gown with elegant design. Turn heads at your next special event.', price: 1299, category: 'Women Western', sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Black', 'Blue', 'Pink', 'Maroon'], stock: 22 },
    { id: 'p18', name: 'Jute Tote Bag', description: 'Eco-friendly jute tote bag with stylish prints. Perfect for shopping trips and daily errands.', price: 349, category: 'Accessories', sizes: ['Free Size'], colors: ['Multicolor', 'Green', 'Blue'], stock: 55 },
    { id: 'p19', name: 'Festive Saree', description: 'Beautiful festive saree with elegant border work. A timeless addition to your ethnic wardrobe.', price: 1199, category: 'Festive Collection', sizes: ['Free Size'], colors: ['Red', 'Maroon', 'Blue', 'Green', 'Pink'], stock: 18 },
    { id: 'p20', name: 'Thoughtful Gift Combo', description: 'Carefully curated combo of trending accessories and goodies. The ideal surprise for friends and family.', price: 349, category: 'Gifting', sizes: ['Free Size'], colors: ['Red', 'Pink', 'Blue', 'Multicolor'], stock: 85 },
    { id: 'p21', name: "Women's Jogger Set", description: 'Cozy jogger set for women. Perfect for lounging, travel, or casual days out.', price: 799, category: 'Women Western', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Pink', 'Blue', 'Navy', 'Multicolor'], stock: 38 },
    { id: 'p22', name: 'Embellished Clutch', description: 'Beautiful embellished clutch with intricate detailing. The perfect evening accessory.', price: 249, category: 'Accessories', sizes: ['Free Size'], colors: ['Red', 'Black', 'Gold', 'Multicolor'], stock: 42 },
  ];

  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO products (id, name, description, price, category, sizes, colors, stock, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'admin', ?, ?)`);

  for (const p of products) {
    stmt.run([p.id, p.name, p.description, p.price, p.category, JSON.stringify(p.sizes), JSON.stringify(p.colors), p.stock, now, now]);
  }
  stmt.free();

  save();
}
