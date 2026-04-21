'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/admin/urunler/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600">Emin misiniz?</span>
        <button onClick={handleDelete} disabled={loading}
          className="text-xs text-red-600 border border-red-200 px-2 py-1 hover:bg-red-50 disabled:opacity-50">
          {loading ? '...' : 'Evet'}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 border border-gray-200 px-2 py-1 hover:bg-gray-50">
          Hayır
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-400 hover:text-red-600 border border-transparent hover:border-red-200 px-2.5 py-1 transition-colors"
    >
      Sil
    </button>
  );
}
