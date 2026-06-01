import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="badge bg-primary/20 text-primary mb-4">Notre Histoire</span>
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mt-3 mb-4">
            Fait avec Amour,<br />Livré avec Soin
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Délice Sucré est née de la passion d&apos;une artisane pour les saveurs authentiques
            de la pâtisserie marocaine.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl mb-4 text-gray-900">L&apos;Histoire de Délice Sucré</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Tout a commencé dans une petite cuisine familiale, où les odeurs de cannelle,
                de fleur d&apos;oranger et de miel se mêlaient pour créer des merveilles sucrées.
                Transmises de génération en génération, ces recettes ancestrales sont aujourd&apos;hui
                le cœur de Délice Sucré.
              </p>
              <p>
                Chaque pièce est préparée à la main, avec des ingrédients soigneusement
                sélectionnés pour garantir une fraîcheur et une qualité exceptionnelles.
                Qu&apos;il s&apos;agisse d&apos;un gâteau de mariage somptueux ou d&apos;une simple
                boîte de chebakia pour l&apos;Aïd, chaque création porte notre signature
                artisanale.
              </p>
              <p>
                Notre mission : transformer chaque occasion en souvenir savoureux,
                avec des créations qui éveillent les sens et réchauffent les cœurs.
              </p>
            </div>
          </div>

          <div className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-3">🍰</div>
              <p className="text-sm">Photo de la pâtissière</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-10">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="text-primary" size={28} />,
                title: 'Passion',
                desc: 'Chaque création est le fruit d\'un amour véritable pour la pâtisserie et le partage.',
              },
              {
                icon: <Star className="text-accent" size={28} />,
                title: 'Qualité',
                desc: 'Des ingrédients frais et naturels, sans compromis sur la qualité.',
              },
              {
                icon: <Award className="text-primary" size={28} />,
                title: 'Authenticité',
                desc: 'Des recettes marocaines traditionnelles respectées et sublimées.',
              },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="flex justify-center mb-3">{v.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="section-title mb-4">Prête à vous régaler ?</h2>
        <p className="section-subtitle mb-8">
          Découvrez toutes nos créations et passez commande dès maintenant.
        </p>
        <Link href="/shop" className="btn-primary mr-4">
          Voir la boutique
        </Link>
        <Link href="/contact" className="btn-outline">
          Nous contacter
        </Link>
      </section>
    </div>
  );
}
