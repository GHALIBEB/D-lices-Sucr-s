export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  category: string;
  isCustomOrder: boolean;
  minPersons: number | null;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string | null;
  deliveryDate: Date | null;
  occasion: string | null;
  notes: string | null;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProductCategory =
  | 'gateaux-custom'
  | 'patisserie-marocaine'
  | 'box-cadeau'
  | 'desserts';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'en-preparation'
  | 'pret'
  | 'livre'
  | 'annule';

export type Occasion =
  | 'anniversaire'
  | 'mariage'
  | 'bapteme'
  | 'ramadan'
  | 'autre';

export interface SiteSettings {
  shopName: string;
  slogan: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  deliveryFee: string;
  freeDeliveryFrom: string;
  minOrderDays: string;
  deliveryCities: string;
  primaryColor: string;
  accentColor: string;
  logo: string;
  heroImage: string;
  heroVideo: string;
  heroVideoMobile: string;
  badgeText: string;
  heroSubtitle: string;
  catImageCustom: string;
  catImageMarocaine: string;
  catImageBox: string;
  catImageDesserts: string;
  featImg0: string;
  featImg1: string;
  featImg2: string;
  featImg3: string;
  featTitle0: string;
  featTitle1: string;
  featTitle2: string;
  featTitle3: string;
  featDesc0: string;
  featDesc1: string;
  featDesc2: string;
  featDesc3: string;
  logoSize: string;
}
