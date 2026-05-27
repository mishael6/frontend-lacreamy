import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendOTP } from '../../services/api';
import { User, Phone } from 'lucide-react';
import styles from './Auth.module.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 9) return setError('Please enter a valid phone number.');
    setLoading(true);
    try {
      await sendOTP(phone);
      navigate('/verify-otp', { state: { phone, name, isSignup: true } });
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
          <h1>Create Account</h1>
          <p>Join LaCreamy to track your orders</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full Name</label>
            <div className={styles.inputWithIcon}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="e.g. Akosua Mensah"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

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
        <div className={styles.divider}><span>Already have an account?</span></div>
        <Link to="/login" className={styles.secondaryLink}>Login instead</Link>
      </div>
    </div>
  );
}