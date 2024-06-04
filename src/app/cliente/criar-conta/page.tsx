import Link from 'next/link';
import { Button } from '@/components/button';

export default function SignUpPage() {
  return (
    <main className="w-full flex flex-col items-center">
      <div>
        <h2 className="font-inter font-semibold text-2xl text-gray-800 text-center">
          Criar Conta
        </h2>
        <p className="font-inter font-normal text-sm text-gray-600 text-center">
          Preencha as informações para se cadastrar
        </p>
      </div>

      <form className="mt-10 max-w-[360px] w-full">
        <div className="flex flex-col">
          <label htmlFor="email" className="font-inter font-medium text-gray-700">
            Nome*
          </label>
          <input
            type="text"
            id="email"
            placeholder="Digite seu nome"
            className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700"
          />
        </div>
        <div className="flex flex-col my-3">
          <label htmlFor="email" className="font-inter font-medium text-gray-700">
            Sobrenome*
          </label>
          <input
            type="text"
            id="email"
            placeholder="Digite seu sobrenome"
            className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="font-inter font-medium text-gray-700">
            Telefone*
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu número de telefone"
            className="w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700"
          />
        </div>
        <Button className="bg-violet-900 w-full mt-4 py-2 font-inter text-sm text-white">
          Criar conta
        </Button>
        <p className="font-inter font-normal text-sm text-gray-600 text-center mt-4">
          Já possui uma conta?{' '}
          <Link href="/cliente/entrar" className="text-violet-900 font-medium">
            Faça login
          </Link>
        </p>
      </form>
    </main>
  );
}
