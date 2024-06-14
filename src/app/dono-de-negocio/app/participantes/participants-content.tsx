'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ParticipantInfoModal } from './participant-info-modal';
import { RegisterParticipantModal } from './register-participant-modal';
import { PageLoading } from '@/components/page-loading';
import { useParticipant } from '@/hooks/use-participant';
import { ParticipantData } from '@/@types/participant-data';
import { useToast } from '@/components/ui/toast/use-toast';
import { FidelityProgramFallback } from '../fidelity-program-fallback';
import { useFidelityProgramStore } from '@/store/fidelity-program-store';
import { ParticipantsFallback } from './participants-fallback';

const ONE_SECOND = 1000;

export type Participant = Omit<ParticipantData, 'score'> & {
  phoneNumber: string;
  createdAt: string;
};

export const ParticipantsContent = () => {
  const { toast } = useToast();
  const { fidelityProgram } = useFidelityProgramStore();
  const { findByFidelityProgramId, isLoadingFindByFidelityProgramId } = useParticipant({
    initialState: {
      isLoadingFindByFidelityProgramId: true,
    },
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showFallback, setShowFallback] = useState({
    fidelityProgram: false,
    participants: false,
  });

  const handleFetchParticipants = async () => {
    const { data, code } = await findByFidelityProgramId(fidelityProgram.id!);

    switch (code) {
      case 'SUCCESS': {
        setParticipants(data!);
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
        return;
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (fidelityProgram.id !== null) {
        handleFetchParticipants();
      } else {
        setShowFallback((state) => ({
          ...state,
          fidelityProgram: true,
        }));
      }
    }, ONE_SECOND);

    return () => clearTimeout(timeoutId);
  }, [fidelityProgram]);

  if (showFallback.fidelityProgram) return <FidelityProgramFallback />;

  if (showFallback.participants) return <ParticipantsFallback />;

  return (
    <PageLoading isLoading={isLoadingFindByFidelityProgramId}>
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
            />
            <Search
              color="#6b7280"
              size={20}
              strokeWidth={1.8}
              className="absolute right-2 top-4"
            />
          </div>
        </div>

        <div className="w-full flex flex-col mt-6 space-y-5">
          {participants.map((participant) => (
            <ParticipantInfoModal key={participant.id} participant={participant} />
          ))}
        </div>
      </div>
    </PageLoading>
  );
};
