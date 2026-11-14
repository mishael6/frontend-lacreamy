import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import StorefrontLayout from '../../components/StorefrontLayout';
import styles from './Contact.module.css';

const locations = [
  { name: 'China Mall', area: 'Ahensan, Kumasi', query: 'LaCreamy China Mall Ahensan Kumasi' },
  { name: 'KNUST Independence Hostel', area: 'Kumasi', query: 'LaCreamy KNUST Independence Hostel Kumasi' },
  { name: 'Jachie', area: 'Kumasi', query: 'LaCreamy Jachie Kumasi' },
];

const hours = [
  ['Monday – Thursday', '8:00 am – 8:00 pm'],
  ['Friday – Saturday', '8:00 am – 8:00 pm'],
  ['Sunday', '8:00 am – 4:00 pm'],
  ['Public holidays', 'Closed'],
];

function ContactPageContent() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /> LaCreamy, Kumasi</p>
          <h1>Come for the pastry.<br /><em>Stay for the feeling.</em></h1>
          <p className={styles.intro}>
            We make thoughtful pastries, cakes and breads for everyday moments and celebrations.
            Visit one of our Kumasi locations, or get in touch about an order, a custom cake or catering.
          </p>
          <div className={styles.heroActions}>
            <Link href="/menu" className={styles.primaryButton}>Explore the menu <ArrowRight size={16} /></Link>
            <a href="https://wa.me/233246480618?text=Hello%20LaCreamy%2C%20I%27d%20like%20to%20make%20an%20enquiry." className={styles.textButton} target="_blank" rel="noreferrer">
              Chat with us <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <img className={styles.heroPhoto} src="/contact-chef.png" alt="LaCreamy chef presenting a freshly prepared dish" />
      </section>

      <section className={styles.contactBand} aria-label="Contact details">
        <a className={styles.contactItem} href="tel:+233246480618">
          <span className={styles.contactIcon}><Phone size={18} strokeWidth={1.6} /></span>
          <span><small>Call the bakery</small><strong>+233 246 480 618</strong></span>
          <ArrowUpRight className={styles.contactArrow} size={16} />
        </a>
        <a className={styles.contactItem} href="mailto:info@mblstwrt@gmail.com">
          <span className={styles.contactIcon}><Mail size={18} strokeWidth={1.6} /></span>
          <span><small>Email us</small><strong>info@mblstwrt@gmail.com</strong></span>
          <ArrowUpRight className={styles.contactArrow} size={16} />
        </a>
        <a className={styles.contactItem} href="https://wa.me/233246480618" target="_blank" rel="noreferrer">
          <span className={styles.contactIcon}><MessageCircle size={18} strokeWidth={1.6} /></span>
          <span><small>Order enquiries</small><strong>Message us on WhatsApp</strong></span>
          <ArrowUpRight className={styles.contactArrow} size={16} />
        </a>
      </section>

      <section className={styles.locationsSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Find your nearest LaCreamy</p>
            <h2>Three stops.<br /><em>One lovely treat.</em></h2>
          </div>
          <p>We are growing across Kumasi, with welcoming spots near the places you already go.</p>
        </div>

        <div className={styles.locationGrid}>
          {locations.map((location, index) => (
            <article className={styles.locationCard} key={location.name}>
              <span className={styles.locationNumber}>0{index + 1}</span>
              <MapPin size={20} strokeWidth={1.5} className={styles.locationPin} />
              <h3>{location.name}</h3>
              <p>{location.area}, Ghana</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`}
                target="_blank"
                rel="noreferrer"
                className={styles.directionsLink}
              >
                Get directions <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.businessStory}>
          <p className={styles.eyebrow}>A little about us</p>
          <h2>Good things take<br /><em>time and butter.</em></h2>
          <p>
            LaCreamy began in Jachie in 2019 with a love for well-made pastry. Today, our bakers make
            croissants, cakes, cookies and breads, alongside custom celebration cakes, wedding cakes
            and catering for special gatherings.
          </p>
          <Link href="/about" className={styles.textButton}>Our story <ArrowRight size={15} /></Link>
        </div>

        <div className={styles.hoursCard}>
          <div className={styles.hoursTitle}><span><Clock3 size={18} /></span><div><p className={styles.eyebrow}>Plan your visit</p><h3>Opening hours</h3></div></div>
          <div className={styles.hoursList}>
            {hours.map(([day, time]) => (
              <div className={styles.hoursRow} key={day}><span>{day}</span><strong>{time}</strong></div>
            ))}
          </div>
          <p className={styles.hoursFootnote}>For location-specific information, give us a call before making a special trip.</p>
        </div>
      </section>

      <section className={styles.cta}>
        <p className={styles.eyebrow}>Your next favourite bite is waiting</p>
        <h2>Let’s make something<br /><em>worth sharing.</em></h2>
        <div className={styles.ctaActions}>
          <Link href="/menu" className={styles.lightButton}>Browse the menu <ArrowRight size={16} /></Link>
          <a href="mailto:info@mblstwrt@gmail.com?subject=LaCreamy%20cake%20or%20catering%20enquiry" className={styles.ctaLink}>Ask about cakes or catering <ArrowUpRight size={15} /></a>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return <StorefrontLayout><ContactPageContent /></StorefrontLayout>;
}

export const metadata = {
  title: 'Contact LaCreamy | Bakery Locations in Kumasi',
  description: 'Find LaCreamy in Kumasi, view opening hours, or contact us about pastries, custom cakes and catering.',
};
