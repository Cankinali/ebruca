import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ebruca | Kadın Giyim',
  description:
    'Ebruca ile modern kadın giyiminde şıklığı keşfedin. Elbise, takım, abiye ve daha fazlası. Güvenli alışveriş, hızlı kargo.',
  keywords: 'kadın giyim, elbise, takım, abiye, şal, kemer, online alışveriş',
  openGraph: {
    title: 'Ebruca | Kadın Giyim',
    description: 'Modern kadın giyiminde şıklığı keşfedin.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <CartProvider>
          <Header />
          <main className="flex-1 min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
