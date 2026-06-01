'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ShoppingBag, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  todayOrders: number;
  weekOrders: number;
  monthRevenue: number;
  pendingCount: number;
  urgentOrders: any[];
  upcomingDeliveries: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Commandes aujourd'hui", value: stats.todayOrders, icon: <ShoppingBag className="text-primary" size={22} />, bg: 'bg-primary/10' },
    { label: 'Commandes cette semaine', value: stats.weekOrders, icon: <TrendingUp className="text-accent" size={22} />, bg: 'bg-accent/10' },
    { label: 'CA du mois (MAD)', value: stats.monthRevenue.toFixed(2), icon: <TrendingUp className="text-green-600" size={22} />, bg: 'bg-green-50' },
    { label: 'En attente', value: stats.pendingCount, icon: <Clock className="text-orange-500" size={22} />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent */}
      {stats.urgentOrders.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-600" size={18} />
            <h2 className="font-semibold text-red-700">Livraisons urgentes (&lt; 24h)</h2>
          </div>
          <div className="space-y-2">
            {stats.urgentOrders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">
                    {order.deliveryDate && format(new Date(order.deliveryDate), 'd MMM HH:mm', { locale: fr })}
                  </p>
                  <p className="text-xs text-gray-500">{order.total.toFixed(2)} MAD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming deliveries */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">Prochaines Livraisons</h2>
          <Link href="/admin/orders" className="text-primary text-sm hover:underline">
            Voir tout
          </Link>
        </div>
        {stats.upcomingDeliveries.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Aucune livraison prévue</p>
        ) : (
          <div className="divide-y">
            {stats.upcomingDeliveries.map((order: any) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.city} — {order.occasion || 'Sans occasion'}</p>
                </div>
                <div className="text-right">
                  {order.deliveryDate && (
                    <p className="text-sm font-medium text-accent">
                      {format(new Date(order.deliveryDate), 'EEE d MMM', { locale: fr })}
                    </p>
                  )}
                  <span className={`badge text-xs status-${order.status}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
