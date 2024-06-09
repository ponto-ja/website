'use client';

import { useEffect, useState } from 'react';
import { Users, HandCoins, Gift, CalendarClock, NotebookPen } from 'lucide-react';
import { FidelityProgramCardInfo } from '../../../../components/fidelity-program-card-info';
import { ScoreHistory } from './score-history';
import { ScoreRegisterModal } from './score-register-modal';
import { PageLoading } from '../../../../components/page-loading';
import { useUserStore } from '@/store/user-store';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { useToast } from '@/components/ui/toast/use-toast';
import { FidelityProgramFallback } from '../fidelity-program-fallback';

export const FidelityProgramContent = () => {
  const { toast } = useToast();
  const { user } = useUserStore();
  const { getByBusinessOwnerId, isLoadingGetByBusinessOwnerId } = useFidelityProgram({
    initialState: {
      isLoadingGetByBusinessOwnerId: true,
    },
  });
  const [showFallback, setShowFallback] = useState(false);

  const handleFetchFidelityProgram = async () => {
    const { data, code } = await getByBusinessOwnerId(user.id!);

    switch (code) {
      case 'SUCCESS': {
        //TODO: save on state
        //TODO: save fidelity program id on global state
        //TODO: call function to fetch score history
        break;
      }

      case 'NOT_FIDELITY_PROGRAM_CREATED': {
        setShowFallback(true);
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no carregamento dos dados, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (user.id !== null) {
      handleFetchFidelityProgram();
    }
  }, [user]);

  if (showFallback) return <FidelityProgramFallback />;

  return (
    <PageLoading isLoading={isLoadingGetByBusinessOwnerId}>
      <div className="w-full flex items-center justify-between border-b pb-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2">
        <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[24px]">
          Meu Programa de Fidelidade
        </h2>
        <ScoreRegisterModal />
      </div>

      <div className="max-w-[1088px] w-full overflow-auto flex items-center gap-4 my-4 max-[600px]:my-2 max-[600px]:gap-2">
        <FidelityProgramCardInfo
          title="Participantes"
          icon={Users}
          value="42"
          description="Clientes participantes"
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Recompensas"
          icon={Gift}
          value="1"
          description="Opções de recompensas"
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Taxa de pontuação"
          icon={HandCoins}
          value="R$ 10,00"
          description="RS 10,00 em compra = +1 ponto"
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Dias ativos"
          icon={CalendarClock}
          value="999"
          description="Criado em 22/01/2024"
          className="min-w-[260px]"
        />
      </div>

      <div className="w-full border rounded p-5">
        <div className="w-full flex items-center gap-2">
          <NotebookPen color="#374151" />
          <p className="font-inter font-semibold text-[18px] text-gray-700">
            Histórico de pontuações
          </p>
        </div>

        <div className="w-full flex flex-col mt-6 space-y-5">
          <ScoreHistory />
        </div>
      </div>
    </PageLoading>
  );
};
