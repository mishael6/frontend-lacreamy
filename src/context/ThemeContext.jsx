import { useEffect } from 'react';

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
    localStorage.removeItem('lacreamy-theme');
  }, []);

  return children;
}
