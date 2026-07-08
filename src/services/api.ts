import type {
  Product,
  CartItem,
  Order,
  User,
  Review,
  ApiResponse,
  OrderStatus,
  ProductCategory,
  ProductSize,
  ProductColor,
} from '../types';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
    });
    const body = await res.json();
    if (!res.ok) {
      return { data: null as unknown as T, error: body.error || 'Request failed', success: false };
    }
    return { data: body.data ?? body, error: null, success: true };
  } catch (err) {
    return { data: null as unknown as T, error: 'Network error', success: false };
  }
}

export const api = {
  async fetchProducts(
    filters?: Partial<{
      categories: ProductCategory[];
      sizes: ProductSize[];
      colors: ProductColor[];
      priceRange: [number, number];
      searchQuery: string;
    }>,
  ): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    if (filters?.categories?.length) params.set('categories', filters.categories.join(','));
    if (filters?.sizes?.length) params.set('sizes', filters.sizes.join(','));
    if (filters?.colors?.length) params.set('colors', filters.colors.join(','));
    if (filters?.priceRange) {
      params.set('minPrice', String(filters.priceRange[0]));
      params.set('maxPrice', String(filters.priceRange[1]));
    }
    if (filters?.searchQuery) params.set('search', filters.searchQuery);
    const qs = params.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  async fetchProductById(id: string): Promise<ApiResponse<Product | null>> {
    return request<Product>(`/products/${id}`);
  },

  async updateProductStock(
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<Product>> {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ stockDelta: -quantity }),
    });
    const body = await res.json();
    if (!res.ok) return { data: null as unknown as Product, error: body.error, success: false };
    return { data: body.data, error: null, success: true };
  },

  async createOrder(
    userId: string,
    items: CartItem[],
  ): Promise<ApiResponse<Order>> {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ userId, items }),
    });
  },

  async getOrders(userId?: string): Promise<ApiResponse<Order[]>> {
    const path = userId ? `/orders?userId=${userId}` : '/orders';
    return request<Order[]>(path);
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
  ): Promise<ApiResponse<Order>> {
    return request<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...(trackingNumber !== undefined ? { trackingNumber } : {}) }),
    });
  },

  async updateProduct(
    productId: string,
    updates: Partial<Product>,
  ): Promise<ApiResponse<Product>> {
    return request<Product>(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(productId: string): Promise<ApiResponse<boolean>> {
    return request<boolean>(`/products/${productId}`, { method: 'DELETE' });
  },

  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) return { data: null as unknown as User, error: body.error || 'Login failed', success: false };
    localStorage.setItem('auth_token', body.token);
    return { data: body.user, error: null, success: true };
  },

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const body = await res.json();
    if (!res.ok) return { data: null as unknown as User, error: body.error || 'Registration failed', success: false };
    localStorage.setItem('auth_token', body.token);
    return { data: body.user, error: null, success: true };
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },

  async getReviews(productId: string): Promise<ApiResponse<Review[]>> {
    try {
      const stored = localStorage.getItem(`reviews_${productId}`);
      const reviews: Review[] = stored ? JSON.parse(stored) : [];
      return { data: reviews, error: null, success: true };
    } catch { return { data: [], error: 'Failed to load reviews', success: false }; }
  },

  async addReview(data: { productId: string; userId: string; userName: string; rating: number; comment: string }): Promise<ApiResponse<Review>> {
    try {
      const review: Review = { id: `rev-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
      const stored = localStorage.getItem(`reviews_${data.productId}`);
      const reviews: Review[] = stored ? JSON.parse(stored) : [];
      reviews.unshift(review);
      localStorage.setItem(`reviews_${data.productId}`, JSON.stringify(reviews));
      return { data: review, error: null, success: true };
    } catch { return { data: null as unknown as Review, error: 'Failed to add review', success: false }; }
  },
};
