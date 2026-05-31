import { ChefHat, Leaf, Heart, Award, Users } from 'lucide-react';
import styles from './About.module.css';

import mabelImg from '../assets/mabel.jpg';
import saimImg from '../assets/drsaim.jpg';
import deliveryImg from '../assets/delivery.jpg';

const team = [
  { name: 'Mrs. Mabel Saim', role: 'Head Pastry Chef', years: '8 years', icon: ChefHat, image: mabelImg },
  { name: 'Dr. Saim', role: 'Artisan Baker', years: '6 years', icon: Award, image: saimImg },
  { name: 'Ayaga Agyebaworo', role: 'Chocolate Specialist', years: '5 years', icon: Heart, image: deliveryImg },
];

const milestones = [
  { year: '2019', event: 'LaCreamy opens its first location in Jachie, Kumasi.' },
  { year: '2020', event: 'We survived lockdown by launching our delivery service and doubled our customer base.' },
  { year: '2021', event: 'Launched our catering and wedding cake service.' },
  { year: '2024', event: 'Launched a program for students, where students can work with us to gain experience and get paid while in school.' },
  { year: '2025', event: 'LaCreamy has expanded to multiple locations across Kumasi, especially in the major universities in Ghana.' },
];

export default function About() {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.label}>Who We Are</p>
        <h1 className={styles.title}>
          A love letter<br />
          <em>to good pastry.</em>
        </h1>
        <p className={styles.intro}>
          LaCreamy started in a small kitchen in Kumasi with one croissant recipe, a rented oven,
          and an unwavering belief that Kumasi deserved world-class artisan pastry.
        </p>
      </div>

      <div className={styles.story}>
        <div className={styles.storyText}>
          <h2>Our Philosophy</h2>
          <p>
            We do not cut corners. Every croissant starts with hand-laminated dough that takes
            two days to make. Every tart shell is blind-baked until perfectly crisp. Every cream
            is whipped and piped by hand, to order.
          </p>
          <p>
            We believe the best ingredient is patience. The second best is local — we work directly
            with farms in Ashanti Region for our eggs, dairy, and seasonal fruits.
          </p>
        </div>
        <div className={styles.storyVisual}>
          {[Leaf, Heart, Award].map((Icon, i) => (
            <div key={i} className={styles.storyIcon} style={{ animationDelay: `${i * 0.3}s` }}>
              <Icon size={32} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        <h2 className={styles.timelineTitle}>Our Journey</h2>
        <div className={styles.milestones}>
          {milestones.map((m, i) => (
            <div key={i} className={styles.milestone} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.year}>{m.year}</div>
              <div className={styles.dot} />
              <div className={styles.event}>{m.event}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.teamGrid}>
        {team.map((t, i) => (
          <div key={i} className={styles.teamCard} style={{ animationDelay: `${i * 0.15}s` }}>
            {/* Updated Avatar Section */}
            <div className={styles.teamAvatar}>
              <img src={t.image} alt={t.name} className={styles.avatarImg} />
            </div>
            <div>
              <h3>{t.name}</h3>
              <p className={styles.teamRole}>{t.role}</p>
              <p className={styles.teamYears}>{t.years} experience</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}