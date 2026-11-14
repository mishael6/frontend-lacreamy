'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '../../navigation';
import { getAdminStats, getAllOrders } from '../../services/api';
import { Package, Calendar, Clock, DollarSign, Plus, ShoppingBag, RefreshCw, ArrowRight } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const STATUS_COLORS = {
  order_placed: '#BA9162',
  confirmed: '#807D82',
  being_prepared: '#9E633A',
  out_for_delivery: '#61311D',
  delivered: '#070403',
  cancelled: '#61311D',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, ordersRes] = await Promise.all([
        getAdminStats(),
        getAllOrders({ limit: 5 }),
      ]);
      setStats(statsRes.data.stats);
      setRecentOrders(ordersRes.data.orders || []);
    } catch {
      setError('We could not load the latest store activity. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className={styles.centered}>
        <RefreshCw size={32} className={styles.spinIcon} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: '#807D82' },
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: Calendar, color: '#9E633A' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: '#BA9162' },
    { label: 'Total Revenue', value: `GHC ${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: '#070403' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>STORE OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Here’s the latest activity across LaCreamy.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
          <RefreshCw size={15} className={loading ? styles.spinIcon : ''} /> Refresh data
        </button>
      </div>

      {error && <div className={styles.errorBanner} role="alert">{error}</div>}

      <div className={styles.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} className={styles.statCard} style={{ '--accent-color': card.color }}>
            <div className={styles.statIcon} style={{ color: card.color }}>
              <card.icon size={24} strokeWidth={1.5} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statValue}>{card.value}</p>
              <p className={styles.statLabel}>{card.label}</p>
            </div>
            <div className={styles.statBar} />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Orders</h2>
          <button className={styles.viewAllBtn} onClick={() => navigate('/admin/orders')}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={40} strokeWidth={1} />
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className={styles.ordersTable}>
            <div className={styles.tableHead}>
              <span>Order</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {recentOrders.map(order => (
              <div key={order._id} className={styles.tableRow}>
                <span className={styles.orderNum}>#{order.orderNumber}</span>
                <span className={styles.customerName}>{order.customerName || 'N/A'}</span>
                <span className={styles.itemCount}>{order.items?.length} item(s)</span>
                <span className={styles.orderTotal}>GHC {order.total?.toFixed(2)}</span>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: STATUS_COLORS[order.status] + '22',
                    color: STATUS_COLORS[order.status],
                  }}
                >
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActions}>
          <button className={styles.quickBtn} onClick={() => navigate('/admin/products')}>
            <span className={styles.quickIcon}><Plus size={18} strokeWidth={1.8} /></span>
            <span><strong>Add a product</strong><small>Create a new menu item</small></span>
            <ArrowRight size={16} className={styles.quickArrow} />
          </button>
          <button className={styles.quickBtn} onClick={() => navigate('/admin/orders')}>
            <span className={styles.quickIcon}><ShoppingBag size={18} strokeWidth={1.8} /></span>
            <span><strong>Manage orders</strong><small>Review and update orders</small></span>
            <ArrowRight size={16} className={styles.quickArrow} />
          </button>
        </div>
      </div>
    </div>
  );
}
