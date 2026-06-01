'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const img = product.images[0] || '/images/placeholder.jpg';

  return (
    <article className="card group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.isCustomOrder && (
            <span className="absolute top-3 left-3 badge bg-accent text-white">
              Sur commande
            </span>
          )}
          {product.featured && !product.isCustomOrder && (
            <span className="absolute top-3 left-3 badge bg-primary text-white">
              Vedette
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold bg-black/60 px-3 py-1 rounded-full text-sm">
                Indisponible
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-serif text-lg font-semibold text-accent">
            {product.price.toFixed(2)} <span className="text-sm">MAD</span>
          </span>

          {product.isCustomOrder ? (
            <a
              href={`https://wa.me/212600000000?text=Bonjour, je suis intéressé(e) par: ${product.name}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs px-3 py-2 rounded-full hover:opacity-90 transition"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          ) : (
            <button
              onClick={() => product.inStock && addItem(product)}
              disabled={!product.inStock}
              className="flex items-center gap-1.5 btn-primary text-xs py-2 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={13} />
              Ajouter
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
