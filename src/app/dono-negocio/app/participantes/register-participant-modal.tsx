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

export const RegisterParticipantModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button
          type="button"
          className="bg-violet-900 font-inter font-medium text-sm text-white flex items-center gap-1 px-3 py-2">
          <Plus color="#FFFFFF" size={18} strokeWidth={3} />
          Cadastrar participante
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar participante</DialogTitle>
        </DialogHeader>

        <form className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="font-inter font-medium text-gray-700">
              Nome*
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Digite seu nome"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col my-3">
            <label htmlFor="lastName" className="font-inter font-medium text-gray-700">
              Sobrenome*
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Digite seu sobrenome"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="font-inter font-medium text-gray-700">
              Telefone*
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Digite seu número de telefone"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
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
              Salvar participante
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
