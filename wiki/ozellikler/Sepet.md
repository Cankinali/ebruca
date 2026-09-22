---
tags: [ozellik]
---

# Sepet

`src/lib/cart-context.tsx`: React state + `localStorage` (`ebruca_sepet` anahtarı, **7 gün** geçerli). Sunucuda tutulmaz, dolayısıyla "sepette ürün bırakanlar" listesi **yoktur**. Sunucunun gördüğü ilk an, siparişin `pending` olarak oluştuğu andır ([[Gunluk-Bakim]] bu siparişlere hatırlatma gönderir).

- Sepetteki fiyat yalnızca gösterim içindir. Ödemede fiyat DB'den yeniden okunur.
- Sepet **yalnızca `/siparis-tamamlandi` sayfasında** temizlenir, ödeme sayfasında temizlenmez. Böylece ödeme başarısız olursa müşteri sepetini dolu bulur.
- `clearCart()` localStorage'ı da hemen siler. Aksi halde alt bileşenin effect'i, sağlayıcının geri yükleme effect'inden önce çalıştığı için eski sepet geri gelirdi.
- `/sepet?error=<kod>`: `/api/odeme/sonuc` başarısız dönüşleri buraya gönderir, sayfa kodlara göre mesaj gösterir (`PaymentErrorBanner`). Uyuşmazlık durumlarında müşteri iletişime yönlendirilir.
- Sepetteki "Kupon kodu" kutusu **işlevsiz** (arkasında kod yok).
