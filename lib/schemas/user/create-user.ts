import { addressSchema } from '@/lib/schemas/address';
import { multiFactorSchema } from '@/lib/schemas/multi-factor';
import { addYears } from 'date-fns';
import { z } from 'zod';
import { professionSchema } from './profession';

export const personalInfoSchema = z.object({
  name: z
    .string({ message: 'Nome deve ser informado' })
    .nonempty({ message: 'Nome deve ser informado' })
    .min(3, { message: 'Nome deve conter no mínimo 3 caracteres.' })
    .max(50, { message: 'Nome deve conter no máximo 50 caracteres.' }),
  userName: z
    .string({ message: 'Nome de usuário deve ser informado' })
    .nonempty({ message: 'Nome de usuário deve ser informado' })
    .min(3, { message: 'Nome de usuário deve conter no mínimo 3 caracteres.' })
    .max(15, { message: 'Nome de usuário deve conter no máximo 15 caracteres.' })
    .regex(/^[a-z0-9_]+$/g, {
      message: 'Nome de usuário não pode conter espaços ou caracteres especiais.',
    }),
  email: z
    .string({ message: 'Email deve ser informado.' })
    .nonempty({ message: 'Email deve ser informado.' })
    .email({ message: 'Email no formato inválido.' }),
  birthDate: z
    .date({ message: 'Data no formato inválido' })
    .max(addYears(new Date(), 100), { message: 'Usuário meio velho para usar o sistema, não? 🤔' })
    .default(new Date()),
});

export const createUserRequestSchema = multiFactorSchema.extend({
  address: addressSchema,
  personalInfo: personalInfoSchema,
  profissionalInfo: professionSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
