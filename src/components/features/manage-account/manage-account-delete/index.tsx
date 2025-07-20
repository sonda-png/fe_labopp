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
            Delete Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete the account of{' '}
            {userToDelete?.fullName}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> This action cannot be undone. All data
              related to this account will be permanently deleted.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="delete-confirm">
              To confirm, please enter the user's name
            </Label>
            <Input id="delete-confirm" placeholder={userToDelete?.fullName} />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete Permanently</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
