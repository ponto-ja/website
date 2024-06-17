import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';

type RegisterInput = {
  name: string;
  scoreNeeded: number;
  description: string | null;
  fidelityProgramId: string;
  participantId: string;
};

type RegisterOutput = {
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

export const useRewardHistory = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const register = async ({
    name,
    scoreNeeded,
    description,
    fidelityProgramId,
    participantId,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { error } = await supabase.from('reward_history').insert({
        id: cuid(),
        name,
        score_needed: scoreNeeded,
        description,
        fidelity_program_id: fidelityProgramId,
        participant_id: participantId,
      });

      if (error) {
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
