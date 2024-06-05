'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';

export const NewRewardModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button
          type="button"
          className="bg-violet-200 font-inter font-medium text-sm text-gray-500 flex items-center gap-1">
          <Plus color="#6b7280" size={18} strokeWidth={3} />
          Nova recompensa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova recompensa</DialogTitle>
        </DialogHeader>

        <form className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="font-inter font-medium text-gray-700">
              Nome da recompensa*
            </label>
            <input
              type="text"
              id="title"
              placeholder="Digite o nome da recompensa"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="scores" className="font-inter font-medium text-gray-700">
              Pontos necessários*
            </label>
            <input
              type="text"
              id="scores"
              placeholder="Digite a quantidade de pontos"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="description" className="font-inter font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              placeholder="Uma descrição para os participantes entenderem melhor a recompensa"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 resize-none placeholder:font-light"
            />
          </div>

          <div className="w-full flex items-center justify-between mt-4">
            <Button
              type="button"
              className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white">
              Salvar recompensa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
