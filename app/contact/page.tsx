'use client';

import { useState } from 'react';
import { Phone, Instagram, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  function handleSend() {
    if (!form.name || !form.message) {
      toast.error('Veuillez remplir nom et message.');
      return;
    }
    const text = `Bonjour Délice Sucré !\n\nNom: ${form.name}\nTéléphone: ${form.phone}\n\n${form.message}`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(text)}`, '_blank');
    setForm({ name: '', phone: '', message: '' });
    toast.success('Redirection vers WhatsApp...');
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="section-title">Nous Contacter</h1>
          <p className="section-subtitle">On adore avoir de vos nouvelles !</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Coordonnées</h2>
              {[
                {
                  icon: <Phone size={18} className="text-primary" />,
                  label: 'WhatsApp',
                  value: '+212 6 00 00 00 00',
                  href: 'https://wa.me/212600000000',
                },
                {
                  icon: <Instagram size={18} className="text-primary" />,
                  label: 'Instagram',
                  value: '@delice_sucre___',
                  href: 'https://www.instagram.com/delice_sucre___',
                },
                {
                  icon: <MapPin size={18} className="text-primary" />,
                  label: 'Zone de livraison',
                  value: 'Casablanca, Rabat et alentours',
                  href: undefined,
                },
                {
                  icon: <Clock size={18} className="text-primary" />,
                  label: 'Délai commande',
                  value: 'Minimum 48h à l\'avance',
                  href: undefined,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 text-sm text-gray-700">
              <p className="font-semibold mb-1">💬 Réponse rapide</p>
              <p>Nous répondons généralement dans les 2h via WhatsApp.</p>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg">Envoyer un message</h2>
            <div>
              <label className="label">Votre nom *</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" placeholder="Votre nom" />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="input" placeholder="06XXXXXXXX" type="tel" />
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="input resize-none"
                rows={4}
                placeholder="Votre message, votre commande..."
              />
            </div>
            <button onClick={handleSend} className="btn-primary w-full">
              Envoyer via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
