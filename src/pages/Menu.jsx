import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PastryCard from '../components/PastryCard';
import { getProducts } from '../services/api';
import styles from './Menu.module.css';

const categories = [
  { id: 'all', label: 'All Pastries' },
  { id: 'croissants', label: 'Croissants' },
  { id: 'cakes', label: 'Cakes' },
  { id: 'tarts', label: 'Tarts' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'bread', label: 'Artisan Bread' },
  { id: 'seasonal', label: 'Seasonal' },
];

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data.products || []))
      .catch(err => console.error('Menu fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = active === 'all' || p.category === active;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>Our Offerings</p>
        <h1 className={styles.title}>The Menu</h1>
        <p className={styles.sub}>
          Every item crafted in-house, every morning. No shortcuts, no compromises.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          {categories.map(c => (
            <button
              key={c.id}
              className={`${styles.tab} ${active === c.id ? styles.activeTab : ''}`}
              onClick={() => setActive(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.search}
            placeholder="Search pastries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className={styles.empty}>
          <div className={styles.spinner} />
          <p>Loading menu...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No pastries found.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((p, i) => (
            <PastryCard key={p._id} pastry={p} delay={i * 80} />
          ))}
        </div>
      )}
    </main>
  );
}