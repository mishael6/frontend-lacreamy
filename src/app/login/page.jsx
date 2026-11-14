import { Suspense } from 'react';
import Login from '../../legacyPages/auth/Login';
import StorefrontLayout from '../../components/StorefrontLayout';

export default function LoginPage() { return <StorefrontLayout><Suspense fallback={null}><Login /></Suspense></StorefrontLayout>; }
