---
tags: [ozellik]
---

# Sepet

`src/lib/cart-context.tsx`: React state + `localStorage` (`ebruca_sepet` anahtarı, **7 gün** geçerli). Sunucuda tutulmaz, dolayısıyla "sepette ürün bırakanlar" listesi **yoktur**. Sunucunun gördüğü ilk an, siparişin `pending` olarak oluştuğu andır ([[Gunluk-Bakim]] bu siparişlere hatırlatma gönderir).

- Sepetteki fiyat yalnızca gösterim içindir. Ödemede fiyat DB'den yeniden okunur.
- ⚠️ `src/app/odeme/page.tsx` sepeti Iyzico'ya **yönlendirmeden önce** temizler. Ödeme başarısız olursa müşteri boş sepete döner → [[Donusum-Iyilestirme]]
