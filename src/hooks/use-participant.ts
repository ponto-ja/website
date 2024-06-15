import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import { ParticipantData } from '@/@types/participant-data';
import cuid from 'cuid';
import dayjs from 'dayjs';

type ParticipantHookProps = {
  initialState?: {
    isLoadingGetByPhoneNumberAndFidelityProgramId?: boolean;
    isLoadingRegister?: boolean;
    isLoadingFindByFidelityProgramId?: boolean;
    isLoadingGetByPhoneNumber?: boolean;
    isLoadingFindByPhoneNumberAndFidelityProgramId?: boolean;
  };
};

type GetByPhoneNumberAndFidelityProgramIdInput = {
  phoneNumber: string;
  fidelityProgramId: string;
};

type GetByPhoneNumberAndFidelityProgramIdOutput = {
  data: ParticipantData | null;
  code: 'SCORE_FOUND' | 'SCORE_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

type RegisterInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type RegisterOutput = {
  data: Pick<ParticipantData, 'id'> | null;
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

type FindByFidelityProgramIdOutput = {
  data:
    | (Omit<ParticipantData, 'score'> & {
        phoneNumber: string;
        createdAt: string;
      })[]
    | null;
  code: 'SUCCESS' | 'NO_PARTICIPANTS' | 'UNEXPECTED_ERROR';
};

type GetByPhoneNumberOutput = {
  data:
    | (Omit<ParticipantData, 'score'> & {
        phoneNumber: string;
        createdAt: string;
      })
    | null;
  code: 'PARTICIPANT_FOUND' | 'PARTICIPANT_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

type FindByPhoneNumberAndFidelityProgramIdInput = {
  phoneNumber: string;
  fidelityProgramId: string;
};

type FindByPhoneNumberAndFidelityProgramIdOutput = {
  data:
    | (Omit<ParticipantData, 'score'> & {
        phoneNumber: string;
        createdAt: string;
      })[]
    | null;
  code: 'PARTICIPANTS_FOUND' | 'PARTICIPANTS_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const useParticipant = ({ initialState }: ParticipantHookProps = {}) => {
  const [
    isLoadingGetByPhoneNumberAndFidelityProgramId,
    setIsLoadingGetByPhoneNumberAndFidelityProgramId,
  ] = useState(initialState?.isLoadingGetByPhoneNumberAndFidelityProgramId ?? false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(
    initialState?.isLoadingRegister ?? false,
  );
  const [isLoadingFindByFidelityProgramId, setIsLoadingFindByFidelityProgramId] =
    useState(initialState?.isLoadingFindByFidelityProgramId ?? false);
  const [isLoadingGetByPhoneNumber, setIsLoadingGetByPhoneNumber] = useState(
    initialState?.isLoadingGetByPhoneNumber ?? false,
  );
  const [
    isLoadingFindByPhoneNumberAndFidelityProgramId,
    setIsLoadingFindByPhoneNumberAndFidelityProgramId,
  ] = useState(initialState?.isLoadingFindByPhoneNumberAndFidelityProgramId ?? false);

  const getByPhoneNumberAndFidelityProgramId = async ({
    phoneNumber,
    fidelityProgramId,
  }: GetByPhoneNumberAndFidelityProgramIdInput): Promise<GetByPhoneNumberAndFidelityProgramIdOutput> => {
    try {
      setIsLoadingGetByPhoneNumberAndFidelityProgramId(true);

      const { data } = await supabase
        .from('scores')
        .select('id, score, participant:participants!inner(id, first_name, last_name)')
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant.phone_number', phoneNumber);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'SCORE_NOT_FOUND',
        };
      }

      const participant = data[0].participant as unknown as Record<string, string>;

      return {
        data: {
          id: participant.id,
          firstName: participant.first_name,
          lastName: participant.last_name,
          score: {
            id: data[0].id,
            score: data[0].score,
          },
        },
        code: 'SCORE_FOUND',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByPhoneNumberAndFidelityProgramId(false);
    }
  };

  const register = async ({
    firstName,
    lastName,
    phoneNumber,
  }: RegisterInput): Promise<RegisterOutput> => {
    try {
      setIsLoadingRegister(true);

      const { data } = await supabase
        .from('participants')
        .insert({
          id: cuid(),
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
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

  const findByFidelityProgramId = async (
    fidelityProgramId: string,
  ): Promise<FindByFidelityProgramIdOutput> => {
    try {
      setIsLoadingFindByFidelityProgramId(true);

      const { data } = await supabase
        .from('participants')
        .select(
          'id, first_name, last_name, phone_number, created_at, pivot_fidelity_programs_participants!inner(fidelity_program_id)',
        )
        .eq('pivot_fidelity_programs_participants.fidelity_program_id', fidelityProgramId)
        .order('created_at', { ascending: false });

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NO_PARTICIPANTS',
        };
      }

      const participants = data.map((participant) => ({
        id: participant.id,
        firstName: participant.first_name,
        lastName: participant.last_name,
        phoneNumber: participant.phone_number,
        createdAt: dayjs(participant.created_at).format('DD/MM/YYYY'),
      }));

      return {
        data: participants,
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

  const getByPhoneNumber = async (
    phoneNumber: string,
  ): Promise<GetByPhoneNumberOutput> => {
    try {
      setIsLoadingGetByPhoneNumber(true);

      const { data } = await supabase
        .from('participants')
        .select('*')
        .eq('phone_number', phoneNumber);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'PARTICIPANT_NOT_FOUND',
        };
      }

      return {
        data: {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          phoneNumber: data[0].phone_number,
          createdAt: dayjs(data[0].phone_number).format('DD/MM/YYYY'),
        },
        code: 'PARTICIPANT_FOUND',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetByPhoneNumber(false);
    }
  };

  const findByPhoneNumberAndFidelityProgramId = async ({
    phoneNumber,
    fidelityProgramId,
  }: FindByPhoneNumberAndFidelityProgramIdInput): Promise<FindByPhoneNumberAndFidelityProgramIdOutput> => {
    try {
      setIsLoadingFindByPhoneNumberAndFidelityProgramId(true);

      const { data } = await supabase
        .from('scores')
        .select(
          'id, score, participant:participants!inner(id, first_name, last_name, phone_number, created_at)',
        )
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant.phone_number', phoneNumber);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'PARTICIPANTS_NOT_FOUND',
        };
      }

      const participants = data.map((item) => {
        const participant = item.participant as unknown as Record<string, string>;

        return {
          id: participant.id,
          firstName: participant.first_name,
          lastName: participant.last_name,
          phoneNumber: participant.phone_number,
          createdAt: dayjs(participant.created_at).format('DD/MM/YYYY'),
        };
      });

      return {
        data: participants,
        code: 'PARTICIPANTS_FOUND',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingFindByPhoneNumberAndFidelityProgramId(false);
    }
  };

  return {
    isLoadingGetByPhoneNumberAndFidelityProgramId,
    isLoadingRegister,
    isLoadingFindByFidelityProgramId,
    isLoadingGetByPhoneNumber,
    isLoadingFindByPhoneNumberAndFidelityProgramId,
    getByPhoneNumberAndFidelityProgramId,
    register,
    findByFidelityProgramId,
    getByPhoneNumber,
    findByPhoneNumberAndFidelityProgramId,
  };
};
