import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';

type RegisterInput = {
  fidelityProgramId: string;
  name: string;
  scoreNeeded: number;
  description: string | null;
};

type RegisterOutput = {
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

export const useReward = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const register = async ({
    fidelityProgramId,
    name,
    scoreNeeded,
    description,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { error } = await supabase.from('rewards').insert({
        id: cuid(),
        fidelity_program_id: fidelityProgramId,
        name,
        score_needed: scoreNeeded,
        description,
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
