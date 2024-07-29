import { Toaster } from '@/components/ui/toast/toaster';
import './globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--inter',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ponto Já',
  description: 'Seu negócio com um programa de fidelidade em menos de 2 minutos',
  openGraph: {
    title: 'Ponto Já',
    description: 'Seu negócio com um programa de fidelidade em menos de 2 minutos',
    type: 'website',
    url: 'https://pontoja.netlify.app/',
    images: 'https://pontoja.s3.amazonaws.com/gift.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} antialiased`}>
      <body className="w-full h-screen">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
