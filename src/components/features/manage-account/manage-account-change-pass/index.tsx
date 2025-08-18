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
  setIsOpen: (isOpen: boolean) => void
  userId?: string
  userName?: string
}

export const ManageAccountChangePass = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
}: ManageAccountChangePassProps) => {
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
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync: changePasswordMutation } = useMutation('changePass', {
    onSuccess: () => {
      toast.success('Change password successfully')
      reset()
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Change password failed. Please try again.')
    },
  })

  const newPassword = watch('newPassword')

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    if (!userId) {
      toast.error('User not found')
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
    setIsOpen(false)
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
    if (strength < 2) return 'Weak'
    if (strength < 4) return 'Medium'
    return 'Strong'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-orange-500" />
            Change password
          </DialogTitle>
          <DialogDescription>
            {userName
              ? `Change password for account: ${userName}`
              : 'Change password account'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-4"
        >
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
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
            <Label htmlFor="confirmPassword">Confirm new password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Enter new password again"
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
              Password requirements:
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
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[A-Z]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                At least 1 uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[a-z]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                At least 1 lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[0-9]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                At least 1 number
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /[^A-Za-z0-9]/.test(newPassword || '')
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                At least 1 special character
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
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Change password
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
