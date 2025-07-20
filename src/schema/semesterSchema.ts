import { z } from 'zod'

// Zod schema for validation
export const semesterSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên học kỳ'),
  subject: z.string().min(1, 'Vui lòng nhập môn học'),
  semester: z
    .number()
    .min(1, 'Học kỳ phải là số dương')
    .max(8, 'Học kỳ không được vượt quá 8'),
  academicYear: z
    .string()
    .min(1, 'Vui lòng nhập năm học')
    .regex(/^\d{4}-\d{4}$/, 'Năm học phải có định dạng YYYY-YYYY'),
  locToPass: z.number().min(0, 'LOC để pass phải là số không âm'),
  teacherId: z.string().min(1, 'Vui lòng chọn giảng viên'),
  isActive: z.boolean(),
})

export type SemesterFormData = z.infer<typeof semesterSchema>
