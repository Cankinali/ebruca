/**
 * E-posta gönderim altyapısı — Resend.
 * RESEND_API_KEY yoksa sessizce no-op çalışır (geliştirme için).
 */
import { Resend } from 'resend';
import { COMPANY } from './company';
import { SITE } from './seo';

const FROM = process.env.EMAIL_FROM || `${COMPANY.brand} <onboarding@resend.dev>`;

/**
 * resend.dev, Resend'in paylaşımlı test göndericisidir: bu adresle YALNIZCA
 * Resend hesabının sahibi olan e-postaya gönderim yapılabilir, müşteri
 * adreslerine yapılan gönderimler 403 ile reddedilir.
 * Canlıya çıkmadan önce ebruca.com alan adı Resend'de doğrulanmalı ve
 * EMAIL_FROM o alan adındaki bir adrese çevrilmelidir.
 */
const TEST_GONDERICI = FROM.includes('resend.dev');

let uyarildi = false;
function gondericiUyarisi() {
  if (uyarildi || !TEST_GONDERICI) return;
  uyarildi = true;
  console.error(
    '[Email] UYARI: Gönderici adresi resend.dev test adresi. Müşterilere ' +
    'gönderilen TÜM e-postalar reddedilecek. resend.com/domains adresinden ' +
    'alan adı doğrulayıp EMAIL_FROM değerini güncelleyin.'
  );
}

function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  gondericiUyarisi();
  return new Resend(key);
}

/** Gönderim sonucunu tek yerden, görünür şekilde raporlar. */
function bildir(tur: string, alici: string, hata: unknown): boolean {
  if (!hata) return true;
  console.error(
    `[Email] GÖNDERİLEMEDİ (${tur}) → ${alici}:`,
    hata instanceof Error ? hata.message : hata
  );
  return false;
}

interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface OrderInfo {
  orderNo: string;
  firstName: string;
  email: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
  address?: string;
  city?: string;
  district?: string;
}

function emailLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;color:#333;">
  <div style="max-width:560px;margin:0 auto;background:#fff;">
    <div style="background:#000;color:#fff;padding:24px;text-align:center;letter-spacing:6px;font-weight:700;font-size:20px;">
      EBRUCA
    </div>
    <div style="padding:32px 24px;">
      <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;">${title}</h1>
      ${body}
    </div>
    <div style="background:#f8f8f8;padding:16px 24px;text-align:center;font-size:11px;color:#888;border-top:1px solid #eee;">
      ${COMPANY.brand} · ${COMPANY.address}<br>
      <a href="${SITE.url}" style="color:#888;">${SITE.url.replace('https://', '')}</a>
      · ${COMPANY.email} · ${COMPANY.phone}
    </div>
  </div>
</body></html>`;
}

function itemsTable(items: OrderItem[]) {
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${items.map(i => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px 0;font-size:14px;">
          <strong>${i.name}</strong><br>
          <span style="color:#888;font-size:12px;">Beden: ${i.size} · Renk: ${i.color} · Adet: ${i.quantity}</span>
        </td>
        <td style="padding:8px 0;font-size:14px;text-align:right;white-space:nowrap;">
          ${(i.price * i.quantity).toLocaleString('tr-TR')} TL
        </td>
      </tr>
    `).join('')}
  </table>`;
}

export async function sendOrderConfirmation(order: OrderInfo): Promise<boolean> {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — gönderilmedi (sipariş onayı)');
    return false;
  }
  const subtotal = order.total - order.shippingFee;
  const body = `
    <p style="font-size:14px;color:#555;">Merhaba ${order.firstName},</p>
    <p style="font-size:14px;color:#555;">Siparişiniz alındı, ödemeniz başarıyla tamamlandı. ${COMPANY.brand} olarak teşekkür ederiz! 🛍️</p>
    <div style="background:#f8f8f8;padding:12px 16px;margin:16px 0;border-left:3px solid #000;">
      <strong>Sipariş No:</strong> <span style="font-family:monospace;">${order.orderNo}</span>
    </div>
    <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-top:24px;">Ürünler</h3>
    ${itemsTable(order.items)}
    <table style="width:100%;font-size:14px;margin-top:16px;">
      <tr><td>Ara Toplam</td><td style="text-align:right;">${subtotal.toLocaleString('tr-TR')} TL</td></tr>
      <tr><td>Kargo</td><td style="text-align:right;">${order.shippingFee === 0 ? 'Ücretsiz' : order.shippingFee.toLocaleString('tr-TR') + ' TL'}</td></tr>
      <tr style="font-weight:700;border-top:1px solid #ccc;"><td style="padding-top:8px;">Toplam</td><td style="text-align:right;padding-top:8px;">${order.total.toLocaleString('tr-TR')} TL</td></tr>
    </table>
    ${order.address ? `<h3 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-top:24px;">Teslimat Adresi</h3>
    <p style="font-size:13px;color:#555;line-height:1.6;">${order.address}<br>${order.district ?? ''}/${order.city ?? ''}</p>` : ''}
    <p style="font-size:13px;color:#555;margin-top:24px;">Siparişiniz hazırlanıp kargoya verildiğinde size ayrı bir e-posta ile bilgilendirme yapılacaktır.</p>
    <p style="font-size:13px;color:#555;">Sorularınız için: <a href="mailto:${COMPANY.email}" style="color:#000;">${COMPANY.email}</a></p>
  `;
  try {
    // Resend SDK 4xx/5xx durumunda exception FIRLATMAZ; hatayı döndürür.
    const { error } = await r.emails.send({
      from: FROM,
      to: order.email,
      subject: `Siparişiniz alındı · ${order.orderNo}`,
      html: emailLayout('Siparişiniz Alındı 🎉', body),
    });
    return bildir('sipariş onayı', order.email, error);
  } catch (e) {
    return bildir('sipariş onayı', order.email, e);
  }
}

interface ShippingInfo extends OrderInfo {
  cargoCompany?: string;
  trackingNo?: string;
}

export async function sendShippingNotification(order: ShippingInfo): Promise<boolean> {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — gönderilmedi (kargo)');
    return false;
  }
  const body = `
    <p style="font-size:14px;color:#555;">Merhaba ${order.firstName},</p>
    <p style="font-size:14px;color:#555;">Siparişiniz kargoya verildi 🚚</p>
    <div style="background:#f8f8f8;padding:16px;margin:16px 0;border-left:3px solid #000;">
      <strong>Sipariş No:</strong> <span style="font-family:monospace;">${order.orderNo}</span><br>
      ${order.cargoCompany ? `<strong>Kargo Firması:</strong> ${order.cargoCompany}<br>` : ''}
      ${order.trackingNo ? `<strong>Takip No:</strong> <span style="font-family:monospace;">${order.trackingNo}</span>` : ''}
    </div>
    <p style="font-size:13px;color:#555;">Kargonuz 2-4 iş günü içinde teslim edilecektir.</p>
    <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-top:24px;">Sipariş İçeriği</h3>
    ${itemsTable(order.items)}
    ${order.address ? `<h3 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-top:24px;">Teslimat Adresi</h3>
    <p style="font-size:13px;color:#555;line-height:1.6;">${order.address}<br>${order.district ?? ''}/${order.city ?? ''}</p>` : ''}
    <p style="font-size:13px;color:#555;margin-top:24px;">Teşekkür ederiz! 💕</p>
  `;
  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: order.email,
      subject: `Siparişiniz kargoya verildi · ${order.orderNo}`,
      html: emailLayout('Siparişiniz Yola Çıktı 🚚', body),
    });
    return bildir('kargo bildirimi', order.email, error);
  } catch (e) {
    return bildir('kargo bildirimi', order.email, e);
  }
}

interface PasswordResetInfo {
  email: string;
  firstName: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(info: PasswordResetInfo): Promise<boolean> {
  const r = client();
  if (!r) {
    // Geliştirmede anahtar yoksa bağlantıyı konsola yaz — akış test edilebilsin.
    console.log('[Email] RESEND_API_KEY yok — şifre sıfırlama bağlantısı:', info.resetUrl);
    return false;
  }
  const body = `
    <p style="font-size:14px;color:#555;">Merhaba ${info.firstName},</p>
    <p style="font-size:14px;color:#555;">Hesabınız için şifre sıfırlama talebinde bulunuldu. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${info.resetUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Şifremi Yenile</a>
    </p>
    <p style="font-size:13px;color:#555;">Bu bağlantı <strong>1 saat</strong> geçerlidir ve yalnızca bir kez kullanılabilir.</p>
    <p style="font-size:13px;color:#555;">Bu talebi siz oluşturmadıysanız bu e-postayı görmezden gelebilirsiniz — şifreniz değişmeden kalır.</p>
    <p style="font-size:11px;color:#999;margin-top:24px;word-break:break-all;">Buton çalışmazsa bu adresi tarayıcınıza yapıştırın:<br>${info.resetUrl}</p>
  `;
  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: info.email,
      subject: 'Şifre sıfırlama talebi',
      html: emailLayout('Şifrenizi Yenileyin', body),
    });
    return bildir('şifre sıfırlama', info.email, error);
  } catch (e) {
    return bildir('şifre sıfırlama', info.email, e);
  }
}

interface ReminderItem extends OrderItem {
  /** Ürün sayfasına dönüş linki — yoksa isim düz metin gösterilir. */
  url?: string;
}

interface ReminderInfo {
  orderNo: string;
  firstName: string;
  email: string;
  total: number;
  shippingFee: number;
  items: ReminderItem[];
  /** "Siparişimi Tamamla" butonunun gideceği adres. */
  ctaUrl: string;
  /** Sipariş otomatik iptal edilene kadar kalan saat. */
  kalanSaat: number;
}

/**
 * Ödemesi tamamlanmamış sipariş hatırlatması.
 *
 * Bilinçli olarak İŞLEM BİLDİRİMİ dilinde yazılmıştır: kişinin kendi
 * başlattığı sipariş kaydıyla ilgili bilgilendirmedir. İndirim, aciliyet
 * baskısı veya kampanya dili İÇERMEZ — o durumda ticari elektronik ileti
 * sayılır ve alıcı onayı + İYS kaydı gerekir (6563 sayılı kanun).
 */
export async function sendAbandonedOrderReminder(info: ReminderInfo): Promise<boolean> {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — gönderilmedi (sipariş hatırlatma)', info.orderNo);
    return false;
  }

  const satirlar = info.items.map(i => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:10px 0;font-size:14px;">
        ${i.url
          ? `<a href="${i.url}" style="color:#000;text-decoration:none;font-weight:600;">${i.name}</a>`
          : `<strong>${i.name}</strong>`}<br>
        <span style="color:#888;font-size:12px;">Beden: ${i.size} · Renk: ${i.color} · Adet: ${i.quantity}</span>
      </td>
      <td style="padding:10px 0;font-size:14px;text-align:right;white-space:nowrap;">
        ${(i.price * i.quantity).toLocaleString('tr-TR')} TL
      </td>
    </tr>`).join('');

  const body = `
    <p style="font-size:14px;color:#555;">Merhaba ${info.firstName},</p>
    <p style="font-size:14px;color:#555;">
      <strong>${info.orderNo}</strong> numaralı siparişinizin ödemesi tamamlanmadı.
      Seçtiğiniz ürünler aşağıda — dilerseniz kaldığınız yerden devam edebilirsiniz.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">${satirlar}</table>
    <table style="width:100%;font-size:14px;">
      <tr><td>Kargo</td><td style="text-align:right;">${info.shippingFee === 0 ? 'Ücretsiz' : info.shippingFee.toLocaleString('tr-TR') + ' TL'}</td></tr>
      <tr style="font-weight:700;border-top:1px solid #ccc;"><td style="padding-top:8px;">Toplam</td><td style="text-align:right;padding-top:8px;">${info.total.toLocaleString('tr-TR')} TL</td></tr>
    </table>
    <p style="text-align:center;margin:28px 0;">
      <a href="${info.ctaUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Siparişimi Tamamla</a>
    </p>
    <p style="font-size:13px;color:#888;">
      Tamamlanmayan siparişler ${info.kalanSaat} saat içinde otomatik olarak iptal edilir.
      Ürünlerin stok durumu bu sürede değişebilir.
    </p>
    <p style="font-size:13px;color:#555;">
      Ödeme sırasında bir sorun yaşadıysanız bize yazın:
      <a href="mailto:${COMPANY.email}" style="color:#000;">${COMPANY.email}</a>
    </p>
  `;

  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: info.email,
      subject: `Siparişiniz tamamlanmadı · ${info.orderNo}`,
      html: emailLayout('Siparişiniz Sizi Bekliyor', body),
    });
    return bildir('sipariş hatırlatma', info.email, error);
  } catch (e) {
    return bildir('sipariş hatırlatma', info.email, e);
  }
}

interface ContactInfo {
  ad: string;
  email: string;
  konu: string;
  mesaj: string;
}

/**
 * İletişim formu mesajını mağazanın kendi adresine iletir.
 * Reply-To müşterinin adresi olarak ayarlanır; böylece gelen kutusundan
 * doğrudan "yanıtla" ile müşteriye dönülebilir.
 */
export async function sendContactMessage(info: ContactInfo): Promise<boolean> {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — iletişim mesajı gönderilmedi:', info.email);
    return false;
  }

  const kacis = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const body = `
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#888;width:90px;">Gönderen</td><td style="padding:6px 0;"><strong>${kacis(info.ad)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#888;">E-posta</td><td style="padding:6px 0;"><a href="mailto:${kacis(info.email)}" style="color:#000;">${kacis(info.email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#888;">Konu</td><td style="padding:6px 0;">${kacis(info.konu)}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:#f8f8f8;border-left:3px solid #000;font-size:14px;line-height:1.7;white-space:pre-wrap;">${kacis(info.mesaj)}</div>
    <p style="font-size:12px;color:#888;margin-top:20px;">Bu e-postayı yanıtlarsanız doğrudan müşteriye ulaşır.</p>
  `;

  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: COMPANY.email,
      replyTo: info.email,
      subject: `İletişim formu: ${info.konu || 'Konu belirtilmemiş'} — ${info.ad}`,
      html: emailLayout('Yeni İletişim Mesajı', body),
    });
    return bildir('iletişim mesajı', COMPANY.email, error);
  } catch (e) {
    return bildir('iletişim mesajı', COMPANY.email, e);
  }
}
