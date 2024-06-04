import Link from 'next/link';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';

export const Footer = () => {
  return (
    <footer className="w-full bg-violet-900 p-8">
      <div className="max-w-[1040px] w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="#" className="font-inter font-normal text-sm text-white">
            Início
          </Link>
          <Link href="#" className="font-inter font-normal text-sm text-white">
            Termos e condições
          </Link>
          <Link href="#" className="font-inter font-normal text-sm text-white">
            Política de privacidade
          </Link>
        </div>
        <Link
          href="#"
          className="bg-green-500 rounded-full w-6 h-6 flex pt-[2px] justify-center">
          <WhatsappIcon />
        </Link>
      </div>
      <div className="mt-8">
        <p className="font-inter font-normal text-sm text-white text-center">
          © 2024 Ponto Já - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
