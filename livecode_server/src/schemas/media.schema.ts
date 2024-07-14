import { z } from 'zod';

const FileTypeSchema = z.enum(['jpg', 'png','jpeg', 'web', 'gif', 'mp4', 'mov']);

const CreateFileSchema = z.object({
  question_id: z.string().uuid(),
  file: z.instanceof(Buffer),
  type: FileTypeSchema,
  alt: z.string().optional(),
});

export type CreateFileInput = z.infer<typeof CreateFileSchema>