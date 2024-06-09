import { z } from 'zod';

export const registerFidelityProgramSchema = z.object({
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  scoreRate: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
});

export type RegisterFidelityProgramData = z.infer<typeof registerFidelityProgramSchema>;
