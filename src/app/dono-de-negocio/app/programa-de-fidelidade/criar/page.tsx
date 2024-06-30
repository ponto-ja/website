'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreeDots } from 'react-loader-spinner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/button';
import { RewardModal } from '../../../../../components/reward-modal';
import { Reward } from '../../../../../components/reward';
import { InputField } from '@/components/input-field';
import {
  RegisterFidelityProgramData,
  registerFidelityProgramSchema,
} from './register-fidelity-program-schema';
import { useToast } from '@/components/ui/toast/use-toast';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { useReward } from '@/hooks/use-reward';
import { useUserStore } from '@/store/user-store';
import { mask } from '@/helpers/mask';
import { RewardData } from '@/@types/reward-data';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';
import { useBusinessOwner } from '@/hooks/use-business-owner';

export default function CreateFidelityProgramPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFidelityProgramData>({
    resolver: zodResolver(registerFidelityProgramSchema),
    defaultValues: {
      name: '',
      scoreRate: '',
    },
  });
  const { toast } = useToast();
  const { user } = useUserStore();
  const { setFidelityProgram } = useFidelityProgramStore();
  const {
    register: registerFidelityProgram,
    isLoadingRegister: isLoadingRegisterFidelityProgram,
  } = useFidelityProgram();
  const { register: registerReward } = useReward();
  const { checkSubscription, isLoadingCheckSubscription } = useBusinessOwner();
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [isRegisteringRewards, setIsRegisteringRewards] = useState(false);

  const scoreRateValue = watch('scoreRate');

  const isLoading =
    isLoadingRegisterFidelityProgram ||
    isRegisteringRewards ||
    isLoadingCheckSubscription;

  const handleRegisterFidelityProgram: SubmitHandler<
    RegisterFidelityProgramData
  > = async ({ name, scoreRate }) => {
    if (rewards.length === 0) {
      toast({
        title: 'Adicione pelo menos 1 recompensa.',
        variant: 'destructive',
        titleClassName: 'text-white',
      });
      return;
    }

    const { data: subscriptionData, code: subscriptionCode } = await checkSubscription(
      user.id!,
    );

    if (subscriptionCode === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro no cadastro do programa, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    if (subscriptionCode === 'SUCCESS' && !subscriptionData!.hasActiveSubscription) {
      toast({
        title: 'Ops! Assinatura expirada :(',
        description: 'Entre em contato com o suporte para renovar a sua assinatura.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    const formattedScoreRate = Number(scoreRate.replace(',', '.'));

    const { data, code } = await registerFidelityProgram({
      name,
      scoreRate: formattedScoreRate,
      businessOwnerId: user.id!,
    });

    switch (code) {
      case 'CREATED': {
        setFidelityProgram({ id: data!.id });

        const rewardsToSave = rewards.map((reward) =>
          registerReward({
            fidelityProgramId: data!.id,
            name: reward.name,
            scoreNeeded: reward.scoreNeeded,
            description: reward.description || null,
          }),
        );

        setIsRegisteringRewards(true);

        await Promise.all(rewardsToSave);

        setIsRegisteringRewards(false);

        toast({
          title: '✅ Programa de Fidelidade',
          description: 'Seu programa de fidelidade foi criado com sucesso.',
        });

        router.replace('/dono-de-negocio/app/painel');
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

  const handleAddReward = (reward: RewardData) => {
    setRewards((state) => [...state, reward]);
  };

  const handleRemoveReward = (rewardId: string) => {
    const data = rewards.filter((reward) => reward.id !== rewardId);
    setRewards(data);
  };

  const handleUpdateReward = (reward: RewardData) => {
    const data = rewards.map((item) => {
      if (item.id === reward.id) return reward;
      return item;
    });
    setRewards(data);
  };

  return (
    <div className="pb-6">
      <h2 className="font-inter font-bold text-2xl text-gray-700 max-[600px]:text-[22px]">
        Cadastrar programa de fidelidade
      </h2>
      <p className="font-inter font-normal text-base text-gray-600">
        Preencha as informações abaixo para cadastrar seu programa de fidelidade.
      </p>

      <form
        className="mt-10 max-w-[600px] w-full"
        onSubmit={handleSubmit(handleRegisterFidelityProgram)}>
        <InputField
          type="text"
          placeholder="Digite o nome do programa"
          label="Nome do programa de fidelidade"
          required={true}
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
                required={true}
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
          <label className="font-inter font-medium text-gray-700">Recompensas*</label>
          <p className="font-inter font-normal text-sm text-gray-700">
            Adicione as recompensas do seu programa de fidelidade
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
                    onClick={() => handleRemoveReward(reward.id)}
                  />
                  <RewardModal
                    initialRewardState={{
                      id: reward.id,
                      name: reward.name,
                      scoreNeeded: String(reward.scoreNeeded),
                      description: reward.description ?? '',
                    }}
                    onSaveReward={(data) => handleUpdateReward(data)}>
                    <Reward.Actions.Update type="button" />
                  </RewardModal>
                </Reward.Actions.Wrap>
              </Reward.Root>
            ))}
          </div>
          <div className="w-full flex justify-center mt-2">
            <RewardModal onSaveReward={handleAddReward}>
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
          disabled={isLoading}
          className="max-w-[260px] w-full bg-violet-900 font-inter font-normal text-sm text-white mt-10 px-3 py-2 flex justify-center">
          {isLoading ? (
            <ThreeDots
              height="20"
              width="40"
              radius="9"
              color="#fafafa"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            'Cadastrar programa de fidelidade'
          )}
        </Button>
      </form>
    </div>
  );
}
