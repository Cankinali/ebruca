---
tags: [buyume, kritik]
---

# Yasal Çerçeve (Pazarlama)

> Bu not mühendislik özetidir, hukuki görüş değildir. Kampanyalar başlamadan önce metinleri bir hukukçuya kontrol ettirin.

## Çerezler ve Meta Pixel (KVKK)

- Kişisel Verileri Koruma Kurumu'nun çerez rehberine göre **zorunlu olmayan** (analitik ve reklam) çerezler için **açık rıza** gerekir. "Siteyi kullanmaya devam ederek kabul etmiş olursunuz" yaklaşımı ve yalnızca "Kabul Et" butonu yeterli sayılmaz.
- Bugünkü `src/components/layout/CookieBanner.tsx` tam olarak bu durumda: tek bir "Kabul Et" butonu var, reddetme seçeneği yok. Pixel eklenmeden önce **Kabul Et / Reddet / Tercihler** yapısına geçilmeli ve Pixel yalnızca reklam onayı verilince yüklenmeli.
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
