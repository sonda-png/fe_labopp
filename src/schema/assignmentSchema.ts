import { z } from 'zod'

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  locTotal: z.number().min(1, 'LOC must be greater than 0'),
  teacherId: z.number().min(1, 'Teacher ID cannot be empty'),
  status: z.enum(['Pending', 'Active', 'Inactive']),
  classIds: z.array(z.string()).min(1, 'Class IDs cannot be empty')
})

export type AssignmentFormValues = z.infer<typeof assignmentSchema>
