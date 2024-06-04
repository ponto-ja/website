import { FirstAccessFallback } from '../first-access-fallback';
import { SideNavigation } from '../side-navigation';

export default function BusinessOwnerPanelPage() {
  return (
    <main className="max-w-[1440px] w-full h-full border-t mx-auto mt-6 flex items-start">
      <SideNavigation />

      <div className="mt-4 ml-4 flex flex-1 rounded">
        <FirstAccessFallback />
      </div>
    </main>
  );
}
