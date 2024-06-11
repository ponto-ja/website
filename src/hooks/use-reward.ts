import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { RewardData } from '@/@types/reward-data';

type RewardHookProps = {
  initialState?: {
    isLoadingRegister?: boolean;
    isLoadingFindByFidelityProgramId?: boolean;
    isLoadingDeleteRecord?: boolean;
    isLoadingUpdate?: boolean;
  };
};

type RegisterInput = {
  fidelityProgramId: string;
  name: string;
  scoreNeeded: number;
  description: string | null;
};

type RegisterOutput = {
  data: RewardData | null;
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

type FindByFidelityProgramIdOutput = {
  data: RewardData[] | null;
  code: 'SUCCESS' | 'UNEXPECTED_ERROR';
};

type DeleteRecordOutput = {
  code: 'DELETED' | 'UNEXPECTED_ERROR';
};

type UpdateInput = {
  id: string;
  name: string;
  scoreNeeded: number;
  description: string | null;
};

type UpdateOutput = {
  code: 'UPDATED' | 'UNEXPECTED_ERROR';
};

export const useReward = ({ initialState }: RewardHookProps = {}) => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(
    initialState?.isLoadingRegister ?? false,
  );
  const [isLoadingFindByFidelityProgramId, setIsLoadingFindByFidelityProgramId] =
    useState(initialState?.isLoadingFindByFidelityProgramId ?? false);
  const [isLoadingDeleteRecord, setIsLoadingDeleteRecord] = useState(
    initialState?.isLoadingDeleteRecord ?? false,
  );
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(
    initialState?.isLoadingUpdate ?? false,
  );

  const register = async ({
    fidelityProgramId,
    name,
    scoreNeeded,
    description,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { data, error } = await supabase
        .from('rewards')
        .insert({
          id: cuid(),
          fidelity_program_id: fidelityProgramId,
          name,
          score_needed: scoreNeeded,
          description,
        })
        .select();

      if (error) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        data: {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          scoreNeeded: data[0].score_needed,
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

  const findByFidelityProgramId = async (
    fidelityProgramId: string,
  ): Promise<FindByFidelityProgramIdOutput> => {
    try {
      setIsLoadingFindByFidelityProgramId(true);

      const { data } = await supabase
        .from('rewards')
        .select('*')
        .eq('fidelity_program_id', fidelityProgramId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (!data || data?.length === 0) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const rewards = data.map((reward) => ({
        id: reward.id,
        name: reward.name,
        scoreNeeded: Number(reward.score_needed),
        description: reward.description,
      }));

      return {
        data: rewards,
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingFindByFidelityProgramId(false);
    }
  };

  const deleteRecord = async (rewardId: string): Promise<DeleteRecordOutput> => {
    try {
      setIsLoadingDeleteRecord(true);

      const currentDate = new Date();

      const { error } = await supabase
        .from('rewards')
        .update({ deleted_at: currentDate, updated_at: currentDate })
        .eq('id', rewardId);

      if (error) {
        return {
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        code: 'DELETED',
      };
    } catch {
      return {
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingDeleteRecord(false);
    }
  };

  const update = async ({
    id,
    name,
    scoreNeeded,
    description,
  }: UpdateInput): Promise<UpdateOutput> => {
    try {
      setIsLoadingUpdate(true);

      const { error } = await supabase
        .from('rewards')
        .update({
          name,
          score_needed: scoreNeeded,
          description: description,
        })
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

  return {
    isLoadingRegister,
    isLoadingFindByFidelityProgramId,
    isLoadingDeleteRecord,
    isLoadingUpdate,
    register,
    findByFidelityProgramId,
    deleteRecord,
    update,
  };
};
