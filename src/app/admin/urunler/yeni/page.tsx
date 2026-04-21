import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/admin/urunler" className="hover:text-black">Ürünler</Link>
          <span>/</span>
          <span className="text-black">Yeni Ürün</span>
        </nav>
        <h1 className="text-xl font-bold mb-8">Yeni Ürün Ekle</h1>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
