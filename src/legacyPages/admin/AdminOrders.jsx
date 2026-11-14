'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { RefreshCw, CheckCircle, ChefHat, Truck, Gift, XCircle, ShoppingBag, Search } from 'lucide-react';
import styles from './AdminOrders.module.css';

const STAGES = [
  { key: 'confirmed', label: 'Confirm', icon: CheckCircle, color: '#807D82' },
  { key: 'being_prepared', label: 'Preparing', icon: ChefHat, color: '#9E633A' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: '#61311D' },
  { key: 'delivered', label: 'Delivered', icon: Gift, color: '#070403' },
  { key: 'cancelled', label: 'Cancel', icon: XCircle, color: '#61311D' },
];

const STATUS_COLORS = {
  order_placed: '#BA9162',
  confirmed: '#807D82',
  being_prepared: '#9E633A',
  out_for_delivery: '#61311D',
  delivered: '#070403',
  cancelled: '#61311D',
};

const STATUS_FILTERS = ['all', 'order_placed', 'confirmed', 'being_prepared', 'out_for_delivery', 'delivered', 'cancelled'];

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await getAllOrders(params);
      setOrders(res.data.orders || []);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(true);
    setError('');
    try {
      await updateOrderStatus(orderId, status, note);
      setSuccess(`Order updated to: ${status.replace(/_/g, ' ')}`);
      setNote('');
      setSelectedOrder(null);
      await fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order.');
    } finally {
      setUpdating(false);
    }
  };

  const visibleOrders = orders.filter(order => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [order.orderNumber, order.customerName, order.customerPhone, order.deliveryAddress]
      .some(value => String(value || '').toLowerCase().includes(query));
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Orders</h1>
          <p>{visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'}{filter !== 'all' ? ` · ${filter.replace(/_/g, ' ')}` : ''}</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchOrders}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {success && <div className={styles.successMsg}>{success}</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.ordersToolbar}>
        <div className={styles.filters} aria-label="Filter orders by status">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f === 'all' ? 'All orders' : f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <label className={styles.searchBox}>
          <Search size={15} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search orders or customers" />
        </label>
      </div>

      {loading ? (
        <div className={styles.centered}>
          <RefreshCw size={32} className={styles.spinIcon} />
          <p>Loading orders...</p>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className={styles.centered}>
          <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
          <p>{search ? 'No orders match your search.' : 'No orders found for this status.'}</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {visibleOrders.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderMain}>
                <div className={styles.orderInfo}>
                  <div className={styles.orderTop}>
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

                  <div className={styles.customerInfo}>
                    <p>{order.customerName}</p>
                    <p>{order.customerPhone}</p>
                    {order.deliveryAddress && <p>{order.deliveryAddress}</p>}
                    {order.specialNote && <p>Note: {order.specialNote}</p>}
                  </div>

                  <div className={styles.orderItems}>
                    {order.items?.map((item, i) => (
                      <span key={i} className={styles.itemChip}>
                        {item.name} x{item.qty}
                      </span>
                    ))}
                  </div>

                  <div className={styles.orderMeta}>
                    <span className={styles.orderTotal}>GHC {order.total?.toFixed(2)}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <p className={styles.actionsLabel}>Update Status</p>
                  <div className={styles.stageButtons}>
                    {STAGES.map(stage => (
                      <button
                        key={stage.key}
                        className={`${styles.stageBtn} ${order.status === stage.key ? styles.stageBtnActive : ''}`}
                        style={{ '--stage-color': stage.color }}
                        onClick={() => {
                          setSelectedOrder({ id: order._id, status: stage.key, num: order.orderNumber });
                          setNote('');
                        }}
                        disabled={
                          order.status === stage.key ||
                          order.status === 'delivered' ||
                          order.status === 'cancelled'
                        }
                      >
                        <stage.icon size={13} />
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <>
          <div className={styles.modalBackdrop} onClick={() => setSelectedOrder(null)} />
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="update-order-heading">
            <h3 id="update-order-heading">Update order #{selectedOrder.num}</h3>
            <p className={styles.modalSub}>
              New status: <strong style={{ color: STATUS_COLORS[selectedOrder.status] }}>
                {selectedOrder.status.replace(/_/g, ' ').toUpperCase()}
              </strong>
            </p>

            <div className={styles.noteField}>
              <label>Note for customer <span>(optional — sent via SMS)</span></label>
              <textarea
                rows={3}
                placeholder="e.g. Your order is being packed and will leave shortly..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setSelectedOrder(null)}>
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status)}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
