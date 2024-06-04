import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
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
          href="/dono-negocio/entrar"
          className="font-inter font-medium text-sm text-gray-700">
          Acessar conta
        </Link>
        <Link
          href="/dono-negocio/criar-conta"
          className="bg-violet-900 text-white font-inter font-normal text-sm rounded-md py-[6px] px-3 hover:opacity-80 transition-opacity duration-300">
          Criar conta grátis
        </Link>
      </div>
    </header>
  );
};
