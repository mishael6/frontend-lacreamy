'use client';

import { useEffect, useState } from 'react';
import { useNavigate, Link } from '../navigation';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Croissant, LoaderCircle,
  MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import styles from './Order.module.css';

const DELIVERY_FEE = 10;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function formatPrice(amount) {
  return `GH₵ ${Number(amount || 0).toFixed(2)}`;
}

export default function Order() {
  const { cart, count, removeItem, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const totalWithDelivery = total + DELIVERY_FEE;

  useEffect(() => {
    if (user?.address) setAddress(user.address);
  }, [user?.address]);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError('');

    if (!user) {
      navigate('/login?from=%2Forder');
      return;
    }
    if (!cart.length) {
      setError('Your cart is empty. Add something from the menu to continue.');
      return;
    }
    if (!address.trim()) {
      setError('Enter a delivery address to place your order.');
      return;
    }

    const items = cart.map(item => ({
      productId: String(item._id || item.id),
      qty: item.qty,
    }));
    if (items.some(item => !OBJECT_ID_PATTERN.test(item.productId))) {
      setError('Some items in your cart are not connected to the live product list. Refresh the menu and add them again.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await placeOrder({
        items,
        deliveryAddress: address.trim(),
        specialNote: note.trim(),
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'We could not place your order. Please try again.');
      }
      setOrderNumber(response.data.order?.orderNumber || '');
      clearCart();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <main className={styles.page}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}><CheckCircle2 size={27} /></span>
          <p className={styles.eyebrow}>Order received</p>
          <h1>Thank you, {user?.name?.split(' ')[0] || 'we have it'}.</h1>
          <p className={styles.successCopy}>Your order <strong>{orderNumber}</strong> is in. We’ll follow up with the next steps.</p>
          <div className={styles.successActions}>
            <Link to="/dashboard" className={styles.primaryButton}>View my orders <ArrowRight size={16} /></Link>
            <Link to="/menu" className={styles.backLink}>Back to the menu</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>LaCreamy checkout</p>
        <h1>Make it yours.</h1>
        <p>Review your basket and share where you’d like us to deliver.</p>
      </header>

      <form className={styles.checkoutLayout} onSubmit={handlePlaceOrder}>
        <div className={styles.checkoutMain}>
          <section className={styles.panel} aria-labelledby="cart-heading">
            <div className={styles.panelHeading}>
              <div><span className={styles.stepNumber}>01</span><h2 id="cart-heading">Your basket</h2></div>
              <span className={styles.itemCount}>{count} {count === 1 ? 'item' : 'items'}</span>
            </div>

            {!cart.length ? (
              <div className={styles.emptyCart}>
                <ShoppingBag size={28} strokeWidth={1.5} />
                <h3>Your basket is waiting</h3>
                <p>Choose something freshly baked to start your order.</p>
                <Link to="/menu" className={styles.secondaryButton}>Browse products <ArrowRight size={15} /></Link>
              </div>
            ) : (
              <>
                <div className={styles.cartList}>
                  {cart.map(item => (
                    <article className={styles.cartItem} key={item._id || item.id}>
                      <div className={styles.productPlaceholder} aria-hidden="true"><Croissant size={22} strokeWidth={1.4} /></div>
                      <div className={styles.productInfo}>
                        <h3>{item.name}</h3>
                        <p>{formatPrice(item.price)} each</p>
                      </div>
                      <div className={styles.quantityControl} aria-label={`Quantity of ${item.name}`}>
                        <button type="button" onClick={() => updateQty(item._id || item.id, item.qty - 1)} aria-label={`Remove one ${item.name}`}><Minus size={13} /></button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item._id || item.id, item.qty + 1)} aria-label={`Add one ${item.name}`}><Plus size={13} /></button>
                      </div>
                      <strong className={styles.lineTotal}>{formatPrice(item.price * item.qty)}</strong>
                      <button type="button" className={styles.removeButton} onClick={() => removeItem(item._id || item.id)} aria-label={`Remove ${item.name} from basket`}><Trash2 size={15} /></button>
                    </article>
                  ))}
                </div>
                <Link to="/menu" className={styles.continueLink}><ArrowLeft size={14} /> Continue shopping</Link>
              </>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="delivery-heading">
            <div className={styles.panelHeading}>
              <div><span className={styles.stepNumber}>02</span><h2 id="delivery-heading">Delivery details</h2></div>
              <MapPin size={18} className={styles.headingIcon} />
            </div>
            {user ? (
              <div className={styles.customerCard}>
                <span className={styles.customerInitial}>{user.name?.charAt(0)?.toUpperCase() || 'L'}</span>
                <div><strong>{user.name}</strong><span>{user.phone}</span></div>
                <span className={styles.accountLabel}>Your account</span>
              </div>
            ) : (
              <div className={styles.signInPrompt}>
                <div><strong>Sign in to place your order</strong><span>Your basket will be here when you return.</span></div>
                <button type="button" className={styles.signInButton} onClick={() => navigate('/login?from=%2Forder')}>Sign in <ArrowRight size={15} /></button>
              </div>
            )}

            <label className={styles.fieldLabel} htmlFor="delivery-address">Delivery address</label>
            <textarea
              id="delivery-address"
              className={styles.textInput}
              placeholder="Street, area and any useful delivery directions"
              value={address}
              onChange={event => setAddress(event.target.value)}
              rows={3}
              required={Boolean(user)}
              disabled={!user}
            />
            <label className={styles.fieldLabel} htmlFor="order-note">Note for the bakery <span>Optional</span></label>
            <textarea
              id="order-note"
              className={styles.textInput}
              placeholder="Allergies, a special occasion or delivery instructions"
              value={note}
              onChange={event => setNote(event.target.value)}
              rows={2}
              disabled={!user}
            />
          </section>
        </div>

        <aside className={styles.summaryPanel} aria-label="Order summary">
          <div className={styles.summaryHeading}><h2>Order summary</h2><ShoppingBag size={18} /></div>
          <div className={styles.summaryLines}>
            <div><span>Items ({count})</span><strong>{formatPrice(total)}</strong></div>
            <div><span>Delivery</span><strong>{formatPrice(DELIVERY_FEE)}</strong></div>
          </div>
          <div className={styles.grandTotal}><span>Total</span><strong>{formatPrice(totalWithDelivery)}</strong></div>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          <button className={styles.checkoutButton} type="submit" disabled={!cart.length || submitting || !user || !address.trim()}>
            {submitting ? <><LoaderCircle size={17} className={styles.spinner} /> Placing order…</> : <>Place order <ArrowRight size={16} /></>}
          </button>
          {!user && <p className={styles.checkoutHint}>Sign in above to finish checkout.</p>}
          <div className={styles.trustNote}><ShieldCheck size={17} /><span>Your order is placed securely through your LaCreamy account.</span></div>
          <p className={styles.paymentNote}>Our team will follow up with delivery and payment details.</p>
        </aside>
      </form>
    </main>
  );
}
