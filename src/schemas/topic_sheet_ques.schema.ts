import { z } from 'zod';

export const createTopicSchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export const createSheetSchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export const createQuestionSchema = z.object({
  title: z.string().min(2).max(256),
  description: z.string().min(10),
  difficulty_level: z.string().max(10),
  average_time_to_solve: z.number().positive().optional().nullable(),
  image: z.array(z.object({url: z.string().url(),type: z.string()})).optional(),
  topic: z.array(z.string().uuid()).optional(),
});

export const addQuestionsToSheetSchema = z.object({
  question: z.array(z.string().uuid()),
});

// one topic can has mutliple question and vice verse

export const updateTopicSchema = createTopicSchema.partial();
export const updateSheetSchema = createSheetSchema.partial();
export const updateQuestionSchema = createQuestionSchema.partial();



export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type CreateSheetInput = z.infer<typeof createSheetSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type UpdateSheetInput = z.infer<typeof updateSheetSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;