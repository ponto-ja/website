import { Trash, SquarePen } from 'lucide-react';

export const Reward = () => {
  return (
    <div className="w-full border-[1px] border-gray-200 rounded px-3 py-2">
      <p className="font-inter font-semibold text-gray-700">
        Desconto de 50% na próxima compra
      </p>
      <p className="font-inter font-normal text-sm text-gray-500 mt-2">
        Pontuação necessária: 100
      </p>
      <p className="font-inter font-normal text-sm text-gray-500 mt-1">
        Breve descrição sobre a recompensa ...
      </p>
      <div className="w-full flex items-center justify-end gap-6 mt-2">
        <button>
          <Trash strokeWidth={2} color="#ef4444" size={22.5} />
        </button>
        <button>
          <SquarePen strokeWidth={2} color="#4b5563" size={22} />
        </button>
      </div>
    </div>
  );
};
