import { z } from 'zod'

// Zod schema for validation
export const semesterSchema = z.object({
  name: z.string().min(1, 'Please enter semester name'),
  subject: z.string().min(1, 'Please enter subject'),
  semester: z
    .number()
    .min(1, 'Semester must be positive')
    .max(8, 'Semester cannot exceed 8'),
  academicYear: z
    .string()
    .min(1, 'Please enter academic year')
    .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'),
  locToPass: z.number().min(0, 'LOC to pass must be non-negative'),
  teacherId: z.string().min(1, 'Please select teacher'),
  isActive: z.boolean(),
})

export type SemesterFormData = z.infer<typeof semesterSchema>
