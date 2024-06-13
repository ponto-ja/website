'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Boxes, Gift, Headset, LogOut, Users } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { useUserStore } from '@/store/user-store';
import { useBusinessOwner } from '@/hooks/use-business-owner';
import { useToast } from './ui/toast/use-toast';

export const UserMenubar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [fallback, setFallback] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, clearUser } = useUserStore();
  const { getById, isLoadingGetById } = useBusinessOwner();

  const handleFetchUser = async () => {
    const { data, code } = await getById(user.id!);

    switch (code) {
      case 'SUCCESS': {
        const initialLetterFromFirstName = data!.firstName[0];
        const initialLetterFromLastName = data!.lastName[0];

        setFallback(initialLetterFromFirstName.concat(initialLetterFromLastName));

        //TODO: show a toast if user has no active subscription
        break;
      }

      case 'INVALID_ID':
      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no carregamento do perfil, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleSignOut = async () => {
    clearUser();
    router.push('/dono-de-negocio/entrar');
  };

  useEffect(() => {
    if (user.id !== null) {
      handleFetchUser();
    }
  }, [user]);

  if ((!user.id && !user.role) || !pathname.includes('/app')) return null;

  if (!user.id || isLoadingGetById)
    return <div className="w-[44px] h-[44px] rounded-full bg-violet-300 animate-pulse" />;

  return (
    <Menubar className="border-[2px] border-violet-900 bg-violet-200 rounded-full w-11 h-11 flex items-center justify-center">
      <MenubarMenu>
        <MenubarTrigger className="text-gray-700 font-semibold">
          {fallback}
        </MenubarTrigger>
        <MenubarContent className="border p-1 mr-5">
          {user.role === 'BUSINESS_OWNER' && (
            <div className="hidden max-[1000px]:block">
              <Link href="/dono-de-negocio/app/painel">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Boxes color="#374151" size={20} strokeWidth={1.8} />
                  Painel
                </MenubarItem>
              </Link>
              <Link href="/dono-de-negocio/app/programa-de-fidelidade">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Gift color="#374151" size={20} strokeWidth={1.8} />
                  Programa de Fidelidade
                </MenubarItem>
              </Link>
              <Link href="/dono-de-negocio/app/participantes">
                <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
                  <Users color="#374151" size={20} strokeWidth={1.8} />
                  Participantes
                </MenubarItem>
              </Link>
              <MenubarSeparator />
            </div>
          )}

          {/* <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
            <NotebookPen color="#374151" size={20} strokeWidth={1.8} />
            Dados do Perfil
          </MenubarItem> */}
          <MenubarItem className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2">
            <Headset color="#374151" size={20} strokeWidth={1.8} />
            Falar com Suporte
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem
            className="focus:bg-violet-200 hover:bg-violet-200 font-inter font-medium text-sm text-gray-700 flex items-center gap-2"
            onClick={handleSignOut}>
            <LogOut color="#374151" size={20} strokeWidth={1.8} />
            Sair da Conta
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
