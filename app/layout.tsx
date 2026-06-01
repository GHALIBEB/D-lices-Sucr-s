import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import PublicShell from '@/components/PublicShell';
import { Toaster } from 'react-hot-toast';
import DynamicColors from '@/components/DynamicColors';

export const metadata: Metadata = {
  title: 'Délice Sucré — Pâtisserie Artisanale Marocaine',
  description:
    'Pâtisseries artisanales marocaines, gâteaux personnalisés et desserts livrés à domicile. Commandez via WhatsApp.',
  keywords: 'pâtisserie marocaine, gâteaux personnalisés, wedding cake, birthday cake, livraison domicile',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <DynamicColors />
        <CartProvider>
          <PublicShell>{children}</PublicShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: 'rgb(var(--color-primary))', secondary: 'white' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
