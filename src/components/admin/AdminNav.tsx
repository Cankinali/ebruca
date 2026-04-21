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
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/siparisler', label: 'Siparişler' },
    { href: '/admin/urunler', label: 'Ürünler' },
  ];

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-bold tracking-[0.2em] uppercase">
              EBRUCA <span className="text-white/40 font-normal tracking-normal">Admin</span>
            </Link>
            <nav className="flex gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    pathname.startsWith(link.href)
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank"
              className="text-xs text-white/40 hover:text-white transition-colors">
              Siteyi Gör ↗
            </Link>
            <button onClick={handleLogout}
              className="text-xs text-white/60 hover:text-white transition-colors">
              Çıkış
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
