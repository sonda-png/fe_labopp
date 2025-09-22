import { ReactNode, useState } from 'react'
import { Search, GraduationCap, Plus, FolderSync } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation, useQuery } from '@/hooks'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { ManageAccountOverview } from '@/components/features/manage-account'
import { ManageAccountTable } from '@/components/features/manage-account/manage-account-table'
import DebouncedInput from '@/components/common/debounce-input'
import { ManageAccountAudit } from '@/components/features/manage-account/manage-account-audit'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { semestersQueries } from '@/api/actions/semesters/semesters.queries'
import { toast } from 'react-toastify'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'

export const ManageAccountPage = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  )
  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })
  const queryClient = useQueryClient()
  const { mutateAsync: syncFapMutation, isPending: isSyncing } = useMutation(
    'handleSyncFap',
    {
      onSuccess: data => {
        queryClient.invalidateQueries({
          queryKey: semestersQueries.getAll().queryKey,
        })
        queryClient.invalidateQueries({
          queryKey: adminAccountQueries.getAll().queryKey,
        })
        toast.success(data.message || 'Sync FAP completed successfully')
      },
      onError: error => {
        toast.error('Failed to sync FAP. Please try again.')
        console.error('Sync FAP error:', error)
      },
    }
  )

  const handleSyncFap = async () => {
    await syncFapMutation(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Management
          </h1>
          <p className="text-gray-600">Manage user accounts</p>
        </div>
      </div>
      <div>
        {/* Overview */}
        <ManageAccountOverview />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

              <DebouncedInput
                value={searchTerm}
                onChange={setSearchTerm}
                delay={3000}
                placeholder="Search by name, email, student ID..."
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {rolesData?.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSyncFap}
              disabled={isSyncing}
            >
              <FolderSync
                className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
              />
              {isSyncing ? 'Syncing...' : 'Sync FAP'}
            </Button>
          </div>
        </div>
        <ManageAccountAudit
          auditMode="create"
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
        />
        <ManageAccountTable
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  )
}
