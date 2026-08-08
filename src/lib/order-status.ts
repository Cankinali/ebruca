/**
 * Müşteriye gösterilen sipariş durumu etiketleri.
 * Hem /hesabim hem /siparis-sorgula burayı kullanır ki etiketler ayrışmasın.
 * (Admin panelinde yönetimsel karşılıkları ayrıca tanımlıdır.)
 */
export interface OrderStatusStyle {
  label: string;
  color: string;
  bg: string;
}

export const ORDER_STATUS: Record<string, OrderStatusStyle> = {
  pending:   { label: 'Hazırlanıyor',  color: 'text-amber-700',  bg: 'bg-amber-50'  },
  confirmed: { label: 'Onaylandı',     color: 'text-blue-700',   bg: 'bg-blue-50'   },
  shipped:   { label: 'Kargoda',       color: 'text-purple-700', bg: 'bg-purple-50' },
  delivered: { label: 'Teslim Edildi', color: 'text-green-700',  bg: 'bg-green-50'  },
  cancelled: { label: 'İptal Edildi',  color: 'text-red-700',    bg: 'bg-red-50'    },
};

export function orderStatusStyle(status: string): OrderStatusStyle {
  return ORDER_STATUS[status] ?? ORDER_STATUS.pending;
}
