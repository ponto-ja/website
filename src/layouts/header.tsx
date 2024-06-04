import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type HeaderProps = {
  profile: 'client' | 'owner';
};

export const Header: FC<HeaderProps> = ({ profile }) => {
  const baseLink = {
    client: '/cliente',
    owner: '/dono-negocio',
  }[profile];
  const accessAccountLink = `${baseLink}/entrar`;
  const createAccountLink = `${baseLink}/criar-conta`;

  return (
    <header className="max-w-[1040px] w-full mx-auto mt-4 flex items-center justify-between">
      <Image
        src={{
          src: 'https://pontoja.s3.amazonaws.com/logo.png',
          width: 114,
          height: 40,
        }}
        alt="PontoJá"
      />
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
    </header>
  );
};
