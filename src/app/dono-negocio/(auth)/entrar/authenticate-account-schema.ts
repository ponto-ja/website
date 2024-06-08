import { z } from 'zod';

export const authenticateAccountSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
    .email({ message: 'E-mail inválido' }),
});

export type AuthenticateAccountData = z.infer<typeof authenticateAccountSchema>;
