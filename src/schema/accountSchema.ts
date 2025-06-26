import { z } from "zod";

export const auditAccountSchema = z.object({
    fullName: z
        .string()
        .min(1, "Vui lòng nhập họ và tên"),

    email: z
        .string()
        .min(1, "Vui lòng nhập email")
        .email("Email không hợp lệ"),

    phone: z
        .string()
        .transform((val) => val.trim()) // loại bỏ khoảng trắng đầu/cuối nếu có
        .refine(
            (val) => val === "" || (/^\d{9,11}$/.test(val)),
            "Số điện thoại không hợp lệ (phải là 9-11 chữ số hoặc để trống)"
        )
        .optional(),

    roleId: z
        .string()
        .min(1, "Vui lòng chọn vai trò"),


});

export const suspendAccountSchema = z.object({
    reason: z
        .string()
        .min(1, 'Vui lòng nhập lý do')
        .min(5, 'Lý do phải có ít nhất 5 ký tự')
        .max(500, 'Lý do không được vượt quá 500 ký tự'),
})

export type AuditAccountSchema = z.infer<typeof auditAccountSchema>;
export type SuspendAccountSchema = z.infer<typeof suspendAccountSchema>;