import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'Our Story' },
    { to: '/order', label: 'Order Now' },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.jpg" alt="LaCreamy" className={styles.logoImg} />
          <span className={styles.logoText}>LaCreamy</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.link} ${location.pathname === l.to ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={styles.cartBtn} onClick={() => setIsOpen(true)} aria-label="Open cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>

          <button
            className={`${styles.iconBtn} ${styles.hamburger}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={styles.mobileLink}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}