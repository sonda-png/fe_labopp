import { ReactNode, useState } from 'react'
import { Search, GraduationCap, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@/hooks'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { ManageAccountOverview } from '@/components/features/manage-account'
import { ManageAccountTable } from '@/components/features/manage-account/manage-account-table'
import DebouncedInput from '@/components/common/debounce-input'
import { ManageAccountAudit } from '@/components/features/manage-account/manage-account-audit'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600">Quản lý tài khoản người dùng</p>
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
                placeholder="Tìm kiếm theo tên, email, MSSV..."
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vai trò" />
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
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
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
