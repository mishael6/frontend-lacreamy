import { ChefHat, Leaf, Heart, Award, Users } from 'lucide-react';
import styles from './About.module.css';

const team = [
  { name: 'Adwoa Mensah', role: 'Head Pastry Chef', years: '8 years', icon: ChefHat },
  { name: 'Kwame Asante', role: 'Artisan Baker', years: '6 years', icon: Award },
  { name: 'Ama Darko', role: 'Chocolate Specialist', years: '5 years', icon: Heart },
];

const milestones = [
  { year: '2019', event: 'LaCreamy opens its first location in Cantonments, Accra.' },
  { year: '2020', event: 'We survived lockdown by launching our delivery service and doubled our customer base.' },
  { year: '2021', event: 'Featured in Eat Out Ghana Magazine as Best Artisan Bakery.' },
  { year: '2023', event: 'Launched our catering and wedding cake service.' },
  { year: '2025', event: 'Opened a second location in East Legon.' },
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
          LaCreamy started in a small kitchen in Cantonments with one croissant recipe, a rented oven,
          and an unwavering belief that Accra deserved world-class artisan pastry.
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
            with farms in the Eastern Region for our eggs, dairy, and seasonal fruits.
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

      <div className={styles.team}>
        <h2 className={styles.teamTitle}>Meet the Bakers</h2>
        <div className={styles.teamGrid}>
          {team.map((t, i) => (
            <div key={i} className={styles.teamCard} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={styles.teamAvatar}>
                <t.icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3>{t.name}</h3>
                <p className={styles.teamRole}>{t.role}</p>
                <p className={styles.teamYears}>{t.years} experience</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}