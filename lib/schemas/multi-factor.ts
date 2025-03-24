import { z } from 'zod';
export const multiFactorSchema = z.object({
  Token: z
    .string()
    .nonempty({ message: 'Token deve ser informado.' })
    .min(8, { message: 'Token deve ter no mínimo 8 caracteres.' }),

  ElectronicSignature: z
    .string()
    .nonempty({ message: 'A assinatura eletrônica deve ser informada.' })
    .min(4, { message: 'A assinatura eletrônica deve ter no mínimo 4 caracteres.' }),
});
export type MultiFactorSchema = z.infer<typeof multiFactorSchema>;
