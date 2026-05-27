import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sendOTP } from '../../services/api';
import { Phone } from 'lucide-react';
import styles from './Auth.module.css';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const openCart = location.state?.openCart || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 9) return setError('Please enter a valid phone number.');
    setLoading(true);
    try {
      await sendOTP(phone);
      navigate('/verify-otp', { state: { phone, isSignup: false, from, openCart } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Send OTP'}
          </button>
        </form>

        <p className={styles.footnote}>We will send a 4-digit code to verify your number.</p>
        <div className={styles.divider}><span>New to LaCreamy?</span></div>
        <Link to="/signup" className={styles.secondaryLink}>Create an account</Link>
        <div className={styles.divider}><span>Admin?</span></div>
        <Link to="/admin/login" className={styles.adminLink}>Go to Admin Login</Link>
      </div>
    </div>
  );
}