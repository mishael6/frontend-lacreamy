'use client';

import { useNavigate } from '../navigation';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

const DELIVERY_FEE = 10;

export default function CartDrawer() {
  const { cart, count, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  const continueToCheckout = () => {
    setIsOpen(false);
    navigate('/order');
  };

  if (!isOpen) return null;

  return (
    <>
      <button className={styles.backdrop} onClick={() => setIsOpen(false)} aria-label="Close cart" />
      <aside className={styles.drawer} aria-label="Shopping cart">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={20} />
            <h2>Your bag</h2>
            {count > 0 && <span className={styles.count}>{count}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close cart"><X size={20} /></button>
        </div>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={45} strokeWidth={1.2} />
            <p>Your bag is empty</p>
            <small>Add something freshly baked from the menu.</small>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {cart.map(item => (
                <div className={styles.item} key={item._id || item.id}>
                  <div className={styles.itemVisual}>
                    {item.image ? <img src={item.image} alt="" /> : <ShoppingBag size={20} strokeWidth={1.2} />}
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>GH₵ {Number(item.price).toFixed(2)} each</p>
                  </div>
                  <div className={styles.itemQty} aria-label={`Quantity of ${item.name}`}>
                    <button onClick={() => updateQty(item._id || item.id, item.qty - 1)} aria-label={`Remove one ${item.name}`}><Minus size={12} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id || item.id, item.qty + 1)} aria-label={`Add one ${item.name}`}><Plus size={12} /></button>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeItem(item._id || item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}><span>Subtotal</span><span className={styles.totalAmt}>GH₵ {total.toFixed(2)}</span></div>
              <p className={styles.checkoutNote}>Delivery fee: GH₵ {DELIVERY_FEE.toFixed(2)}</p>
              <button className={styles.proceedBtn} onClick={continueToCheckout}>
                Continue to checkout <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
