const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.featured) params.append('featured', filters.featured);
    if (filters.inStock) params.append('inStock', filters.inStock);
    
    const query = params.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getTrendingProducts() {
    return this.request('/products/trending/list');
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(identifier) {
    return this.request(`/categories/${identifier}`);
  }

  // Search
  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    return this.request(`/search?${params.toString()}`);
  }

  // Cart
  async getCart(sessionId) {
    return this.request(`/cart/${sessionId}`);
  }

  async addToCart(sessionId, productId, quantity = 1) {
    return this.request(`/cart/${sessionId}/items`, {
      method: 'POST',
      body: { productId, quantity },
    });
  }

  async updateCartItem(sessionId, productId, quantity) {
    return this.request(`/cart/${sessionId}/items/${productId}`, {
      method: 'PUT',
      body: { quantity },
    });
  }

  async removeFromCart(sessionId, productId) {
    return this.request(`/cart/${sessionId}/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(sessionId) {
    return this.request(`/cart/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Contact
  async submitContact(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: formData,
    });
  }

  // Orders
  async createOrder(sessionId, customerInfo) {
    return this.request('/orders', {
      method: 'POST',
      body: { sessionId, customerInfo },
    });
  }

  async getOrder(orderNumber) {
    return this.request(`/orders/${orderNumber}`);
  }

  // Admin
  async adminLogin(username, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: { username, password },
    });
  }

  async adminVerify(token) {
    return this.request('/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAdminDashboardStats(token) {
    return this.request('/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Admin Products
  async getAdminProducts(token) {
    return this.request('/admin/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createAdminProduct(token, productData) {
    return this.request('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: productData,
    });
  }

  async updateAdminProduct(token, productId, productData) {
    return this.request(`/admin/products/${productId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: productData,
    });
  }

  async deleteAdminProduct(token, productId) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Admin Orders
  async getAdminOrders(token, filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    
    return this.request(`/admin/orders${params.toString() ? `?${params.toString()}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAdminOrder(token, orderId) {
    return this.request(`/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateOrderStatus(token, orderId, status, notes) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { status, notes },
    });
  }

  async updateOrderPaymentStatus(token, orderId, paymentStatus) {
    return this.request(`/admin/orders/${orderId}/payment-status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { paymentStatus },
    });
  }

  // Admin Sales
  async getAdminSales(token, filters = {}) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    return this.request(`/admin/sales${params.toString() ? `?${params.toString()}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new ApiService();

