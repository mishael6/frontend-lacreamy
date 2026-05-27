import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  // Use admin token for admin routes, customer token for everything else
  const isAdminRoute = config.url?.includes('/admin');
  const token = isAdminRoute
    ? localStorage.getItem('lacreamy_admin_token')
    : localStorage.getItem('lacreamy_token');

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - auto logout
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = error.config?.url?.includes('/admin');
      if (isAdminRoute) {
        localStorage.removeItem('lacreamy_admin_token');
        localStorage.removeItem('lacreamy_admin');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('lacreamy_token');
        localStorage.removeItem('lacreamy_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const sendOTP = (phone) => API.post('/auth/send-otp', { phone });
export const verifyOTP = (phone, code, name) => API.post('/auth/verify-otp', { phone, code, name });
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders');
export const getMyOrder = (id) => API.get(`/orders/${id}`);

// Admin
export const adminLogin = (email, password) => API.post('/admin/login', { email, password });
export const getAdminStats = () => API.get('/admin/stats');
export const getAllOrders = (params) => API.get('/admin/orders', { params });
export const updateOrderStatus = (id, status, note) => API.put(`/admin/orders/${id}/status`, { status, note });
export const createProduct = (data) => API.post('/admin/products', data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);

export default API;