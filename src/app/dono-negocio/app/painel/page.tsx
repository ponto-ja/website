import { FirstAccessFallback } from '../first-access-fallback';
import { Users, HandCoins, Gift, CalendarClock, NotebookPen } from 'lucide-react';
import { FidelityProgramCardInfo } from './fidelity-program-card-info';
import { ScoreHistory } from './score-history';
import { ScoreRegisterModal } from './score-register-modal';

export default function BusinessOwnerPanelPage() {
  return (
    <div className="w-full">
      {/* <FirstAccessFallback /> */}
      <div className="w-full flex items-center justify-between border-b pb-4">
        <h2 className="font-inter font-bold text-[26px] text-gray-700">
          Meu Programa de Fidelidade
        </h2>
        <ScoreRegisterModal />
      </div>

      <div className="w-full grid grid-cols-4 gap-4 mt-4">
        <FidelityProgramCardInfo
          title="Participantes"
          icon={Users}
          value="42"
          description="Clientes participantes"
        />
        <FidelityProgramCardInfo
          title="Recompensas"
          icon={Gift}
          value="1"
          description="Opções de recompensas"
        />
        <FidelityProgramCardInfo
          title="Taxa de pontuação"
          icon={HandCoins}
          value="R$ 10,00"
          description="RS 10,00 em compra = +1 ponto"
        />

        <FidelityProgramCardInfo
          title="Dias ativos"
          icon={CalendarClock}
          value="999"
          description="Criado em 22/01/2024"
        />
      </div>

      <div className="w-full border rounded p-5 mt-4">
        <div className="w-full flex items-center gap-2">
          <NotebookPen color="#374151" />
          <p className="font-inter font-semibold text-[18px] text-gray-700">
            Histórico de pontuações
          </p>
        </div>

        <div className="w-full flex flex-col mt-6 space-y-5">
          <ScoreHistory />
        </div>
      </div>
    </div>
  );
}
