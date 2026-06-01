import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';

export const revalidate = 60;

interface Props {
  searchParams: { category?: string };
}

const categoryLabels: Record<string, string> = {
  'gateaux-custom': '🎂 Gâteaux Custom',
  'patisserie-marocaine': '🍯 Pâtisseries Marocaines',
  'box-cadeau': '🎁 Box Cadeaux',
  desserts: '🍰 Desserts',
};

export default async function ShopPage({ searchParams }: Props) {
  const category = searchParams.category;

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      inStock: true,
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-8 text-center">
          <h1 className="section-title">
            {category ? categoryLabels[category] || 'Boutique' : 'Toute la Boutique'}
          </h1>
          <p className="section-subtitle">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ShopFilters active={category} />

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🍰</p>
            <p>Aucun produit dans cette catégorie pour l'instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
