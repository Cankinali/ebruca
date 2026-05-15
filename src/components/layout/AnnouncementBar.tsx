'use client';

import { useState, useEffect } from 'react';

const announcements = [
  '5.000 TL üzeri ÜCRETSİZ KARGO',
  '5.000 TL üzeri SEÇİLİ KARTLARDA 3 TAKSİT',
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white text-center py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wide sm:tracking-widest font-medium uppercase px-4 overflow-hidden">
      <span key={current}>{announcements[current]}</span>
    </div>
  );
}
