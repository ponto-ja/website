'use client';

import { usePathname } from 'next/navigation';
import { Boxes, Gift, Users } from 'lucide-react';
import { Navigation } from '@/components/navigation';

export const SideNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="min-w-[280px] max-w-[280px] w-full flex flex-col mt-4 gap-[6px] max-[1000px]:hidden">
      <Navigation
        title="Painel"
        href="/dono-de-negocio/app/painel"
        active={pathname.includes('/painel')}
        icon={Boxes}
      />
      <Navigation
        title="Programa de Fidelidade"
        href="/dono-de-negocio/app/programa-de-fidelidade"
        active={pathname.includes('/programa-de-fidelidade')}
        icon={Gift}
      />
      <Navigation
        title="Participantes"
        href="/dono-de-negocio/app/participantes"
        active={pathname.includes('/participantes')}
        icon={Users}
      />
    </nav>
  );
};
