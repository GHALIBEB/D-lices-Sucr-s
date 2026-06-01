import Link from 'next/link';
import { Heart, Instagram, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="text-primary fill-primary" size={18} />
            <span className="font-serif text-white text-lg">Délice Sucré</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Pâtisseries artisanales marocaines faites avec amour. Chaque création est unique,
            préparée avec des ingrédients frais de qualité.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/shop', label: 'Boutique' },
              { href: '/about', label: 'Notre Histoire' },
              { href: '/contact', label: 'Contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Nous suivre</h3>
          <div className="space-y-3 text-sm">
            <a
              href="https://www.instagram.com/delice_sucre___"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram size={16} />
              @delice_sucre___
            </a>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone size={16} />
              Commander via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Délice Sucré. Fait avec{' '}
        <Heart size={10} className="inline text-primary fill-primary" /> au Maroc.
      </div>
    </footer>
  );
}
