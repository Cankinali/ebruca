'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/giris');
    router.refresh();
  };

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/siparisler', label: 'Siparişler', icon: '📦' },
    { href: '/admin/urunler', label: 'Ürünler', icon: '👗' },
  ];

  return (
    <header className="bg-black text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Üst sıra: logo + çıkış */}
        <div className="flex items-center justify-between h-12 sm:h-14 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm font-bold tracking-[0.2em] uppercase">
            EBRUCA <span className="text-white/40 font-normal tracking-normal">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1.5"
            >
              Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-white/70 hover:text-white transition-colors px-3 py-1.5 border border-white/20 rounded hover:border-white/50"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Alt sıra: sekmeli nav (mobilde scroll, masaüstünde wide) */}
        <nav className="flex border-t border-white/10 overflow-x-auto scrollbar-hide">
          {links.map(link => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap transition-colors min-h-[44px] ${
                  active
                    ? 'text-white border-b-2 border-white -mb-px'
                    : 'text-white/60 hover:text-white border-b-2 border-transparent'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
