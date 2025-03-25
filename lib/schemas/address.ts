import { z } from 'zod';
export const addressSchema = z.object({
  city: z
    .string({ message: 'Nome da cidade deve ser informado.' })
    .nonempty({ message: 'Nome da cidade deve ser informado.' })
    .min(2, { message: 'Nome da cidade deve conter no mínimo 2 caracteres.' }),
  street: z
    .string({ message: 'Rua deve ser informada.' })
    .nonempty({ message: 'Rua deve ser informada.' })
    .min(4, { message: 'Rua deve ter no mínimo 4 caracteres.' }),
  number: z
    .number()
    .int()
    .nonnegative({ message: 'Número da rua não pode ser negativo.' })
    .min(1, { message: 'Número da rua deve ser no mínimo 1.' })
    .max(999999999, { message: 'Número da rua deve ter no máximo 9 dígitos.' }),
  zipCode: z
    .string({ message: 'Cep deve ser informado.' })
    .nonempty({ message: 'Cep deve ser informado.' })
    .min(8, { message: 'Cep deve conter no mínimo 8 caracteres.' })
    .max(8, { message: 'Cep deve conter no máximo 8 caracteres.' }),
  state: z
    .string({ message: 'Estado deve ser informado.' })
    .nonempty({ message: 'Estado deve ser informado.' })
    .min(2, { message: 'Estado deve conter no mínimo 2 caracteres.' })
    .max(24, { message: 'Estado deve conter no máximo 24 caracteres.' }),
});
export type AddressSchema = z.infer<typeof addressSchema>;
