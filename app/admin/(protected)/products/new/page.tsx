import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-gray-900">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
