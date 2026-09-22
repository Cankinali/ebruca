---
tags: [genel, kritik]
---

# Çalışma Akışı

Bir değişikliğin fikirden canlıya kadar izlediği yol.

## 1. Lokal

```bash
cd ~/Desktop/Projeler/ebruca
npm run dev          # http://localhost:3000
```

- Yerel veritabanı `dev.db`. Canlı Turso bilgileri `.env.production.local` dosyasında durur ve **yalnızca bilinçli olarak** kullanılır.
- Iyzico yerelde sandbox'a gitmeli (`IYZIPAY_BASE_URL`).

## 2. Doğrulama

- Test altyapısı yok. Mantığı geçici bir `.tmp.mts` script'iyle yerel DB'ye karşı deneyin, **sonra silin**.
- `npm run lint`: **14 sorun baştan beri var.** Sayı 14'ün üstüne çıkarsa sebep yeni değişikliktir.
- `npm run build`: Vercel'e gitmeden önce yerelde build alın.
- Şema değiştiyse `npx prisma generate` → [[Veritabani]]

## 3. Commit

- Mesaj formatı Türkçe ve konvansiyonel: `feat: …`, `fix: …`, `docs: …`
- İlgili wiki notu **aynı commit'te** güncellenir.

## 4. Canlı

`main`'e push edilince Vercel deploy eder → [[Deploy]]

Canlı SQL gerekiyorsa sıra şöyle: **yedek → SQL → deploy**. Yeni kolonu okuyan kod, kolon eklenmeden canlıya çıkarsa site kırılır.

## 5. Canlıda kontrol

Ödemeye dokunan her değişiklikten sonra:
- Test siparişi verin, `/siparis-tamamlandi` sayfasına ulaşılıyor mu bakın
- Onay e-postası geldi mi bakın (Resend hata fırlatmaz → [[E-posta]])
- Admin panelinde "Ödenmiş Siparişler" listesinde görünüyor mu bakın
