import { z } from 'zod';
import { dateTimeSchema } from './common.schema';

const dateSchema = z.union([
    z.date().optional(),
    z.number().refine((val) => val > 0, {
      message: "Unix timestamp must be a positive number",
    }).transform((val) => new Date(val)).optional(),
]);
const ratingSchema = z.number().int().min(1).max(10);
const uuidSchema = z.string().uuid();

export const createScheduleSchema = z.object({
  topic: z.array(uuidSchema).min(1),
  level: z.string().min(3),
  join_link: z.string().url().optional(),
  start_time: dateSchema,
  owner_id: z.string().uuid().optional(),
  allowed_users: z.array(z.string().uuid()).optional(),
});

export const updateScheduleSchema = z.object({
  topic: z.array(z.string().uuid()).min(1).optional(),
  level: z.string().min(3).optional(),
  start_time: dateSchema.optional(),
  allowed_users: z.array(z.string().uuid()).optional(),
});
export const createFeedbackSchema = z.object({
  problem_solving_rating: ratingSchema,
  coding_rating: ratingSchema,
  communication_rating: ratingSchema,
  peer_strengths: z.string().min(1),
  areas_for_improvement: z.string().optional(),
  interviewer_rating: ratingSchema,
  topic_rating: ratingSchema,
  interviewee: uuidSchema, // Assuming this is a UUID of the user
  schedule_id: uuidSchema,
});


// const submissionStatusSchema = z.enum(['failed', 'accepted']);

// Solution creation schema
export const createSolutionSchema = z.object({
  solution_text: z.string().min(1).max(10000),
  submission_status: z.string().min(4),
  question_id: uuidSchema,
});

// Solution update schema
export const updateSolutionSchema = z.object({
  solution_text: z.string().min(1).max(10000).optional(),
  submission_status: z.string().min(4).optional(),
});

// Types inferred from schemas
export type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
export type UpdateSolutionInput = z.infer<typeof updateSolutionSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type updateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

