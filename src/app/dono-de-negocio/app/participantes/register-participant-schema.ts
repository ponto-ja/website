import { z } from 'zod';

export const registerParticipantSchema = z.object({
  firstName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  lastName: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  phoneNumber: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
});

export type RegisterParticipantData = z.infer<typeof registerParticipantSchema>;
