import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';
import ProductGallery from '@/components/ProductGallery';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};
  return {
    title: `${product.name} — Délice Sucré`,
    description: product.description || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();

  const categoryLabel: Record<string, string> = {
    'gateaux-custom': 'Gâteaux Custom',
    'patisserie-marocaine': 'Pâtisseries Marocaines',
    'box-cadeau': 'Box Cadeaux',
    desserts: 'Desserts',
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="relative">
            <ProductGallery images={product.images} name={product.name} />
            {product.isCustomOrder && (
              <span className="absolute top-4 left-4 badge bg-accent text-white text-sm px-3 py-1.5 z-10">
                ✨ Sur Commande
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="badge bg-primary/10 text-primary w-fit mb-3">
              {categoryLabel[product.category] || product.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="text-3xl font-serif font-semibold text-accent mb-4">
              {product.price.toFixed(2)}{' '}
              <span className="text-lg text-gray-500 font-sans font-normal">MAD</span>
            </div>

            {product.minPersons && (
              <p className="text-sm text-gray-500 mb-4">
                Pour {product.minPersons}+ personnes
              </p>
            )}

            {!product.inStock && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                Ce produit est actuellement indisponible.
              </div>
            )}

            <ProductActions product={product as any} />

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-lg mb-1">🏠</div>
                Fait maison
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-lg mb-1">🚚</div>
                Livraison
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-lg mb-1">💰</div>
                Paiement à la livraison
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
