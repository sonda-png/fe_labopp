import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
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
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { useMutation, useQuery } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, UserCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  suspendAccountSchema,
  SuspendAccountSchema,
} from '@/schema/accountSchema'

interface ManageAccountSuspendProps {
  isSuspendModalOpen: boolean
  setIsSuspendModalOpen: (open: boolean) => void
  id?: string
}

export const ManageAccountSuspend = ({
  isSuspendModalOpen,
  setIsSuspendModalOpen,
  id,
}: ManageAccountSuspendProps) => {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuspendAccountSchema>({
    resolver: zodResolver(suspendAccountSchema),
  })

  const { data: userToSuspend } = useQuery({
    ...adminAccountQueries.getDetail(id),
  })

  const isActivating = !userToSuspend?.isActive
  const actionText = isActivating ? 'activate' : 'suspend'
  const actionTextCapitalized = isActivating ? 'Activate' : 'Suspend'

  const { mutateAsync: handleSuspendAccount } = useMutation(
    'changeStatusAccount',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: adminAccountQueries.getAll().queryKey,
        })

        queryClient.invalidateQueries({
          queryKey: adminAccountQueries.getDetail(id).queryKey,
        })

        setIsSuspendModalOpen(false)
        reset()
        toast.success(
          isActivating
            ? 'Account activated successfully'
            : 'Account suspended successfully'
        )
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'An error occurred')
      },
    }
  )

  const onSubmit = async (data: SuspendAccountSchema) => {
    if (!userToSuspend?.id) return

    await handleSuspendAccount({
      id: userToSuspend.id,
      isActive: !userToSuspend.isActive,
      reason: data.reason,
    })
  }

  return (
    <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isActivating ? (
              <UserCheck className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
            )}
            {actionTextCapitalized} Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionText} the account of{' '}
            <strong>{userToSuspend?.fullName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for {actionText} *</Label>
              <Input
                id="reason"
                placeholder={`Enter reason for ${actionText}...`}
                {...register('reason')}
                className={errors.reason ? 'border-red-500' : ''}
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSuspendModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isActivating ? 'default' : 'destructive'}
              className={isActivating ? 'bg-green-600 hover:bg-green-700' : ''}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : actionTextCapitalized}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
