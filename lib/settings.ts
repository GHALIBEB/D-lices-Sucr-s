import { prisma } from './prisma';
import type { SiteSettings } from '@/types';

export const defaultSettings: SiteSettings = {
  shopName: 'Délice Sucré',
  slogan: 'Pâtisseries artisanales livrées à domicile',
  whatsappNumber: '212600000000',
  instagramUrl: 'https://www.instagram.com/delice_sucre___',
  facebookUrl: '',
  deliveryFee: '25',
  freeDeliveryFrom: '300',
  minOrderDays: '48',
  deliveryCities: 'Casablanca, Rabat, Marrakech, Fès',
  primaryColor: '244 167 185',
  accentColor: '201 169 110',
  logo: '',
  heroImage: '',
  heroVideo: '',
  badgeText: 'Fait Maison Depuis 2018',
  heroSubtitle: 'Pâtisseries artisanales livrées à domicile',
  catImageCustom: '',
  catImageMarocaine: '',
  catImageBox: '',
  catImageDesserts: '',
  featImg0: '',
  featImg1: '',
  featImg2: '',
  featImg3: '',
  featTitle0: 'Ingrédients Frais',
  featTitle1: 'Recettes Artisanales',
  featTitle2: 'Livraison Soignée',
  featTitle3: 'Sur Mesure',
  featDesc0: 'Produits de qualité sélectionnés chaque matin',
  featDesc1: 'Recettes familiales transmises de génération en génération',
  featDesc2: 'Emballages protecteurs pour une livraison parfaite',
  featDesc3: 'Personnalisation complète selon vos envies',
  logoSize: '56',
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  rows.forEach((r) => (map[r.key] = r.value));
  return { ...defaultSettings, ...map } as SiteSettings;
}

export async function updateSettings(data: Partial<SiteSettings>) {
  const entries = Object.entries(data);
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}
