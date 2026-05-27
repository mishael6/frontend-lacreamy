import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Phone, Leaf, ChefHat, Package, Truck } from 'lucide-react';
import Hero from '../components/Hero';
import PastryCard from '../components/PastryCard';
import { getProducts } from '../services/api';
import styles from './Home.module.css';

const features = [
  { icon: Leaf, title: 'Local Ingredients', desc: 'We source from Ghanaian farms and trusted local suppliers every morning.' },
  { icon: ChefHat, title: 'Trained Artisans', desc: 'Our pastry chefs trained under French patissiers with decades of experience.' },
  { icon: Clock, title: 'Freshly Baked Daily', desc: 'Nothing sits in a cabinet overnight. Every item is baked fresh from 5am.' },
  { icon: Truck, title: 'Same-Day Delivery', desc: 'Order before 12pm and receive your pastries by 5pm within Accra.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => {
        const products = res.data.products || [];
        const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
        setFeatured(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <main>
      <Hero />

      <section className={styles.features}>
        <div className={styles.featuresInner}>
          {features.map((f, i) => (
            <div key={i} className={styles.feature} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featureIcon}>
                <f.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>Our Finest</p>
              <h2 className={styles.sectionTitle}>Fan Favourites</h2>
            </div>
            <Link to="/menu" className={styles.viewAll}>
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.grid}>
            {featured.map((p, i) => (
              <PastryCard key={p._id} pastry={p} delay={i * 120} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <Package size={48} strokeWidth={1} className={styles.ctaIcon} />
          <h2>Ready to indulge?</h2>
          <p>Browse our full menu and place your order directly via WhatsApp. We will confirm within minutes.</p>
          <Link to="/order" className={styles.ctaBtn}>
            Start Your Order
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className={styles.info}>
        <div className={styles.infoInner}>
          <div className={styles.infoItem}>
            <Clock size={20} />
            <div>
              <strong>Opening Hours</strong>
              <p>Mon-Sat: 7am - 7pm</p>
              <p>Sunday: 8am - 4pm</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MapPin size={20} />
            <div>
              <strong>Location</strong>
              <p>12 Cantonments Road</p>
              <p>Accra, Ghana</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Phone size={20} />
            <div>
              <strong>Get in Touch</strong>
              <p>+233 24 123 4567</p>
              <p>lacreamy@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}