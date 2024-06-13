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
import { formatScoreRate } from '@/helpers/format-score-rate';

type FidelityProgramSummaryData = {
  id: string;
  name: string;
  numberOfParticipants: number;
  numberOfRewards: number;
  numberOfActiveDays: number;
  scoreRate: string;
  createdAt: string;
};

export const PanelContent = () => {
  const { toast } = useToast();
  const { user } = useUserStore();
  const { getSummaryByBusinessOwnerId, isLoadingGetSummaryByBusinessOwnerId } =
    useFidelityProgram({
      initialState: {
        isLoadingGetSummaryByBusinessOwnerId: true,
      },
    });
  const [showFallback, setShowFallback] = useState(false);
  const [fidelityProgramSummary, setFidelityProgramSummary] =
    useState<FidelityProgramSummaryData | null>(null);

  const handleFetchFidelityProgramSummary = async () => {
    const { data, code } = await getSummaryByBusinessOwnerId(user.id!);

    switch (code) {
      case 'SUCCESS': {
        //TODO: save on state
        setFidelityProgramSummary({
          id: data!.id,
          name: data!.name,
          numberOfParticipants: data!.numberOfParticipants,
          numberOfRewards: data!.numberOfRewards,
          numberOfActiveDays: data!.numberOfActiveDays,
          scoreRate: formatScoreRate(data!.scoreRate),
          createdAt: data!.createdAt,
        });

        //TODO: save fidelity program on global state
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

  const onRegisterParticipant = () => {
    setFidelityProgramSummary((state) => ({
      ...state!,
      numberOfParticipants: state!.numberOfParticipants + 1,
    }));
  };

  useEffect(() => {
    if (user.id !== null) {
      handleFetchFidelityProgramSummary();
    }
  }, [user]);

  if (showFallback) return <FidelityProgramFallback />;

  return (
    <PageLoading isLoading={isLoadingGetSummaryByBusinessOwnerId}>
      <div className="w-full flex items-center justify-between border-b pb-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2">
        <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[24px]">
          {fidelityProgramSummary?.name}
        </h2>
        <ScoreRegisterModal
          fidelityProgramId={fidelityProgramSummary?.id ?? ''}
          scoreRate={
            fidelityProgramSummary?.scoreRate
              ? Number(
                  fidelityProgramSummary.scoreRate.replace('R$', '').replace(',', '.'),
                )
              : 0
          }
          onRegisterParticipant={onRegisterParticipant}
        />
      </div>

      <div className="max-w-[1088px] w-full overflow-auto flex items-center gap-4 my-4 max-[600px]:my-2 max-[600px]:gap-2">
        <FidelityProgramCardInfo
          title="Participantes"
          icon={Users}
          value={String(fidelityProgramSummary?.numberOfParticipants)}
          description="Clientes participantes"
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Recompensas"
          icon={Gift}
          value={String(fidelityProgramSummary?.numberOfRewards)}
          description="Opções de recompensas"
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Taxa de pontuação"
          icon={HandCoins}
          value={`${fidelityProgramSummary?.scoreRate}`}
          description={`${fidelityProgramSummary?.scoreRate} em compra = +1 ponto`}
          className="min-w-[260px]"
        />
        <FidelityProgramCardInfo
          title="Dias ativos"
          icon={CalendarClock}
          value={String(fidelityProgramSummary?.numberOfActiveDays)}
          description={`Criado em ${fidelityProgramSummary?.createdAt}`}
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
