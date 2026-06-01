'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { value: '', label: 'Tous' },
  { value: 'gateaux-custom', label: 'Gâteaux Custom' },
  { value: 'patisserie-marocaine', label: 'Pâtisseries Marocaines' },
  { value: 'box-cadeau', label: 'Box Cadeaux' },
  { value: 'desserts', label: 'Desserts' },
];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products${filter ? `?category=${filter}` : ''}`)
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [filter]);

  async function toggleStock(id: string, current: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !current }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, inStock: !current } : p)));
    toast.success('Stock mis à jour');
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Produit supprimé');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gray-900">Produits</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === c.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">Photo</th>
                <th className="px-4 py-3 text-left">Produit</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-right">Prix</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name}</p>
                    {p.isCustomOrder && <span className="badge bg-accent/10 text-accent text-xs">Sur commande</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">{p.price.toFixed(2)} MAD</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleStock(p.id, p.inStock)} className="text-gray-400 hover:text-primary transition">
                      {p.inStock ? (
                        <ToggleRight size={22} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={22} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition">
                        <Pencil size={13} />
                      </Link>
                      <button onClick={() => deleteProduct(p.id, p.name)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-gray-400 py-12">Aucun produit</p>
          )}
        </div>
      )}
    </div>
  );
}
