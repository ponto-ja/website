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
import { useReward } from '@/hooks/use-reward';
import { RewardData } from '@/@types/reward-data';
import { Oval } from 'react-loader-spinner';
import { useRewardHistory } from '@/hooks/use-reward-history';
import { RewardHistoryData } from '@/@types/reward-history-data';
import { HistoryFallback } from './history-fallback';
import { useScoreHistory } from '@/hooks/use-score-history';
import { ScoreHistoryData } from '@/@types/score-history-data';

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
  const { findByFidelityProgramId, isLoadingFindByFidelityProgramId } = useReward();
  const {
    findByFidelityProgramIdAndParticipantId,
    isLoadingFindByFidelityProgramIdAndParticipantId,
  } = useRewardHistory();
  const {
    findByFidelityProgramIdAndParticipantId:
      findScoreHistoryByFidelityProgramIdAndParticipantId,
    isLoadingFindByFidelityProgramIdAndParticipantId:
      isLoadingFindScoreHistoryByFidelityProgramIdAndParticipantId,
  } = useScoreHistory();
  const [showFallback, setShowFallback] = useState({
    fidelityProgram: false,
    rewardHistory: false,
    scoreHistory: false,
  });
  const [fidelityProgram, setFidelityProgram] = useState<FidelityProgramData | null>(
    null,
  );
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryData[]>([]);
  const [scoreHistory, setScoreHistory] = useState<
    Omit<ScoreHistoryData, 'participant'>[]
  >([]);

  const handleFetchAvailableRewards = async () => {
    const { code, data } = await findByFidelityProgramId(fidelityProgramId);

    if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description:
          'Houve um erro no carregamento das recompensas disponíveis, recarregue a página.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    setRewards(data!);
  };

  const handleFetchRewardHistory = async () => {
    const { code, data } = await findByFidelityProgramIdAndParticipantId({
      fidelityProgramId,
      participantId: user.id!,
    });

    switch (code) {
      case 'FOUND_HISTORY': {
        setRewardHistory(data!);
        break;
      }

      case 'NOT_FOUND_HISTORY': {
        setShowFallback((state) => ({
          ...state,
          rewardHistory: true,
        }));
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description:
            'Houve um erro no carregamento do histórico de recompensas, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleFetchScoreHistory = async () => {
    const { code, data } = await findScoreHistoryByFidelityProgramIdAndParticipantId({
      fidelityProgramId,
      participantId: user.id!,
    });

    switch (code) {
      case 'FOUND_HISTORY': {
        setScoreHistory(data!);
        break;
      }

      case 'NOT_FOUND_HISTORY': {
        setShowFallback((state) => ({
          ...state,
          scoreHistory: true,
        }));
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description:
            'Houve um erro no carregamento do histórico de pontos, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleFetchFidelityProgram = async () => {
    const { code, data } = await getByFidelityProgramIdAndParticipantId({
      fidelityProgramId,
      participantId: user.id!,
    });

    switch (code) {
      case 'FOUND_FIDELITY_PROGRAM': {
        setFidelityProgram(data!);

        await Promise.all([
          handleFetchAvailableRewards(),
          handleFetchRewardHistory(),
          handleFetchScoreHistory(),
        ]);
        break;
      }

      case 'NOT_FOUND_FIDELITY_PROGRAM': {
        setShowFallback((state) => ({
          ...state,
          fidelityProgram: true,
        }));
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
    if (fidelityProgramId && user.id) {
      handleFetchFidelityProgram();
    }
  }, [fidelityProgramId, user]);

  if (showFallback.fidelityProgram) return <FidelityProgramsFallback />;

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
            value={String(fidelityProgram?.numberOfActiveDays)}
            description={`Criado em ${fidelityProgram?.createdAt}`}
            className="min-w-[300px] max-w-[300px]"
          />
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Recompensas disponíveis
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Recompensas que você pode ganhar dentro do programa
          </p>
          {isLoadingFindByFidelityProgramId && (
            <div className="w-full flex justify-center mt-4">
              <Oval
                visible={true}
                height="38"
                width="38"
                color="#4c1d95"
                ariaLabel="oval-loading"
                secondaryColor="#c4b5fd"
                strokeWidth={4}
              />
            </div>
          )}
          <div className="mt-3 flex items-stretch flex-wrap gap-2">
            {rewards.map((reward) => (
              <Reward.Root className="max-w-[400px]" key={reward.id}>
                <Reward.Name>{reward.name}</Reward.Name>
                <Reward.ScoreRate>
                  Pontuação necessária: {reward.scoreNeeded}
                </Reward.ScoreRate>
                {reward.description && (
                  <Reward.Description>{reward.description}</Reward.Description>
                )}
              </Reward.Root>
            ))}
          </div>
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Histórico de recompensas
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Recompensas que você já ganhou dentro do programa
          </p>
          {isLoadingFindByFidelityProgramIdAndParticipantId && (
            <div className="w-full flex justify-center mt-4">
              <Oval
                visible={true}
                height="38"
                width="38"
                color="#4c1d95"
                ariaLabel="oval-loading"
                secondaryColor="#c4b5fd"
                strokeWidth={4}
              />
            </div>
          )}
          <div className="mt-3 flex items-stretch flex-wrap gap-2">
            {rewardHistory.map((reward) => (
              <Reward.Root className="max-w-[400px]" key={reward.id}>
                <Reward.Name>{reward.name}</Reward.Name>
                <Reward.ScoreRate>
                  Pontuação necessária: {reward.scoreNeeded}
                </Reward.ScoreRate>
                {reward.description && (
                  <Reward.Description>{reward.description}</Reward.Description>
                )}
              </Reward.Root>
            ))}
          </div>
          {showFallback.rewardHistory && (
            <HistoryFallback title="Você ainda não ganhou alguma recompensa desse programa." />
          )}
        </div>

        <div className="mt-10 w-full">
          <p className="font-inter font-medium text-gray-700 text-[18px]">
            Histórico de pontos
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            Seu histórico de pontos dentro do programa
          </p>
          {isLoadingFindScoreHistoryByFidelityProgramIdAndParticipantId && (
            <div className="w-full flex justify-center mt-4">
              <Oval
                visible={true}
                height="38"
                width="38"
                color="#4c1d95"
                ariaLabel="oval-loading"
                secondaryColor="#c4b5fd"
                strokeWidth={4}
              />
            </div>
          )}
          <div className="w-full mt-3 max-w-[600px] flex flex-col">
            {scoreHistory.map((history, index) => (
              <ScoreHistory key={history.id} index={index + 1} {...history} />
            ))}
          </div>
          {showFallback.scoreHistory && (
            <HistoryFallback title="Você ainda não teve pontos cadastrados dentro do programa." />
          )}
        </div>
      </div>
    </PageLoading>
  );
};
