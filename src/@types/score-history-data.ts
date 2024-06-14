import { ScoreOperation } from '@/enums/score-operation';

export type ScoreHistoryData = {
  id: string;
  score: number;
  operation: keyof typeof ScoreOperation;
  createdAt: string;
  participant: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
};
