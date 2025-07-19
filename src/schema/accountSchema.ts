import { z } from 'zod'

export const auditAccountSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),

  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),

  phone: z
    .string()
    .transform(val => val.trim()) // loại bỏ khoảng trắng đầu/cuối nếu có
    .refine(
      val => val === '' || /^\d{9,11}$/.test(val),
      'Số điện thoại không hợp lệ (phải là 9-11 chữ số hoặc để trống)'
    )
    .optional(),

  roleId: z.string().min(1, 'Vui lòng chọn vai trò'),

  userName: z.string().min(1, 'Vui lòng nhập tên đăng nhập').optional(),

  password: z.string().min(1, 'Vui lòng nhập mật khẩu').optional(),
})

export const suspendAccountSchema = z.object({
  reason: z
    .string()
    .min(1, 'Vui lòng nhập lý do')
    .min(5, 'Lý do phải có ít nhất 5 ký tự')
    .max(500, 'Lý do không được vượt quá 500 ký tự'),
})

// Zod schema for password validation
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export type AuditAccountSchema = z.infer<typeof auditAccountSchema>
export type SuspendAccountSchema = z.infer<typeof suspendAccountSchema>
