import { z } from 'zod'

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  locTotal: z.number().min(1, 'LOC phải lớn hơn 0'),
  teacherId: z.string().min(1, 'Mã giáo viên không được để trống'),
  status: z.enum(['Pending', 'Active', 'Inactive']),
})

export type AssignmentFormValues = z.infer<typeof assignmentSchema>
