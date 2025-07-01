import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReactNode, useEffect } from 'react'
import { auditAccountSchema, AuditAccountSchema } from '@/schema/accountSchema'
import { useMutation, useQuery } from '@/hooks'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { toast } from 'react-toastify'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { useQueryClient } from '@tanstack/react-query'

interface ManageAccountAuditProps {
  auditMode: 'create' | 'update'
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  id?: string
}

/* Edit/Create User Modal */
export const ManageAccountAudit = ({
  auditMode,
  isModalOpen,
  setIsModalOpen,
  id,
}: ManageAccountAuditProps): ReactNode => {
  const queryClient = useQueryClient()

  const { data: userToEdit } = useQuery({
    ...adminAccountQueries.getDetail(id),
  })

  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })

  const { mutateAsync: handleCreateAccount } = useMutation('createAccount', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminAccountQueries.getAll().queryKey,
      })
      setIsModalOpen(false)
      toast.success('Tạo tài khoản thành công')
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message || 'Đã xảy ra lỗi')
    },
  })

  const { mutateAsync: handleUpdateAccount } = useMutation('updateAccount', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminAccountQueries.getAll().queryKey,
      })
      setIsModalOpen(false)
      toast.success('Cập nhật tài khoản thành công')
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message || 'Đã xảy ra lỗi')
    },
  })

  const handleAuditAccount = async (data: AuditAccountSchema) => {
    if (auditMode === 'create') {
      await handleCreateAccount({
        ...data,
        department: 'CNTT',
        userName: data.userName,
        password: data.password,
      })
    } else {
      await handleUpdateAccount({
        ...data,
        id: userToEdit?.id || '',
        department: 'CNTT',
      })
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuditAccountSchema>({
    resolver: zodResolver(auditAccountSchema),
  })

  useEffect(() => {
    if (userToEdit) {
      reset({
        fullName: userToEdit.fullName,
        email: userToEdit.email,
        phone: userToEdit.phone,
        roleId: rolesData?.find(role => role.name === userToEdit.roleName)?.id,
      })
    }
  }, [userToEdit, reset, rolesData])

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {auditMode === 'update'
              ? 'Chỉnh sửa thông tin người dùng'
              : 'Tạo tài khoản người dùng mới'}
          </DialogTitle>
          <DialogDescription>
            {auditMode === 'update'
              ? `Cập nhật thông tin cho ${userToEdit?.fullName}`
              : 'Tạo tài khoản mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAuditAccount)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                defaultValue={userToEdit?.fullName}
                id="fullName"
                {...register('fullName', {
                  required: 'Vui lòng nhập họ và tên',
                })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập</Label>
              <Input
                id="userName"
                {...register('userName', {
                  required: 'Vui lòng nhập tên đăng nhập',
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu',
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                {...register('phone', {
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleId">Vai trò</Label>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesData?.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roleId && (
                <p className="text-red-500 text-sm">{errors.roleId.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
