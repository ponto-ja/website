'use client';

import { FC, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '@/components/input-field';
import { Button } from '@/components/button';
import { ThreeDots } from 'react-loader-spinner';
import {
  UpdateFidelityProgramData,
  updateFidelityProgramSchema,
} from './update-fidelity-program-schema';
import { mask } from '@/helpers/mask';
import { Plus } from 'lucide-react';
import { RewardModal } from '../../../../components/reward-modal';
import { Reward } from '@/components/reward';
import { useToast } from '@/components/ui/toast/use-toast';
import { formatScoreRate } from '@/helpers/format-score-rate';
import { RewardData } from '@/@types/reward-data';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { useReward } from '@/hooks/use-reward';

type FidelityProgramInformationProps = {
  fidelityProgramDetails: {
    id: string;
    name: string;
    scoreRate: string;
  };
  rewards: RewardData[];
};

export const FidelityProgramInformation: FC<FidelityProgramInformationProps> = ({
  fidelityProgramDetails,
  rewards: rewardsProps,
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateFidelityProgramData>({
    resolver: zodResolver(updateFidelityProgramSchema),
    defaultValues: {
      name: fidelityProgramDetails.name,
      scoreRate: formatScoreRate(
        Number(fidelityProgramDetails.scoreRate.replace(/\./g, '').replace(/,/, '.')),
        false,
      ),
    },
  });
  const {
    update: updateFidelityProgram,
    isLoadingUpdate: isLoadingUpdateFidelityProgram,
  } = useFidelityProgram();
  const {
    deleteRecord,
    isLoadingDeleteRecord,
    register: registerReward,
    isLoadingRegister,
    update: updateReward,
    isLoadingUpdate: isLoadingUpdateReward,
  } = useReward();
  const [rewards, setRewards] = useState<RewardData[]>(rewardsProps);
  const [rewardId, setRewardId] = useState<string | null>(null);

  const scoreRateValue = watch('scoreRate');

  const handleUpdateFidelityProgramDetails: SubmitHandler<
    UpdateFidelityProgramData
  > = async ({ name, scoreRate }) => {
    if (rewards.length === 0) {
      toast({
        title: 'Adicione pelo menos 1 recompensa',
        variant: 'destructive',
        titleClassName: 'text-white',
      });
      return;
    }

    const formattedScoreRate = Number(scoreRate.replace(',', '.'));

    const { code } = await updateFidelityProgram({
      id: fidelityProgramDetails.id!,
      name,
      scoreRate: formattedScoreRate,
    });

    if (code === 'UPDATED') {
      toast({
        title: '✅ Programa de Fidelidade',
        description: 'As informações foram atualizadas com sucesso.',
      });
    } else if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro na atualização dos dados, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (rewards.length <= 1) {
      toast({
        title: 'Seu programa de fidelidade deve ter pelo menos 1 recompensa.',
        variant: 'destructive',
        titleClassName: 'text-white',
      });
      return;
    }

    setRewardId(rewardId);

    const { code } = await deleteRecord(rewardId);

    if (code === 'DELETED') {
      toast({
        title: '✅ Programa de Fidelidade',
        description: 'Recompensa deletada com sucesso.',
      });
    } else if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro ao deletar a recompensa, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
    }

    const data = rewards.filter((reward) => reward.id !== rewardId);

    setRewards(data);
    setRewardId(null);
  };

  const handleAddReward = async (reward: RewardData) => {
    const { data, code } = await registerReward({
      fidelityProgramId: fidelityProgramDetails.id,
      name: reward.name,
      scoreNeeded: reward.scoreNeeded,
      description: reward.description,
    });

    if (code === 'CREATED') {
      const newReward = {
        id: data!.id,
        name: data!.name,
        description: data!.description,
        scoreNeeded: data!.scoreNeeded,
      };

      setRewards((state) => [...state, newReward]);

      toast({
        title: '✅ Programa de Fidelidade',
        description: 'Recompensa adicionada com sucesso.',
      });
    } else if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro ao adicionar a recompensa, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
    }
  };

  const handleUpdateReward = async (reward: RewardData) => {
    const { code } = await updateReward({
      id: reward.id,
      name: reward.name,
      scoreNeeded: reward.scoreNeeded,
      description: reward.description || null,
    });

    if (code === 'UPDATED') {
      const data = rewards.map((item) => {
        if (item.id === reward.id) return reward;
        return item;
      });

      setRewards(data);

      toast({
        title: '✅ Programa de Fidelidade',
        description: 'Recompensa atualizada com sucesso.',
      });
    } else if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro ao atualizar a recompensa, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
    }
  };

  return (
    <div className="pb-6">
      <h2 className="font-inter font-bold text-2xl text-gray-700 max-[600px]:text-[22px]">
        {fidelityProgramDetails.name}
      </h2>
      <p className="font-inter font-normal text-base text-gray-600">
        Você pode editar seu programa de fidelidade atualizando as informações abaixo.
      </p>

      <form
        className="mt-10 max-w-[600px] w-full"
        onSubmit={handleSubmit(handleUpdateFidelityProgramDetails)}>
        <InputField
          type="text"
          placeholder="Digite o nome do programa"
          label="Nome do programa de fidelidade"
          error={errors.name?.message}
          {...register('name')}
        />
        <Controller
          control={control}
          name="scoreRate"
          render={({ field: { value, onChange } }) => (
            <div className="mt-6">
              <InputField
                type="text"
                placeholder="Digite a taxa de pontos"
                label="Taxa de pontos"
                error={errors.scoreRate?.message}
                value={value}
                onChange={({ target }) => onChange(mask.currency(target.value))}
              />
              <p className="font-inter font-normal text-sm text-gray-700 mt-[2px]">
                A cada{' '}
                <span className="font-semibold">
                  R$ {scoreRateValue === '' ? '0,00' : scoreRateValue}
                </span>{' '}
                em compras, o participante ganha +1 ponto
              </p>
            </div>
          )}
        />

        <div className="flex flex-col mt-6">
          <label className="font-inter font-medium text-gray-700">Recompensas</label>
          <p className="font-inter font-normal text-sm text-gray-700">
            Você pode atualizar as recompensas do seu programa de fidelidade
          </p>
          <div className="my-2 flex flex-col gap-2">
            {rewards.map((reward) => (
              <Reward.Root key={reward.id}>
                <Reward.Name>{reward.name}</Reward.Name>
                <Reward.ScoreRate>
                  Pontuação necessária: {reward.scoreNeeded}
                </Reward.ScoreRate>
                {!!reward.description && (
                  <Reward.Description>{reward.description}</Reward.Description>
                )}
                <Reward.Actions.Wrap>
                  <Reward.Actions.Delete
                    type="button"
                    isLoading={reward.id === rewardId && isLoadingDeleteRecord}
                    disabled={reward.id === rewardId && isLoadingDeleteRecord}
                    onClick={() => handleDeleteReward(reward.id)}
                  />
                  <RewardModal
                    initialRewardState={{
                      id: reward.id,
                      name: reward.name,
                      scoreNeeded: String(reward.scoreNeeded),
                      description: reward.description ?? '',
                    }}
                    onSaveReward={handleUpdateReward}
                    isLoading={isLoadingUpdateReward}>
                    <Reward.Actions.Update type="button" />
                  </RewardModal>
                </Reward.Actions.Wrap>
              </Reward.Root>
            ))}
          </div>
          <div className="w-full flex justify-center mt-2">
            <RewardModal onSaveReward={handleAddReward} isLoading={isLoadingRegister}>
              <Button
                type="button"
                className="bg-violet-200 font-inter font-medium text-sm text-gray-500 flex items-center gap-1">
                <Plus color="#6b7280" size={18} strokeWidth={3} />
                Nova recompensa
              </Button>
            </RewardModal>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoadingUpdateFidelityProgram}
          className="max-w-[260px] w-full bg-violet-900 font-inter font-normal text-sm text-white mt-10 px-3 py-2 flex justify-center">
          {isLoadingUpdateFidelityProgram ? (
            <ThreeDots
              height="20"
              width="40"
              radius="9"
              color="#fafafa"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            'Atualizar programa de fidelidade'
          )}
        </Button>
      </form>
    </div>
  );
};
