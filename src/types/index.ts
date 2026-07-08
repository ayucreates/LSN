export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ProductCategory =
  | 'Women Western'
  | 'Women Ethnic'
  | 'Kids'
  | 'Accessories'
  | 'Festive Collection'
  | 'Gifting';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export type ProductColor =
  | 'Red'
  | 'Blue'
  | 'Black'
  | 'White'
  | 'Green'
  | 'Pink'
  | 'Yellow'
  | 'Navy'
  | 'Maroon'
  | 'Multicolor';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  images: string[];
  stock: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
  selectedColor: ProductColor;
}

export interface FilterState {
  categories: ProductCategory[];
  sizes: ProductSize[];
  colors: ProductColor[];
  priceRange: [number, number];
  searchQuery: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  trackingNumber: string | null;
  shipping?: ShippingAddress | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  success: boolean;
}
