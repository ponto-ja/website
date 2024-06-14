import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';

type RegisterInput = {
  fidelityProgramId: string;
  participantId: string;
};

type RegisterOutput = {
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

type GetByFidelityProgramIdAndParticipantIdInput = {
  fidelityProgramId: string;
  participantId: string;
};

type GetByFidelityProgramIdAndParticipantIdOutput = {
  code: 'RELATION_FOUND' | 'RELATION_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const usePivotFidelityProgramsParticipants = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [
    isLoadingGetByFidelityProgramIdAndParticipantId,
    setIsLoadingGetByFidelityProgramIdAndParticipantId,
  ] = useState(false);

  const register = async ({
    fidelityProgramId,
    participantId,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { data } = await supabase
        .from('pivot_fidelity_programs_participants')
        .insert({
          id: cuid(),
          fidelity_program_id: fidelityProgramId,
          participant_id: participantId,
        })
        .select();

      if (!data?.[0]) {
        return {
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        code: 'CREATED',
      };
    } catch {
      return {
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const getByFidelityProgramIdAndParticipantId = async ({
    fidelityProgramId,
    participantId,
  }: GetByFidelityProgramIdAndParticipantIdInput): Promise<GetByFidelityProgramIdAndParticipantIdOutput> => {
    try {
      setIsLoadingGetByFidelityProgramIdAndParticipantId(true);

      const { data } = await supabase
        .from('pivot_fidelity_programs_participants')
        .select('*')
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant_id', participantId);

      if (!data?.[0]) {
        return {
          code: 'RELATION_NOT_FOUND',
        };
      }

      return {
        code: 'RELATION_FOUND',
      };
    } catch {
      return {
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByFidelityProgramIdAndParticipantId(false);
    }
  };

  return {
    isLoadingRegister,
    isLoadingGetByFidelityProgramIdAndParticipantId,
    register,
    getByFidelityProgramIdAndParticipantId,
  };
};
