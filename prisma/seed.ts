import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Wedding Cake Élégance',
    slug: 'wedding-cake-elegance',
    description: 'Gâteau de mariage sur mesure, décoré à la main avec fleurs en sucre et dorures. Pour 80 à 150 personnes.',
    price: 2500,
    images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600'],
    category: 'gateaux-custom',
    isCustomOrder: true,
    minPersons: 80,
    featured: true,
    inStock: true,
  },
  {
    name: 'Birthday Cake Princesse',
    slug: 'birthday-cake-princesse',
    description: 'Gâteau d\'anniversaire thématique, personnalisé selon vos envies. Pour 20 à 50 personnes.',
    price: 450,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    category: 'gateaux-custom',
    isCustomOrder: true,
    minPersons: 20,
    featured: true,
    inStock: true,
  },
  {
    name: 'Assortiment Chebakia & Briouates',
    slug: 'assortiment-chebakia-briouates',
    description: 'Plateau généreux de chebakia au miel et sésame, briouates aux amandes et cannelle. Idéal pour Ramadan.',
    price: 180,
    images: ['https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600'],
    category: 'patisserie-marocaine',
    isCustomOrder: false,
    featured: true,
    inStock: true,
  },
  {
    name: 'Kaab El Ghazal Traditionnel',
    slug: 'kaab-el-ghazal',
    description: 'Cornes de gazelle garnies de pâte d\'amande parfumée à la fleur d\'oranger. Boîte de 20 pièces.',
    price: 120,
    images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'],
    category: 'patisserie-marocaine',
    isCustomOrder: false,
    featured: true,
    inStock: true,
  },
  {
    name: 'Box Cadeau Prestige',
    slug: 'box-cadeau-prestige',
    description: 'Boîte cadeau luxueuse assortissant les meilleures pâtisseries marocaines. Présentation soignée, idéale pour offrir.',
    price: 350,
    images: ['https://images.unsplash.com/photo-1562074185-c54f0bcac4f7?w=600'],
    category: 'box-cadeau',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
  {
    name: 'Box Cadeau Délice',
    slug: 'box-cadeau-delice',
    description: 'Assortiment de macarons, cheesecake miniatures et tartelettes fruits. Parfait pour toutes les occasions.',
    price: 220,
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=600'],
    category: 'box-cadeau',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
  {
    name: 'Cheesecake Fruits Rouges',
    slug: 'cheesecake-fruits-rouges',
    description: 'Cheesecake onctueux sur base biscuitée, coulis de fruits rouges maison. 8 personnes.',
    price: 280,
    images: ['https://images.unsplash.com/photo-1508737804141-4c3b688e2546?w=600'],
    category: 'desserts',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
  {
    name: 'Tarte Citron Meringuée',
    slug: 'tarte-citron-meringuee',
    description: 'Tarte au citron avec sa meringue italienne légèrement flambée. Acidulée et gourmande. 6-8 personnes.',
    price: 190,
    images: ['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600'],
    category: 'desserts',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
  {
    name: 'Boîte Macarons (12 pièces)',
    slug: 'boite-macarons-12',
    description: 'Coffret de 12 macarons aux saveurs variées : framboise, pistache, chocolat, citron, rose...',
    price: 160,
    images: ['https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600'],
    category: 'desserts',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
  {
    name: 'Makroud aux Dattes',
    slug: 'makroud-dattes',
    description: 'Makroud traditionnel fourré aux dattes et parfumé à la fleur d\'oranger, frit et nappé de miel. Boîte de 15 pièces.',
    price: 90,
    images: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600'],
    category: 'patisserie-marocaine',
    isCustomOrder: false,
    featured: false,
    inStock: true,
  },
];

const defaultSettings = [
  { key: 'shopName', value: 'Délice Sucré' },
  { key: 'slogan', value: 'Pâtisseries artisanales livrées à domicile' },
  { key: 'whatsappNumber', value: '212600000000' },
  { key: 'instagramUrl', value: 'https://www.instagram.com/delice_sucre___' },
  { key: 'badgeText', value: 'Fait Maison Depuis 2018' },
  { key: 'heroSubtitle', value: 'Pâtisseries artisanales livrées à domicile' },
  { key: 'deliveryFee', value: '25' },
  { key: 'freeDeliveryFrom', value: '300' },
  { key: 'minOrderDays', value: '2' },
  { key: 'deliveryCities', value: 'Casablanca, Rabat, Marrakech, Fès' },
  { key: 'primaryColor', value: '244 167 185' },
  { key: 'accentColor', value: '201 169 110' },
  { key: 'featTitle0', value: 'Ingrédients Frais' },
  { key: 'featTitle1', value: 'Recettes Artisanales' },
  { key: 'featTitle2', value: 'Livraison Soignée' },
  { key: 'featTitle3', value: 'Personnalisation' },
  { key: 'featDesc0', value: 'Produits de qualité sélectionnés chaque matin' },
  { key: 'featDesc1', value: 'Recettes familiales transmises de génération en génération' },
  { key: 'featDesc2', value: 'Emballages protecteurs pour une livraison parfaite' },
  { key: 'featDesc3', value: 'Personnalisation complète selon vos envies' },
];

async function main() {
  console.log('Seeding database...');

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  console.log(`Seeded ${products.length} products and ${defaultSettings.length} settings.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
