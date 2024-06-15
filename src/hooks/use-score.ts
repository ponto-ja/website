import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';

type UpdateInput = {
  id: string;
  score: number;
};

type UpdateOutput = {
  code: 'UPDATED' | 'UNEXPECTED_ERROR';
};

type RegisterInput = {
  fidelityProgramId: string;
  participantId: string;
  score: number;
};

type RegisterOutput = {
  data: { id: string } | null;
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

type GetByParticipantIdOutput = {
  data: {
    id: string;
    score: number;
  } | null;
  code: 'SCORE_FOUND' | 'SCORE_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const useScore = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingGetByParticipantId, setIsLoadingGetByParticipantId] = useState(false);

  const update = async ({ id, score }: UpdateInput): Promise<UpdateOutput> => {
    try {
      setIsLoadingUpdate(true);

      const { error } = await supabase
        .from('scores')
        .update({ score, updated_at: new Date() })
        .eq('id', id);

      if (error) {
        return {
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        code: 'UPDATED',
      };
    } catch {
      return {
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const register = async ({
    fidelityProgramId,
    participantId,
    score,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { data } = await supabase
        .from('scores')
        .insert({
          id: cuid(),
          fidelity_program_id: fidelityProgramId,
          participant_id: participantId,
          score,
        })
        .select();

      if (!data?.[0]) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        data: {
          id: data[0].id,
        },
        code: 'CREATED',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const getByParticipantId = async (
    participantId: string,
  ): Promise<GetByParticipantIdOutput> => {
    try {
      setIsLoadingGetByParticipantId(true);

      const { data } = await supabase
        .from('scores')
        .select('id, score')
        .eq('participant_id', participantId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'SCORE_NOT_FOUND',
        };
      }

      return {
        data: {
          id: data[0].id,
          score: data[0].score,
        },
        code: 'SCORE_FOUND',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByParticipantId(false);
    }
  };

  return {
    isLoadingUpdate,
    isLoadingRegister,
    isLoadingGetByParticipantId,
    update,
    register,
    getByParticipantId,
  };
};
