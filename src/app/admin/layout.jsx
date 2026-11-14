'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '../../legacyPages/admin/AdminLayout';
import AdminRoute from '../../components/AdminRoute';

export default function AdminRootLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return children;

  return <AdminRoute><AdminLayout>{children}</AdminLayout></AdminRoute>;
}
