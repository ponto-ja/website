'use client';

import { FC, PropsWithChildren, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import cuid from 'cuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { RewardData } from './page';
import { RegisterRewardData, registerRewardSchema } from './register-reward-schema';
import { InputField } from '@/components/input-field';
import { mask } from '@/helpers/mask';

type RewardModalProps = {
  onSaveReward: (data: RewardData) => void;
  initialRewardState?: {
    id: string;
    name: string;
    scoreNeeded: string;
    description: string;
  };
};

export const RewardModal: FC<PropsWithChildren<RewardModalProps>> = ({
  children,
  onSaveReward,
  initialRewardState,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterRewardData>({
    resolver: zodResolver(registerRewardSchema),
    defaultValues: {
      name: initialRewardState?.name ?? '',
      scoreNeeded: initialRewardState?.scoreNeeded ?? '',
      description: initialRewardState?.description ?? '',
    },
  });
  const [open, setOpen] = useState(false);

  const handleRegisterReward: SubmitHandler<RegisterRewardData> = ({
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

    onSaveReward(reward);

    reset();

    setOpen(false);
  };

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
              className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white">
              Salvar recompensa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
