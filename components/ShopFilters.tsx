'use client';

import Link from 'next/link';

const categories = [
  { key: '', label: 'Tous' },
  { key: 'gateaux-custom', label: '🎂 Gâteaux Custom' },
  { key: 'patisserie-marocaine', label: '🍯 Pâtisseries Marocaines' },
  { key: 'box-cadeau', label: '🎁 Box Cadeaux' },
  { key: 'desserts', label: '🍰 Desserts' },
];

export default function ShopFilters({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((cat) => (
        <Link
          key={cat.key}
          href={cat.key ? `/shop?category=${cat.key}` : '/shop'}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
            (active || '') === cat.key
              ? 'bg-primary text-white shadow'
              : 'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200'
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
