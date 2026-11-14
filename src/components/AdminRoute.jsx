'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !admin) router.replace('/admin/login'); }, [loading, admin, router]);
  if (loading) return null;
  if (!admin) return null;
  return children;
}
