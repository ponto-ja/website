'use client';

import { FC, useEffect, useState } from 'react';
import { Plus, CircleAlert, CircleCheckBig } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Oval, ThreeDots } from 'react-loader-spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { InputField } from '@/components/input-field';
import {
  registerScoreWithParticipantDataSchema,
  registerScoreWithoutParticipantDataSchema,
  RegisterScoreWithParticipantData,
} from './register-score-schema';
import { mask } from '@/helpers/mask';
import { ParticipantData } from '@/@types/participant-data';
import { useParticipant } from '@/hooks/use-participant';
import { useToast } from '@/components/ui/toast/use-toast';
import { useBusinessOwner } from '@/hooks/use-business-owner';
import { useUserStore } from '@/store/user-store';
import { useScore } from '@/hooks/use-score';
import { useScoreHistory } from '@/hooks/use-score-history';
import { ScoreOperation } from '@/enums/score-operation';
import { usePivotFidelityProgramsParticipants } from '@/hooks/use-pivot-fidelity-programs-participants';

type ScoreRegisterModalProps = {
  fidelityProgramId: string;
  scoreRate: number;
  onRegisterParticipant: () => void;
};

export const ScoreRegisterModal: FC<ScoreRegisterModalProps> = ({
  fidelityProgramId,
  scoreRate,
  onRegisterParticipant,
}) => {
  const { toast } = useToast();
  const [isParticipantNotFound, setIsParticipantNotFound] = useState<boolean | null>(
    null,
  );
  const {
    register,
    formState: { errors },
    control,
    watch,
    handleSubmit,
    reset,
  } = useForm<RegisterScoreWithParticipantData>({
    resolver: zodResolver(
      isParticipantNotFound === true
        ? registerScoreWithParticipantDataSchema
        : registerScoreWithoutParticipantDataSchema,
    ),
    defaultValues: {
      phoneNumber: '',
      amount: '',
      firstName: '',
      lastName: '',
    },
  });
  const { user } = useUserStore();
  const { checkSubscription, isLoadingCheckSubscription } = useBusinessOwner();
  const {
    getByPhoneNumber,
    isLoadingGetByPhoneNumber,
    register: registerParticipant,
    isLoadingRegister: isLoadingRegisterParticipant,
  } = useParticipant();
  const {
    update,
    isLoadingUpdate,
    register: registerScore,
    isLoadingRegister: isLoadingRegisterScore,
  } = useScore();
  const {
    register: registerScoreHistory,
    isLoadingRegister: isLoadingRegisterScoreHistory,
  } = useScoreHistory();
  const {
    register: registerRelationBetweenFidelityProgramAndParticipant,
    isLoadingRegister: isLoadingRegisterRelationBetweenFidelityProgramAndParticipant,
  } = usePivotFidelityProgramsParticipants();
  const [open, setOpen] = useState(false);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);

  const phoneNumberValue = watch('phoneNumber');
  const amountValue = watch('amount');

  const isLoading =
    isLoadingCheckSubscription ||
    isLoadingUpdate ||
    isLoadingRegisterScoreHistory ||
    isLoadingRegisterParticipant ||
    isLoadingRegisterScore ||
    isLoadingRegisterRelationBetweenFidelityProgramAndParticipant;
  const scorePerAmount = ['', '0,00'].includes(amountValue)
    ? 0
    : Math.trunc(Number(amountValue.replace(',', '.')) / scoreRate);

  const handleRegisterScore: SubmitHandler<RegisterScoreWithParticipantData> = async (
    formData,
  ) => {
    if (scorePerAmount <= 0) {
      toast({
        title: 'Deve-se cadastrar no mínimo 1 ponto.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

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

    if (isParticipantNotFound === false) {
      const { code: scoreCode } = await update({
        id: participant!.score.id,
        score: participant!.score.score + scorePerAmount,
      });

      if (scoreCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }

      const { code: scoreHistoryCode } = await registerScoreHistory({
        fidelityProgramId: fidelityProgramId,
        participantId: participant!.id,
        score: scorePerAmount,
        operation: ScoreOperation.EARNING,
      });

      if (scoreHistoryCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }
    } else if (isParticipantNotFound === true) {
      const { data: participantData, code: participantCode } = await registerParticipant({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: mask.onlyNumbers(formData.phoneNumber),
      });

      if (participantCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }

      const { code: relationCode } =
        await registerRelationBetweenFidelityProgramAndParticipant({
          fidelityProgramId,
          participantId: participantData!.id,
        });

      if (relationCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }

      const { code: scoreCode } = await registerScore({
        fidelityProgramId,
        participantId: participantData!.id,
        score: scorePerAmount,
      });

      if (scoreCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }

      const { code: scoreHistoryCode } = await registerScoreHistory({
        fidelityProgramId: fidelityProgramId,
        participantId: participantData!.id,
        score: scorePerAmount,
        operation: ScoreOperation.EARNING,
      });

      if (scoreHistoryCode === 'UNEXPECTED_ERROR') {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no cadastro de pontos, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        return;
      }

      onRegisterParticipant();
    }

    toast({
      title: '✅ Pontos cadastrados com sucesso.',
    });

    reset();

    setOpen(false);
  };

  const handleGetParticipantByPhoneNumber = async () => {
    const { data, code } = await getByPhoneNumber({
      phoneNumber: mask.onlyNumbers(phoneNumberValue),
      fidelityProgramId,
    });

    switch (code) {
      case 'SUCCESS': {
        setParticipant({
          id: data!.id,
          firstName: data!.firstName,
          lastName: data!.lastName,
          score: data!.score,
        });
        setIsParticipantNotFound(false);
        break;
      }

      case 'PARTICIPANT_NOT_FOUND': {
        setIsParticipantNotFound(true);
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description:
            'Houve um erro no carregamento ao buscar o participante, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (phoneNumberValue.length === 15) {
      setParticipant(null);
      setIsParticipantNotFound(null);
      handleGetParticipantByPhoneNumber();
    } else {
      setIsParticipantNotFound(null);
      setParticipant(null);
    }
  }, [phoneNumberValue]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button
          type="button"
          className="bg-violet-900 font-inter font-medium text-sm text-white flex items-center gap-1 px-3 py-2">
          <Plus color="#FFFFFF" size={18} strokeWidth={3} />
          Cadastrar pontos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de pontos</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(handleRegisterScore)}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { value, onChange } }) => (
              <div className="mt-4 relative">
                <InputField
                  type="text"
                  placeholder="Digite o telefone do partipante"
                  label="Telefone do participante"
                  required={true}
                  error={errors.phoneNumber?.message}
                  value={value}
                  onChange={({ target }) => onChange(mask.phoneNumber(target.value))}
                />
                {isLoadingGetByPhoneNumber && (
                  <Oval
                    visible={true}
                    height="22"
                    width="22"
                    color="#4c1d95"
                    ariaLabel="oval-loading"
                    secondaryColor="#c4b5fd"
                    strokeWidth={4}
                    wrapperClass="absolute right-2 top-[38px]"
                  />
                )}
              </div>
            )}
          />
          {isParticipantNotFound === true && (
            <>
              <div className="w-full bg-red-200 p-[6px] rounded flex items-center gap-2 my-2 border-[1px] border-red-500 mb-4">
                <span>
                  <CircleAlert strokeWidth={2} color="#ef4444" size={20} />
                </span>
                <p className="font-inter font-medium text-sm text-red-500">
                  Usuário ainda não cadastrado. Informe os dados abaixo para cadastrá-lo.
                </p>
              </div>

              <InputField
                type="text"
                placeholder="Digite o nome do participante"
                label="Nome do participante"
                required={true}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <InputField
                type="text"
                placeholder="Digite o sobrenome do participante"
                label="Sobrenome do participante"
                required={true}
                error={errors.lastName?.message}
                {...register('lastName')}
                rootClassName="mt-4"
              />
            </>
          )}

          {!!participant && !isParticipantNotFound && (
            <div className="w-full bg-green-200 p-[6px] rounded flex items-center gap-2 my-2 border-[1px] border-green-500 mb-4">
              <span>
                <CircleCheckBig strokeWidth={2} color="#16a34a" size={20} />
              </span>
              <p className="font-inter font-medium text-sm text-green-600">
                Participante cadastrado: {participant?.firstName} {participant?.lastName}
              </p>
            </div>
          )}
          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange } }) => (
              <>
                <div className="mt-3">
                  <InputField
                    type="text"
                    placeholder="Digite o valor da compra"
                    label="Valor da compra"
                    required={true}
                    error={errors.amount?.message}
                    value={value}
                    onChange={({ target }) => onChange(mask.currency(target.value))}
                  />
                </div>
                {!!amountValue && (
                  <p className="font-inter font-normal text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded mt-2">
                    Pontos ganhos nessa compra:{' '}
                    <span className="font-semibold">{scorePerAmount}</span>
                  </p>
                )}
              </>
            )}
          />

          {!!participant && !isParticipantNotFound && (
            <div className="w-full bg-violet-200 rounded mt-4 p-3">
              <p className="font-inter font-medium text-base text-gray-500 text-center">
                Saldo atual do participante
              </p>
              <p className="font-inter font-semibold text-3xl text-gray-500 text-center mt-2">
                {participant?.score?.score}
              </p>
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-4">
            <Button
              type="button"
              className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              type="submit"
              disabled={(!participant && !isParticipantNotFound) || isLoading}
              className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white min-w-[90px] flex justify-center">
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
