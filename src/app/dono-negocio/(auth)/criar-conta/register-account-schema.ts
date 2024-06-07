import { z } from 'zod';

export const registerAccountSchema = z.object({
  firstName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  lastName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
    .email({ message: 'E-mail inválido' }),
});

export type RegisterAccountData = z.infer<typeof registerAccountSchema>;
