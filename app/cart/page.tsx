'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { buildWhatsAppMessage, buildWhatsAppURL } from '@/lib/whatsapp';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DELIVERY_FEE = 25;
const FREE_DELIVERY_FROM = 300;
const MIN_ORDER_DAYS = 2;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    city: '',
    address: '',
    occasion: '',
    notes: '',
  });
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const deliveryFee = total >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const grandTotal = total + deliveryFee;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + MIN_ORDER_DAYS);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleOrder() {
    if (!form.customerName || !form.phone || !form.city) {
      toast.error('Veuillez remplir les champs obligatoires.');
      return;
    }
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      return;
    }

    setLoading(true);
    try {
      const message = buildWhatsAppMessage({
        ...form,
        deliveryDate: deliveryDate || undefined,
        items,
        total: grandTotal,
        deliveryFee,
      });

      // Save order in background
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          deliveryDate: deliveryDate?.toISOString(),
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          total: grandTotal,
        }),
      });

      const waUrl = buildWhatsAppURL('212600000000', message);
      window.open(waUrl, '_blank');
      clearCart();
      toast.success('Commande envoyée via WhatsApp !');
    } catch {
      toast.error('Erreur lors de l\'envoi de la commande.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
        <ShoppingBag size={64} strokeWidth={1} />
        <h1 className="font-serif text-2xl text-gray-700">Votre panier est vide</h1>
        <Link href="/shop" className="btn-primary">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="section-title mb-8">Ma Commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card p-4 flex gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-primary font-semibold">{product.price.toFixed(2)} MAD</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition">
                      <Minus size={12} />
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(product.id)} className="text-gray-400 hover:text-red-500 transition">
                    <Trash2 size={16} />
                  </button>
                  <span className="font-semibold text-accent">
                    {(product.price * quantity).toFixed(2)} MAD
                  </span>
                </div>
              </div>
            ))}

            {/* Customer form */}
            <div className="card p-6 space-y-4">
              <h2 className="font-serif text-xl">Vos Informations</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet *</label>
                  <input name="customerName" value={form.customerName} onChange={handleInput} className="input" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="label">Téléphone *</label>
                  <input name="phone" value={form.phone} onChange={handleInput} className="input" placeholder="06XXXXXXXX" type="tel" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Ville *</label>
                  <input name="city" value={form.city} onChange={handleInput} className="input" placeholder="Votre ville" />
                </div>
                <div>
                  <label className="label">Adresse</label>
                  <input name="address" value={form.address} onChange={handleInput} className="input" placeholder="Adresse complète" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Date de livraison souhaitée</label>
                  <DatePicker
                    selected={deliveryDate}
                    onChange={(date) => setDeliveryDate(date)}
                    minDate={minDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Choisir une date"
                    className="input w-full"
                    withPortal
                  />
                </div>
                <div>
                  <label className="label">Occasion</label>
                  <select name="occasion" value={form.occasion} onChange={handleInput} className="input">
                    <option value="">Sélectionner...</option>
                    <option value="anniversaire">🎂 Anniversaire</option>
                    <option value="mariage">💍 Mariage</option>
                    <option value="bapteme">👶 Baptême</option>
                    <option value="ramadan">🌙 Ramadan</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Message / Texte sur le gâteau (optionnel)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInput}
                  className="input resize-none"
                  rows={3}
                  placeholder="Ex: Joyeux anniversaire Sarah !"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif text-xl mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'Gratuite 🎉' : `${deliveryFee.toFixed(2)} MAD`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-400">
                    Livraison gratuite dès {FREE_DELIVERY_FROM} MAD
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{grandTotal.toFixed(2)} MAD</span>
                </div>
              </div>

              <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                💰 Paiement à la livraison — aucun prépaiement requis
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-full font-semibold text-base hover:opacity-90 transition disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {loading ? 'Envoi...' : 'Commander via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
