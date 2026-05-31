import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Order from './pages/Order';

// Auth pages
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';

// Customer Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Admin Panel
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Auth */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Customer Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Panel */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>

                {/* Public pages */}
                <Route path="/" element={<><Navbar /><CartDrawer /><Home /><Footer /></>} />
                <Route path="/menu" element={<><Navbar /><CartDrawer /><Menu /><Footer /></>} />
                <Route path="/about" element={<><Navbar /><CartDrawer /><About /><Footer /></>} />
                <Route path="/order" element={<><Navbar /><CartDrawer /><Order /><Footer /></>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}