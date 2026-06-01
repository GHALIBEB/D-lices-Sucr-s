'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/shop', label: 'Boutique' },
    { href: '/about', label: 'Notre Histoire' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center relative">

        {/* Mobile gauche : hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 z-10"
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo — centré sur mobile, à gauche sur desktop */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Délices Sucrés"
            width={120}
            height={120}
            style={{ width: 'var(--logo-size, 56px)', height: 'var(--logo-size, 56px)' }}
            className="rounded-full object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 ml-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-gray-600 hover:text-primary transition-colors font-medium text-sm"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions — toujours à droite */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>

          <Link href="/cart" className="hidden md:block btn-primary text-sm py-2 px-5">
            Commander
          </Link>
        </div>
      </nav>

      {/* Mobile menu déroulant */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary py-3 font-medium border-b border-gray-50 text-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block btn-primary text-center text-sm mt-3"
          >
            Commander
          </Link>
        </div>
      )}
    </header>
  );
}
