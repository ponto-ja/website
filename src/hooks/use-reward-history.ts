import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { RewardHistoryData } from '@/@types/reward-history-data';

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

type FindByFidelityProgramIdAndParticipantIdInput = {
  fidelityProgramId: string;
  participantId: string;
};

type FindByFidelityProgramIdAndParticipantIdOutput = {
  data: RewardHistoryData[] | null;
  code: 'FOUND_HISTORY' | 'NOT_FOUND_HISTORY' | 'UNEXPECTED_ERROR';
};

export const useRewardHistory = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [
    isLoadingFindByFidelityProgramIdAndParticipantId,
    setIsLoadingFindByFidelityProgramIdAndParticipantId,
  ] = useState(false);

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

  const findByFidelityProgramIdAndParticipantId = async ({
    fidelityProgramId,
    participantId,
  }: FindByFidelityProgramIdAndParticipantIdInput): Promise<FindByFidelityProgramIdAndParticipantIdOutput> => {
    try {
      setIsLoadingFindByFidelityProgramIdAndParticipantId(true);

      const { data } = await supabase
        .from('reward_history')
        .select('*')
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant_id', participantId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NOT_FOUND_HISTORY',
        };
      }

      const rewardHistory = data.map((reward) => ({
        id: reward.id,
        name: reward.name,
        scoreNeeded: reward.score_needed,
        description: reward.description,
      }));

      return {
        data: rewardHistory,
        code: 'FOUND_HISTORY',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingFindByFidelityProgramIdAndParticipantId(false);
    }
  };

  return {
    isLoadingRegister,
    isLoadingFindByFidelityProgramIdAndParticipantId,
    register,
    findByFidelityProgramIdAndParticipantId,
  };
};
