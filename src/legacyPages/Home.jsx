'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from '../navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import PastryCard from '../components/PastryCard';
import { getProducts } from '../services/api';
import { pastries } from '../data/pastries';
import styles from './Home.module.css';

const bakeryNotes = [
  {
    heading: 'A little joy in every bite.',
    body: 'From the first fold of pastry to the final golden bake, we make each batch with patience and care.',
    signature: 'From the LaCreamy kitchen',
  },
  {
    heading: 'Good things are better shared.',
    body: 'Bring home something buttery, sweet, and freshly made. There is always room for one more at the table.',
    signature: 'Made fresh in Kumasi',
  },
];

const easing = [0.22, 1, 0.36, 1];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [featured, setFeatured] = useState([1, 4, 8, 12].map(id => pastries.find(item => item.id === id)));
  const [activeNote, setActiveNote] = useState(0);
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.18 },
    transition: { duration: 0.65, ease: easing },
  };

  useEffect(() => {
    getProducts()
      .then(res => {
        const products = res.data.products || [];
        const featuredProducts = products.filter(p => p.isFeatured && p.isAvailable).slice(0, 4);
        setFeatured(products.length > 0 ? featuredProducts : [1, 4, 8, 12].map(id => pastries.find(item => item.id === id)));
      })
      .catch(() => {});
  }, []);

  return (
    <main className={styles.homeCanvas}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easing }}
      >
        <Hero />
      </motion.div>

      {featured.length > 0 && (
        <motion.section className={styles.section} id="bestsellers" {...reveal}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Our Bestsellers</h2>
          </div>
          <div className={styles.grid}>
            {featured.map((p, i) => (
              <motion.div
                key={p._id || p.id || p.name}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.1, ease: easing }}
              >
                <PastryCard pastry={p} delay={0} variant="showcase" />
              </motion.div>
            ))}
          </div>
          <Link to="/menu" className={styles.discover}>
            Discover the full menu <ArrowRight size={15} />
          </Link>
        </motion.section>
      )}

      <motion.section className={styles.story} {...reveal}>
        <div className={styles.storyVisual}>
          <h2>Tradition Meets Taste</h2>
          <div className={styles.storyImage}>
            <motion.img
              className={styles.storyPhoto}
              src="/chocolatecookies-story.png"
              alt="A selection of freshly baked cookies and chocolate treats"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, ease: easing }}
            />
          </div>
        </div>
        <div className={styles.storyCopy}>
          <p>We are a family-owned bakery dedicated to crafting delicious baked goods using the finest ingredients. Our passion for baking is in every bite, creating a taste that feels both comforting and unforgettable.</p>
          <Link to="/menu" className={styles.textLink}>Shop now <ArrowRight size={15} /></Link>
        </div>
      </motion.section>

      <motion.section className={styles.cookieFeature} {...reveal}>
        <motion.img
          className={styles.cookieImage}
          src="/cookies-feature.png"
          alt="A stack of freshly baked cookies"
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: easing }}
        />
        <div className={styles.cookieShade} />
        <div className={styles.cookieCopy}>
          <h2>Delicious Cookies</h2>
          <p>Golden edges, soft centres, and just enough chocolate. A good day starts with one.</p>
          <Link to="/menu" className={styles.lightButton}>Find your favourite <ArrowRight size={15} /></Link>
        </div>
      </motion.section>

      <motion.section className={styles.testimonial} {...reveal}>
        <h2>Why Our Customers Love<br />LaCreamy</h2>
        <div className={styles.reviewCarousel}>
          <button className={styles.carouselArrow} onClick={() => setActiveNote(index => (index + bakeryNotes.length - 1) % bakeryNotes.length)} aria-label="Previous story"><ArrowLeft size={18} /></button>
          <div className={styles.reviewImage}>
            <span className={styles.reviewShape} />
            <motion.img
              className={styles.reviewPhoto}
              src="/baker-testimonial.jfif"
              alt="LaCreamy baker presenting freshly baked treats"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, ease: easing }}
            />
          </div>
          <motion.div
            key={activeNote}
            className={styles.reviewCopy}
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easing }}
          >
            <h3>{bakeryNotes[activeNote].heading}</h3>
            <p>{bakeryNotes[activeNote].body}</p>
            <span>{bakeryNotes[activeNote].signature}</span>
          </motion.div>
          <button className={`${styles.carouselArrow} ${styles.nextArrow}`} onClick={() => setActiveNote(index => (index + 1) % bakeryNotes.length)} aria-label="Next story"><ArrowRight size={18} /></button>
        </div>
      </motion.section>

    </main>
  );
}
