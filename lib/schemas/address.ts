import { z } from 'zod';
export const addressSchema = z.object({
  city: z
    .string({ message: 'City name must be informed.' })
    .nonempty({ message: 'City name must be informed.' })
    .min(2, { message: 'City name must contain a minimum of 2 characters.' }),
  street: z
    .string({ message: 'Street must be informed.' })
    .nonempty({ message: 'Street must be informed.' })
    .min(4, { message: 'Street deve ter no mínimo 4 characters.' }),
  number: z
    .number()
    .int()
    .nonnegative({ message: 'Street number must be non negative.' })
    .min(1, { message: 'Street number must be at minimum 1.' })
    .max(999999999, { message: 'Street number must contain a maximum of 9 digits.' }),
  zipCode: z
    .string({ message: 'Cep must be informed.' })
    .nonempty({ message: 'Cep must be informed.' })
    .min(8, { message: 'Cep must contain a minimum of 8 characters.' })
    .max(8, { message: 'Cep deve conter no máximo 8 characters.' }),
  state: z
    .string({ message: 'Estado must be informed.' })
    .nonempty({ message: 'Estado must be informed.' })
    .min(2, { message: 'Estado must contain a minimum of 2 characters.' })
    .max(24, { message: 'Estado deve conter no máximo 24 characters.' }),
});
export type AddressSchema = z.infer<typeof addressSchema>;
