'use client';

import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '@/assets/images/logo.png';
import { useUserStore } from '@/store/user-store';

export const Logo = () => {
  const { user } = useUserStore();

  const getHref = () => {
    if (!user.id || !user.role) return '/perfil';

    if (user.role === 'BUSINESS_OWNER') return '/dono-de-negocio/app';

    if (user.role === 'PARTICIPANT') return '/cliente/app';
  };

  return (
    <Link href={getHref()!} className="relative">
      <Image
        src={{
          src: LogoImage.src,
          width: 114,
          height: 40,
        }}
        alt="PontoJá"
      />
      <h1 className="absolute top-0 opacity-0">Ponto Já</h1>
    </Link>
  );
};
