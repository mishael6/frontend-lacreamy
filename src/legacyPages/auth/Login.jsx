'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNavigate, Link } from '../../navigation';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import styles from './Auth.module.css';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const requestedFrom = searchParams.get('from');
  const from = requestedFrom?.startsWith('/') && !requestedFrom.startsWith('//') ? requestedFrom : '/';
  const openCart = searchParams.get('openCart') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(phone, password);
      const data = res.data;
      if (!data.success) return setError(data.message);
      login(data.token, data.user);
      navigate(from);
      if (openCart) setTimeout(() => {}, 300);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not connect to the LaCreamy server. Make sure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/logo.jpg" alt="LaCreamy" className={styles.logoImg} />
          <h1>Welcome Back</h1>
          <p>Login to track and place orders</p>
          {openCart && <div className={styles.cartNote}>Login to complete your order</div>}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Phone Number</label>
            <div className={styles.phoneInput}>
              <Phone size={16} className={styles.phoneIcon} />
              <span className={styles.flag}>GH +233</span>
              <input
                type="tel"
                placeholder="024 123 4567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <div className={styles.passwordInput}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Login'}
          </button>
        </form>

        <div className={styles.divider}><span>New to LaCreamy?</span></div>
        <Link to="/signup" className={styles.secondaryLink}>Create an account</Link>
        {/* ... <div className={styles.divider}><span>Admin?</span></div>
        <Link to="/admin/login" className={styles.adminLink}>Go to Admin Login</Link> ... */}
      </div>
    </div>
  );
}
