'use client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreeDots } from 'react-loader-spinner';
import cuid from 'cuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import {
  RegisterRewardData,
  registerRewardSchema,
} from '../app/dono-negocio/app/programa-de-fidelidade/criar/register-reward-schema';
import { InputField } from '@/components/input-field';
import { mask } from '@/helpers/mask';
import { RewardData } from '@/@types/reward-data';

type RewardModalProps = {
  onSaveReward: (data: RewardData) => void | Promise<void>;
  initialRewardState?: {
    id: string;
    name: string;
    scoreNeeded: string;
    description: string;
  };
  isLoading?: boolean;
};

export const RewardModal: FC<PropsWithChildren<RewardModalProps>> = ({
  children,
  onSaveReward,
  initialRewardState,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterRewardData>({
    resolver: zodResolver(registerRewardSchema),
    defaultValues: {
      name: '',
      scoreNeeded: '',
      description: '',
    },
  });
  const [open, setOpen] = useState(false);

  const handleRegisterReward: SubmitHandler<RegisterRewardData> = async ({
    name,
    scoreNeeded,
    description,
  }) => {
    const reward = {
      id: initialRewardState?.id ?? cuid(),
      name,
      scoreNeeded: Number(scoreNeeded),
      description,
    };

    await onSaveReward(reward);

    reset();

    setOpen(false);
  };

  useEffect(() => {
    setValue('name', initialRewardState?.name ?? '');
    setValue('scoreNeeded', initialRewardState?.scoreNeeded ?? '');
    setValue('description', initialRewardState?.description ?? '');
  }, [initialRewardState]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger className="h-5">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova recompensa</DialogTitle>
        </DialogHeader>

        <form
          className="mt-4"
          onSubmit={(event) => {
            event.stopPropagation();
            handleSubmit(handleRegisterReward)(event);
          }}>
          <InputField
            type="text"
            placeholder="Digite o nome da recompensa"
            label="Nome da recompensa"
            required={true}
            error={errors.name?.message}
            {...register('name')}
          />
          <Controller
            control={control}
            name="scoreNeeded"
            render={({ field: { value, onChange } }) => (
              <InputField
                type="text"
                placeholder="Digite a quantidade de pontos"
                label="Pontos necessários"
                required={true}
                value={value}
                onChange={({ target }) => onChange(mask.onlyNumbers(target.value))}
                rootClassName="my-4"
                error={errors.scoreNeeded?.message}
              />
            )}
          />
          <div className="flex flex-col">
            <label htmlFor="description" className="font-inter font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              placeholder="Uma descrição para os participantes entenderem melhor a recompensa"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 resize-none placeholder:font-light"
              {...register('description')}
            />
          </div>

          <div className="w-full flex items-center justify-between mt-4">
            <Button
              type="button"
              className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white min-w-[140px] flex justify-center">
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
                'Salvar recompensa'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
