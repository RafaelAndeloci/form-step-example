import { z } from 'zod';
import { createFileSchema } from './create-file-schema';

export const jobPositionEnum = z.enum(['Internship', 'Junior', 'Mid-level', 'Senior']);

export const skillsSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const MAX_CV_FILE_SIZE = 400000;
export const ACCEPTED_CV_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const professionSchema = z.object({
  position: jobPositionEnum,
  skills: z.array(skillsSchema).optional(),
  cv: createFileSchema(MAX_CV_FILE_SIZE, ACCEPTED_CV_TYPES, 'CV').optional(),
});

export type JobPositionEnum = z.infer<typeof jobPositionEnum>;
export type ProfessionSchema = z.infer<typeof professionSchema>;
