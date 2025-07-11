import { useState } from 'react'
import { Eye, EyeOff, Key, Lock } from 'lucide-react'
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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '@/schema/accountSchema'
import { useMutation } from '@/hooks'

interface ManageAccountChangePassProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  userName?: string
}

export const ManageAccountChangePass = ({
  isOpen,
  onClose,
  userId,
}: ManageAccountChangePassProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync: changePasswordMutation } = useMutation('changePass', {
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công')
      reset()
      onClose()
    },
    onError: () => {
      toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại.')
    },
  })

  const newPassword = watch('newPassword')

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng')
      return
    }

    setIsLoading(true)

    await changePasswordMutation({
      userId,
      newPassword: data.newPassword,
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword || '')

  const getStrengthColor = (strength: number) => {
    if (strength < 2) return 'bg-red-500'
    if (strength < 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength < 2) return 'Yếu'
    if (strength < 4) return 'Trung bình'
    return 'Mạnh'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-orange-500" />
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            {userName
              ? `Đổi mật khẩu cho tài khoản: ${userName}`
              : 'Đổi mật khẩu tài khoản'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu hiện tại"
                {...register('currentPassword')}
                className={`pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                {...register('newPassword')}
                className={`pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      passwordStrength < 2
                        ? 'text-red-500'
                        : passwordStrength < 4
                          ? 'text-yellow-500'
                          : 'text-green-500'
                    }`}
                  >
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                {...register('confirmPassword')}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Yêu cầu mật khẩu:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    (newPassword?.length || 0) >= 8
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                Ít nhất 8 ký tự
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[A-Z]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                Có ít nhất 1 chữ hoa
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[a-z]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                Có ít nhất 1 chữ thường
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[0-9]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                Có ít nhất 1 số
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[^A-Za-z0-9]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                Có ít nhất 1 ký tự đặc biệt
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang cập nhật...</span>
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
