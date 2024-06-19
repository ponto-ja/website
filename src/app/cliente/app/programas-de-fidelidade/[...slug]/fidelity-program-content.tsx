'use client';

import { FC, useEffect, useState } from 'react';
import { FidelityProgramCardInfo } from '@/components/fidelity-program-card-info';
import { CalendarClock, CircleDollarSign, Gift, HandCoins } from 'lucide-react';
import { ScoreHistory } from './score-history';
import { Reward } from '@/components/reward';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { PageLoading } from '@/components/page-loading';
import { useToast } from '@/components/ui/toast/use-toast';
import { FidelityProgramsFallback } from '../fidelity-programs-fallback';
import { formatScoreRate } from '@/helpers/format-score-rate';
import { useUserStore } from '@/store/user-store';

type FidelityProgramContentProps = {
  fidelityProgramId: string;
};

type FidelityProgramData = {
  id: string;
  name: string;
  numberOfRewards: number;
  numberOfActiveDays: number;
  scoreRate: number;
  totalScore: number;
  createdAt: string;
};

export const FidelityProgramContent: FC<FidelityProgramContentProps> = ({
  fidelityProgramId,
}) => {
  const { toast } = useToast();
  const { user } = useUserStore();
  const {
    getByFidelityProgramIdAndParticipantId,
    isLoadingGetByFidelityProgramIdAndParticipantId,
  } = useFidelityProgram({
    initialState: {
      isLoadingGetByFidelityProgramIdAndParticipantId: true,
    },
  });
  const [showFallback, setShowFallback] = useState(false);
  const [fidelityProgram, setFidelityProgram] = useState<FidelityProgramData | null>(
    null,
  );

  const handleFetchFidelityProgram = async () => {
    const { code, data } = await getByFidelityProgramIdAndParticipantId({
      fidelityProgramId,
      participantId: user.id!,
    });

    switch (code) {
      case 'FOUND_FIDELITY_PROGRAM': {
        setFidelityProgram(data!);
        //TODO: Fetch rewards
        //TODO: Fetch reward history
        //TODO: Fetch score history
        break;
      }

      case 'NOT_FOUND_FIDELITY_PROGRAM': {
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
    if (fidelityProgramId && user) {
      handleFetchFidelityProgram();
    }
  }, [fidelityProgramId, user]);

  if (showFallback) return <FidelityProgramsFallback />;

  return (
    <PageLoading isLoading={isLoadingGetByFidelityProgramIdAndParticipantId}>
      <div className="w-full mb-4">
        <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[22px]">
          {fidelityProgram?.name}
        </h2>

        <div className="max-w-[1440px] w-full overflow-auto flex items-center gap-4 mt-4">
          <FidelityProgramCardInfo
            title="Total de pontos"
            icon={CircleDollarSign}
            value={String(fidelityProgram?.totalScore)}
            description="Seu total de pontos no programa"
            className="min-w-[300px] max-w-[300px]"
          />
          <FidelityProgramCardInfo
            title="Taxa de pontuação"
            icon={HandCoins}
            value={formatScoreRate(fidelityProgram?.scoreRate ?? 0)}
            description="RS 10,00 em compra = +1 ponto"
            className="min-w-[300px] max-w-[300px]"
          />
          <FidelityProgramCardInfo
            title="Recompensas"
            icon={Gift}
            value={String(fidelityProgram?.numberOfRewards)}
            description="Opções de recompensas"
            className="min-w-[300px] max-w-[300px]"
          />
          <FidelityProgramCardInfo
            title="Dias ativos"
            icon={CalendarClock}
            value="2"
            description={`Criado em ${fidelityProgram?.createdAt}`}
            className="min-w-[300px] max-w-[300px]"
          />
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Recompensas disponíveis
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Recompensas que pode ganhar dentro do programa
          </p>
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <Reward.Root className="max-w-[400px]">
              <Reward.Name>Desconto de 50% na próxima compra</Reward.Name>
              <Reward.ScoreRate>Pontuação necessária: 100</Reward.ScoreRate>
              <Reward.Description>
                Breve descrição sobre a recompensa ...
              </Reward.Description>
            </Reward.Root>
            <Reward.Root className="max-w-[400px]">
              <Reward.Name>Desconto de 50% na próxima compra</Reward.Name>
              <Reward.ScoreRate>Pontuação necessária: 100</Reward.ScoreRate>
              <Reward.Description>
                Breve descrição sobre a recompensa ...
              </Reward.Description>
            </Reward.Root>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Histórico de recompensas
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Recompensas que você já ganhou dentro do programa
          </p>
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <Reward.Root className="max-w-[400px]">
              <Reward.Name>Desconto de 50% na próxima compra</Reward.Name>
              <Reward.ScoreRate>Pontuação necessária: 100</Reward.ScoreRate>
              <Reward.Description>
                Breve descrição sobre a recompensa ...
              </Reward.Description>
            </Reward.Root>
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Histórico de pontos
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Seu histórico de pontos dentro do programa
          </p>
          <div className="w-full mt-3 max-w-[600px] flex flex-col">
            <ScoreHistory />
            <ScoreHistory />
          </div>
        </div>
      </div>
    </PageLoading>
  );
};
