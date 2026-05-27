import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAdminAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logoutAdmin(); navigate('/admin/login'); };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div>
            <p className={styles.sidebarTitle}>LaCreamy</p>
            <p className={styles.sidebarSub}>Admin Panel</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.adminName}>{admin?.name}</p>
              <p className={styles.adminEmail}>{admin?.email}</p>
            </div>
          </div>
          <div className={styles.footerActions}>
            <button className={styles.themeBtn} onClick={toggle}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <main className={styles.main}>
        <div className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <p className={styles.topbarTitle}>LaCreamy Admin</p>
          <button className={styles.themeBtn} onClick={toggle}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}