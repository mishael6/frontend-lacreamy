'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function StorefrontLayout({ children }) {
  return <><Navbar /><CartDrawer />{children}<Footer /></>;
}
