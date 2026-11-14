import { ArrowUpRight } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.copyEnter}>
          <h1>Your Daily Dose<br />of Freshness</h1>
          <p className={styles.intro}>Premium bread and cookies<br />made from scratch</p>
          <a className={styles.roundLink} href="#bestsellers" aria-label="Shop now, see bestsellers">
            <svg className={styles.roundText} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <defs>
                <path id="shopNowCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text>
                <textPath href="#shopNowCircle">SHOP NOW · SHOP NOW · SHOP NOW ·</textPath>
              </text>
            </svg>
            <i><ArrowUpRight size={23} strokeWidth={1.6} /></i>
          </a>
        </div>
      </div>
      <div className={styles.visual}>
        <img className={styles.mainPhoto} src="/cakes-hero.png" alt="Golden waffles topped with strawberries, cream, and chocolate" />
      </div>
      <img className={styles.chocolateDrip} src="/chocolate-drip.png" alt="" aria-hidden="true" />
    </section>
  );
}
