import '../index.css';
import AppProviders from '../AppProviders';

export const metadata = {
  title: 'LaCreamy | A little joy, freshly baked',
  description: 'Thoughtfully baked pastries, cakes and breads in Kumasi, Ghana. Order something lovely from LaCreamy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
