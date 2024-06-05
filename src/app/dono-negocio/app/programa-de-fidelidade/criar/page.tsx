import { Button } from '@/components/button';
import { NewRewardModal } from './new-reward-modal';
import { Reward } from './reward';

export default function CreateFidelityProgramPage() {
  return (
    <div className="pb-6">
      <h2 className="font-inter font-bold text-2xl text-gray-700">
        Cadastrar programa de fidelidade
      </h2>
      <p className="font-inter font-normal text-base text-gray-600">
        Preencha as informações abaixo para cadastrar seu programa de fidelidade.
      </p>

      <form className="mt-10 max-w-[600px] w-full">
        <div className="flex flex-col">
          <label
            htmlFor="fidelityProgramName"
            className="font-inter font-medium text-gray-700">
            Nome do programa de fidelidade*
          </label>
          <input
            type="text"
            id="fidelityProgramName"
            autoFocus={true}
            placeholder="Digite o nome do programa"
            className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
          />
        </div>
        <div className="flex flex-col mt-6">
          <label htmlFor="scoreRate" className="font-inter font-medium text-gray-700">
            Taxa de pontos*
          </label>
          <input
            type="text"
            id="scoreRate"
            placeholder="Digite a taxa de pontos"
            className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
          />
          <p className="font-inter font-normal text-sm text-gray-700">
            A cada <span className="font-semibold">R$ 0,00</span> em compras, o
            participante ganha +1 ponto
          </p>
        </div>

        <div className="flex flex-col mt-6">
          <label className="font-inter font-medium text-gray-700">Recompensas*</label>
          <p className="font-inter font-normal text-sm text-gray-700">
            Adicione as recompensas do seu programa de fidelidade
          </p>
          <div className="my-2 flex flex-col gap-2">
            <Reward />
          </div>
          <div className="w-full flex justify-center mt-2">
            <NewRewardModal />
          </div>
        </div>

        <Button className="bg-violet-900 font-inter font-normal text-sm text-white mt-10 px-3 py-2">
          Cadastrar programa de fidelidade
        </Button>
      </form>
    </div>
  );
}
