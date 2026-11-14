'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, MapPin, Mail, Clock3 } from 'lucide-react';
import { Link } from '../navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    const subject = encodeURIComponent('LaCreamy newsletter signup');
    const body = encodeURIComponent(`Please add ${email.trim()} to the LaCreamy mailing list.`);
    window.location.href = `mailto:info@mblstwrt@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <h2>Exclusive Offers, New<br />Product Announcements</h2>
        <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
          <input
            type="email"
            aria-label="Your email address"
            placeholder="Enter your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
          <button type="submit" aria-label="Subscribe by email"><ArrowRight size={17} /></button>
        </form>
      </div>

      <div className={styles.inner}>
        <div className={styles.links}>
          <strong><MapPin size={14} /> Location</strong>
          <span>China Mall (Ahensan)</span>
          <span>KNUST Independence Hostel</span>
          <span>Jachie, Kumasi, Ghana</span>
          <a href="tel:+233246480618">+233 246 480 618</a>
        </div>

        <div className={styles.links}>
          <strong>Quick Links</strong>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/menu">Products</Link>
          <Link to="/contact">Contact us</Link>
        </div>

        <div className={styles.links}>
          <strong>Follow us</strong>
          <span>Facebook</span>
          <span>Instagram</span>
          <span>TikTok</span>
          <a href="mailto:info@mblstwrt@gmail.com"><Mail size={14} /> Email us</a>
        </div>

        <div className={styles.links}>
          <strong><Clock3 size={14} /> Opening Hours</strong>
          <div className={styles.hoursGrid}>
            <span>Monday–Thursday: 8:00–20:00</span>
            <span>Friday: 8:00–20:00</span>
            <span>Saturday: 8:00–20:00</span>
            <span>Sunday: 8:00–16:00</span>
            <span>Closed on holidays</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomBrand}>
          <Image src="/logo.jpg" width={640} height={640} alt="LaCreamy Cakes" className={styles.brandLogo} />
          <p>Copyright {new Date().getFullYear()} LaCreamy. All rights reserved.</p>
        </div>
        <div className={styles.paymentPlaceholders} aria-label="Payment logo placeholders for future upload">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>
    </footer>
  );
}
