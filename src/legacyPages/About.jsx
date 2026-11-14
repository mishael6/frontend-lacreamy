'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChefHat, Leaf, Heart, Award } from 'lucide-react';
import styles from './About.module.css';

import mabelImg from '../assets/mabel.jpg';
import saimImg from '../assets/drsaim.jpg';
import deliveryImg from '../assets/delivery.jpg';

const team = [
  { name: 'Mrs. Mabel Saim', role: 'Head Pastry Chef', years: '8 years', image: mabelImg },
  { name: 'Dr. Saim', role: 'Artisan Baker', years: '6 years', image: saimImg },
  { name: 'Ayaga Agyebaworo', role: 'Chocolate Specialist', years: '5 years', image: deliveryImg },
];

const values = [
  { icon: Leaf, title: 'Ingredients with intention', detail: 'Quality ingredients and seasonal produce from Ashanti farms.' },
  { icon: Heart, title: 'Made with patience', detail: 'Carefully laminated dough, rested for the texture we love.' },
  { icon: Award, title: 'Craft in every detail', detail: 'Each bake is finished by hand, fresh for the people we serve.' },
];

const milestones = [
  { year: '2019', title: 'A small beginning', event: 'LaCreamy opens its first location in Jachie, Kumasi.' },
  { year: '2020', title: 'Finding new ways', event: 'We launch delivery, reach more neighbours, and grow our customer community.' },
  { year: '2021', title: 'Made for celebrations', event: 'Catering and wedding cakes become part of the LaCreamy story.' },
  { year: '2024', title: 'Sharing the craft', event: 'We begin a paid learning program for students to gain hands-on bakery experience.' },
  { year: '2025', title: 'Growing together', event: 'LaCreamy expands to multiple locations across Kumasi, including university communities.' },
];

const easing = [0.22, 1, 0.36, 1];

export default function About() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.18 },
    transition: { duration: 0.65, ease: easing },
  };

  return (
    <main className={styles.page}>
      <motion.section
        className={styles.hero}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: easing }}
      >
        <div className={styles.heroContent}>
          <p className={styles.label}><span /> Our story · Kumasi, Ghana</p>
          <h1 className={styles.title}>A love letter<br /><em>to good pastry.</em></h1>
          <p className={styles.intro}>
            LaCreamy began in a small kitchen in Kumasi with one croissant recipe, a rented oven,
            and a belief that our city deserved world-class artisan pastry.
          </p>
          <a className={styles.heroLink} href="#our-journey">Discover our story <span aria-hidden="true">↓</span></a>
        </div>
        <span className={styles.heroCaption}>Fresh from our kitchen, since 2019</span>
      </motion.section>

      <motion.section className={styles.story} {...reveal}>
        <div className={styles.storyText}>
          <p className={styles.sectionLabel}>What matters to us</p>
          <h2>Good pastry takes<br /><em>time and care.</em></h2>
          <p>
            We do not cut corners. Croissant dough is folded, rested, and baked until every layer
            is light and crisp. Tarts are made from scratch, and each cream is prepared fresh.
          </p>
          <p>
            We believe patience is an ingredient. We pair it with thoughtful sourcing, working
            with local farms for eggs, dairy, and seasonal fruit whenever we can.
          </p>
        </div>
        <div className={styles.values}>
          {values.map(({ icon: Icon, title, detail }, index) => (
            <motion.article
              key={title}
              className={styles.valueCard}
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.12, ease: easing }}
            >
              <span className={styles.valueIcon}><Icon size={20} strokeWidth={1.6} /></span>
              <div><h3>{title}</h3><p>{detail}</p></div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className={styles.timeline} id="our-journey" {...reveal}>
        <div className={styles.timelineHeader}>
          <p className={styles.sectionLabel}>Our journey</p>
          <h2 className={styles.timelineTitle}>Growing with<br /><em>our community.</em></h2>
          <p>Every chapter has been shaped by the people who bake with us and welcome us into their celebrations.</p>
        </div>
        <div className={styles.milestones}>
          {milestones.map((milestone, index) => (
            <motion.article
              key={milestone.year}
              className={styles.milestone}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.1, ease: easing }}
            >
              <span className={styles.milestoneDot} aria-hidden="true" />
              <div className={styles.eventCard}>
                <span className={styles.year}>{milestone.year}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.event}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className={styles.teamSection} {...reveal}>
        <div className={styles.teamHeader}>
          <p className={styles.sectionLabel}>The people behind the pastry</p>
          <h2>Made by hand.<br /><em>Made by us.</em></h2>
        </div>
        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <motion.article
              key={member.name}
              className={styles.teamCard}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.22 }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.12, ease: easing }}
            >
              <img src={member.image.src} alt={member.name} className={styles.avatarImg} />
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamYears}>{member.years} of experience</p>
              </div>
              <ChefHat className={styles.teamMark} size={18} strokeWidth={1.5} aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
