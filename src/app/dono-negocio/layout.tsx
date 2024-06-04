import { Footer } from '../layouts/footer';
import { Header } from '../layouts/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
