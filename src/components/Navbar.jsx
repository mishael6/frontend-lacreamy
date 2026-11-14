import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Link } from '../navigation';
import { ShoppingBag, Menu, X, Search, UserRound } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.setAttribute('data-page', pathname === '/' ? 'home' : 'store');
    document.body.setAttribute('data-route', pathname);
  }, [pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About us' },
    { to: '/menu', label: 'Products' },
    { to: '/order', label: 'Order' },
    { to: '/contact', label: 'Contact us' },
  ];

  return (
    <nav className={`${styles.nav} ${pathname === '/' ? styles.homeNav : ''} ${pathname === '/about' ? styles.aboutNav : ''} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" aria-label="LaCreamy home" className={styles.logo}>
          <Image src="/logo.jpg" width={640} height={640} alt="LaCreamy Cakes" className={styles.logoImg} priority />
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.link} ${pathname === l.to ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/menu" className={styles.iconBtn} aria-label="Browse and search products"><Search size={17} /></Link>

          <button className={styles.cartBtn} onClick={() => setIsOpen(true)} aria-label="Open cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>

          <Link
            to={user ? '/dashboard' : '/login'}
            className={`${styles.iconBtn} ${styles.accountLink}`}
            aria-label={user ? `${user.name}'s account dashboard` : 'Sign in to your account'}
            title={user?.name || 'Customer account'}
          >
            <UserRound size={17} />
            {user?.name && <span className={styles.accountName}>{user.name}</span>}
          </Link>

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
