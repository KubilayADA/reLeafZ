// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    console.error('Error fetching products:', error);
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
    console.error('Error fetching product:', error);
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
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch pharmacy products');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching pharmacy products:', error);
    throw error;
  }
}

// ============================================
// ORDER ENDPOINTS
// ============================================

export async function createOrder(
  items: OrderItem[],
  deliveryMethod: 'PICKUP' | 'DELIVERY',
  deliveryAddress: string | null,
  token: string
): Promise<Order> {
  try {
    const body: any = {
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderDetails(orderId: number, token: string): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch order');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function getPatientOrders(patientId: number, token: string): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/patient/${patientId}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching patient orders:', error);
    throw error;
  }
}

export async function cancelOrder(orderId: number, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to cancel order');
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

// ============================================
// STOCK/AVAILABILITY ENDPOINTS
// ============================================

export async function checkProductAvailability(
  items: OrderItem[]
): Promise<{ allAvailable: boolean; items: any[] }> {
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
    console.error('Error checking availability:', error);
    throw error;
  }
}

// ============================================
// PHARMACY ENDPOINTS
// ============================================

export async function fetchPharmacyDashboard(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch pharmacy dashboard');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pharmacy dashboard:', error);
    throw error;
  }
}

export async function pharmacyLogin(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in pharmacy:', error);
    throw error;
  }
}

export interface PharmacyOrder {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: string;
  symptoms: string;
  createdAt: string;
  prescriptionPdfPath?: string;  
  selectedProducts?: Array<{     
    productName: string;
    quantity: number;
  }>;
  totalPrice?: number;         
}

export async function fetchPharmacyOrders(pharmacyId: number, token: string): Promise<PharmacyOrder[]> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching pharmacy orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  pharmacyId: number,
  orderId: number,
  status: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function markOrderReady(pharmacyId: number, orderId: number, token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/pharmacy/${pharmacyId}/orders/${orderId}/mark-ready`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark order as ready');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking order as ready:', error);
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
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering patient:', error);
    throw error;
  }
}

export async function patientLogin(email: string, postcode: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/patient-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, postcode }),
    });

    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
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

export async function createProduct(productData: ProductFormData, token: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: number,
  productData: Partial<ProductFormData>,
  token: string
): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: number, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function updateProductStock(
  productId: number,
  stock: number,
  token: string
): Promise<Product> {
  return updateProduct(productId, { stock }, token);
}