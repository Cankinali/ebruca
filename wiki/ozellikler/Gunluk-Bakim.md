---
tags: [ozellik]
---

# Günlük Bakım (Cron)

`GET /api/cron/siparis-bakim`. Vercel Cron her gün 06:00 UTC'de (TR 09:00) çalıştırır. Yetki: `CRON_SECRET` (Bearer) ya da admin oturumu.

1. **Hatırlatma** (24-72 saat): ödemesi tamamlanmamış siparişin sahibine **tek seferlik** işlem bildirimi gider (`reminderSentAt`).
2. **İptal** (72 saatten eski): yalnızca `status='cancelled'` yapılır. `paymentStatus` korunur, sipariş panelde kalır ve geri alınabilir.

Her ikisinde de `paymentId` dolu olan siparişlere dokunulmaz. Bu, Iyzico'da kayıtlı bir ödeme olduğu anlamına gelir ve insan incelemesi gerekir.

⚠️ Hatırlatma e-postasına **indirim kodu veya "son şans" dili eklenmemeli**. Eklenirse ticari ileti olur ve onay + İYS gerekir → [[Yasal-Cerceve]]

Bu, sitedeki tek "terk edilmiş sepet" mekanizmasıdır ve yalnızca ödeme adımına kadar gelenleri yakalar. Daha erken aşamada ayrılanlar için Meta yeniden hedefleme kullanılabilir → [[Buyume-Plani]]
