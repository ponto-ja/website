import Link from 'next/link';
import { Button } from '@/components/button';

export default function SignInPage() {
  return (
    <main className="w-full flex flex-col items-center max-[400px]:px-3 max-[400px]:my-[30px]">
      <div>
        <h2 className="font-inter font-semibold text-2xl text-gray-800 text-center max-[400px]:text-[20px]">
          Entrar
        </h2>
        <p className="font-inter font-normal text-sm text-gray-600 text-center">
          Acesse sua conta usando seu número de telefone
        </p>
      </div>

      <form className="mt-10 max-w-[360px] w-full">
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
        <Button className="bg-violet-900 w-full mt-4 py-2 font-inter text-sm text-white">
          Acessar conta
        </Button>
        <p className="font-inter font-normal text-sm text-gray-600 text-center mt-4">
          Ainda não possui uma conta?{' '}
          <Link href="/cliente/criar-conta" className="text-violet-900 font-medium">
            Cadastre-se
          </Link>
        </p>
      </form>
    </main>
  );
}
