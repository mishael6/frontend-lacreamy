import { useState } from 'react';
import { Minus, Plus, MessageCircle, Trash2, ShoppingBag } from 'lucide-react';
import PastryCard from '../components/PastryCard';
import { pastries, categories, ADMIN_WHATSAPP } from '../data/pastries';
import { useCart } from '../context/CartContext';
import styles from './Order.module.css';

export default function Order() {
  const { cart, removeItem, updateQty, clearCart, total } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const filtered = pastries.filter(p =>
    activeCategory === 'all' || p.category === activeCategory
  );

  const sendOrder = () => {
    if (!name.trim() || !phone.trim() || cart.length === 0) return;

    const lines = cart.map(i =>
      `  • ${i.name} × ${i.qty} — GH₵ ${(i.price * i.qty).toFixed(2)}`
    );

    const msg = [
      `🥐 *New LaCreamy Order*`,
      ``,
      `*Customer:* ${name}`,
      `*Phone:* ${phone}`,
      address ? `*Delivery Address:* ${address}` : '',
      note ? `*Note:* ${note}` : '',
      ``,
      `*Items:*`,
      ...lines,
      ``,
      `*Order Total: GH₵ ${total.toFixed(2)}*`,
      ``,
      `_Ordered via LaCreamy website_`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    clearCart();
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>Place an Order</p>
        <h1 className={styles.title}>Order Online</h1>
        <p className={styles.sub}>Pick your pastries, fill in your details, and we'll confirm via WhatsApp.</p>
      </div>

      <div className={styles.layout}>
        {/* Menu panel */}
        <div className={styles.menuPanel}>
          <h2 className={styles.panelTitle}>
            <ShoppingBag size={18} />
            Choose Your Pastries
          </h2>

          <div className={styles.tabs}>
            {categories.map(c => (
              <button
                key={c.id}
                className={`${styles.tab} ${activeCategory === c.id ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map((p, i) => (
              <PastryCard key={p.id} pastry={p} delay={i * 60} />
            ))}
          </div>
        </div>

        {/* Order summary + details */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <h2 className={styles.panelTitle}>Your Order</h2>

            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <span>🛒</span>
                <p>Nothing here yet. Add some pastries from the menu!</p>
              </div>
            ) : (
              <div className={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <span className={styles.cartEmoji}>{item.emoji}</span>
                    <div className={styles.cartItemInfo}>
                      <p>{item.name}</p>
                      <p className={styles.cartItemPrice}>GH₵ {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                    </div>
                    <button className={styles.removeItem} onClick={() => removeItem(item.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalAmt}>GH₵ {total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className={styles.formSection}>
              <h3 className={styles.formTitle}>Your Details</h3>

              <div className={styles.field}>
                <label>Full Name *</label>
                <input type="text" placeholder="Akosua Mensah" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Phone Number *</label>
                <input type="tel" placeholder="0241234567" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Delivery Address <span>(optional)</span></label>
                <input type="text" placeholder="e.g. 12 Cantonments Rd, Accra" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Special Requests <span>(optional)</span></label>
                <textarea
                  placeholder="Allergies, gift wrapping, delivery time..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {sent ? (
              <div className={styles.successMsg}>
                <span>🎉</span>
                <p>Order sent! Check WhatsApp for confirmation.</p>
              </div>
            ) : (
              <button
                className={styles.submitBtn}
                onClick={sendOrder}
                disabled={!name.trim() || !phone.trim() || cart.length === 0}
              >
                <MessageCircle size={18} />
                Send Order via WhatsApp
              </button>
            )}

            <p className={styles.disclaimer}>
              Tapping the button will open WhatsApp with your order details. We'll confirm your order within minutes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}