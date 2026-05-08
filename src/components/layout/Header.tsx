'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import AnnouncementBar from './AnnouncementBar';

const menuItems = [
  { label: 'Elbise', href: '/kategori/elbise' },
  {
    label: 'Takım',
    href: '/kategori/takim',
    children: [
      { label: 'Etekli Takım', href: '/kategori/etekli-takim' },
      { label: 'Pantolonlu Takım', href: '/kategori/pantolonlu-takim' },
    ],
  },
  {
    label: 'Alt Giyim',
    href: '/kategori/alt-giyim',
    children: [
      { label: 'Etek', href: '/kategori/etek' },
      { label: 'Pantolon', href: '/kategori/pantolon' },
    ],
  },
  { label: 'Üst Giyim', href: '/kategori/ust-giyim' },
  { label: 'İletişim', href: '/iletisim' },
];

export default function Header() {
  const { totalItems } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(82);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Header yüksekliğini ölç (announcement bar dahil)
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}
      >
        <AnnouncementBar />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Hamburger */}
            <button
              className="lg:hidden flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <div className="w-[22px] flex flex-col gap-[5px]">
                <span
                  className={`block h-[2px] w-full bg-black rounded-full origin-center transition-all duration-250 ease-in-out ${
                    mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-black rounded-full transition-all duration-250 ease-in-out ${
                    mobileOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-black rounded-full origin-center transition-all duration-250 ease-in-out ${
                    mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-black uppercase absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              EBRUCA
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {menuItems.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-black tracking-wide transition-colors block"
                  >
                    {item.label}
                  </Link>
                  {item.children && activeMenu === item.label && (
                    <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg z-50">
                      {item.children.map(sub => (
                        <Link key={sub.label} href={sub.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Sağ ikonlar */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {searchOpen ? (
                <div className="flex items-center gap-1.5">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Ara..."
                    className="border-b border-black outline-none text-sm py-1 w-28 sm:w-44"
                    onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                  />
                  <button onClick={() => setSearchOpen(false)}
                    className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-50 rounded"
                  aria-label="Ara">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              <Link href="/giris"
                className="p-2 min-w-[44px] min-h-[44px] hidden sm:flex items-center justify-center hover:bg-gray-50 rounded"
                aria-label="Hesabım">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              <Link href="/sepet"
                className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-50 rounded"
                aria-label="Sepet">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil Menü — header dışında, fixed overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 bottom-0 z-40 bg-white overflow-y-auto"
          style={{ top: headerHeight }}
        >
          <nav className="px-4 py-2 divide-y divide-gray-50">
              <div>
              <Link href="/"
                className="flex items-center py-4 text-sm font-medium text-gray-800"
                onClick={() => setMobileOpen(false)}>
                Anasayfa
              </Link>
            </div>
            {menuItems.map(item => (
              <div key={item.label}>
                <Link href={item.href}
                  className="flex items-center justify-between py-4 text-sm font-medium text-gray-800"
                  onClick={() => setMobileOpen(false)}>
                  {item.label}
                  {item.children && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.children.map(sub => (
                      <Link key={sub.label} href={sub.href}
                        className="flex items-center py-2.5 text-sm text-gray-500"
                        onClick={() => setMobileOpen(false)}>
                        <span className="w-3 h-px bg-gray-300 mr-3 flex-shrink-0" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/giris"
              className="flex items-center py-4 text-sm font-medium text-gray-800 gap-2"
              onClick={() => setMobileOpen(false)}>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hesabım
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
