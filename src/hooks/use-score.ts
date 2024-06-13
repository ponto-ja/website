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
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

export const useScore = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

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

  return {
    isLoadingUpdate,
    isLoadingRegister,
    update,
    register,
  };
};
