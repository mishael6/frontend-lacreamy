import { useState } from 'react';
import { ShoppingBag, Star, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './PastryCard.module.css';

export default function PastryCard({ pastry, delay = 0, variant }) {
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

  const image = variant === 'showcase' ? '' : (pastry.image || '');
  const hasImage = Boolean(image) && !imgError;

  return (
    <div className={`${styles.card} ${variant === 'showcase' ? styles.showcase : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <div
        className={styles.imageWrap}
        style={{ background: hasImage ? '#FFFFFF' : '#F9F8F5' }}
      >
        {hasImage ? (
          <img
            src={image}
            alt={pastry.name}
            className={styles.productImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.noImage}>
            <><ImageIcon size={25} strokeWidth={1.2} /><span>Image placeholder</span></>
          </div>
        )}
        {pastry.badge && (
          <span className={styles.badge}>{pastry.badge}</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{pastry.category}</span>
          {variant !== 'showcase' && <div className={styles.stars}>
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          </div>}
        </div>

        <h3 className={styles.name}>{pastry.name}</h3>
        <p className={styles.desc}>{pastry.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>GH&#8373; {Number(pastry.price).toFixed(2)}</span>
          {variant === 'showcase' && <span className={styles.featuredLabel}><Star size={11} fill="currentColor" /> Bestseller</span>}
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
