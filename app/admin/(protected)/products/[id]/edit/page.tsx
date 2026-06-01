'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`).then((r) => r.json()).then(setProduct);
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gray-900">Modifier le produit</h1>
      <ProductForm product={product} />
    </div>
  );
}
