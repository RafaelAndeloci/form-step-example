import { addressSchema } from '@/lib/schemas/address';
import { multiFactorSchema } from '@/lib/schemas/multi-factor';
import { z } from 'zod';
import { professionSchema } from './profession';

export const personalInfoSchema = z.object({
  name: z
    .string({ message: 'Name must be informed.' })
    .nonempty({ message: 'Name must be informed.' })
    .min(3, { message: 'Name must contain a minimum of 3 characters.' })
    .max(50, { message: 'Name must contain a maximum of 50 characters.' }),
  userName: z
    .string({ message: 'User Name must be informed.' })
    .nonempty({ message: 'User Name must be informed.' })
    .min(3, { message: 'User Name must contain a minimum of 3 characters.' })
    .max(15, { message: 'User Name must contain a maximum of 15 characters.' })
    .regex(/^[a-z0-9_]+$/g, {
      message: 'User Name cannot contain special characters or spaces.',
    }),
  email: z
    .string({ message: 'Email must be informed.' })
    .nonempty({ message: 'Email must be informed.' })
    .email({ message: 'Email in invalid format.' }),
  birthDate: z.date({ message: 'Data in invalid format' }).default(new Date()),
});

export const createUserRequestSchema = multiFactorSchema.extend({
  address: addressSchema,
  personalInfo: personalInfoSchema,
  profissionalInfo: professionSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
