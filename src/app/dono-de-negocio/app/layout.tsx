import { Header } from '../../../layouts/header';
import { ProtectedRoute } from './protected-route';
import { SideNavigation } from './side-navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full justify-between">
        <Header profile="owner" showButtons={false} className="max-w-[1440px]" />

        <main className="max-w-[1440px] w-full h-full border-t mx-auto mt-6 flex items-start px-4 max-[600px]:px-2 max-[1000px]:mt-3">
          <SideNavigation />

          <div className="max-w-[1088px] overflow-auto w-full mt-4 pb-10 ml-10 flex flex-1 rounded max-[1000px]:ml-0">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
