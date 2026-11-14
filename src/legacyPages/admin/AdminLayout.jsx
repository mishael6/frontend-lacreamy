'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useNavigate } from '../../navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ArrowUpRight, LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
];

export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPage = navItems.find(item => pathname === item.to) || navItems[0];

  const handleLogout = () => { logoutAdmin(); navigate('/admin/login'); };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin/dashboard" className={styles.brand} onClick={() => setSidebarOpen(false)}>
            <img src="/logo.jpg" alt="" className={styles.brandLogo} />
            <span><strong className={styles.sidebarTitle}>LaCreamy</strong><small className={styles.sidebarSub}>Admin workspace</small></span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Workspace</p>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`${styles.navItem} ${pathname === item.to || pathname.startsWith(`${item.to}/`) ? styles.navActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} strokeWidth={1.7} />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link to="/" target="_blank" rel="noreferrer" className={`${styles.navItem} ${styles.storefrontLink}`}>
            <ArrowUpRight size={18} strokeWidth={1.7} />
            <span>View storefront</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className={styles.adminName}>{admin?.name}</p>
              <p className={styles.adminEmail}>{admin?.email}</p>
            </div>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <main className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle admin navigation" aria-expanded={sidebarOpen}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={styles.topbarHeading}>
            <span>LaCreamy / Admin</span>
            <strong>{currentPage.label}</strong>
          </div>
          <div className={styles.topbarUser}>
            <span className={styles.topbarAvatar}>{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            <span>{admin?.name || 'Administrator'}</span>
          </div>
        </div>
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
