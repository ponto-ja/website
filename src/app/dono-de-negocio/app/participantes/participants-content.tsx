/* eslint-disable no-extra-boolean-cast */
'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ParticipantInfoModal } from './participant-info-modal';
import { RegisterParticipantModal } from './register-participant-modal';
import { PageLoading } from '@/components/page-loading';
import { useParticipant } from '@/hooks/use-participant';
import { ParticipantData } from '@/@types/participant-data';
import { useToast } from '@/components/ui/toast/use-toast';
import { FidelityProgramFallback } from '../fidelity-program-fallback';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';
import { ParticipantsFallback } from './participants-fallback';
import { mask } from '@/helpers/mask';
import { Oval } from 'react-loader-spinner';
import { useReward } from '@/hooks/use-reward';
import { RewardData } from '@/@types/reward-data';

const ONE_SECOND = 1000;

export type Participant = Omit<ParticipantData, 'score'> & {
  phoneNumber: string;
  createdAt: string;
};

export const ParticipantsContent = () => {
  const { toast } = useToast();
  const { fidelityProgram } = useFidelityProgramStore();
  const {
    findByFidelityProgramId,
    isLoadingFindByFidelityProgramId,
    findByPhoneNumberAndFidelityProgramId,
    isLoadingFindByPhoneNumberAndFidelityProgramId,
  } = useParticipant({
    initialState: {
      isLoadingFindByFidelityProgramId: true,
    },
  });
  const {
    findByFidelityProgramId: findRewardsByFidelityProgramId,
    isLoadingFindByFidelityProgramId: isLoadingFindRewardsByFidelityProgramId,
  } = useReward({
    initialState: {
      isLoadingFindByFidelityProgramId: true,
    },
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showFallback, setShowFallback] = useState({
    fidelityProgram: false,
    participants: false,
  });
  const [phoneNumber, setPhoneNumber] = useState<string | null>();
  const [rewards, setRewards] = useState<RewardData[]>([]);

  const isLoading =
    isLoadingFindByFidelityProgramId || isLoadingFindRewardsByFidelityProgramId;

  const handleFetchParticipants = async () => {
    const { data, code } = await findByFidelityProgramId(fidelityProgram.id!);

    switch (code) {
      case 'SUCCESS': {
        setParticipants(data!);
        setShowFallback((state) => ({
          ...state,
          participants: false,
        }));
        break;
      }

      case 'NO_PARTICIPANTS': {
        setShowFallback((state) => ({
          ...state,
          participants: true,
        }));
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description:
            'Houve um erro no carregamento dos participantes, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleFetchParticipantsByPhoneNumber = async () => {
    const { code, data } = await findByPhoneNumberAndFidelityProgramId({
      fidelityProgramId: fidelityProgram.id!,
      phoneNumber: mask.onlyNumbers(phoneNumber!),
    });

    switch (code) {
      case 'PARTICIPANTS_FOUND': {
        setParticipants(data!);
        break;
      }

      case 'PARTICIPANTS_NOT_FOUND': {
        setParticipants([]);
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro ao buscar o participante, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleFetchRewards = async () => {
    const { code, data } = await findRewardsByFidelityProgramId(fidelityProgram.id!);

    if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description:
          'Houve um erro no carregamento das recompensas, recarregue a página.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    setRewards(data!);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (fidelityProgram.id !== null) {
        handleFetchParticipants();
        handleFetchRewards();
      } else {
        setShowFallback((state) => ({
          ...state,
          fidelityProgram: true,
        }));
      }
    }, ONE_SECOND);

    return () => clearTimeout(timeoutId);
  }, [fidelityProgram]);

  useEffect(() => {
    if (phoneNumber?.length === 15) {
      handleFetchParticipantsByPhoneNumber();
    } else if (phoneNumber === '') {
      handleFetchParticipants();
    }
  }, [phoneNumber]);

  if (showFallback.fidelityProgram) return <FidelityProgramFallback />;

  if (showFallback.participants)
    return (
      <>
        <div className="w-full flex items-center justify-end">
          <RegisterParticipantModal
            onRegisterParticipant={() => handleFetchParticipants()}
          />
        </div>
        <ParticipantsFallback text="Sem participantes cadastrados ainda." />
      </>
    );

  return (
    <PageLoading isLoading={isLoading}>
      <div className="w-full flex items-center justify-end">
        <RegisterParticipantModal
          onRegisterParticipant={() => handleFetchParticipants()}
        />
      </div>

      <div className="w-full border rounded p-5 mt-4">
        <div className="w-full flex items-end justify-between max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-2">
          <p className="font-inter font-semibold text-[22px] text-gray-700 max-[700px]:text-[20px]">
            Participantes cadastrados
          </p>
          <div className="relative max-w-[320px] w-full">
            <input
              type="text"
              id="phone"
              placeholder="Telefone do participante"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 pr-8 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
              value={phoneNumber ?? ''}
              onChange={({ target }) => setPhoneNumber(mask.phoneNumber(target.value))}
            />
            {!!phoneNumber ? (
              <button
                className="absolute right-2 top-4"
                onClick={() => setPhoneNumber('')}>
                <X color="#6b7280" size={20} strokeWidth={1.8} />
              </button>
            ) : (
              <Search
                color="#6b7280"
                size={20}
                strokeWidth={1.8}
                className="absolute right-2 top-4"
              />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col mt-6 space-y-5">
          {isLoadingFindByPhoneNumberAndFidelityProgramId && (
            <div className="w-full flex justify-center mt-[100px]">
              <Oval
                visible={true}
                height="46"
                width="46"
                color="#4c1d95"
                ariaLabel="oval-loading"
                secondaryColor="#c4b5fd"
                strokeWidth={4}
              />
            </div>
          )}
          {!isLoadingFindByPhoneNumberAndFidelityProgramId && (
            <>
              {participants.length === 0 && (
                <ParticipantsFallback text="Sem resultados para o telefone informado." />
              )}
              {participants.map((participant) => (
                <ParticipantInfoModal
                  key={participant.id}
                  participant={participant}
                  rewards={rewards}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </PageLoading>
  );
};
