import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Auth.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      loginAdmin(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/logo.jpg" alt="LaCreamy" className={styles.logoImg} />
          <h1>Admin Login</h1>
          <p>LaCreamy Dashboard Access</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email Address</label>
            <div className={styles.inputWithIcon}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="admin@lacreamy.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                placeholder="Password"
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
            {loading ? <span className={styles.spinner} /> : 'Login to Dashboard'}
          </button>
        </form>

        <div className={styles.divider}><span>Customer?</span></div>
        <Link to="/login" className={styles.secondaryLink}>Go to Customer Login</Link>
      </div>
    </div>
  );
}