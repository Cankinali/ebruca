/**
 * E-posta gönderim altyapısı — Resend.
 * RESEND_API_KEY yoksa sessizce no-op çalışır (geliştirme için).
 */
import { Resend } from 'resend';
import { COMPANY } from './company';
import { SITE } from './seo';

const FROM = process.env.EMAIL_FROM || `${COMPANY.brand} <onboarding@resend.dev>`;

function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
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

export async function sendOrderConfirmation(order: OrderInfo) {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — gönderilmedi (sipariş onayı)');
    return;
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
    await r.emails.send({
      from: FROM,
      to: order.email,
      subject: `Siparişiniz alındı · ${order.orderNo}`,
      html: emailLayout('Siparişiniz Alındı 🎉', body),
    });
  } catch (e) {
    console.error('[Email] Sipariş onayı gönderilemedi:', e);
  }
}

interface ShippingInfo extends OrderInfo {
  cargoCompany?: string;
  trackingNo?: string;
}

export async function sendShippingNotification(order: ShippingInfo) {
  const r = client();
  if (!r) {
    console.log('[Email] RESEND_API_KEY yok — gönderilmedi (kargo)');
    return;
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
    await r.emails.send({
      from: FROM,
      to: order.email,
      subject: `Siparişiniz kargoya verildi · ${order.orderNo}`,
      html: emailLayout('Siparişiniz Yola Çıktı 🚚', body),
    });
  } catch (e) {
    console.error('[Email] Kargo bilgisi gönderilemedi:', e);
  }
}
