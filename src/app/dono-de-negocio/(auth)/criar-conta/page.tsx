'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import { Button } from '@/components/button';
import { InputField } from '@/components/input-field';
import { registerAccountSchema, RegisterAccountData } from './register-account-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessOwner } from '@/hooks/use-business-owner';
import { useToast } from '@/components/ui/toast/use-toast';
import { useUserStore } from '@/store/user-store';

export default function RegisterAccountPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<RegisterAccountData>({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });
  const { toast } = useToast();
  const {
    register: registerBusinessOwner,
    isLoadingRegister,
    authenticate,
    isLoadingAuthenticate,
  } = useBusinessOwner();
  const { setUser } = useUserStore();

  const isLoading = isLoadingRegister || isLoadingAuthenticate;

  const handleRegisterBusinessOwnerAccount: SubmitHandler<RegisterAccountData> = async ({
    firstName,
    lastName,
    email,
  }) => {
    clearErrors('root');

    const { code } = await registerBusinessOwner({ firstName, lastName, email });

    switch (code) {
      case 'CREATED': {
        const { data: user } = await authenticate({ email });

        setUser({ id: user!.id, role: user!.role });

        toast({
          title: '✅ Credencial válida!',
          description: 'Seu acesso foi autorizado com sucesso',
        });

        reset();

        router.push('/dono-de-negocio/app');
        break;
      }

      case 'EMAIL_ALREADY_EXISTS': {
        setError('email', { message: 'E-mail já cadastrado' });
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro na criação da sua conta, tente novamente.',
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
          Criar Conta
        </h2>
        <p className="font-inter font-normal text-sm text-gray-600 text-center">
          Preencha as informações para se cadastrar
        </p>
      </div>

      <form
        className="mt-10 max-w-[360px] w-full"
        onSubmit={handleSubmit(handleRegisterBusinessOwnerAccount)}>
        <InputField
          type="text"
          placeholder="Digite seu nome"
          label="Nome"
          required={true}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <InputField
          type="text"
          placeholder="Digite seu sobrenome"
          label="Sobrenome"
          required={true}
          rootClassName="my-3"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <InputField
          type="email"
          placeholder="Digite seu e-mail"
          label="E-mail"
          required={true}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button
          disabled={isLoading}
          className="bg-violet-900 w-full mt-4 py-2 font-inter text-sm text-white flex justify-center">
          {isLoading ? (
            <ThreeDots
              height="20"
              width="40"
              radius="9"
              color="#fafafa"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : (
            'Criar conta'
          )}
        </Button>
        <p className="font-inter font-normal text-sm text-gray-600 text-center mt-4">
          Já possui uma conta?{' '}
          <Link href="/dono-de-negocio/entrar" className="text-violet-900 font-medium">
            Faça login
          </Link>
        </p>
      </form>
    </main>
  );
}
