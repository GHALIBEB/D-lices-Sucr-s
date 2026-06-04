'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ferme le menu mobile au changement de page
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/shop', label: 'Boutique' },
    { href: '/menu', label: 'La Carte' },
    { href: '/about', label: 'Notre Histoire' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-lg shadow-md'
          : 'bg-white/95 backdrop-blur-md shadow-sm md:bg-black/20 md:backdrop-blur-sm md:shadow-none'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center relative">

        {/* Logo — centré mobile, gauche desktop */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-3 group"
        >
          <div className="relative overflow-hidden rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300 shadow-sm group-hover:shadow-md">
            <Image
              src="/images/logo.png"
              alt="Délices Sucrés"
              width={120}
              height={120}
              style={{ width: 'var(--logo-size, 64px)', height: 'var(--logo-size, 64px)' }}
              className="object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Nom de la boutique — visible uniquement sur desktop */}
          <div className="hidden lg:block">
            <p className="font-serif text-lg leading-tight text-gray-900 group-hover:text-primary transition-colors">Délices Sucrés</p>
            <p className="text-xs text-primary font-medium tracking-wide">Pâtisserie Artisanale</p>
          </div>
        </Link>

        {/* Desktop links — centrés */}
        <ul className="hidden md:flex items-center gap-6 mx-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    active ? 'text-primary' : (scrolled || true) ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions droite */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-primary transition-colors duration-200"
            aria-label="Panier"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce">
                {count}
              </span>
            )}
          </button>

          <Link
            href="/cart"
            className="hidden md:flex items-center gap-2 btn-primary text-sm py-2.5 px-5 shadow-sm"
          >
            Commander
          </Link>

          {/* Hamburger mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`} />
              <span className={`absolute block h-0.5 w-6 bg-current top-3 transition-all duration-300 ${isOpen ? 'opacity-0 -translate-x-2' : 'opacity-100'}`} />
              <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/98 backdrop-blur-lg border-t border-gray-100 px-6 py-4 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center justify-between py-3 font-medium text-sm border-b border-gray-50 transition-colors ${
                  active ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                {l.label}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
          <Link href="/cart" className="block btn-primary text-center text-sm mt-4">
            Commander maintenant
          </Link>
        </div>
      </div>
    </header>
  );
}
