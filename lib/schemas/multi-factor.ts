import { z } from 'zod';
export const multiFactorSchema = z.object({
  Token: z
    .string()
    .nonempty({ message: 'Token must be informed.' })
    .min(8, { message: 'Token must contain a minimum of 8 characters.' }),

  ElectronicSignature: z
    .string()
    .nonempty({ message: 'The Electronic Signature must be informed.' })
    .min(4, { message: 'The Electronic Signature must contain a minimum of 4 characters.' }),
});
export type MultiFactorSchema = z.infer<typeof multiFactorSchema>;
