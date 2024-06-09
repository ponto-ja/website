'use client';

import { useState } from 'react';
import { UserRound, Phone, CalendarClock, CircleAlert, HandCoins } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { Participant } from './participant';
import { Reward } from '@/components/reward';

export const ParticipantInfoModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Participant />
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dados do participante</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <UserRound color="#374151" strokeWidth={1.7} size={22} />
            <p className="font-inter font-medium text-sm text-gray-700">John Doe</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone color="#374151" strokeWidth={1.7} size={21} />
            <p className="font-inter font-medium text-sm text-gray-700">
              (99) 99999-9999
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock color="#374151" strokeWidth={1.7} size={22} />
            <p className="font-inter font-medium text-sm text-gray-700">04/05/2024</p>
          </div>
        </div>

        <div className="w-full bg-violet-200 rounded my-1 p-3">
          <p className="font-inter font-medium text-base text-gray-500 text-center">
            Saldo atual do participante
          </p>
          <p className="font-inter font-semibold text-3xl text-gray-500 text-center mt-2">
            20
          </p>
        </div>

        <div>
          <p className="font-inter font-medium text-gray-700">Recompensas disponíveis</p>
          <p className="font-inter font-normal text-sm text-gray-700">
            Selecione uma recompensa para trocar
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <Reward.Root selected>
              <Reward.Name>Desconto de 50% na próxima compra</Reward.Name>
              <Reward.ScoreRate>Pontuação necessária: 100</Reward.ScoreRate>
              <Reward.Description>
                Breve descrição sobre a recompensa ...
              </Reward.Description>
            </Reward.Root>
            <Reward.Root>
              <Reward.Name>Desconto de 50% na próxima compra</Reward.Name>
              <Reward.ScoreRate>Pontuação necessária: 100</Reward.ScoreRate>
            </Reward.Root>
          </div>
        </div>

        <div className="w-full bg-red-200 p-[6px] rounded flex items-center gap-2 border-[1px] border-red-500">
          <span>
            <CircleAlert strokeWidth={2} color="#ef4444" size={20} />
          </span>
          <p className="font-inter font-medium text-sm text-red-500">
            Saldo insuficiente para fazer a troca por alguma recompensa.
          </p>
        </div>

        <div className="w-full flex items-center justify-between">
          <Button
            type="button"
            className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
            onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button
            disabled
            className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white flex items-center gap-2">
            <HandCoins strokeWidth={2} color="#FFFFFF" size={20} />
            Trocar pontos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
