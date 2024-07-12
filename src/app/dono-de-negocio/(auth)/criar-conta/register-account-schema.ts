import { z } from 'zod';
import { cnpj } from 'cpf-cnpj-validator';

export const registerAccountSchema = z.object({
  firstName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  lastName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  phoneNumber: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
    .min(15, { message: 'Número de telefone inválido' }),
  companyIdentificationNumber: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
    .refine((input) => cnpj.isValid(input), { message: 'CPNJ inválido' }),
});

export type RegisterAccountData = z.infer<typeof registerAccountSchema>;
