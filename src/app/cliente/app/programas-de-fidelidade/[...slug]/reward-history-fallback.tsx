import { Frown } from 'lucide-react';

export const RewardHistoryFallback = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center gap-2 mt-4">
      <Frown color="#374151" size={44} strokeWidth={1.3} />
      <h2 className="text-center font-inter font-medium text-base text-gray-700">
        Você ainda não ganhou alguma recompensa desse programa.
      </h2>
    </div>
  );
};
