import { z } from 'zod'

export const auditAccountSchema = z.object({
  fullName: z.string().min(1, 'Please enter full name'),

  email: z.string().min(1, 'Please enter email').email('Email is not valid'),

  phone: z
    .string()
    .transform(val => val.trim())
    .refine(
      val => val === '' || /^\d{9,11}$/.test(val),
      'Phone number is not valid (must be 9-11 digits or empty)'
    )
    .optional(),

  roleId: z.string().min(1, 'Please select role'),

  userName: z.string().min(1, 'Please enter username').optional(),

  password: z.string().min(1, 'Please enter password').optional(),
})

export const suspendAccountSchema = z.object({
  reason: z
    .string()
    .min(1, 'Please enter reason')
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
})

// Zod schema for password validation
export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least 1 special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export type AuditAccountSchema = z.infer<typeof auditAccountSchema>
export type SuspendAccountSchema = z.infer<typeof suspendAccountSchema>
