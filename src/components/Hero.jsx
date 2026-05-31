import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Clock, Package } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>
          <Star size={12} fill="currentColor" />
          <span>Artisan Bakery - Est. 2022</span>
          <Star size={12} fill="currentColor" />
        </div>

        <h1 className={styles.headline}>
          <span className={styles.line1}>Crafted with</span>
          <span className={styles.line2}>Love and Butter</span>
        </h1>

        <p className={styles.sub}>
          Every pastry is hand-made daily with locally sourced ingredients,
          French techniques, and an obsessive attention to flavour.
        </p>

        <div className={styles.actions}>
          <Link to="/menu" className={styles.primaryBtn}>
            Browse the Menu
            <ArrowRight size={18} />
          </Link>
          <Link to="/order" className={styles.secondaryBtn}>
            Order Now
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>50+</span>
            <span className={styles.statLabel}>Pastry Varieties</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Daily</span>
            <span className={styles.statLabel}>Fresh Baked</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>5 Star</span>
            <span className={styles.statLabel}>Rated by Customers</span>
          </div>
        </div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.ringOuter}>
          <div className={styles.ringInner}>
            <div className={styles.centerPiece}>
              <Award size={64} strokeWidth={1} className={styles.centerIcon} />
            </div>
          </div>
        </div>
        <div className={styles.orbitItems}>
          {[Package, Star, Clock].map((Icon, i) => (
            <div
              key={i}
              className={styles.orbitItem}
              style={{
                transform: `rotate(${i * 120}deg) translateX(140px) rotate(-${i * 120}deg)`,
              }}
            >
              <Icon size={22} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}