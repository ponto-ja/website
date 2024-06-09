import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import dayjs from 'dayjs';
import cuid from 'cuid';

type FidelityProgramHookProps = {
  initialState?: {
    isLoadingGetByBusinessOwnerId?: boolean;
    isLoadingRegister?: boolean;
  };
};

type GetByBusinessOwnerIdOutput = {
  data: {
    numberOfParticipants: number;
    numberOfRewards: number;
    scoreRate: number;
    activeDays: number;
  } | null;
  code: 'SUCCESS' | 'NOT_FIDELITY_PROGRAM_CREATED' | 'UNEXPECTED_ERROR';
};

type RegisterInput = {
  businessOwnerId: string;
  name: string;
  scoreRate: number;
};

type RegisterOutput = {
  data: {
    id: string;
  } | null;
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

export const useFidelityProgram = ({ initialState }: FidelityProgramHookProps = {}) => {
  const [isLoadingGetByBusinessOwnerId, setIsLoadingGetByBusinessOwnerId] = useState(
    initialState?.isLoadingGetByBusinessOwnerId ?? false,
  );
  const [isLoadingRegister, setIsLoadingRegister] = useState(
    initialState?.isLoadingRegister ?? false,
  );

  const getByBusinessOwnerId = async (
    businessOwnerId: string,
  ): Promise<GetByBusinessOwnerIdOutput> => {
    try {
      setIsLoadingGetByBusinessOwnerId(true);

      const { data } = await supabase
        .from('fidelity_programs')
        .select('*')
        .eq('business_owner_id', businessOwnerId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NOT_FIDELITY_PROGRAM_CREATED',
        };
      }

      const [fidelityProgramData] = data;

      const { count: numberOfParticipants } = await supabase
        .from('pivot_fidelity_programs_participants')
        .select('*', { count: 'exact', head: true })
        .eq('fidelity_program_id', fidelityProgramData.id);

      if (!numberOfParticipants) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const { count: numberOfRewards } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('fidelity_program_id', fidelityProgramData.id);

      if (!numberOfRewards) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const differenceBetweenDates = dayjs().diff(
        dayjs(),
        fidelityProgramData.created_at,
      );

      return {
        data: {
          numberOfParticipants,
          numberOfRewards,
          scoreRate: fidelityProgramData.score_rate,
          activeDays: differenceBetweenDates,
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByBusinessOwnerId(false);
    }
  };

  const register = async ({
    businessOwnerId,
    name,
    scoreRate,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { data } = await supabase
        .from('fidelity_programs')
        .insert({
          id: cuid(),
          business_owner_id: businessOwnerId,
          name,
          score_rate: scoreRate,
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

  return {
    isLoadingGetByBusinessOwnerId,
    isLoadingRegister,
    getByBusinessOwnerId,
    register,
  };
};
