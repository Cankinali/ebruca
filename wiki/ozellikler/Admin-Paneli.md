---
tags: [ozellik]
---

# Admin Paneli (`/admin`)

Tek şifreyle giriş (`ADMIN_PASSWORD`). İki katmanlı koruma: `src/proxy.ts` sayfaları korur, API'ler de ayrıca `requireAdmin()` çağırır.

| Bölüm | Not |
|---|---|
| Dashboard | Ciro ve sipariş sayısı yalnızca `paymentStatus='success'` ve `status!='cancelled'` olanlardan hesaplanır |
| Siparişler | Varsayılan sekme "Ödenmiş Siparişler". "Ödeme Bekleyen" ayrı sekmededir ve Iyzico'dan teyit edilmeden işleme alınmaz. İlk `shipped` geçişinde kargo e-postası gider. |
| Ürünler | Ekleme ve düzenleme (`components/admin/ProductForm.tsx`), görsel yükleme `api/admin/upload` |
| Üyeler | Liste ve detay |

## Büyüme için eksik

Dashboard'da **kaynak kırılımı yok**: hangi siparişin Instagram'dan, Meta reklamından veya organik aramadan geldiği bilinmiyor → [[Kampanya-Olcumu]]
