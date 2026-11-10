export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type VariantSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: VariantSize;
  color: string;
  colorHex: string;
  price: number | null;
  stock: number;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  sizingNotes: string;
  category: string;
  basePrice: number;
  featured: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface ProductCatalogQuery {
  category?: string;
  price_min?: number;
  price_max?: number;
  size?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: PaginationMeta;
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}

export interface PromoValidationResult {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  minCartSpend: number;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export type FulfillmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface OrderRecord {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  promoCodeApplied: string | null;
  status: FulfillmentStatus;
  createdAt: string;
  items: OrderItemRecord[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  paymentMethod: string;
  promoCode?: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  orders: OrderRecord[];
  metrics: AdminMetrics;
}

export interface CreateAdminProductPayload {
  name: string;
  slug?: string;
  description: string;
  sizingNotes?: string;
  category: string;
  basePrice: number;
  featured: boolean;
  images: string[];
  variants: Array<{
    sku: string;
    size: VariantSize;
    color: string;
    colorHex: string;
    price?: number;
    stock: number;
    imageUrl: string;
  }>;
}

interface ApiErrorPayload {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

const API_BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = (await response.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!response.ok) {
    const errorMessage =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      data.error &&
      typeof data.error.message === 'string'
        ? data.error.message
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string }) =>
      request<{ success: boolean; user: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      request<{ success: boolean; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    logout: () =>
      request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      }),
    me: () => request<{ success: boolean; user: UserProfile | null }>('/auth/me'),
  },

  products: {
    list: (params: ProductCatalogQuery = {}) => {
      const searchParams = new URLSearchParams();
      if (params.category && params.category !== 'ALL') {
        searchParams.set('category', params.category);
      }
      if (params.price_min !== undefined) {
        searchParams.set('price_min', String(params.price_min));
      }
      if (params.price_max !== undefined) {
        searchParams.set('price_max', String(params.price_max));
      }
      if (params.size && params.size !== 'ALL') {
        searchParams.set('size', params.size);
      }
      if (params.sort) {
        searchParams.set('sort', params.sort);
      }
      if (params.featured !== undefined) {
        searchParams.set('featured', String(params.featured));
      }
      if (params.search) {
        searchParams.set('search', params.search);
      }
      if (params.page) {
        searchParams.set('page', String(params.page));
      }
      if (params.limit) {
        searchParams.set('limit', String(params.limit));
      }
      const queryString = searchParams.toString();
      return request<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getBySlug: (slug: string) =>
      request<SingleProductResponse>(`/products/${encodeURIComponent(slug)}`),
  },

  wishlist: {
    get: () =>
      request<{ success: boolean; productIds: string[]; products: Product[] }>('/wishlist'),
    toggle: (productId: string) =>
      request<{
        success: boolean;
        action: 'added' | 'removed';
        productId: string;
        productIds: string[];
      }>('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }),
  },

  checkout: {
    validatePromo: (code: string, cartSubtotal: number) =>
      request<{ success: boolean; promo: PromoValidationResult }>('/checkout/validate-promo', {
        method: 'POST',
        body: JSON.stringify({ code, cartSubtotal }),
      }),
    createOrder: (payload: CreateOrderPayload) =>
      request<{ success: boolean; order: OrderRecord }>('/checkout/order', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  admin: {
    getOrders: () => request<AdminOrdersResponse>('/admin/orders'),
    updateOrderStatus: (orderId: string, status: FulfillmentStatus) =>
      request<{ success: boolean; order: OrderRecord }>(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    createProduct: (payload: CreateAdminProductPayload) =>
      request<{ success: boolean; product: Product }>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateStock: (productId: string, variantId: string, stock: number) =>
      request<{ success: boolean; variant: ProductVariant }>(`/admin/products/${productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ variantId, stock }),
      }),
  },
};
