import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import LogoImage from '@/assets/images/logo.png';

type HeaderProps = {
  profile?: 'client' | 'owner';
  showButtons?: boolean;
  className?: ComponentProps<'header'>['className'];
};

export const Header: FC<HeaderProps> = ({
  profile = 'owner',
  showButtons = true,
  className,
}) => {
  const baseLink = {
    client: '/cliente',
    owner: '/dono-negocio',
  }[profile];
  const accessAccountLink = `${baseLink}/entrar`;
  const createAccountLink = `${baseLink}/criar-conta`;

  return (
    <header
      className={twMerge(
        'max-w-[1040px] w-full mx-auto mt-4 flex items-center justify-between',
        className,
      )}>
      <Link href="/perfil">
        <Image
          src={{
            src: LogoImage.src,
            width: 114,
            height: 40,
          }}
          alt="PontoJá"
        />
      </Link>
      {showButtons && (
        <div className="flex items-center gap-8">
          <Link
            href={accessAccountLink}
            className="font-inter font-medium text-sm text-gray-700">
            Acessar conta
          </Link>
          <Link
            href={createAccountLink}
            className="bg-violet-900 text-white font-inter font-normal text-sm rounded-md py-[6px] px-3 hover:opacity-80 transition-opacity duration-300">
            Criar conta grátis
          </Link>
        </div>
      )}
    </header>
  );
};
