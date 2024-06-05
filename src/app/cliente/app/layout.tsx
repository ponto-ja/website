import { Header } from '../../../layouts/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full justify-between">
      <Header profile="owner" showButtons={false} className="max-w-[1440px]" />

      <main className="max-w-[1440px] w-full h-full border-t mx-auto mt-6 flex items-start">
        <div className="mt-4 flex flex-1 rounded">{children}</div>
      </main>
    </div>
  );
}
