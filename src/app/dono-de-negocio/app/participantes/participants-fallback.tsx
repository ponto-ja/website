import { UserX } from 'lucide-react';

export const ParticipantsFallback = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center gap-2 mt-[100px]">
      <UserX color="#374151" size={60} strokeWidth={1.3} />
      <h2 className="text-center font-inter font-medium text-base text-gray-700">
        Sem participantes cadastrados ainda.
      </h2>
    </div>
  );
};
