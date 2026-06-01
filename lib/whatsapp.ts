import type { CartItem } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderData {
  customerName: string;
  phone: string;
  city: string;
  address?: string;
  deliveryDate?: Date;
  occasion?: string;
  notes?: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
}

export function buildWhatsAppMessage(data: OrderData): string {
  const occasionLabels: Record<string, string> = {
    anniversaire: 'Anniversaire',
    mariage: 'Mariage',
    bapteme: 'Baptême',
    ramadan: 'Ramadan',
    autre: 'Autre',
  };

  const lines = [
    '🍰 *Nouvelle Commande — Délice Sucré*',
    '',
    `👤 *Client :* ${data.customerName}`,
    `📱 *Téléphone :* ${data.phone}`,
    `📍 *Ville :* ${data.city}`,
    data.address ? `🏠 *Adresse :* ${data.address}` : '',
    data.deliveryDate
      ? `📅 *Date de livraison :* ${format(data.deliveryDate, 'EEEE d MMMM yyyy', { locale: fr })}`
      : '',
    data.occasion
      ? `🎉 *Occasion :* ${occasionLabels[data.occasion] || data.occasion}`
      : '',
    '',
    '*🛒 Commande :*',
    ...data.items.map(
      (item) =>
        `  • ${item.product.name} x${item.quantity} — ${(item.product.price * item.quantity).toFixed(2)} MAD`
    ),
    '',
    `💰 *Sous-total :* ${(data.total - data.deliveryFee).toFixed(2)} MAD`,
    data.deliveryFee > 0
      ? `🚚 *Livraison :* ${data.deliveryFee.toFixed(2)} MAD`
      : `🚚 *Livraison :* Gratuite`,
    `✅ *Total :* ${data.total.toFixed(2)} MAD`,
    '',
    data.notes ? `📝 *Message personnalisé :* ${data.notes}` : '',
    '',
    '_Paiement à la livraison_',
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildWhatsAppURL(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
