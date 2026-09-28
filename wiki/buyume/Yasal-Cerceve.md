---
tags: [buyume, kritik]
---

# Yasal Çerçeve (Pazarlama)

> Bu not mühendislik özetidir, hukuki görüş değildir. Kampanyalar başlamadan önce metinleri bir hukukçuya kontrol ettirin.

## Çerezler ve Meta Pixel (KVKK)

- Kişisel Verileri Koruma Kurumu'nun çerez rehberine göre **zorunlu olmayan** (analitik ve reklam) çerezler için **açık rıza** gerekir. "Siteyi kullanmaya devam ederek kabul etmiş olursunuz" yaklaşımı ve yalnızca "Kabul Et" butonu yeterli sayılmaz.
- 28.09.2026: `CookieBanner.tsx` **Kabul Et / Reddet** yapısına geçti (butonlar eşit görünümde); Pixel ve CAPI yalnızca onayla çalışır, onay `ebruca_consent` çerezinde. "Tercihler" (kategori bazlı) henüz yok. 28.09.2026'da `/cerez`, `/kvkk` ve `/gizlilik` sitenin gerçekte yaptığına göre yeniden yazıldı: gerçek çerez listesi (Google Analytics yok — eski metin yanlıştı), `/cerez`'te **tercih değiştirme** (reddedince `_fbp`/`_fbc` silinir), KVKK'da hukuki sebepler (m.5), Meta'ya açık rızayla aktarım ve hash'lenen alanlar, yurt dışındaki altyapı sağlayıcıları (Vercel, Turso, Cloudflare, Resend), m.11 haklarının tamamı. Eski metin "yurt dışına aktarım yapılmaz" diyordu — altyapı yüzünden zaten doğru değildi.
- **Açık kalan hukuki iş (kodla çözülmez):** Yurt dışındaki hizmet sağlayıcılar için KVKK m.9 kapsamında standart sözleşme ve Kurum'a bildirim; VERBİS kaydı gerekip gerekmediği. Bir avukat/mali müşavirle teyit edilmeli. Yeni bir izleme aracı eklenirse `/cerez` ve `/kvkk` güncellenir.
- `/cerez` sayfası kullanılmayan Google Analytics'ten bahsediyor. Metin, gerçekte kullanılan araçlara göre güncellenmeli (Meta eklenince Meta da yazılmalı).
- Meta'ya veri göndermek **yurt dışına aktarım** sayılır. KVKK'nın güncel aktarım hükümleri (standart sözleşme vb.) ve aydınlatma metni (`/kvkk`, `/gizlilik`) buna göre güncellenmeli.

## Ticari elektronik ileti (6563 sayılı kanun, İYS)

- İndirim, kampanya veya "son şans" içeren e-posta ya da SMS **ticari elektronik iletidir**. Alıcının önceden onayı ve **İYS (İleti Yönetim Sistemi)** kaydı gerekir.
- Bugünkü e-postaların hepsi işlem bildirimi (onay, kargo, şifre, hatırlatma), onay gerektirmez. **İçlerine pazarlama dili eklenmemeli** → [[E-posta]], [[Gunluk-Bakim]]
- Kayıt ve ödeme formunda **ayrı, önceden işaretlenmemiş** bir "kampanyalardan haberdar olmak istiyorum" kutusu gerekir. Onay zamanı ve kanalı saklanmalı (örneğin `User.marketingConsentAt`) → [[Uyelik]]

## Reklam metinleri

- İndirim gösteriliyorsa gerçek bir önceki fiyata dayanmalı (`originalPrice`). Fiyat Etiketi Yönetmeliği'ndeki indirim kurallarına dikkat edilmeli.
- Sitede gösterilen puan ve yorumlar gerçek olmalı. Sabit bir puan yazılmamalı.
- Mesafeli satış ve ön bilgilendirme metinleri kampanya koşullarıyla çelişmemeli.
