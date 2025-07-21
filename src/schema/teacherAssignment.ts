import { z } from 'zod'

// Schema for teacher assignment form
export const teacherAssignmentSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  locTarget: z.number().min(1, 'LOC phải lớn hơn 0'),
  dueDate: z.string().min(1, 'Ngày hạn nộp không được để trống'),
})

export type TeacherAssignmentFormValues = z.infer<
  typeof teacherAssignmentSchema
>
