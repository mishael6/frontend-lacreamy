import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllOrders } from '../../services/api';
import { Package, Calendar, Clock, DollarSign, Plus, ShoppingBag, RefreshCw } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const STATUS_COLORS = {
  order_placed: '#F2C94C',
  confirmed: '#3B82F6',
  being_prepared: '#F97316',
  out_for_delivery: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getAllOrders({ limit: 5 }),
        ]);
        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.centered}>
        <RefreshCw size={32} className={styles.spinIcon} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: '#3B82F6' },
    { label: "Today's Orders", value: stats?.todayOrders || 0, icon: Calendar, color: '#F97316' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: '#F2C94C' },
    { label: 'Total Revenue', value: `GHC ${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: '#22C55E' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <p>Welcome back! Here is what is happening at LaCreamy.</p>
      </div>

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
            View All
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
            <Plus size={28} strokeWidth={1.5} />
            <p>Add New Product</p>
          </button>
          <button className={styles.quickBtn} onClick={() => navigate('/admin/orders')}>
            <ShoppingBag size={28} strokeWidth={1.5} />
            <p>Manage Orders</p>
          </button>
        </div>
      </div>
    </div>
  );
}