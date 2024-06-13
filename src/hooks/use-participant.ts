import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import { ParticipantData } from '@/@types/participant-data';
import cuid from 'cuid';

type GetByPhoneNumberInput = {
  phoneNumber: string;
  fidelityProgramId: string;
};

type GetByPhoneNumberOutput = {
  data: ParticipantData | null;
  code: 'SUCCESS' | 'PARTICIPANT_NOT_FOUND' | 'UNEXPECTED_ERROR';
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

export const useParticipant = () => {
  const [isLoadingGetByPhoneNumber, setIsLoadingGetByPhoneNumber] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const getByPhoneNumber = async ({
    phoneNumber,
    fidelityProgramId,
  }: GetByPhoneNumberInput): Promise<GetByPhoneNumberOutput> => {
    try {
      setIsLoadingGetByPhoneNumber(true);

      const { data } = await supabase
        .from('scores')
        .select('id, score, participants!inner(id, first_name, last_name)')
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participants.phone_number', phoneNumber);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'PARTICIPANT_NOT_FOUND',
        };
      }

      const participant = data[0].participants as unknown as Record<string, string>;

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
        code: 'SUCCESS',
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

  return {
    isLoadingGetByPhoneNumber,
    isLoadingRegister,
    getByPhoneNumber,
    register,
  };
};
