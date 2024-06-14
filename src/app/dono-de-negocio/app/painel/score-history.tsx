import { ScoreHistoryData } from '@/@types/score-history-data';
import { mask } from '@/helpers/mask';

export const ScoreHistory = ({
  score,
  operation,
  createdAt,
  participant,
}: ScoreHistoryData) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-violet-200 rounded-full w-10 h-10 flex items-center justify-center">
          <p className="font-inter font-medium text-gray-500 text-base">
            {participant.firstName[0]}
            {participant.lastName[0]}
          </p>
        </div>
        <div>
          <p className="font-inter font-medium text-gray-700 text-base">
            {participant.firstName} {participant.lastName}
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">
            {mask.phoneNumber(participant.phoneNumber)}
          </p>
        </div>
      </div>
      {operation === 'EARNING' && (
        <div className="flex items-center gap-4 max-[500px]:flex-col max-[500px]:items-end max-[500px]:gap-1">
          <p className="min-w-[100px] text-center font-inter font-medium text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded">
            +{score} {score === 1 ? 'ponto' : 'pontos'}
          </p>
          <p className="font-inter font-normal text-sm text-gray-500">{createdAt}</p>
        </div>
      )}
      {operation === 'SPENDING' && (
        <div className="flex items-center gap-4">
          <p className="min-w-[100px] text-center font-inter font-medium text-sm text-red-600 bg-red-200 py-1 px-[6px] rounded">
            -{score} {score === 1 ? 'ponto' : 'pontos'}
          </p>
          <p className="font-inter font-normal text-sm text-gray-500">{createdAt}</p>
        </div>
      )}
    </div>
  );
};
