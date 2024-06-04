import { Header } from '../../../layouts/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full justify-between">
      <Header profile="owner" showButtons={false} className="max-w-[1440px]" />
      {children}
    </div>
  );
}
