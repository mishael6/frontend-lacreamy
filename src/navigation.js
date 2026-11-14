'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function Link({ to, ...props }) {
  return <NextLink href={to} {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  return useCallback((href, options) => router.push(href, options), [router]);
}
