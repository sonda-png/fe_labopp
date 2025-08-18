import { z } from 'zod'

// Schema for teacher assignment form
export const teacherAssignmentSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  locTarget: z.number().min(1, 'LOC must be greater than 0'),
  dueDate: z.string().min(1, 'Due date cannot be empty'),
})

export type TeacherAssignmentFormValues = z.infer<
  typeof teacherAssignmentSchema
>
