import { z } from 'zod';

export const authenticateAccountSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
});

export type AuthenticateAccountData = z.infer<typeof authenticateAccountSchema>;
