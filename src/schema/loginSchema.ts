import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(50, { message: 'Username must be less than 50 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
    .nonempty({ message: 'Password is required' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
