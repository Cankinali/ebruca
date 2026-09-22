---
tags: [ozellik]
---

# E-posta

`src/lib/email.ts`: tüm şablonlar tek dosyada, ortak `emailLayout()`. Sağlayıcı Resend.

| Fonksiyon | Ne zaman |
|---|---|
| `sendOrderConfirmation` | Başarılı ödeme |
| `sendShippingNotification` | İlk `shipped` geçişi |
| `sendPasswordResetEmail` | Şifre sıfırlama |
| `sendAbandonedOrderReminder` | [[Gunluk-Bakim]], 24-72 saat arası |
| `sendContactMessage` | İletişim formu (mağazaya gider) |

## Tuzaklar

- **Resend SDK 4xx/5xx durumunda exception fırlatmaz**, `{ data, error }` döner. Her gönderimde `error` kontrol edilmeli. Bu gözden kaçtığı için e-postalar aylarca sessizce gitmedi.
- Tüm göndericiler `Promise<boolean>` döner.
- `Reply-To` mağazanın gerçek gelen kutusudur, çünkü gönderim alan adının MX kaydı olmayabilir.
- DNS taşınırken `resend._domainkey`, `send` MX ve `send` TXT kayıtları mutlaka taşınmalı → [[Deploy]]

## Pazarlama

Bugünkü e-postaların hepsi **işlem bildirimi**. İçlerine indirim, kampanya veya aciliyet dili girerse ticari elektronik ileti sayılır → [[Yasal-Cerceve]]
