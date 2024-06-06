import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, FC } from 'react';
import { NotebookPen, Headset, LogOut, Menu, Boxes, Gift, Users } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
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
        'max-w-[1040px] w-full mx-auto mt-4 flex items-center justify-between px-4',
        className,
      )}>
      <Link href="/perfil" className="relative">
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

      <Menubar className="border-[2px] border-violet-900 bg-violet-200 rounded-full w-11 h-11 flex items-center justify-center">
        <MenubarMenu>
          <MenubarTrigger className="text-gray-700 font-semibold">TS</MenubarTrigger>
          <MenubarContent className="border p-1 mr-5">
            <div className="hidden max-[1000px]:block">
              <Link href="/dono-negocio/app/painel">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Boxes color="#374151" size={20} strokeWidth={1.8} />
                  Painel
                </MenubarItem>
              </Link>
              <Link href="/dono-negocio/app/programa-de-fidelidade">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Gift color="#374151" size={20} strokeWidth={1.8} />
                  Programa de Fidelidade
                </MenubarItem>
              </Link>
              <Link href="/dono-negocio/app/participantes">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Users color="#374151" size={20} strokeWidth={1.8} />
                  Participantes
                </MenubarItem>
              </Link>

              <MenubarSeparator />
            </div>

            <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
              <NotebookPen color="#374151" size={20} strokeWidth={1.8} />
              Dados do Perfil
            </MenubarItem>
            <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
              <Headset color="#374151" size={20} strokeWidth={1.8} />
              Falar com Suporte
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
              <LogOut color="#374151" size={20} strokeWidth={1.8} />
              Sair da Conta
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {showButtons && (
        <>
          <div className="flex items-center gap-8 max-[450px]:hidden">
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
          <div className="hidden max-[450px]:block">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="text-gray-700 font-semibold">
                  <Menu color="#374151" size={26} />
                </MenubarTrigger>
                <MenubarContent className="border p-1 mr-5 -mt-2">
                  <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                    <Link href={accessAccountLink}>Acessar conta</Link>
                  </MenubarItem>
                  <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                    <Link href={createAccountLink}>Criar conta grátis</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </>
      )}
    </header>
  );
};
