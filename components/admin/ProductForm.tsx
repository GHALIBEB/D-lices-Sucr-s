'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  product?: any;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'desserts',
    isCustomOrder: product?.isCustomOrder || false,
    minPersons: product?.minPersons?.toString() || '',
    inStock: product?.inStock ?? true,
    featured: product?.featured || false,
  });
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((p) => ({
      ...p,
      [name]: val,
      ...(name === 'name' && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'image');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setImages((prev) => [...prev, data.url]);
      else toast.error('Erreur upload');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      toast.error('Nom et prix requis');
      return;
    }
    if (!form.slug) {
      setForm((p) => ({ ...p, slug: slugify(form.name) }));
      toast.error('Slug généré automatiquement — réessayez');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      minPersons: form.minPersons ? parseInt(form.minPersons) : null,
      images,
    };
    try {
      if (isEdit) {
        await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Produit mis à jour');
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        toast.success('Produit créé');
      }
      router.push('/admin/products');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Nom *</label>
          <input name="name" value={form.name} onChange={handleInput} className="input" placeholder="Nom du produit" />
        </div>
        <div>
          <label className="label">Slug (URL)</label>
          <input name="slug" value={form.slug} onChange={handleInput} className="input" placeholder="mon-produit" />
          {form.slug && (
            <p className="text-xs text-gray-400 mt-1">/product/<strong>{form.slug}</strong></p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={handleInput} className="input resize-none" rows={3} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Prix (MAD) *</label>
          <input name="price" value={form.price} onChange={handleInput} className="input" type="number" step="0.01" />
        </div>
        <div>
          <label className="label">Catégorie</label>
          <select name="category" value={form.category} onChange={handleInput} className="input">
            <option value="gateaux-custom">Gâteaux Custom</option>
            <option value="patisserie-marocaine">Pâtisseries Marocaines</option>
            <option value="box-cadeau">Box Cadeaux</option>
            <option value="desserts">Desserts</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { name: 'isCustomOrder', label: 'Sur commande' },
          { name: 'inStock', label: 'En stock' },
          { name: 'featured', label: 'Produit vedette' },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              checked={form[name as keyof typeof form] as boolean}
              onChange={handleInput}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>

      {form.isCustomOrder && (
        <div>
          <label className="label">Nombre de personnes minimum</label>
          <input name="minPersons" value={form.minPersons} onChange={handleInput} className="input" type="number" placeholder="Ex: 20" />
        </div>
      )}

      {/* Images */}
      <div>
        <label className="label">Images (max 5, 5MB/image)</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition text-gray-400">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={18} />
                  <span className="text-xs mt-1">Ajouter</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
            </label>
          )}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
        {saving ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
      </button>
    </div>
  );
}
