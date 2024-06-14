'use client';

import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';

import { useUserStore } from '@/store/user-store';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { PageLoading } from '@/components/page-loading';
import { FidelityProgramFallback } from '../fidelity-program-fallback';
import { FidelityProgramInformation } from './fidelity-program-information';
import { useReward } from '@/hooks/use-reward';
import { RewardData } from '@/@types/reward-data';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';

type FidelityProgramDetailsData = {
  id: string;
  name: string;
  scoreRate: string;
};

export const FidelityProgramContent = () => {
  const { toast } = useToast();
  const { user } = useUserStore();
  const { setFidelityProgram } = useFidelityProgramStore();
  const { getDetailsByBusinessOwnerId, isLoadingGetDetailsByBusinessOwnerId } =
    useFidelityProgram({
      initialState: {
        isLoadingGetDetailsByBusinessOwnerId: true,
      },
    });
  const { findByFidelityProgramId, isLoadingFindByFidelityProgramId } = useReward({
    initialState: {
      isLoadingFindByFidelityProgramId: true,
    },
  });
  const [showFallback, setShowFallback] = useState(false);
  const [fidelityProgramDetails, setFidelityProgramDetails] =
    useState<FidelityProgramDetailsData | null>(null);
  const [rewards, setRewards] = useState<RewardData[]>([]);

  const isLoading =
    isLoadingGetDetailsByBusinessOwnerId || isLoadingFindByFidelityProgramId;

  const handleFetchFidelityProgramDetails = async () => {
    const { data, code } = await getDetailsByBusinessOwnerId(user.id!);

    switch (code) {
      case 'SUCCESS': {
        setFidelityProgramDetails({
          id: data!.id,
          name: data!.name,
          scoreRate: data!.scoreRate,
        });

        setFidelityProgram({ id: data!.id });

        const { data: rewards, code } = await findByFidelityProgramId(data!.id);

        if (code === 'SUCCESS') {
          setRewards(rewards!);
        } else if (code === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no carregamento dos dados, recarregue a página.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
        }
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
      handleFetchFidelityProgramDetails();
    }
  }, [user]);

  if (showFallback) return <FidelityProgramFallback />;

  return (
    <PageLoading isLoading={isLoading}>
      <FidelityProgramInformation
        fidelityProgramDetails={{
          id: fidelityProgramDetails?.id ?? '',
          name: fidelityProgramDetails?.name ?? '',
          scoreRate: fidelityProgramDetails?.scoreRate ?? '',
        }}
        rewards={rewards}
      />
    </PageLoading>
  );
};
