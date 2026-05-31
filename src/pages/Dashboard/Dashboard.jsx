import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList, Receipt, Truck, LogOut, ShoppingBag,
  RefreshCw, CheckCircle, XCircle, Package, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Dashboard.module.css';

const STAGES = [
  { key: 'order_placed', label: 'Order Placed', icon: ShoppingBag },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'being_prepared', label: 'Being Prepared', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_COLORS = {
  order_placed: '#F2C94C',
  confirmed: '#3B82F6',
  being_prepared: '#F97316',
  out_for_delivery: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getStageIndex(status) {
  return STAGES.findIndex(s => s.key === status);
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('history');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
      if (res.data.orders?.length > 0) setSelectedOrder(res.data.orders[0]);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleSelectOrder = (order) => { setSelectedOrder(order); setTab('receipt'); };
  const handleTrack = (order) => { setSelectedOrder(order); setTab('track'); };

  const tabs = [
    { key: 'history', label: 'Orders', icon: ClipboardList },
    { key: 'receipt', label: 'Receipt', icon: Receipt },
    { key: 'track', label: 'Track', icon: Truck },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.logoWrap}>
              <img
                src="/logo.jpg"
                alt="LaCreamy"
                className={styles.headerLogo}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className={styles.logoFallback}>LC</div>
            </div>
            <div>
              <h1 className={styles.headerTitle}>LaCreamy</h1>
              <p className={styles.headerSub}>
                Welcome, {user?.name?.split(' ')[0] || 'Customer'}
              </p>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.themeBtn} onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className={styles.shopBtn} onClick={() => navigate('/')}>
              <ShoppingBag size={14} />
              <span>Shop</span>
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${tab === t.key ? styles.activeTab : ''}`}
              onClick={() => setTab(t.key)}
            >
              <t.icon size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading && (
          <div className={styles.centered}>
            <RefreshCw size={32} className={styles.spinIcon} />
            <p>Loading your orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.centered}>
            <XCircle size={32} color="#ef4444" />
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchOrders}>Try Again</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className={styles.centered}>
            <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
            <p>You have not placed any orders yet.</p>
            <button className={styles.shopBtn} onClick={() => navigate('/order')}>
              Order Now
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* ORDER HISTORY */}
            {tab === 'history' && (
              <div className={styles.historyList}>
                {orders.map(order => (
                  <div key={order._id} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div className={styles.orderTopLeft}>
                        <span className={styles.orderNum}>#{order.orderNumber}</span>
                        <span
                          className={styles.statusBadge}
                          style={{
                            background: STATUS_COLORS[order.status] + '22',
                            color: STATUS_COLORS[order.status],
                          }}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                    </div>

                    <div className={styles.orderItems}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className={styles.itemChip}>{item.name} x{item.qty}</span>
                      ))}
                      {order.items.length > 3 && (
                        <span className={styles.itemChip}>+{order.items.length - 3} more</span>
                      )}
                    </div>

                    <div className={styles.orderBottom}>
                      <span className={styles.orderTotal}>GHC {order.total.toFixed(2)}</span>
                      <div className={styles.orderActions}>
                        <button className={styles.actionBtn} onClick={() => handleSelectOrder(order)}>
                          <Receipt size={13} /> Receipt
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            className={`${styles.actionBtn} ${styles.trackBtn}`}
                            onClick={() => handleTrack(order)}
                          >
                            <Truck size={13} /> Track
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RECEIPT */}
            {tab === 'receipt' && selectedOrder && (
              <div className={styles.receipt}>
                <div className={styles.receiptHeader}>
                  <div className={styles.receiptLogoWrap}>
                    <img
                      src="/logo.jpg"
                      alt="LaCreamy"
                      className={styles.receiptLogo}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <h2>LaCreamy</h2>
                  <p>12 Cantonments Road, Accra</p>
                  <p>+233 24 123 4567</p>
                </div>

                <div className={styles.receiptDivider}>{'- '.repeat(24)}</div>

                <div className={styles.receiptInfo}>
                  {[
                    ['Order No.', `#${selectedOrder.orderNumber}`],
                    ['Date', formatDate(selectedOrder.createdAt)],
                    ['Customer', selectedOrder.customerName],
                    ['Phone', selectedOrder.customerPhone],
                    selectedOrder.deliveryAddress ? ['Delivery', selectedOrder.deliveryAddress] : null,
                  ].filter(Boolean).map(([label, value]) => (
                    <div key={label} className={styles.receiptRow}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className={styles.receiptDivider}>{'- '.repeat(24)}</div>

                <div className={styles.receiptItems}>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className={styles.receiptItem}>
                      <span>{item.name} x{item.qty}</span>
                      <span>GHC {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.receiptDivider}>{'- '.repeat(24)}</div>

                <div className={styles.receiptTotals}>
                  <div className={styles.receiptRow}>
                    <span>Subtotal</span>
                    <span>GHC {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span>Delivery Fee</span>
                    <span>GHC {selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className={`${styles.receiptRow} ${styles.receiptTotal}`}>
                    <strong>TOTAL</strong>
                    <strong>GHC {selectedOrder.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className={styles.receiptDivider}>{'- '.repeat(24)}</div>

                <div className={styles.receiptFooter}>
                  <p>Status: <strong style={{ color: STATUS_COLORS[selectedOrder.status] }}>
                    {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
                  </strong></p>
                  {selectedOrder.specialNote && <p>Note: {selectedOrder.specialNote}</p>}
                  <p>Thank you for choosing LaCreamy!</p>
                  <p>Made with love in Accra, Ghana</p>
                </div>

                {orders.length > 1 && (
                  <div className={styles.orderSelector}>
                    <p>View receipt for another order:</p>
                    <div className={styles.selectorList}>
                      {orders.map(o => (
                        <button
                          key={o._id}
                          className={`${styles.selectorBtn} ${selectedOrder._id === o._id ? styles.selectorActive : ''}`}
                          onClick={() => setSelectedOrder(o)}
                        >
                          #{o.orderNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TRACK */}
            {tab === 'track' && selectedOrder && (
              <div className={styles.tracker}>
                <div className={styles.trackerHeader}>
                  <h2>Tracking <span>#{selectedOrder.orderNumber}</span></h2>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>

                {selectedOrder.status === 'cancelled' ? (
                  <div className={styles.cancelledMsg}>
                    <XCircle size={40} color="#ef4444" />
                    <p>This order was cancelled.</p>
                  </div>
                ) : (
                  <div className={styles.stagesWrap}>
                    {STAGES.map((stage, i) => {
                      const currentIndex = getStageIndex(selectedOrder.status);
                      const isDone = i <= currentIndex;
                      const isCurrent = i === currentIndex;
                      const historyEntry = selectedOrder.deliveryHistory?.find(h => h.stage === stage.key);

                      return (
                        <div
                          key={stage.key}
                          className={`${styles.stage} ${isDone ? styles.stageDone : ''} ${isCurrent ? styles.stageCurrent : ''}`}
                        >
                          <div className={styles.stageLeft}>
                            <div className={styles.stageIconWrap}>
                              <stage.icon size={18} strokeWidth={1.5} />
                            </div>
                            {i < STAGES.length - 1 && (
                              <div className={`${styles.stageLine} ${isDone && i < currentIndex ? styles.stageLineDone : ''}`} />
                            )}
                          </div>
                          <div className={styles.stageRight}>
                            <p className={styles.stageLabel}>{stage.label}</p>
                            {historyEntry && <p className={styles.stageTime}>{formatDate(historyEntry.timestamp)}</p>}
                            {historyEntry?.note && <p className={styles.stageNote}>{historyEntry.note}</p>}
                            {!historyEntry && !isDone && <p className={styles.stagePending}>Pending...</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 1 && (
                  <div className={styles.orderSelector}>
                    <p>Track another order:</p>
                    <div className={styles.selectorList}>
                      {orders
                        .filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
                        .map(o => (
                          <button
                            key={o._id}
                            className={`${styles.selectorBtn} ${selectedOrder._id === o._id ? styles.selectorActive : ''}`}
                            onClick={() => setSelectedOrder(o)}
                          >
                            #{o.orderNumber}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <button className={styles.refreshBtn} onClick={fetchOrders}>
                  <RefreshCw size={16} /> Refresh Status
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}