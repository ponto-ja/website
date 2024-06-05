import Image from 'next/image';
import Link from 'next/link';
import businessImage from '@/assets/images/business.png';
import userImage from '@/assets/images/user.png';

export default function ProfilePage() {
  return (
    <main className="w-full flex flex-col items-center -mt-[80px] max-[400px]:my-[30px]">
      <div className="mb-10">
        <h2 className="font-inter font-semibold text-2xl text-gray-800 text-center max-[400px]:text-[20px]">
          Perfil da Conta
        </h2>
        <p className="font-inter font-normal text-sm text-gray-600 text-center">
          Selecione o perfil da sua conta
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-[400px]:grid-cols-1">
        <Link
          href="/dono-negocio/entrar"
          className="flex flex-col items-center gap-4 cursor-pointer px-3 py-4 border-[2px] border-violet-900 rounded-lg">
          <Image
            src={{
              src: businessImage.src,
              width: 60,
              height: 60,
            }}
            alt="Dono(a) de negócio"
          />
          <p className="font-inter font-medium text-base text-violet-900">
            Dono(a) de negócio
          </p>
        </Link>
        <Link
          href="/cliente/entrar"
          className="flex flex-col items-center gap-4 cursor-pointer px-3 py-4 border-[2px] border-violet-900 rounded-lg">
          <Image
            src={{
              src: userImage.src,
              width: 60,
              height: 60,
            }}
            alt="Cliente"
          />
          <p className="font-inter font-medium text-base text-violet-900">Cliente</p>
        </Link>
      </div>
    </main>
  );
}
