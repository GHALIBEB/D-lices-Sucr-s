'use client';

import { useEffect } from 'react';

export default function DynamicColors() {
  useEffect(() => {
    async function loadColors() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;
        const data = await res.json();
        if (data.primaryColor) {
          document.documentElement.style.setProperty('--color-primary', data.primaryColor);
        }
        if (data.accentColor) {
          document.documentElement.style.setProperty('--color-accent', data.accentColor);
        }
        if (data.logoSize) {
          document.documentElement.style.setProperty('--logo-size', `${data.logoSize}px`);
        }
      } catch {}
    }
    loadColors();
  }, []);

  return null;
}
