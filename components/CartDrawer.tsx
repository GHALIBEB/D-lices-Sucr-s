'use client';

import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-serif text-xl">Mon Panier</h2>
          <button onClick={closeCart} className="p-2 text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
            <ShoppingBag size={48} strokeWidth={1} />
            <p>Votre panier est vide</p>
            <button onClick={closeCart} className="btn-primary text-sm">
              Voir la boutique
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-primary font-semibold text-sm">
                      {product.price.toFixed(2)} MAD
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1 self-start"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t px-5 py-4 space-y-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{total.toFixed(2)} MAD</span>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-primary block text-center"
              >
                Finaliser la commande
              </Link>
              <button
                onClick={closeCart}
                className="btn-outline block text-center w-full text-sm"
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
