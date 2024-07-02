import z from 'zod'

export const getIdParamSchema = z.object({
    id: z.string().uuid(),
});
export const dateTimeSchema = z.string().datetime(); // ISO 8601 date-time format

export const queryTimeSchema = z.object({
  dt: z.object({
    start: dateTimeSchema,
    end: dateTimeSchema,
  }),
});
