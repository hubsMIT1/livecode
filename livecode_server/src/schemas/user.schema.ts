import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  username: z.string().min(1),
});

export const loginUserSchema = z.object({
  credential: z.string(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  username: z.string().min(1).optional(),
  socialLinks: z.array(z.string().url()).optional(),
  about: z.string().optional(),
  profileImage: z.string().url().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;