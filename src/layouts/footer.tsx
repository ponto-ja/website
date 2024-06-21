import Link from 'next/link';
import WhatsappIcon from '@/assets/icons/whatsapp.svg';

export const Footer = () => {
  return (
    <footer className="w-full bg-violet-900 p-8 max-[500px]:p-4">
      <div className="max-w-[1040px] w-full mx-auto flex items-center justify-between max-[500px]:flex-col-reverse max-[500px]:gap-4">
        <div className="flex items-center gap-8 max-[420px]:flex-col max-[420px]:gap-3">
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
          href="https://api.whatsapp.com/send/?phone=5593992423295&text=Ol%C3%A1%2C+eu+gostaria+de+saber+mais+sobre+a+sua+plataforma."
          target="_blank"
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
