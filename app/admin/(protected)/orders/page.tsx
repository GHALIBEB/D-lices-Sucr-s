'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const statuses = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'en-preparation', label: 'En préparation' },
  { value: 'pret', label: 'Prêt' },
  { value: 'livre', label: 'Livré' },
  { value: 'annule', label: 'Annulé' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders${filter ? `?status=${filter}` : ''}`)
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success('Statut mis à jour');
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gray-900">Commandes</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === s.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Aucune commande</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expanded === order.id;
            const isUrgent =
              order.deliveryDate &&
              new Date(order.deliveryDate).getTime() - Date.now() < 24 * 3600 * 1000 &&
              !['livre', 'annule'].includes(order.status);

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden ${isUrgent ? 'ring-2 ring-red-300' : ''}`}
              >
                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{order.customerName}</p>
                        {isUrgent && (
                          <span className="badge bg-red-100 text-red-700 text-xs">⚡ URGENT</span>
                        )}
                        {order.occasion && (
                          <span className="badge bg-gray-100 text-gray-600 text-xs">{order.occasion}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <a href={`tel:${order.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone size={13} /> {order.phone}
                        </a>
                        <span>{order.city}</span>
                        {order.deliveryDate && (
                          <span className="text-accent font-medium">
                            📅 {format(new Date(order.deliveryDate), 'd MMM yyyy', { locale: fr })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">{order.total.toFixed(2)} MAD</span>

                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium cursor-pointer status-${order.status}`}
                      >
                        {statuses.slice(1).map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <a href={`tel:${order.phone}`} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition">
                          <Phone size={13} />
                        </a>
                        <a
                          href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 bg-[#25D366]/10 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition text-[#25D366]"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                      </div>

                      <button onClick={() => setExpanded(isExpanded ? null : order.id)} className="text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t bg-gray-50 pt-3 space-y-2">
                    {order.address && <p className="text-sm text-gray-600">📍 {order.address}</p>}
                    {order.notes && <p className="text-sm text-gray-600">📝 {order.notes}</p>}
                    <div className="space-y-1">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product?.name} × {item.quantity}</span>
                          <span className="font-medium">{(item.price * item.quantity).toFixed(2)} MAD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
