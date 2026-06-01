'use client';

import { ShoppingBag, MessageCircle, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import type { Product } from '@/types';

export default function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  if (product.isCustomOrder) {
    return (
      <div className="space-y-3">
        <div className="bg-accent/10 rounded-2xl p-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">Sur Commande — Personnalisé pour vous</p>
          <p>Ce gâteau est créé sur mesure selon vos envies. Contactez-nous via WhatsApp pour obtenir un devis gratuit.</p>
        </div>
        <a
          href={`https://wa.me/212600000000?text=Bonjour, je suis intéressé(e) par: ${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white w-full py-4 rounded-full font-semibold hover:opacity-90 transition text-lg"
        >
          <MessageCircle size={20} />
          Demander un devis WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantité :</span>
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center font-semibold">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <button
        onClick={() => addItem(product, qty)}
        disabled={!product.inStock}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={18} />
        Ajouter au panier
      </button>

      <Link href="/cart" className="btn-accent w-full flex items-center justify-center gap-2 text-base py-4">
        Commander directement
      </Link>
    </div>
  );
}
