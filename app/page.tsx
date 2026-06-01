import Image from 'next/image';
import Link from 'next/link';
import { getSettings, defaultSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { Star, Truck, Clock, Award, Sparkles, Instagram } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSettings().catch(() => ({ ...defaultSettings })),
    prisma.product.findMany({ where: { featured: true, inStock: true }, take: 4 }).catch(() => []),
  ]);

  const categories = [
    {
      key: 'gateaux-custom',
      label: 'Gâteaux Custom',
      emoji: '🎂',
      image: settings.catImageCustom,
      desc: 'Wedding cakes, birthday cakes personnalisés',
    },
    {
      key: 'patisserie-marocaine',
      label: 'Pâtisseries Marocaines',
      emoji: '🍯',
      image: settings.catImageMarocaine,
      desc: 'Chebakia, briouates, kaab el ghazal...',
    },
    {
      key: 'box-cadeau',
      label: 'Box Cadeaux',
      emoji: '🎁',
      image: settings.catImageBox,
      desc: 'Boîtes assorties idéales pour offrir',
    },
    {
      key: 'desserts',
      label: 'Desserts',
      emoji: '🍰',
      image: settings.catImageDesserts,
      desc: 'Cheesecakes, tartes, macarons...',
    },
  ];

  const features = [0, 1, 2, 3].map((i) => ({
    title: (settings as any)[`featTitle${i}`],
    desc: (settings as any)[`featDesc${i}`],
    img: (settings as any)[`featImg${i}`],
  }));

  const defaultIcons = [<Star key={0} />, <Award key={1} />, <Truck key={2} />, <Sparkles key={3} />];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {settings.heroVideo ? (
          <video
            src={settings.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ objectPosition: 'center 30%' }}
          />
        ) : settings.heroImage ? (
          <Image
            src={settings.heroImage}
            alt="Délice Sucré hero"
            fill
            className="object-cover object-center"
            style={{ objectPosition: 'center 30%' }}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cream to-accent/20" />
        )}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-5 max-w-lg mx-auto animate-fade-in">
          <span className="inline-flex items-center gap-2 bg-white/90 text-accent px-3 py-1.5 rounded-full text-xs font-semibold mb-4 shadow">
            <Star size={12} className="fill-accent text-accent" />
            {settings.badgeText}
          </span>
          <h1 className="font-serif text-4xl md:text-7xl text-white mb-3 leading-tight drop-shadow-lg">
            {settings.shopName}
          </h1>
          <p className="text-white/90 text-base md:text-xl mb-7 drop-shadow leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Link href="/cart" className="btn-primary shadow-lg text-base py-3.5">
              Commander maintenant
            </Link>
            <Link href="/shop" className="bg-white/90 text-gray-800 px-6 py-3.5 rounded-full font-medium hover:bg-white transition shadow-lg text-base">
              Voir la Carte
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-primary/10 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12">
          {[
            { icon: <Award size={18} className="text-accent" />, text: 'Fait Maison' },
            { icon: <Truck size={18} className="text-accent" />, text: 'Livraison à Domicile' },
            { icon: <Clock size={18} className="text-accent" />, text: 'Sur Commande 48h' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 font-medium text-gray-700">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Nos Créations Vedettes</h2>
            <p className="section-subtitle">Sélectionnées avec amour pour vous</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop" className="btn-outline">
              Voir toute la boutique
            </Link>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Nos Catégories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className="card group text-center p-6 hover:border-primary hover:border-2 transition-all"
              >
                {cat.image ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="text-5xl mb-4">{cat.emoji}</div>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SUR COMMANDE */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="badge bg-accent/20 text-accent mb-4">✨ Service Premium</span>
          <h2 className="section-title mt-2">Gâteaux Sur Commande</h2>
          <p className="section-subtitle mb-6">
            Mariage, anniversaire, baptême — chaque occasion mérite un gâteau unique
            créé spécialement pour vous.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            {['Mariage', 'Anniversaire', 'Baptême'].map((occ) => (
              <div key={occ} className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className="text-2xl mb-1">
                  {occ === 'Mariage' ? '💍' : occ === 'Anniversaire' ? '🎂' : '👶'}
                </div>
                <p className="text-xs font-medium text-gray-700">{occ}</p>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/212600000000?text=Bonjour, je souhaite commander un gâteau personnalisé."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Demander un devis gratuit
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title">Pourquoi Délice Sucré ?</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="text-center p-4">
              {feat.img ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-3">
                  <Image src={feat.img} alt={feat.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                  {defaultIcons[i]}
                </div>
              )}
              <h3 className="font-semibold text-gray-900 text-sm">{feat.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title">Notre Vitrine</h2>
          <p className="section-subtitle mb-6">Retrouvez nos créations sur Instagram</p>
          <a
            href={settings.instagramUrl || 'https://www.instagram.com/delice_sucre___'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <Instagram size={18} />
            Suivre @delice_sucre___
          </a>
        </div>
      </section>
    </>
  );
}
