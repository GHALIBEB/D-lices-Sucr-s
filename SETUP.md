# 🍰 Délice Sucré — Guide de démarrage

## 1. Installation

```bash
cd delice-sucre
npm install
```

## 2. Variables d'environnement

Créez le fichier `.env.local` (déjà présent comme template) et remplissez :

```env
# Neon PostgreSQL
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/delice_sucre?sslmode=require"

# Admin password (bcrypt hash)
# Pour générer : node -e "const b=require('bcryptjs'); b.hash('votre_mdp',10).then(console.log)"
ADMIN_PASSWORD_HASH="$2b$10$..."

SESSION_SECRET="une-chaine-aleatoire-longue-minimum-32-chars"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET="delice_sucre_preset"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="212600000000"
```

## 3. Base de données

```bash
# Push le schéma vers Neon
npm run db:push

# Optionnel : générer le client Prisma
npm run db:generate

# Seeder avec des données exemples
npm run db:seed
```

## 4. Lancer le projet

```bash
npm run dev
```

## 5. Accès admin

- URL : http://localhost:3000/admin/login
- Mot de passe : celui dont vous avez généré le hash

## 6. Structure des pages

| URL | Description |
|-----|-------------|
| `/` | Homepage avec hero, featured, catégories |
| `/shop` | Catalogue avec filtres |
| `/product/[slug]` | Page produit |
| `/cart` | Panier + formulaire commande |
| `/about` | Histoire de la pâtissière |
| `/contact` | Contact + WhatsApp |
| `/admin/dashboard` | Dashboard commandes urgentes |
| `/admin/products` | CRUD produits |
| `/admin/orders` | Gestion commandes avec statuts |
| `/admin/settings` | Paramètres complets (couleurs, médias, textes) |
| `/admin/activity` | Journal d'activité |

## 7. Déploiement Cloudflare Workers

```bash
# Installer Wrangler
npm install -g wrangler

# Build
npm run build

# Deploy
wrangler pages deploy .next
```

N'oubliez pas de configurer les env vars dans Cloudflare Dashboard.
