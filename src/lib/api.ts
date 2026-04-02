// lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// Types
export interface Product {
  id: number;
  name: string;
  form: 'FLOWER' | 'OIL' | 'EXTRACT' | 'CAPSULE' | 'SPRAY';
  thcPercent: number;
  cbdPercent: number;
  price: number;
  unit: string;
  stock: number;
  pharmacyId: number;
  imageUrl?: string;
  productTags?: Array<{ tag: { id: number; name: string } }>;
  minStockAlert?: number;
  lastStockUpdate?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  zip: string;
  contact: string;
  zipRange?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface TreatmentRequest {
  id: number;
  patientId: number;
  pharmacyId: number;
  status: string;
}

// Dashboard types
export interface DashboardOrderStats {
  pending: number;
  paid: number;
  processing: number;
  ready: number;
  delivered: number;
  total: number;
}

export interface DashboardRevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
}

export interface DashboardInventoryStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface DashboardRecentOrder {
  id: number;
  patientName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  pharmacy: Pharmacy;
  stats: {
    orders: DashboardOrderStats;
    revenue: DashboardRevenueStats;
    inventory: DashboardInventoryStats;
  };
  recentOrders: DashboardRecentOrder[];
}

// Order types
export interface PharmacyOrder {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: string;
  symptoms: string;
  createdAt: string;
  updatedAt: string;
  prescriptionPdfPath?: string;
  selectedProducts?: Array<{
    productName: string;
    quantity: number;
    price?: number;
  }>;
  totalPrice?: number;
}

export interface OrdersResponse {
  data: PharmacyOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statusCounts: Record<string, number>;
}

export interface OrderFilters {
  status?: string;
  from?: string;
  to?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'total_price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderPayment {
  id: number;
  amount: number;
  status: string;
  type: string;
  method: string;
  createdAt: string;
  completedAt: string | null;
}

export interface OrderDetail {
  id: number;
  treatmentRequestId?: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  selectedProducts: Array<{
    productName: string;
    quantity: number;
    price?: number;
  }>;
  totalPrice: number;
  prescriptionPdfPath?: string;
  prescriptionPaid: boolean;
  productsPaid: boolean;
  symptoms: string;
  payments: OrderPayment[];
}

// Inventory types
export interface InventoryFilters {
  search?: string;
  form?: string;
  availability?: 'all' | 'available' | 'unavailable' | 'lowStock' | 'outOfStock';
  sortBy?: 'name' | 'stock' | 'price' | 'lastStockUpdate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InventorySummary {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface InventoryResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: InventorySummary;
}

// Analytics types
export interface AnalyticsRevenuePoint {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface AnalyticsTopProduct {
  name: string;
  revenue: number;
  quantity: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  uniquePatients: number;
  returningPatients: number;
}

export interface AnalyticsResponse {
  period: string;
  revenueByPeriod: AnalyticsRevenuePoint[];
  topProducts: AnalyticsTopProduct[];
  summary: AnalyticsSummary;
}

// Valid statuses recognized by the backend
export const ALLOWED_ORDER_STATUSES = ['APPROVED', 'PAID', 'PROCESSING', 'READY', 'PICKED_UP', 'DELIVERED', 'FULFILLED'] as const;

// Status transition map — mirrors backend's allowed transitions
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  PAID: ['PROCESSING'],
  PROCESSING: ['READY'],
  READY: ['PICKED_UP'],
  PICKED_UP: ['DELIVERED'],
};

export const STATUS_TRANSITION_LABELS: Record<string, string> = {
  PROCESSING: 'In Bearbeitung nehmen',
  READY: 'Als Bereit markieren',
  PICKED_UP: 'Als Abgeholt markieren',
  DELIVERED: 'Als Geliefert markieren',
};

// ============================================
// PRODUCT ENDPOINTS
// ============================================

export async function fetchAllProducts(filters?: {
  pharmacyId?: number;
  form?: string;
  minThc?: number;
  maxThc?: number;
  search?: string;
  inStock?: boolean;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.pharmacyId) params.append('pharmacyId', filters.pharmacyId.toString());
    if (filters?.form) params.append('form', filters.form);
    if (filters?.minThc) params.append('minThc', filters.minThc.toString());
    if (filters?.maxThc) params.append('maxThc', filters.maxThc.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.inStock) params.append('inStock', 'true');

    const url = `${API_BASE}/api/products${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching products:', error);
    }
    throw error;
  }
}

export async function fetchProductById(productId: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error);
    }
    throw error;
  }
}

export async function fetchPharmacyProducts(
  pharmacyId: number,
  inStockOnly: boolean = false
): Promise<Product[]> {
  try {
    const endpoint = inStockOnly ? 'available' : '';
    const url = `${API_BASE}/api/products/pharmacy/${pharmacyId}${endpoint ? '/' + endpoint : ''}`;
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch pharmacy products');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching pharmacy products:', error);
    }
    throw error;
  }
}

// ============================================
// ORDER ENDPOINTS
// ============================================

export async function createOrder(
  items: OrderItem[],
  deliveryMethod: 'PICKUP' | 'DELIVERY',
  deliveryAddress: string | null
): Promise<Order> {
  try {
    const body: Record<string, unknown> = {
      items,
      deliveryMethod,
    };

    if (deliveryMethod === 'DELIVERY' && deliveryAddress) {
      body.deliveryAddress = deliveryAddress;
    }

    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating order:', error);
    }
    throw error;
  }
}

export async function getOrderDetails(orderId: number): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch order');
    const data = await response.json();
    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching order:', error);
    }
    throw error;
  }
}

export async function getPatientOrders(patientId: number): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/patient/${patientId}/orders`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching patient orders:', error);
    }
    throw error;
  }
}

export async function cancelOrder(orderId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to cancel order');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error cancelling order:', error);
    }
    throw error;
  }
}

// ============================================
// STOCK/AVAILABILITY ENDPOINTS
// ============================================

export async function checkProductAvailability(
  items: OrderItem[]
): Promise<{ allAvailable: boolean; items: unknown[] }> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) throw new Error('Failed to check availability');
    const data = await response.json();
    return {
      allAvailable: data.allAvailable,
      items: data.data || [],
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error checking availability:', error);
    }
    throw error;
  }
}

// ============================================
// PHARMACY ENDPOINTS
// ============================================

export async function fetchPharmacyDashboard(): Promise<DashboardResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch pharmacy dashboard');
    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching pharmacy dashboard:', error);
    }
    throw error;
  }
}

export async function pharmacyLogin(email: string, password: string): Promise<{ token: string; pharmacy: Pharmacy }> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logging in pharmacy:', error);
    }
    throw error;
  }
}

export async function fetchPharmacyOrders(
  pharmacyId: number,
  filters?: OrderFilters
): Promise<OrdersResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/api/pharmacy/${pharmacyId}/orders${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return {
      data: data.data || [],
      pagination: data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      statusCounts: data.statusCounts || {},
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching pharmacy orders:', error);
    }
    throw error;
  }
}

export async function fetchPharmacyOrderDetail(
  pharmacyId: number,
  orderId: number
): Promise<OrderDetail> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders/${orderId}`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch order detail');
    const data = await response.json();
    return data.order ?? data.data ?? data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching order detail:', error);
    }
    throw error;
  }
}

export async function updateOrderStatus(
  pharmacyId: number,
  orderId: number,
  status: string
): Promise<{ success: boolean; allowedTransitions?: string[] }> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400 && errorData.allowedTransitions) {
        throw new Error(errorData.message || `Invalid transition. Allowed: ${errorData.allowedTransitions.join(', ')}`);
      }
      throw new Error(errorData.message || 'Failed to update order status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating order status:', error);
    }
    throw error;
  }
}

export async function markOrderReady(pharmacyId: number, orderId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders/${orderId}/mark-ready`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark order as ready');
    }

    // deliveryLink is now always null — no UI to show
    await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error marking order as ready:', error);
    }
    throw error;
  }
}

export async function fetchPharmacyInventory(
  pharmacyId: number,
  filters?: InventoryFilters
): Promise<InventoryResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.form) params.append('form', filters.form);
    if (filters?.availability) params.append('availability', filters.availability);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/api/pharmacy/${pharmacyId}/inventory${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch inventory');
    const data = await response.json();
    return {
      data: data.data || [],
      pagination: data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
      summary: data.summary || { totalProducts: 0, lowStock: 0, outOfStock: 0, totalValue: 0 },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching inventory:', error);
    }
    throw error;
  }
}

export async function fetchPharmacyAnalytics(
  pharmacyId: number,
  period: '7d' | '30d' | '90d' | '12m' = '30d'
): Promise<AnalyticsResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/api/pharmacy/${pharmacyId}/analytics?period=${period}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) throw new Error('Failed to fetch analytics');
    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching analytics:', error);
    }
    throw error;
  }
}

export async function fetchPendingOrders(
  pharmacyId: number
): Promise<PharmacyOrder[]> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/pending-orders`, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch pending orders');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching pending orders:', error);
    }
    throw error;
  }
}

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export async function patientRegister(formData: {
  email: string;
  postcode: string;
  fullName: string;
  phone: string;
  city: string;
  symptoms: string;
}): Promise<{ token: string; treatmentRequest: TreatmentRequest }> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/patient-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error registering patient:', error);
    }
    throw error;
  }
}

export async function patientLogin(email: string, postcode: string): Promise<unknown> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/patient-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, postcode }),
    });

    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logging in:', error);
    }
    throw error;
  }
}

// ============================================
// PRODUCT MANAGEMENT ENDPOINTS (Pharmacy Auth Required)
// ============================================

export interface ProductFormData {
  name: string;
  form: 'FLOWER' | 'OIL' | 'EXTRACT' | 'CAPSULE' | 'SPRAY';
  thcPercent: number;
  cbdPercent: number;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
}

export async function createProduct(productData: ProductFormData): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating product:', error);
    }
    throw error;
  }
}

export async function updateProduct(
  productId: number,
  productData: Partial<ProductFormData>
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating product:', error);
    }
    throw error;
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting product:', error);
    }
    throw error;
  }
}

export async function updateProductStock(
  productId: number,
  stock: number
): Promise<Product> {
  return updateProduct(productId, { stock });
}
