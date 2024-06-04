import { Button } from '@/components/button';
import { Frown } from 'lucide-react';

export const FirstAccessFallback = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center gap-2 mt-[80px]">
      <Frown color="#374151" size={60} strokeWidth={1.3} />
      <p className="text-center font-inter font-medium text-base text-gray-700">
        Crie seu programa de fidelidade para começar.
      </p>
      <Button className="bg-violet-900 py-2 font-inter text-sm text-white mt-4">
        Criar programa de fidelidade
      </Button>
    </div>
  );
};
