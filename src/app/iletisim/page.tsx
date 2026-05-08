import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Ebruca ile iletişime geçin. Telefon, e-posta, WhatsApp ve mağaza adresimiz. Hafta içi 09:00-18:00 arası size yardımcı olmaktan memnuniyet duyarız.',
  alternates: { canonical: absoluteUrl('/iletisim') },
};

export default function IletisimPage() {
  return <ContactForm />;
}
