import { Button } from '@/components/button';
import { Plus, Search } from 'lucide-react';
import { Participant } from './participant';
import { ParticipantInfoModal } from './participant-info-modal';

export default function ParticipantsPage() {
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-end">
        <Button
          type="button"
          className="bg-violet-900 font-inter font-medium text-sm text-white flex items-center gap-1 px-3 py-2">
          <Plus color="#FFFFFF" size={18} strokeWidth={3} />
          Cadastrar participante
        </Button>
      </div>

      <div className="w-full border rounded p-5 mt-4">
        <div className="w-full flex items-end justify-between">
          <p className="font-inter font-semibold text-[18px] text-gray-700">
            Participantes cadastrados
          </p>
          <div className="relative max-w-[320px] w-full">
            <input
              type="text"
              id="phone"
              placeholder="Telefone do participante"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 pr-8 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
            <Search
              color="#6b7280"
              size={20}
              strokeWidth={1.8}
              className="absolute right-2 top-4"
            />
          </div>
        </div>

        <div className="w-full flex flex-col mt-6 space-y-5">
          <ParticipantInfoModal />
        </div>
      </div>
    </div>
  );
}
