'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts({ available: 'true' });
      setProducts((res.data.products || []).filter(product => product.isAvailable));
    } catch {
      setError('We could not load the product catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter(p => {
    const matchCat = active === 'all' || p.category === active;
    const matchSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
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

      {!loading && error && (
        <div className={styles.empty} role="alert">
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={loadProducts}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <p>{products.length === 0 ? 'No products are available right now. Please check back soon.' : 'No products match your search or category.'}</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((p, i) => (
            <PastryCard key={p._id} pastry={p} delay={i * 80} />
          ))}
        </div>
      )}
    </main>
  );
}
