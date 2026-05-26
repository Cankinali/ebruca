'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/ui/ProductCard';
import { COMPANY } from '@/lib/company';

interface Props {
  product: Product;
  bestsellers: Product[];
}

export default function ProductDetail({ product, bestsellers }: Props) {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  // URL'de ?renk= varsa onu kullan, yoksa ilk rengi
  const renkFromUrl = searchParams.get('renk');
  const initialColor = (renkFromUrl && product.colors.includes(renkFromUrl))
    ? renkFromUrl
    : (product.colors[0] ?? '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [activeImage, setActiveImage] = useState(0);

  // Seçili renge ait özel görseller varsa onları, yoksa ürünün ana görsellerini göster
  const colorSpecificImages = product.colorImages?.[selectedColor];
  const displayedImages = (colorSpecificImages && colorSpecificImages.length > 0)
    ? colorSpecificImages
    : product.images;

  // Seçili renge ait özel bedenler varsa onları, yoksa genel bedenleri göster
  const colorSpecificSizes = product.colorSizes?.[selectedColor];
  const displayedSizes = (colorSpecificSizes && colorSpecificSizes.length > 0)
    ? colorSpecificSizes
    : product.sizes;

  // Seçili renge ait özel stok varsa onu, yoksa genel stoğu kullan
  const colorSpecificStock = product.colorSizeStock?.[selectedColor];
  const displayedSizeStock = (colorSpecificStock && Object.keys(colorSpecificStock).length > 0)
    ? colorSpecificStock
    : product.sizeStock;

  // Renk değişince ilk fotoğrafa ve seçili bedeni temizle
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImage(0);
    // Yeni renkte seçili beden yoksa sıfırla
    const newSizes = product.colorSizes?.[color];
    if (newSizes && newSizes.length > 0 && selectedSize && !newSizes.includes(selectedSize)) {
      setSelectedSize('');
    }
  };
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'aciklama' | 'olculer'>('aciklama');

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockLabel = {
    in_stock: { text: 'Stokta', class: 'text-green-600' },
    low_stock: { text: 'Tükeniyor', class: 'text-amber-600' },
    out_of_stock: { text: 'Tükendi', class: 'text-red-600' },
  }[product.stock];

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const waLink = `${COMPANY.whatsappUrl}?text=${encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-black">Anasayfa</Link>
        <span>/</span>
        <Link href={`/kategori/${product.category}`} className="hover:text-black capitalize">
          {product.category.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            {displayedImages[activeImage] ? (
              <Image src={displayedImages[activeImage]} alt={product.name} fill priority
                className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {discount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm px-2 py-1 font-medium">
                -%{discount}
              </div>
            )}
          </div>
          {displayedImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {displayedImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} aria-label={`${product.name} fotoğraf ${i + 1}`}
                  className={`relative w-20 aspect-square flex-shrink-0 overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-black' : 'border-transparent'
                  }`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
            <p className="text-xs text-gray-400 mt-1">Ürün Kodu: {product.code}</p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{product.price.toLocaleString('tr-TR')} TL</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">KDV dahildir.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              product.stock === 'in_stock' ? 'bg-green-500' :
              product.stock === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${stockLabel?.class}`}>{stockLabel?.text}</span>
          </div>

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                Renk: <span className="font-normal text-gray-600">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button key={color} onClick={() => handleColorChange(color)}
                    className={`px-3 py-1.5 text-sm border transition-colors ${
                      selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {displayedSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-semibold uppercase tracking-wider ${sizeError ? 'text-red-500' : ''}`}>
                  Beden {sizeError && '— Lütfen beden seçin'}
                </p>
                <button className="text-xs text-gray-400 underline">Beden Rehberi</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayedSizes.map(size => {
                  const stock = displayedSizeStock?.[size];
                  const hasStockDefined = displayedSizeStock && Object.keys(displayedSizeStock).length > 0;
                  const isSoldOut = hasStockDefined && stock === 0;
                  const isLow = hasStockDefined && stock !== undefined && stock > 0 && stock <= 3;
                  return (
                    <button
                      key={size}
                      onClick={() => { if (!isSoldOut) { setSelectedSize(size); setSizeError(false); } }}
                      disabled={isSoldOut}
                      aria-label={isSoldOut ? `${size} - Tükendi` : size}
                      className={`relative flex flex-col items-center justify-center min-w-12 h-12 px-2 text-sm border transition-colors leading-tight ${
                        isSoldOut
                          ? 'border-gray-200 text-gray-400 line-through cursor-not-allowed bg-gray-50/50'
                          : selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 hover:border-gray-400'
                      }`}>
                      <span>{size}</span>
                      {isSoldOut && (
                        <span className="text-[9px] text-gray-400 font-medium">Tükendi</span>
                      )}
                      {isLow && (
                        <span className={`text-[9px] ${selectedSize === size ? 'text-white/70' : 'text-amber-500'}`}>
                          Son {stock}!
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {product.stock === 'out_of_stock' ? (
              <button className="flex-1 bg-gray-100 text-gray-500 py-4 text-sm font-medium tracking-wider uppercase">
                Stoğa Gelince Haber Ver
              </button>
            ) : (
              <button onClick={handleAddToCart}
                className={`flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}>
                {added ? '✓ Sepete Eklendi' : 'Sepete Ekle'}
              </button>
            )}
            <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile iletişime geç"
              className="border border-gray-200 px-4 flex items-center justify-center hover:bg-gray-50">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          <div className="flex gap-4 py-4 border-t border-b border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Güvenli ödeme
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Hızlı kargo
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              3D Secure
            </span>
          </div>

          <div>
            <div className="flex border-b border-gray-100">
              {(['aciklama', 'olculer'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'
                  }`}>
                  {tab === 'aciklama' ? 'Açıklama' : 'Ölçüler'}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm text-gray-600 leading-relaxed">
              {activeTab === 'aciklama' ? (
                <p>{product.description || 'Açıklama eklenmemiş.'}</p>
              ) : (
                <p>{product.measurements ?? 'Ölçü bilgisi mevcut değil.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {bestsellers.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-wide uppercase mb-6">Çok Satanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
