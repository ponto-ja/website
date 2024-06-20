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
import { ScoreHistoryFallback } from './score-history-fallback';
import { useScoreHistory } from '@/hooks/use-score-history';
import { ScoreHistoryData } from '@/@types/score-history-data';
import { Oval } from 'react-loader-spinner';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';

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
  const { setFidelityProgram } = useFidelityProgramStore();
  const { getSummaryByBusinessOwnerId, isLoadingGetSummaryByBusinessOwnerId } =
    useFidelityProgram({
      initialState: {
        isLoadingGetSummaryByBusinessOwnerId: true,
      },
    });
  const { findByFidelityProgramId, isLoadingFindByFidelityProgramId } = useScoreHistory();
  const [showFallback, setShowFallback] = useState({
    fidelityProgram: false,
    scoreHistory: false,
  });
  const [fidelityProgramSummary, setFidelityProgramSummary] =
    useState<FidelityProgramSummaryData | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryData[]>([]);

  const handleFetchScoreHistory = async (fidelityProgramId: string) => {
    const { data: scoreHistoryData, code: scoreHistoryCode } =
      await findByFidelityProgramId(fidelityProgramId);

    if (scoreHistoryCode === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description:
          'Houve um erro no carregamento do histórico de pontuações, recarregue a página.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    if (scoreHistoryCode === 'NO_SCORE_HISTORY') {
      setShowFallback((state) => ({
        ...state,
        scoreHistory: true,
      }));
      return;
    }

    setScoreHistory(scoreHistoryData!);
    setShowFallback((state) => ({
      ...state,
      scoreHistory: false,
    }));
  };

  const handleFetchFidelityProgramSummary = async () => {
    const { data, code } = await getSummaryByBusinessOwnerId(user.id!);

    switch (code) {
      case 'SUCCESS': {
        setFidelityProgramSummary({
          id: data!.id,
          name: data!.name,
          numberOfParticipants: data!.numberOfParticipants,
          numberOfRewards: data!.numberOfRewards,
          numberOfActiveDays: data!.numberOfActiveDays,
          scoreRate: formatScoreRate(data!.scoreRate),
          createdAt: data!.createdAt,
        });

        await handleFetchScoreHistory(data!.id);

        setFidelityProgram({ id: data!.id });
        break;
      }

      case 'NOT_FIDELITY_PROGRAM_CREATED': {
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

  if (showFallback.fidelityProgram) return <FidelityProgramFallback />;

  return (
    <PageLoading isLoading={isLoadingGetSummaryByBusinessOwnerId}>
      <div className="w-full flex items-center justify-between border-b pb-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2">
        <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[24px]">
          {fidelityProgramSummary?.name}
        </h2>
        <ScoreRegisterModal
          scoreRate={
            fidelityProgramSummary?.scoreRate
              ? Number(
                  fidelityProgramSummary.scoreRate.replace('R$', '').replace(',', '.'),
                )
              : 0
          }
          onRegisterParticipant={onRegisterParticipant}
          onRegisterScore={() => handleFetchScoreHistory(fidelityProgramSummary!.id)}
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
        <p className="font-inter font-normal text-gray-500 text-sm">
          Os 10 últimos cadastros de pontos no programa
        </p>

        <div className="w-full flex flex-col mt-6 space-y-5">
          {isLoadingFindByFidelityProgramId && (
            <div className="w-full flex justify-center">
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
          {showFallback.scoreHistory && <ScoreHistoryFallback />}
          {scoreHistory.map((history) => (
            <ScoreHistory key={history.id} {...history} />
          ))}
        </div>
      </div>
    </PageLoading>
  );
};
