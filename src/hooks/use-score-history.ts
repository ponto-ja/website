import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { ScoreOperation } from '@/enums/score-operation';

type RegisterInput = {
  fidelityProgramId: string;
  participantId: string;
  score: number;
  operation: keyof typeof ScoreOperation;
};

type RegisterOutput = {
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

export const useScoreHistory = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const register = async ({
    fidelityProgramId,
    participantId,
    score,
    operation,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(false);

      const { data } = await supabase
        .from('score_history')
        .insert({
          id: cuid(),
          fidelity_program_id: fidelityProgramId,
          participant_id: participantId,
          score,
          operation,
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
    isLoadingRegister,
    register,
  };
};
