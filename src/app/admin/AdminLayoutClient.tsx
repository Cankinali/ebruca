'use client';

import { usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Giriş sayfasında nav gösterme
  const showNav = !pathname.startsWith('/admin/giris');

  return (
    <div className="min-h-screen bg-gray-50">
      {showNav && <AdminNav />}
      {children}
    </div>
  );
}
