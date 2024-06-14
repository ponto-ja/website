'use client';

import { FC, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { InputField } from '@/components/input-field';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { mask } from '@/helpers/mask';
import {
  registerParticipantSchema,
  RegisterParticipantData,
} from './register-participant-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/user-store';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';
import { useBusinessOwner } from '@/hooks/use-business-owner';
import { useToast } from '@/components/ui/toast/use-toast';
import { useParticipant } from '@/hooks/use-participant';
import { ThreeDots } from 'react-loader-spinner';
import { usePivotFidelityProgramsParticipants } from '@/hooks/use-pivot-fidelity-programs-participants';
import { useScore } from '@/hooks/use-score';

type RegisterParticipantModalProps = {
  onRegisterParticipant: () => void;
};

export const RegisterParticipantModal: FC<RegisterParticipantModalProps> = ({
  onRegisterParticipant,
}) => {
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterParticipantData>({
    resolver: zodResolver(registerParticipantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });
  const { user } = useUserStore();
  const { fidelityProgram } = useFidelityProgramStore();
  const { checkSubscription, isLoadingCheckSubscription } = useBusinessOwner();
  const {
    getByPhoneNumber,
    isLoadingGetByPhoneNumber,
    register: registerParticipant,
    isLoadingRegister: isLoadingRegisterParticipant,
  } = useParticipant();
  const {
    getByFidelityProgramIdAndParticipantId,
    isLoadingGetByFidelityProgramIdAndParticipantId,
    register: registerRelationBetweenFidelityProgramAndParticipant,
    isLoadingRegister: isLoadingRegisterRelationBetweenFidelityProgramAndParticipant,
  } = usePivotFidelityProgramsParticipants();
  const { register: registerScore, isLoadingRegister: isLoadingRegisterScore } =
    useScore();
  const [open, setOpen] = useState(false);

  const isLoading =
    isLoadingCheckSubscription ||
    isLoadingGetByPhoneNumber ||
    isLoadingRegisterParticipant ||
    isLoadingGetByFidelityProgramIdAndParticipantId ||
    isLoadingRegisterRelationBetweenFidelityProgramAndParticipant ||
    isLoadingRegisterScore;

  const handleRegisterParticipant: SubmitHandler<RegisterParticipantData> = async ({
    firstName,
    lastName,
    phoneNumber,
  }) => {
    const { data, code } = await checkSubscription(user.id!);

    if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro no cadastro de pontos, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    if (code === 'SUCCESS' && !data!.hasActiveSubscription) {
      toast({
        title: 'Ops! Assinatura expirada :(',
        description: 'Entre em contato com o suporte para renovar a sua assinatura.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    const { code: participantCode, data: participantByPhoneNumberData } =
      await getByPhoneNumber(mask.onlyNumbers(phoneNumber));

    switch (participantCode) {
      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro do participante, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }

      case 'PARTICIPANT_NOT_FOUND': {
        const { data: participantData, code: registerParticipantCode } =
          await registerParticipant({
            firstName,
            lastName,
            phoneNumber: mask.onlyNumbers(phoneNumber),
          });

        if (registerParticipantCode === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no cadastro do participante, tente novamente.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        const { code: scoreCode } = await registerScore({
          fidelityProgramId: fidelityProgram.id!,
          participantId: participantData!.id,
          score: 0,
        });

        if (scoreCode === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no cadastro do participante, tente novamente.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        const { code } = await registerRelationBetweenFidelityProgramAndParticipant({
          fidelityProgramId: fidelityProgram.id!,
          participantId: participantData!.id,
        });

        if (code === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no cadastro do participante, tente novamente.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        toast({
          title: '✅ Participante cadastrado com sucesso.',
        });

        reset();

        onRegisterParticipant();

        setOpen(false);

        break;
      }

      case 'PARTICIPANT_FOUND': {
        const { code } = await getByFidelityProgramIdAndParticipantId({
          fidelityProgramId: fidelityProgram.id!,
          participantId: participantByPhoneNumberData!.id,
        });

        if (code === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no cadastro do participante, tente novamente.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        if (code === 'RELATION_FOUND') {
          toast({
            title: 'Participante já cadastrado no programa.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        const { code: registerRelationCode } =
          await registerRelationBetweenFidelityProgramAndParticipant({
            fidelityProgramId: fidelityProgram.id!,
            participantId: participantByPhoneNumberData!.id,
          });

        if (registerRelationCode === 'UNEXPECTED_ERROR') {
          toast({
            title: 'Ops! Erro inesperado :(',
            description: 'Houve um erro no cadastro do participante, tente novamente.',
            variant: 'destructive',
            titleClassName: 'text-white',
            descriptionClassName: 'text-white',
          });
          return;
        }

        toast({
          title: '✅ Participante cadastrado com sucesso.',
        });

        reset();

        onRegisterParticipant();

        setOpen(false);

        break;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button
          type="button"
          className="bg-violet-900 font-inter font-medium text-sm text-white flex items-center gap-1 px-3 py-2">
          <Plus color="#FFFFFF" size={18} strokeWidth={3} />
          Cadastrar participante
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar participante</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(handleRegisterParticipant)}>
          <InputField
            type="text"
            placeholder="Digite o nome do participante"
            label="Nome"
            required={true}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <InputField
            type="text"
            placeholder="Digite o sobrenome do participante"
            label="Sobrenome"
            required={true}
            error={errors.lastName?.message}
            {...register('lastName')}
            rootClassName="my-3"
          />
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { value, onChange } }) => (
              <InputField
                type="text"
                placeholder="Digite o telefone do partipante"
                label="Telefone"
                required={true}
                error={errors.phoneNumber?.message}
                value={value}
                onChange={({ target }) => onChange(mask.phoneNumber(target.value))}
              />
            )}
          />
          <div className="w-full flex items-center justify-between mt-4">
            <Button
              type="button"
              className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              disabled={isLoading}
              className="min-w-[100px] bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white flex justify-center">
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
                'Cadastrar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
