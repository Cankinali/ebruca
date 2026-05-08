import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'Sipariş, kargo, iade, beden ve ödeme konularında en çok sorulan soruların cevaplarını burada bulabilirsiniz.',
  alternates: { canonical: absoluteUrl('/sss') },
};

export default function SssPage() {
  return <FaqClient />;
}
