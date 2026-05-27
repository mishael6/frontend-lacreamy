import { useState } from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './PastryCard.module.css';

export default function PastryCard({ pastry, delay = 0 }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem({
      id: pastry._id || pastry.id,
      name: pastry.name,
      price: pastry.price,
      gradient: pastry.gradient || '',
      image: pastry.image || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasImage = pastry.image && pastry.image !== '' && !imgError;

  return (
    <div className={styles.card} style={{ animationDelay: `${delay}ms` }}>
      <div
        className={styles.imageWrap}
        style={{ background: hasImage ? '#f0ece4' : (pastry.gradient || 'linear-gradient(135deg, #F5E9C8 0%, #E8CC8A 100%)') }}
      >
        {hasImage ? (
          <img
            src={pastry.image}
            alt={pastry.name}
            className={styles.productImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.noImage}>
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}
        {pastry.badge && (
          <span className={styles.badge}>{pastry.badge}</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{pastry.category}</span>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill="currentColor" />
            ))}
          </div>
        </div>

        <h3 className={styles.name}>{pastry.name}</h3>
        <p className={styles.desc}>{pastry.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>GH&#8373; {Number(pastry.price).toFixed(2)}</span>
          <button
            className={`${styles.addBtn} ${added ? styles.added : ''}`}
            onClick={handleAdd}
          >
            {added ? 'Added!' : (
              <>
                <ShoppingBag size={14} />
                Add to Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}