'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Activity,
  Heart,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/activity', label: 'Activité', icon: Activity },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    toast.success('Déconnecté');
    router.push('/admin/login');
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white hidden md:flex flex-col z-30">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Heart className="text-primary fill-primary" size={20} />
          <div>
            <p className="font-serif text-base font-semibold">Délice Sucré</p>
            <p className="text-gray-400 text-xs">Administration</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-full px-4 py-2"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
