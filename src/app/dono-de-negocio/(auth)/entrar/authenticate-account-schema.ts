import { z } from 'zod';
import { cnpj } from 'cpf-cnpj-validator';

export const authenticateAccountSchema = z.object({
  companyIdentificationNumber: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
    .refine((input) => cnpj.isValid(input), { message: 'CPNJ inválido' }),
});

export type AuthenticateAccountData = z.infer<typeof authenticateAccountSchema>;
