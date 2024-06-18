'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/button';
import { InputField } from '@/components/input-field';
import { RegisterAccountData, registerAccountSchema } from './register-account-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { mask } from '@/helpers/mask';
import { ThreeDots } from 'react-loader-spinner';
import { useParticipant } from '@/hooks/use-participant';
import { useToast } from '@/components/ui/toast/use-toast';
import { useUserStore } from '@/store/user-store';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserStore();
  const {
    handleSubmit,
    clearErrors,
    setError,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm<RegisterAccountData>({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });
  const {
    getByPhoneNumber,
    isLoadingGetByPhoneNumber,
    register: registerParticipant,
    isLoadingRegister: isLoadingRegisterParticipant,
    authenticate,
    isLoadingAuthenticate,
  } = useParticipant();

  const isLoading =
    isLoadingGetByPhoneNumber || isLoadingRegisterParticipant || isLoadingAuthenticate;

  const handleRegisterParticipantAccount: SubmitHandler<RegisterAccountData> = async ({
    firstName,
    lastName,
    phoneNumber,
  }) => {
    clearErrors('root');

    const { code } = await getByPhoneNumber(mask.onlyNumbers(phoneNumber));

    if (code === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro na criação da sua conta, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    if (code === 'PARTICIPANT_FOUND') {
      setError('phoneNumber', { message: 'Número de telefone já cadastrado' });
      return;
    }

    const { code: registerParticipantCode } = await registerParticipant({
      firstName,
      lastName,
      phoneNumber: mask.onlyNumbers(phoneNumber),
    });

    if (registerParticipantCode === 'UNEXPECTED_ERROR') {
      toast({
        title: 'Ops! Erro inesperado :(',
        description: 'Houve um erro na criação da sua conta, tente novamente.',
        variant: 'destructive',
        titleClassName: 'text-white',
        descriptionClassName: 'text-white',
      });
      return;
    }

    const { data: user } = await authenticate({
      phoneNumber: mask.onlyNumbers(phoneNumber),
    });

    setUser({ id: user!.id, role: user!.role });

    reset();

    router.push('/cliente/app');
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
        onSubmit={handleSubmit(handleRegisterParticipantAccount)}>
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
          <Link href="/cliente/entrar" className="text-violet-900 font-medium">
            Faça login
          </Link>
        </p>
      </form>
    </main>
  );
}
