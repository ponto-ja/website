import { z } from 'zod';

export const updateFidelityProgramSchema = z.object({
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  scoreRate: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
});

export type UpdateFidelityProgramData = z.infer<typeof updateFidelityProgramSchema>;
