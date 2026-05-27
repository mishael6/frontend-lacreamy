import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.jpg" alt="LaCreamy" className={styles.logoImg} />
            <span>LaCreamy</span>
          </div>
          <p>Handcrafted pastries baked fresh daily in Accra, Ghana. Because you deserve the real thing.</p>
        </div>

        <div className={styles.links}>
          <strong>Navigate</strong>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/order">Order Now</Link>
        </div>

        <div className={styles.links}>
          <strong>Contact</strong>
          <span className={styles.contactItem}>
            <MapPin size={14} /> 12 Cantonments Rd, Accra
          </span>
          <span className={styles.contactItem}>
            <Phone size={14} /> +233 24 123 4567
          </span>
          <span className={styles.contactItem}>
            <Mail size={14} /> lacreamy@gmail.com
          </span>
          <span className={styles.contactItem}>
            <Clock size={14} /> Mon-Sat: 7am-7pm
          </span>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} LaCreamy. All rights reserved.</p>
        <p>Made with love in Ghana</p>
      </div>
    </footer>
  );
}