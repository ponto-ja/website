'use client';

import { useState } from 'react';
import { Plus, CircleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';

export const ScoreRegisterModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button
          type="button"
          className="bg-violet-900 font-inter font-medium text-sm text-white flex items-center gap-1 px-3 py-2">
          <Plus color="#FFFFFF" size={18} strokeWidth={3} />
          Cadastrar pontos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de pontos</DialogTitle>
        </DialogHeader>

        <form className="mt-4">
          <div className="flex flex-col">
            <label htmlFor="phone" className="font-inter font-medium text-gray-700">
              Telefone do participante*
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Digite o telefone do partipante"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="w-full bg-red-200 p-[6px] rounded flex items-center gap-2 my-2 border-[1px] border-red-500 mb-4">
            <span>
              <CircleAlert strokeWidth={2} color="#ef4444" size={20} />
            </span>
            <p className="font-inter font-medium text-sm text-red-500">
              Usuário ainda não cadastrado. Informe os dados abaixo para cadastrá-lo.
            </p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstName" className="font-inter font-medium text-gray-700">
              Nome do participante*
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Digite o nome do participante"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="lastName" className="font-inter font-medium text-gray-700">
              Sobrenome do participante*
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Digite o sobrenome do participante"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="amount" className="font-inter font-medium text-gray-700">
              Valor da compra*
            </label>
            <input
              type="text"
              id="amount"
              placeholder="Digite o valor da compra"
              className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light"
            />
          </div>
          <p className="font-inter font-normal text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded mt-2">
            Pontos ganhos nessa compra: <span className="font-semibold">R$ 10,00</span>
          </p>

          <div className="w-full bg-violet-200 rounded my-4 p-3">
            <p className="font-inter font-medium text-base text-gray-500 text-center">
              Saldo atual do participante
            </p>
            <p className="font-inter font-semibold text-3xl text-gray-500 text-center mt-2">
              20
            </p>
          </div>

          <div className="w-full flex items-center justify-between">
            <Button
              type="button"
              className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white">
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
