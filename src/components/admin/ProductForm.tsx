'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductFormData {
  id?: string;
  name: string;
  brand: string;
  code: string;
  price: string;
  originalPrice: string;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  colors: string[];
  description: string;
  measurements: string;
  stock: string;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
}

const CATEGORIES = [
  { value: 'elbise', label: 'Elbise' },
  { value: 'takim', label: 'Takım' },
  { value: 'etekli-takim', label: 'Etekli Takım' },
  { value: 'pantolonlu-takim', label: 'Pantolonlu Takım' },
  { value: 'alt-giyim', label: 'Alt Giyim' },
  { value: 'etek', label: 'Etek' },
  { value: 'pantolon', label: 'Pantolon' },
  { value: 'ust-giyim', label: 'Üst Giyim' },
  { value: 'dis-giyim', label: 'Dış Giyim' },
  { value: 'abiye', label: 'Abiye' },
  { value: 'sal-kemer', label: 'Şal & Kemer' },
];

const SIZE_OPTIONS: { value: string; label: string; sub?: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: '38/40', label: '38/40', sub: '1 BEDEN' },
  { value: '42/44', label: '42/44', sub: '2 BEDEN' },
  { value: '46/48', label: '46/48', sub: '3 BEDEN' },
  { value: '50/52', label: '50/52', sub: '4 BEDEN' },
  { value: '54/56', label: '54/56', sub: '5 BEDEN' },
  { value: 'Standart', label: 'Standart' },
];
const COLOR_OPTIONS = ['Siyah', 'Beyaz', 'Ekru', 'Camel', 'Lacivert', 'Bordo', 'Haki', 'Pudra', 'Gri', 'Pembe', 'Mavi', 'Yeşil', 'Bej'];

const empty: ProductFormData = {
  name: '', brand: 'Ebruca', code: '', price: '', originalPrice: '',
  images: [], category: 'elbise', subcategory: '', sizes: [], colors: [],
  description: '', measurements: '', stock: 'in_stock',
  isNew: true, isBestseller: false, isFeatured: false,
};

interface Props {
  initial?: ProductFormData;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initial = empty, mode }: Props) {
  const [form, setForm] = useState<ProductFormData>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const set = (key: keyof ProductFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: 'sizes' | 'colors', item: string) => {
    setForm(prev => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item],
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm(prev => ({ ...prev, images: [...prev.images, url] }));
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const moveImage = (from: number, to: number) => {
    setForm(prev => {
      const imgs = [...prev.images];
      const [item] = imgs.splice(from, 1);
      imgs.splice(to, 0, item);
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.price || !form.category) {
      setError('Ad, Kod, Fiyat ve Kategori zorunludur.');
      return;
    }
    setSaving(true);
    setError('');

    const url = mode === 'create' ? '/api/admin/urunler' : `/api/admin/urunler/${form.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      }),
    });

    setSaving(false);
    if (res.ok) {
      router.push('/admin/urunler');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Kayıt hatası oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Temel bilgiler */}
      <section className="bg-white border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Temel Bilgiler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Adı *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="ör: Siyah Midi Elbise"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Marka</label>
            <input value={form.brand} onChange={e => set('brand', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Kodu *</label>
            <input value={form.code} onChange={e => set('code', e.target.value)}
              placeholder="ör: EBR-001"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat (TL) *</label>
            <input type="number" min="0" step="0.01" value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="1290"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Eski Fiyat (TL) <span className="text-gray-400 font-normal">— indirim için</span>
            </label>
            <input type="number" min="0" step="0.01" value={form.originalPrice}
              onChange={e => set('originalPrice', e.target.value)}
              placeholder="1590 (isteğe bağlı)"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="bg-white border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Kategori & Stok
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kategori *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black bg-white">
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Alt Kategori</label>
            <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
              placeholder="ör: etekli-takim"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stok Durumu</label>
            <select value={form.stock} onChange={e => set('stock', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black bg-white">
              <option value="in_stock">Stokta</option>
              <option value="low_stock">Tükeniyor</option>
              <option value="out_of_stock">Tükendi</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6">
          {([
            { key: 'isNew', label: 'Yeni Ürün' },
            { key: 'isBestseller', label: 'Çok Satan' },
            { key: 'isFeatured', label: 'Öne Çıkan' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form[key] as boolean}
                onChange={e => set(key, e.target.checked)}
                className="accent-black w-4 h-4" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Görseller */}
      <section className="bg-white border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Görseller
        </h2>

        {/* Yüklü görseller */}
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={img} className="relative group">
                <div className="relative w-24 h-32 bg-gray-100 overflow-hidden border border-gray-200">
                  <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                      Ana
                    </span>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)}
                      className="w-5 h-5 bg-white border border-gray-200 text-xs flex items-center justify-center shadow hover:bg-gray-50"
                      title="Sola taşı">←</button>
                  )}
                  <button type="button" onClick={() => removeImage(i)}
                    className="w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center shadow hover:bg-red-600"
                    title="Kaldır">×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-gray-400 p-8 text-center cursor-pointer transition-colors"
        >
          {uploading ? (
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          ) : (
            <>
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-500">Görsel eklemek için tıklayın</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — maks. 5 MB — çoklu seçim</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={handleFileUpload} />

        <p className="text-xs text-gray-400">
          💡 İlk görsel ana görsel olarak kullanılır. Sıralamayı değiştirmek için oka tıklayın.
        </p>
      </section>

      {/* Bedenler */}
      <section className="bg-white border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Beden & Renk
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Bedenler</label>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map(({ value, label, sub }) => (
              <button key={value} type="button"
                onClick={() => toggleArrayItem('sizes', value)}
                className={`flex flex-col items-center px-3 py-1.5 text-sm border transition-colors leading-tight ${
                  form.sizes.includes(value)
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}>
                <span>{label}</span>
                {sub && <span className="text-xs opacity-70">{sub}</span>}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Renkler</label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map(color => (
              <button key={color} type="button"
                onClick={() => toggleArrayItem('colors', color)}
                className={`px-3 py-1.5 text-sm border transition-colors ${
                  form.colors.includes(color)
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}>
                {color}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Açıklama */}
      <section className="bg-white border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Açıklama & Ölçüler
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Açıklaması</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={4} placeholder="Ürün hakkında detaylı açıklama..."
            className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ölçüler</label>
          <input value={form.measurements} onChange={e => set('measurements', e.target.value)}
            placeholder="ör: Boy: 110 cm | Göğüs: S/36 cm"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" />
        </div>
      </section>

      {/* Kaydet */}
      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 px-6 py-3 text-sm hover:border-black transition-colors">
          İptal
        </button>
        <button type="submit" disabled={saving}
          className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors">
          {saving ? 'Kaydediliyor...' : mode === 'create' ? 'Ürünü Ekle' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}
