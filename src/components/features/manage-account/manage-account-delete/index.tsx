import { AdminAccountResponse } from '@/api/actions/admin-account/admin-account.type'
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
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface ManageAccountDeleteProps {
  userToDelete: AdminAccountResponse | null
}

/* Delete User Account Modal */
export const ManageAccountDelete = ({
  userToDelete,
}: ManageAccountDeleteProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Xóa tài khoản
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của{' '}
            {userToDelete?.fullName}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất
              cả dữ liệu liên quan đến tài khoản này sẽ bị xóa vĩnh viễn.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="delete-confirm">
              Để xác nhận, vui lòng nhập tên người dùng
            </Label>
            <Input id="delete-confirm" placeholder={userToDelete?.fullName} />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Hủy
          </Button>
          <Button variant="destructive">Xóa vĩnh viễn</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
