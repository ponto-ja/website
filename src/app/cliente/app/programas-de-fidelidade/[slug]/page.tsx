import { FidelityProgramCardInfo } from '@/components/fidelity-program-card-info';
import { RewardAvailable } from '@/components/reward-available';
import { CircleDollarSign, Gift, HandCoins } from 'lucide-react';
import { ScoreHistory } from './score-history';

export default function FidelityProgramPage() {
  return (
    <div className="w-full mb-4">
      <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[22px]">
        Programa da Farmácia
      </h2>

      <div className="max-w-[932px] w-full overflow-auto flex items-center gap-4 mt-4">
        <FidelityProgramCardInfo
          title="Total de pontos"
          icon={CircleDollarSign}
          value="120"
          description="Seu total de pontos no programa"
          className="min-w-[300px]"
        />
        <FidelityProgramCardInfo
          title="Taxa de pontuação"
          icon={HandCoins}
          value="R$ 10,00"
          description="RS 10,00 em compra = +1 ponto"
          className="min-w-[300px]"
        />
        <FidelityProgramCardInfo
          title="Recompensas"
          icon={Gift}
          value="1"
          description="Opções de recompensas"
          className="min-w-[300px]"
        />
      </div>

      <div className="mt-10 w-full">
        <p className="font-inter font-medium text-gray-700 text-[18px]">
          Recompensas disponíveis
        </p>
        <p className="font-inter font-normal text-sm text-gray-600">
          Recompensas que pode ganhar dentro do programa
        </p>
        <div className="mt-2 flex items-center flex-wrap gap-2">
          <RewardAvailable className="max-w-[400px]" />
          <RewardAvailable className="max-w-[400px]" />
        </div>
      </div>

      <div className="mt-10 w-full">
        <p className="font-inter font-medium text-gray-700 text-[18px]">
          Histórico de recompensas
        </p>
        <p className="font-inter font-normal text-sm text-gray-600">
          Recompensas que você já ganhou dentro do programa
        </p>
        <div className="mt-2 flex items-center flex-wrap gap-2">
          <RewardAvailable className="max-w-[400px]" />
        </div>
      </div>

      <div className="mt-10 w-full">
        <p className="font-inter font-medium text-gray-700 text-[18px]">
          Histórico de pontos
        </p>
        <p className="font-inter font-normal text-sm text-gray-600">
          Seu histórico de pontos dentro do programa
        </p>
        <div className="w-full mt-3 max-w-[600px] flex flex-col">
          <ScoreHistory />
          <ScoreHistory />
        </div>
      </div>
    </div>
  );
}
