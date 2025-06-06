import { z } from 'zod'

export const loginSchema = z.object({
  userCredential: z
    .string()
    .email({ message: 'Email không hợp lệ' })
    .nonempty({ message: 'Email là bắt buộc' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự' })
    .nonempty({ message: 'Mật khẩu là bắt buộc' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
