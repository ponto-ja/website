import { z } from 'zod';

export const registerRewardSchema = z.object({
  name: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  scoreNeeded: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  description: z.string(),
});

export type RegisterRewardData = z.infer<typeof registerRewardSchema>;
