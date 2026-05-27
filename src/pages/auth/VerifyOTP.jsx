import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOTP, sendOTP } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { KeyRound } from 'lucide-react';
import styles from './Auth.module.css';

export default function VerifyOTP() {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setIsOpen } = useCart();

  const phone = location.state?.phone;
  const name = location.state?.name || '';
  const isSignup = location.state?.isSignup || false;
  const from = location.state?.from || '/';
  const openCart = location.state?.openCart || false;

  useEffect(() => {
    if (!phone) navigate(isSignup ? '/signup' : '/login');
  }, [phone, navigate, isSignup]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigit = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      setCode(pasted.split(''));
      inputs.current[3]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) return setError('Please enter the 4-digit code.');
    setLoading(true);
    setError('');
    try {
      const res = await verifyOTP(phone, fullCode, name);
      const { token, user } = res.data;
      login(token, user);
      navigate(from);
      if (openCart) setTimeout(() => setIsOpen(true), 300);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError('');
    try {
      await sendOTP(phone);
      setCode(['', '', '', '']);
      setCountdown(60);
      inputs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.otpLogoIcon}>
            <KeyRound size={32} strokeWidth={1.5} />
          </div>
          <h1>Enter OTP</h1>
          <p>We sent a 4-digit code to <strong>{phone}</strong></p>
        </div>

        <div className={styles.form}>
          <div className={styles.otpGrid} onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`${styles.otpInput} ${digit ? styles.otpFilled : ''}`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.submitBtn}
            onClick={handleVerify}
            disabled={loading || code.join('').length !== 4}
          >
            {loading ? <span className={styles.spinner} /> : isSignup ? 'Create Account' : 'Login'}
          </button>

          <button
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={countdown > 0 || resending}
          >
            {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>

        <Link to={isSignup ? '/signup' : '/login'} className={styles.backLink}>
          Change phone number
        </Link>
      </div>
    </div>
  );
}