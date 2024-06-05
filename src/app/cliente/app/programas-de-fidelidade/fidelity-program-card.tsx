import { Gift } from 'lucide-react';

export const FidelityProgramCard = () => {
  return (
    <div className="rounded border max-w-[360px] w-full p-5 cursor-pointer hover:border-violet-900">
      <div className="w-full flex items-start justify-between mb-6">
        <p className="font-inter font-medium text-[18px] text-gray-700">
          Programa da Farmácia
        </p>
        <Gift color="#374151" strokeWidth={1.8} />
      </div>
      <p className="font-inter font-normal text-base text-gray-700">
        R$ 10,00 em compra = +1 ponto
      </p>
      <p className="font-inter font-normal text-base text-gray-600 mt-1">
        Criado em 22/01/2024
      </p>
    </div>
  );
};
