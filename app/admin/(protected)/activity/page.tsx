'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const actionLabels: Record<string, string> = {
  login: '🔐 Connexion',
  create_product: '➕ Produit créé',
  update_product: '✏️ Produit modifié',
  delete_product: '🗑️ Produit supprimé',
  update_order_status: '📦 Statut commande mis à jour',
  update_settings: '⚙️ Paramètres mis à jour',
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/activity')
      .then((r) => r.json())
      .then(setActivities)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gray-900">Journal d'activité</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {activities.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Aucune activité</p>
          ) : (
            <div className="divide-y">
              {activities.map((a) => (
                <div key={a.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="text-xl">{(actionLabels[a.action] || a.action).split(' ')[0]}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {(actionLabels[a.action] || a.action).split(' ').slice(1).join(' ')}
                    </p>
                    {a.details && <p className="text-gray-500 text-xs mt-0.5">{a.details}</p>}
                  </div>
                  <time className="text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(a.createdAt), 'd MMM yyyy HH:mm', { locale: fr })}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
