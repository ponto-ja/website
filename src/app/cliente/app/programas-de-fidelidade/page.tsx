import { Sparkles } from 'lucide-react';
import { FidelityProgramCard } from './fidelity-program-card';

export default function FidelityProgramsPage() {
  return (
    <div className="w-full">
      <div>
        <div className="flex items-center gap-3">
          <Sparkles color="#374151" size={30} strokeWidth={1.7} />
          <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[22px]">
            Programas de Fidelidade
          </h2>
        </div>
        <p className="font-inter font-normal text-sm text-gray-700">
          Programas de fidelidade que você está participando
        </p>
      </div>

      <div className="w-full mt-4 flex items-center gap-4 flex-wrap">
        <FidelityProgramCard />
        <FidelityProgramCard />
        <FidelityProgramCard />
      </div>
    </div>
  );
}
