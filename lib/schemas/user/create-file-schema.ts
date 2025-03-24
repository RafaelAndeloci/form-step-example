import { z } from 'zod';

export function createFileSchema(maxSize: number, acceptedFiles: string[], fieldName?: string) {
  return z
    .any()
    .refine(
      (files) => files?.length == 1,
      fieldName ? `${fieldName} deve ser preenchido.` : undefined
    )
    .refine((files) => files?.[0]?.size <= maxSize, `Max file size is 5MB.`)
    .refine(
      (files) => acceptedFiles.includes(files?.[0]?.type),
      `apenas arquivos dos tipos ${acceptedFiles.map((acpt) => `.${acpt.split('/')[1]}`).join(' ')} são aceitos.`
    );
}
