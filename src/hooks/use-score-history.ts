import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import dayjs from 'dayjs';
import { ScoreOperation } from '@/enums/score-operation';
import { ScoreHistoryData } from '@/@types/score-history-data';

type ScoreHistoryHookProps = {
  initialState?: {
    isLoadingRegister?: boolean;
    isLoadingFindByFidelityProgramId?: boolean;
    isLoadingFindByFidelityProgramIdAndParticipantId?: boolean;
  };
};

type RegisterInput = {
  fidelityProgramId: string;
  participantId: string;
  score: number;
  operation: keyof typeof ScoreOperation;
};

type RegisterOutput = {
  code: 'CREATED' | 'UNEXPECTED_ERROR';
};

type GetByFidelityProgramOutput = {
  data: ScoreHistoryData[] | null;
  code: 'SUCCESS' | 'NO_SCORE_HISTORY' | 'UNEXPECTED_ERROR';
};

type FindByFidelityProgramIdAndParticipantIdInput = {
  fidelityProgramId: string;
  participantId: string;
};

type FindByFidelityProgramIdAndParticipantIdOutput = {
  data: Omit<ScoreHistoryData, 'participant'>[] | null;
  code: 'FOUND_HISTORY' | 'NOT_FOUND_HISTORY' | 'UNEXPECTED_ERROR';
};

export const useScoreHistory = ({ initialState }: ScoreHistoryHookProps = {}) => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(
    initialState?.isLoadingRegister ?? false,
  );
  const [isLoadingFindByFidelityProgramId, setIsLoadingFindByFidelityProgramId] =
    useState(initialState?.isLoadingFindByFidelityProgramId ?? false);
  const [
    isLoadingFindByFidelityProgramIdAndParticipantId,
    setIsLoadingFindByFidelityProgramIdAndParticipantId,
  ] = useState(initialState?.isLoadingFindByFidelityProgramIdAndParticipantId ?? false);

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

  const findByFidelityProgramId = async (
    fidelityProgramId: string,
  ): Promise<GetByFidelityProgramOutput> => {
    try {
      setIsLoadingFindByFidelityProgramId(true);

      const { data } = await supabase
        .from('score_history')
        .select(
          'id, score, operation, created_at, participant:participants!inner(first_name, last_name, phone_number)',
        )
        .eq('fidelity_program_id', fidelityProgramId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NO_SCORE_HISTORY',
        };
      }

      const scoreHistory = data.map((history) => {
        const participant = history.participant as unknown as Record<string, string>;

        return {
          id: history.id,
          score: history.score,
          operation: history.operation,
          createdAt: dayjs(history.created_at).format('DD/MM/YYYY'),
          participant: {
            firstName: participant.first_name,
            lastName: participant.last_name,
            phoneNumber: participant.phone_number,
          },
        };
      });

      return {
        data: scoreHistory,
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

  const findByFidelityProgramIdAndParticipantId = async ({
    fidelityProgramId,
    participantId,
  }: FindByFidelityProgramIdAndParticipantIdInput): Promise<FindByFidelityProgramIdAndParticipantIdOutput> => {
    try {
      setIsLoadingFindByFidelityProgramIdAndParticipantId(true);

      const { data } = await supabase
        .from('score_history')
        .select(
          'id, score, operation, created_at, participant:participants!inner(first_name, last_name, phone_number)',
        )
        .eq('fidelity_program_id', fidelityProgramId)
        .eq('participant_id', participantId)
        .order('created_at', { ascending: false });

      if (!data?.[0]) {
        return {
          data: null,
          code: 'NOT_FOUND_HISTORY',
        };
      }

      const scoreHistory = data.map((history) => ({
        id: history.id,
        score: history.score,
        operation: history.operation,
        createdAt: dayjs(history.created_at).format('DD/MM/YYYY'),
      }));

      return {
        data: scoreHistory,
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
    isLoadingFindByFidelityProgramId,
    isLoadingFindByFidelityProgramIdAndParticipantId,
    register,
    findByFidelityProgramId,
    findByFidelityProgramIdAndParticipantId,
  };
};
