'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/button';
import { InputField } from '@/components/input-field';
import {
  AuthenticateAccountData,
  authenticateAccountSchema,
} from './authenticate-account-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreeDots } from 'react-loader-spinner';
import { useParticipant } from '@/hooks/use-participant';
import { useToast } from '@/components/ui/toast/use-toast';
import { useUserStore } from '@/store/user-store';
import { mask } from '@/helpers/mask';

export default function SignInPage() {
  const router = useRouter();
  const {
    handleSubmit,
    clearErrors,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<AuthenticateAccountData>({
    resolver: zodResolver(authenticateAccountSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });
  const { toast } = useToast();
  const { authenticate, isLoadingAuthenticate } = useParticipant();
  const { setUser } = useUserStore();

  const handleAuthenticateAccount: SubmitHandler<AuthenticateAccountData> = async ({
    phoneNumber,
  }) => {
    clearErrors('root');

    const { data, code } = await authenticate({
      phoneNumber: mask.onlyNumbers(phoneNumber),
    });

    switch (code) {
      case 'SUCCESS': {
        setUser(data!);

        reset();

        router.push('/cliente/app');
        break;
      }

      case 'INVALID_CREDENTIAL': {
        setError('phoneNumber', { message: 'Credencial inválida' });
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro na autenticação da sua conta, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

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

      <form
        className="mt-10 max-w-[360px] w-full"
        onSubmit={handleSubmit(handleAuthenticateAccount)}>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { value, onChange } }) => (
            <InputField
              type="text"
              placeholder="Digite seu número de telefone"
              label="Telefone"
              required={true}
              error={errors.phoneNumber?.message}
              value={value}
              onChange={({ target }) => onChange(mask.phoneNumber(target.value))}
            />
          )}
        />
        <Button
          disabled={isLoadingAuthenticate}
          className="bg-violet-900 w-full mt-4 py-2 font-inter text-sm text-white flex justify-center">
          {isLoadingAuthenticate ? (
            <ThreeDots
              height="20"
              width="40"
              radius="9"
              color="#fafafa"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            'Acessar conta'
          )}
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
