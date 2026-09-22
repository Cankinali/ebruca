---
tags: [ozellik]
---

# Üyelik

**Opsiyoneldir.** Misafir olarak sipariş vermek her zaman açıktır.

- Tek kaynak `src/lib/auth.ts`: scrypt ile şifre özetleme, oturum, `getCurrentUser()` (React `cache` ile sarılı)
- Çerez `ebruca_session`: httpOnly, sameSite=lax, canlıda secure, 30 gün. DB'de token'ın SHA-256 özeti tutulur.
- 5 hatalı girişte hesap 15 dakika kilitlenir.
- Şifre sıfırlama: 1 saat geçerli, tek kullanımlık token. Şifre değişince kullanıcının tüm oturumları kapanır.
- Kayıtta KVKK ve üyelik sözleşmesi onayı damgalanır (`kvkkAcceptedAt`, `termsAcceptedAt`).
- **Pazarlama izni (ticari ileti onayı) toplanmıyor.** E-posta veya SMS kampanyası yapılacaksa ayrı onay kutusu ve İYS kaydı gerekir → [[Yasal-Cerceve]]

Geçmiş misafir siparişleri e-posta adresine göre hesaba **bağlanmaz** → [[Kararlar]]
