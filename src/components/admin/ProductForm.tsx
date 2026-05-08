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
  sizeStock: Record<string, number>;
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
  { value: 'abiye', label: 'Abiye' },
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Standart'];
const NUMERIC_SIZES = ['38', '39', '40', '41', '42', '43', '44', '46', '47', '48'];

const BEDEN_GROUPS: { group: string; sizes: string[] }[] = [
  { group: '0 BEDEN', sizes: ['38/40', '40/42', '42/44', '44/46', '46/48', '48/50'] },
  { group: '1 BEDEN', sizes: ['38/40', '38/42', '40/42', '42/44', '44/46', '46/48', '48/50'] },
  { group: '2 BEDEN', sizes: ['38/40', '40/42', '42/44', '44/46', '44/48', '46/48', '48/50'] },
  { group: '3 BEDEN', sizes: ['38/40', '40/42', '42/44', '44/46', '44/48', '46', '46/48', '48/50'] },
  { group: '4 BEDEN', sizes: ['38/40', '40/42', '42/44', '44/46', '46', '46/48', '48', '48/50'] },
  { group: '5 BEDEN', sizes: ['38/40', '40/42', '42/44', '44/46', '46/48', '48/50'] },
];

// Seçilen değer: "1 BEDEN / 38/40" formatında saklanır
const bedenValue = (group: string, size: string) => `${group} / ${size}`;
const COLOR_OPTIONS = ['Siyah', 'Beyaz', 'Ekru', 'Camel', 'Lacivert', 'Bordo', 'Haki', 'Pudra', 'Gri', 'Pembe', 'Mavi', 'Yeşil', 'Bej'];

const empty: ProductFormData = {
  name: '', brand: 'Ebruca', code: '', price: '', originalPrice: '',
  images: [], category: 'elbise', subcategory: '', sizes: [], colors: [],
  description: '', measurements: '', stock: 'in_stock', sizeStock: {},
  isNew: true, isBestseller: false, isFeatured: false,
};

interface Props {
  initial?: ProductFormData;
  mode: 'create' | 'edit';
}

const DISCOUNT_OPTIONS = [0, 10, 20, 30, 40, 50];

export default function ProductForm({ initial = empty, mode }: Props) {
  const [form, setForm] = useState<ProductFormData>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // İndirim yüzdesi — düzenleme modunda mevcut fiyatlardan hesapla
  const [discountPct, setDiscountPct] = useState<number>(() => {
    if (initial.originalPrice && initial.price) {
      const orig = Number(initial.originalPrice);
      const sale = Number(initial.price);
      if (orig > 0 && sale < orig) {
        const pct = Math.round((1 - sale / orig) * 100);
        return DISCOUNT_OPTIONS.includes(pct) ? pct : 0;
      }
    }
    return 0;
  });
  const [error, setError] = useState('');
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const set = (key: keyof ProductFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key: 'sizes' | 'colors', item: string) => {
    setForm(prev => {
      const arr = prev[key] as string[];
      const has = arr.includes(item);
      const newArr = has ? arr.filter(x => x !== item) : [...arr, item];
      // Beden kaldırılınca sizeStock'tan da sil
      if (key === 'sizes' && has) {
        const newStock = { ...prev.sizeStock };
        delete newStock[item];
        return { ...prev, sizes: newArr, sizeStock: newStock };
      }
      // Beden eklenince sizeStock'a 0 ile başlat (kullanıcı girecek)
      if (key === 'sizes' && !has) {
        return { ...prev, sizes: newArr, sizeStock: { ...prev.sizeStock, [item]: 0 } };
      }
      return { ...prev, [key]: newArr };
    });
  };

  const setSizeStock = (size: string, qty: number) => {
    setForm(prev => ({ ...prev, sizeStock: { ...prev.sizeStock, [size]: qty } }));
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
    if (galleryRef.current) galleryRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
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
    if (!form.name || !form.code || !form.originalPrice || !form.category) {
      setError('Ad, Kod, Fiyat ve Kategori zorunludur.');
      return;
    }
    setSaving(true);
    setError('');

    const url = mode === 'create' ? '/api/admin/urunler' : `/api/admin/urunler/${form.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const listPrice = Number(form.originalPrice); // kullanıcının girdiği fiyat
    const salePrice = discountPct > 0
      ? Math.round(listPrice * (1 - discountPct / 100))
      : listPrice;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: salePrice,
          originalPrice: discountPct > 0 ? listPrice : null,
        }),
      });

      setSaving(false);

      if (res.ok) {
        router.push('/admin/urunler');
        router.refresh();
      } else {
        let msg = `Sunucu hatası (${res.status})`;
        try {
          const data = await res.json();
          msg = data.error ?? msg;
        } catch {
          const text = await res.text().catch(() => '');
          console.error('Sunucu yanıtı:', text.slice(0, 500));
        }
        setError(msg);
      }
    } catch (err) {
      setSaving(false);
      setError('Bağlantı hatası: ' + String(err));
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
      <section className="bg-white border border-gray-100 p-4 sm:p-6 space-y-4">
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
          {/* Fiyat + İndirim */}
          <div className="sm:col-span-2 bg-gray-50 border border-gray-100 p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Fiyatı (TL) *</label>
              <input
                type="number" min="0" step="1"
                value={form.originalPrice}
                onChange={e => set('originalPrice', e.target.value)}
                placeholder="ör: 1590"
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">İndirim Oranı</label>
              <div className="flex gap-2 flex-wrap">
                {DISCOUNT_OPTIONS.map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPct(pct)}
                    className={`px-3 py-1.5 text-sm font-medium border transition-colors ${
                      discountPct === pct
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {pct === 0 ? 'İndirim Yok' : `%${pct}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Son fiyat göstergesi */}
            {form.originalPrice && (
              <div className="flex items-center gap-3 pt-1 border-t border-gray-200">
                <span className="text-xs text-gray-500">Son Fiyat:</span>
                {discountPct > 0 ? (
                  <>
                    <span className="text-sm line-through text-gray-400">
                      {Number(form.originalPrice).toLocaleString('tr-TR')} TL
                    </span>
                    <span className="text-lg font-bold text-black">
                      {Math.round(Number(form.originalPrice) * (1 - discountPct / 100)).toLocaleString('tr-TR')} TL
                    </span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 border border-green-200">
                      %{discountPct} İNDİRİM
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-black">
                    {Number(form.originalPrice).toLocaleString('tr-TR')} TL
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="bg-white border border-gray-100 p-4 sm:p-6 space-y-4">
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
      <section className="bg-white border border-gray-100 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Görseller
        </h2>

        {/* Yüklü görseller — mobilde butonlar her zaman görünür */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            {form.images.map((img, i) => (
              <div key={img} className="relative">
                <div className="relative aspect-[3/4] sm:w-24 sm:h-32 bg-gray-100 overflow-hidden border border-gray-200">
                  <Image src={img} alt="" fill className="object-cover" sizes="(max-width: 640px) 33vw, 96px" />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] sm:text-xs text-center py-0.5">
                      ANA
                    </span>
                  )}
                </div>
                {/* Sil butonu — mobilde her zaman görünür, masaüstünde hover */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Kaldır"
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-red-500 text-white text-base flex items-center justify-center shadow-md hover:bg-red-600 active:scale-95 transition-all rounded-full"
                >
                  ×
                </button>
                {/* Sola taşıma — sadece ilk değilse */}
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    aria-label="Önce taşı"
                    className="absolute -top-1.5 -left-1.5 w-7 h-7 bg-white border border-gray-300 text-sm flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all rounded-full"
                  >
                    ←
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Yükleme butonları — telefonda 2 ayrı: galeri + kamera */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed border-gray-200 active:border-gray-400 active:bg-gray-50 p-4 text-center transition-colors min-h-[88px] flex flex-col items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Galeriden</span>
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed border-gray-200 active:border-gray-400 active:bg-gray-50 p-4 text-center transition-colors min-h-[88px] flex flex-col items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">Fotoğraf Çek</span>
          </button>
        </div>

        {/* Masaüstü tek kutu */}
        <div
          onClick={() => galleryRef.current?.click()}
          className="hidden sm:block border-2 border-dashed border-gray-200 hover:border-gray-400 p-8 text-center cursor-pointer transition-colors"
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

        {uploading && (
          <p className="text-sm text-center text-gray-500 py-2 sm:hidden">Yükleniyor...</p>
        )}

        {/* Galeri input — çoklu seçim */}
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
          onChange={handleFileUpload} />
        {/* Kamera input — telefonda kamerayı direkt aç */}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={handleFileUpload} />

        <p className="text-xs text-gray-400">
          💡 İlk görsel ana görsel olarak kullanılır. Sıralamayı değiştirmek için oka tıklayın.
        </p>
      </section>

      {/* Bedenler */}
      <section className="bg-white border border-gray-100 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-3">
          Beden & Renk
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Bedenler</label>
          <div className="space-y-3">
            {/* Standart bedenler */}
            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map(size => (
                <button key={size} type="button"
                  onClick={() => toggleArrayItem('sizes', size)}
                  className={`px-3 py-1.5 text-sm border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
            {/* Tekil numara bedenler */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 w-16 flex-shrink-0">Numara</span>
              {NUMERIC_SIZES.map(size => (
                <button key={size} type="button"
                  onClick={() => toggleArrayItem('sizes', size)}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
            {/* Beden grupları */}
            {BEDEN_GROUPS.map(({ group, sizes }) => (
              <div key={group} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 w-16 flex-shrink-0">{group}</span>
                {sizes.map(size => {
                  const val = bedenValue(group, size);
                  return (
                    <button key={val} type="button"
                      onClick={() => toggleArrayItem('sizes', val)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        form.sizes.includes(val)
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}>
                      {size}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Beden bazlı stok girişi */}
        {form.sizes.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Beden Stokları <span className="text-gray-400 font-normal">(seçilen bedenler için adet giriniz)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {form.sizes.map(size => (
                <div key={size} className="flex items-center gap-2 border border-gray-100 px-2 py-1.5">
                  <span className="text-xs text-gray-600 flex-1 truncate">{size}</span>
                  <input
                    type="number"
                    min="0"
                    value={form.sizeStock[size] ?? 0}
                    onChange={e => setSizeStock(size, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 border border-gray-200 px-2 py-1 text-sm text-center outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-gray-400">adet</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Toplam stok: {Object.values(form.sizeStock).reduce((a, b) => a + b, 0)} adet
            </p>
          </div>
        )}

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
      <section className="bg-white border border-gray-100 p-4 sm:p-6 space-y-4">
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

      {/* Kaydet — mobilde sticky bottom */}
      <div className="sticky bottom-0 -mx-3 sm:mx-0 px-3 sm:px-0 py-3 sm:py-0 bg-gray-50 sm:bg-transparent border-t sm:border-0 border-gray-200 flex gap-2 sm:gap-3 z-10">
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 px-4 sm:px-6 py-3 text-sm hover:border-black transition-colors min-h-[48px] flex-shrink-0 bg-white">
          İptal
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 sm:flex-none bg-black text-white px-6 sm:px-8 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors min-h-[48px]">
          {saving ? 'Kaydediliyor...' : mode === 'create' ? 'Ürünü Ekle' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
