import { ScoreOperation } from '@/enums/score-operation';
import { FC } from 'react';

type ScoreHistoryProps = {
  index: number;
  score: number;
  operation: keyof typeof ScoreOperation;
  createdAt: string;
};

export const ScoreHistory: FC<ScoreHistoryProps> = ({
  index,
  score,
  operation,
  createdAt,
}) => {
  return (
    <div className="w-full flex items-center justify-between rounded border-[1px] border-transparent hover:border-violet-900 p-1">
      {operation === 'EARNING' && (
        <>
          <p className="font-inter font-normal text-sm text-gray-500">
            {index}. {createdAt}
          </p>
          <p className="min-w-[100px] text-center font-inter font-medium text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded">
            +{score} {score === 1 ? 'ponto' : 'pontos'}
          </p>
        </>
      )}
      {operation === 'SPENDING' && (
        <>
          <p className="font-inter font-normal text-sm text-gray-500">
            {index}. {createdAt}
          </p>
          <p className="min-w-[100px] text-center font-inter font-medium text-sm text-red-600 bg-red-200 py-1 px-[6px] rounded">
            -{score} {score === 1 ? 'ponto' : 'pontos'}
          </p>
        </>
      )}
    </div>
  );
};
