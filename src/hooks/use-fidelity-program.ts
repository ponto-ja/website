import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import dayjs from 'dayjs';
import cuid from 'cuid';
import { FidelityProgramData } from '@/@types/fidelity-program-data';

type FidelityProgramHookProps = {
  initialState?: {
    isLoadingGetSummaryByBusinessOwnerId?: boolean;
    isLoadingRegister?: boolean;
    isLoadingGetDetailsByBusinessOwnerId?: boolean;
    isLoadingUpdate?: boolean;
    isLoadingFindByParticipantId?: boolean;
    isLoadingGetByFidelityProgramIdAndParticipantId?: boolean;
  };
};

type GetSummaryByBusinessOwnerIdOutput = {
  data: {
    id: string;
    name: string;
    numberOfParticipants: number;
    numberOfRewards: number;
    numberOfActiveDays: number;
    scoreRate: number;
    createdAt: string;
  } | null;
  code: 'SUCCESS' | 'NOT_FIDELITY_PROGRAM_CREATED' | 'UNEXPECTED_ERROR';
};

type GetDetailsByBusinessOwnerIdOutput = {
  data: {
    id: string;
    name: string;
    scoreRate: string;
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

type UpdateInput = {
  id: string;
  name: string;
  scoreRate: number;
};

type UpdateOutput = {
  code: 'UPDATED' | 'UNEXPECTED_ERROR';
};

type FindByParticipantIdOutput = {
  data: FidelityProgramData[] | null;
  code: 'FOUND_FIDELITY_PROGRAMS' | 'NOT_FOUND_FIDELITY_PROGRAMS' | 'UNEXPECTED_ERROR';
};

type GetByFidelityProgramIdAndParticipantIdInput = {
  fidelityProgramId: string;
  participantId: string;
};

type GetByFidelityProgramIdAndParticipantIdOutput = {
  data: {
    id: string;
    name: string;
    numberOfRewards: number;
    numberOfActiveDays: number;
    scoreRate: number;
    totalScore: number;
    createdAt: string;
  } | null;
  code: 'FOUND_FIDELITY_PROGRAM' | 'NOT_FOUND_FIDELITY_PROGRAM' | 'UNEXPECTED_ERROR';
};

export const useFidelityProgram = ({ initialState }: FidelityProgramHookProps = {}) => {
  const [isLoadingGetSummaryByBusinessOwnerId, setIsLoadingGetSummaryByBusinessOwnerId] =
    useState(initialState?.isLoadingGetSummaryByBusinessOwnerId ?? false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(
    initialState?.isLoadingRegister ?? false,
  );
  const [isLoadingGetDetailsByBusinessOwnerId, setIsLoadingGetDetailsByBusinessOwnerId] =
    useState(initialState?.isLoadingGetDetailsByBusinessOwnerId ?? false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(
    initialState?.isLoadingUpdate ?? false,
  );
  const [isLoadingFindByParticipantId, setIsLoadingFindByParticipantId] = useState(
    initialState?.isLoadingFindByParticipantId ?? false,
  );
  const [
    isLoadingGetByFidelityProgramIdAndParticipantId,
    setIsLoadingGetByFidelityProgramIdAndParticipantId,
  ] = useState(initialState?.isLoadingGetByFidelityProgramIdAndParticipantId ?? false);

  const getSummaryByBusinessOwnerId = async (
    businessOwnerId: string,
  ): Promise<GetSummaryByBusinessOwnerIdOutput> => {
    try {
      setIsLoadingGetSummaryByBusinessOwnerId(true);

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
        .eq('fidelity_program_id', fidelityProgramData.id)
        .is('deleted_at', null);

      if (numberOfParticipants === null) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const { count: numberOfRewards } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('fidelity_program_id', fidelityProgramData.id)
        .is('deleted_at', null);

      if (numberOfRewards === null) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const differenceBetweenDatesInDays = dayjs()
        .startOf('date')
        .diff(dayjs(fidelityProgramData.created_at).startOf('date'), 'days');

      const createdAt = dayjs(fidelityProgramData.created_at).format('DD/MM/YYYY');

      return {
        data: {
          id: fidelityProgramData.id,
          name: fidelityProgramData.name,
          numberOfParticipants,
          numberOfRewards,
          scoreRate: fidelityProgramData.score_rate,
          numberOfActiveDays: differenceBetweenDatesInDays,
          createdAt,
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetSummaryByBusinessOwnerId(false);
    }
  };

  const getDetailsByBusinessOwnerId = async (
    businessOwnerId: string,
  ): Promise<GetDetailsByBusinessOwnerIdOutput> => {
    try {
      setIsLoadingGetDetailsByBusinessOwnerId(true);

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

      return {
        data: {
          id: data[0].id,
          name: data[0].name,
          scoreRate: String(data[0].score_rate).replace('.', ','),
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetDetailsByBusinessOwnerId(false);
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

  const update = async ({ id, name, scoreRate }: UpdateInput): Promise<UpdateOutput> => {
    try {
      setIsLoadingUpdate(true);

      const { error } = await supabase
        .from('fidelity_programs')
        .update({
          name,
          score_rate: scoreRate,
          updated_at: new Date(),
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

  const findByParticipantId = async (
    participantId: string,
  ): Promise<FindByParticipantIdOutput> => {
    try {
      setIsLoadingFindByParticipantId(true);

      const { data } = await supabase
        .from('fidelity_programs')
        .select(
          'id, name, score_rate, created_at, pivot_fidelity_programs_participants!inner()',
        )
        .eq('pivot_fidelity_programs_participants.participant_id', participantId)
        .is('pivot_fidelity_programs_participants.deleted_at', null)
        .order('created_at', { ascending: false });

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NOT_FOUND_FIDELITY_PROGRAMS',
        };
      }

      const fidelityPrograms = data.map((fidelityProgram) => ({
        id: fidelityProgram.id,
        name: fidelityProgram.name,
        scoreRate: fidelityProgram.score_rate,
        createdAt: dayjs(fidelityProgram.created_at).format('DD/MM/YYYY'),
      }));

      return {
        data: fidelityPrograms,
        code: 'FOUND_FIDELITY_PROGRAMS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingFindByParticipantId(false);
    }
  };

  const getByFidelityProgramIdAndParticipantId = async ({
    fidelityProgramId,
    participantId,
  }: GetByFidelityProgramIdAndParticipantIdInput): Promise<GetByFidelityProgramIdAndParticipantIdOutput> => {
    try {
      setIsLoadingGetByFidelityProgramIdAndParticipantId(true);

      const { data } = await supabase
        .from('fidelity_programs')
        .select('*')
        .eq('id', fidelityProgramId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NOT_FOUND_FIDELITY_PROGRAM',
        };
      }

      const [fidelityProgramData] = data;

      const { data: scoreData } = await supabase
        .from('scores')
        .select('score')
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant_id', participantId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const { count: numberOfRewards } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('fidelity_program_id', fidelityProgramData.id)
        .is('deleted_at', null);

      if (numberOfRewards === null) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      const differenceBetweenDatesInDays = dayjs()
        .startOf('date')
        .diff(dayjs(fidelityProgramData.created_at).startOf('date'), 'days');

      const createdAt = dayjs(fidelityProgramData.created_at).format('DD/MM/YYYY');

      return {
        data: {
          id: fidelityProgramData.id,
          name: fidelityProgramData.name,
          numberOfRewards,
          scoreRate: fidelityProgramData.score_rate,
          totalScore: scoreData?.[0].score,
          numberOfActiveDays: differenceBetweenDatesInDays,
          createdAt,
        },
        code: 'FOUND_FIDELITY_PROGRAM',
      };
    } catch (error) {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByFidelityProgramIdAndParticipantId(false);
    }
  };

  return {
    isLoadingGetSummaryByBusinessOwnerId,
    isLoadingGetDetailsByBusinessOwnerId,
    isLoadingRegister,
    isLoadingUpdate,
    isLoadingFindByParticipantId,
    isLoadingGetByFidelityProgramIdAndParticipantId,
    getSummaryByBusinessOwnerId,
    getDetailsByBusinessOwnerId,
    register,
    update,
    findByParticipantId,
    getByFidelityProgramIdAndParticipantId,
  };
};
