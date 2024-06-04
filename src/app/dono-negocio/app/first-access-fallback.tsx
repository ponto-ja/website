import Link from 'next/link';
import { Frown } from 'lucide-react';

export const FirstAccessFallback = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center gap-2 mt-[80px]">
      <Frown color="#374151" size={60} strokeWidth={1.3} />
      <h2 className="text-center font-inter font-medium text-base text-gray-700">
        Crie seu programa de fidelidade para começar.
      </h2>
      <Link
        href="/dono-negocio/app/programa-de-fidelidade/criar"
        className="bg-violet-900 py-2 font-inter text-sm text-white mt-4 px-2 rounded-md">
        Criar programa de fidelidade
      </Link>
    </div>
  );
};
