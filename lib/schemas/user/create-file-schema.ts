import { z } from 'zod';

export function createFileSchema(maxSize: number, acceptedFiles: string[], fieldName?: string) {
  return z
    .any()
    .refine((files) => files?.length == 1, fieldName ? `${fieldName} must be informed.` : undefined)
    .refine((files) => files?.[0]?.size <= maxSize, `Max file size is 5MB.`)
    .refine(
      (files) => acceptedFiles.includes(files?.[0]?.type),
      `Only files of type ${acceptedFiles.map((acpt) => `.${acpt.split('/')[1]}`).join(' ')} are accepted.`
    );
}
