import './globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  variable: '--inter',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ponto Já',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
