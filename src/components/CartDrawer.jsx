import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './CartDrawer.module.css';

const ADMIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '233241234567';
const DELIVERY_FEE = 10;

export default function CartDrawer() {
  const { cart, removeItem, updateQty, clearCart, total, isOpen, setIsOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('cart'); // cart | details
  const [note, setNote] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [sent, setSent] = useState(false);

  const grandTotal = total + DELIVERY_FEE;

  const handleCheckout = () => {
    if (!user) {
      // Save cart state and redirect to login
      setIsOpen(false);
      navigate('/login', { state: { from: '/', openCart: true } });
      return;
    }
    setStep('details');
  };

  const sendWhatsApp = () => {
    const lines = cart.map(i =>
      `  - ${i.name} x${i.qty} = GH${(i.price * i.qty).toFixed(2)}`
    );

    const msg = [
      `*New LaCreamy Order*`,
      ``,
      `*Customer:* ${user.name}`,
      `*Phone:* ${user.phone}`,
      address ? `*Delivery Address:* ${address}` : '',
      note ? `*Note:* ${note}` : '',
      ``,
      `*Items:*`,
      ...lines,
      ``,
      `*Subtotal:* GHC ${total.toFixed(2)}`,
      `*Delivery Fee:* GHC ${DELIVERY_FEE.toFixed(2)}`,
      `*Total:* GHC ${grandTotal.toFixed(2)}`,
      ``,
      `_Ordered via LaCreamy website_`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    clearCart();
    setSent(true);
    setStep('cart');
    setNote('');
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={() => { setIsOpen(false); setStep('cart'); }} />
      <aside className={styles.drawer}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={20} />
            <h2>Your Order</h2>
            {cart.length > 0 && (
              <span className={styles.count}>{cart.reduce((s, i) => s + i.qty, 0)}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={() => { setIsOpen(false); setStep('cart'); }}>
            <X size={20} />
          </button>
        </div>

        {/* Success message */}
        {sent && (
          <div className={styles.successMsg}>
            <p>Order sent! Check WhatsApp for confirmation.</p>
          </div>
        )}

        {/* Empty cart */}
        {!sent && cart.length === 0 && (
          <div className={styles.empty}>
            <ShoppingBag size={48} strokeWidth={1} />
            <p>Your order is empty</p>
            <small>Add some pastries to get started!</small>
          </div>
        )}

        {/* Cart items */}
        {!sent && cart.length > 0 && (
          <>
            {step === 'cart' && (
              <div className={styles.items}>
                {cart.map(item => (
                  <div key={item.id} className={styles.item}>
                    <div
                      className={styles.itemVisual}
                      style={{ background: item.image ? 'transparent' : (item.gradient || '#F5E9C8') }}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <ShoppingBag size={20} strokeWidth={1} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>GHC {item.price.toFixed(2)} each</p>
                    </div>
                    <div className={styles.itemQty}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>
                        <Minus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Details step */}
            {step === 'details' && (
              <div className={styles.details}>
                {/* User info - pre-filled */}
                <div className={styles.userInfo}>
                  <p className={styles.userInfoLabel}>Ordering as</p>
                  <p className={styles.userName}>{user?.name}</p>
                  <p className={styles.userPhone}>{user?.phone}</p>
                </div>

                <div className={styles.field}>
                  <label>Delivery Address <span>(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Cantonments Rd, Accra"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
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

                {/* Order summary */}
                <div className={styles.summary}>
                  {cart.map(i => (
                    <div key={i.id} className={styles.summaryLine}>
                      <span>{i.name} x{i.qty}</span>
                      <span>GHC {(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className={styles.summaryLine}>
                    <span>Delivery Fee</span>
                    <span>GHC {DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmt}>GHC {grandTotal.toFixed(2)}</span>
              </div>

              {step === 'cart' && (
                <>
                  {!user ? (
                    // Not logged in — show login prompt
                    <div className={styles.loginPrompt}>
                      <p>Login to complete your order</p>
                      <button
                        className={styles.loginBtn}
                        onClick={handleCheckout}
                      >
                        <LogIn size={18} />
                        Login to Checkout
                      </button>
                    </div>
                  ) : (
                    // Logged in — proceed to details
                    <button className={styles.proceedBtn} onClick={() => setStep('details')}>
                      Proceed to Order
                    </button>
                  )}
                </>
              )}

              {step === 'details' && (
                <div className={styles.detailsActions}>
                  <button className={styles.backBtn} onClick={() => setStep('cart')}>
                    Back
                  </button>
                  <button className={styles.whatsappBtn} onClick={sendWhatsApp}>
                    <MessageCircle size={18} />
                    Pay via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}