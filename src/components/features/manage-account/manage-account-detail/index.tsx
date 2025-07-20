import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { roleQueries } from '@/api/actions/roles/role.queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@/hooks'
import { convertLocalTime } from '@/utils/helpers/convertLocalTime'
import {
  User,
  Mail,
  Phone,
  Clock,
  Building,
  Shield,
  Activity,
  X,
} from 'lucide-react'

interface ManageAccountDetailProps {
  isDetailModalOpen: boolean
  setIsDetailModalOpen: (open: boolean) => void
  id?: string
}

export const ManageAccountDetail = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  id,
}: ManageAccountDetailProps) => {
  const { data: userDetail, isLoading } = useQuery({
    ...adminAccountQueries.getDetail(id),
    enabled: !!id && isDetailModalOpen,
  })

  const { data: rolesData } = useQuery({
    ...roleQueries.getAll(),
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'role_admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'role_head':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'role_student':
        return 'bg-green-500 hover:bg-green-600'
      case 'role_teacher':
        return 'bg-yellow-500 hover:bg-yellow-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusColor = (status: boolean) => {
    return status
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getStatusText = (status: boolean) => {
    return status ? 'Active' : 'Inactive'
  }

  if (isLoading) {
    return (
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-orange-500" />
            <span>User Account Details</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information for {userDetail?.fullName}
          </DialogDescription>
        </DialogHeader>

        {userDetail && (
          <div className="space-y-6">
            {/* Header Section với Avatar và thông tin cơ bản */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                      {userDetail.fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {userDetail.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ID: {userDetail.id}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        variant="outline"
                        className={getStatusColor(userDetail.isActive)}
                      >
                        <Activity className="mr-1 h-3 w-3" />
                        {getStatusText(userDetail.isActive)}
                      </Badge>

                      <Badge
                        className={getRoleColor(
                          rolesData?.find(
                            role => role.name === userDetail.roleName
                          )?.id || ''
                        )}
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {
                          rolesData?.find(
                            role => role.name === userDetail.roleName
                          )?.name
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-orange-500" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userDetail.email}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{userDetail.phone}</p>
                    </div>
                  </div>

                  {userDetail.department && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Department/Faculty
                          </p>
                          <p className="font-medium">{userDetail.department}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>System Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Activity</p>
                      <p className="font-medium">
                        {convertLocalTime(userDetail.lastActive)}
                      </p>
                    </div>
                  </div>

                  <Separator />
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-orange-500" />
                  <span>Additional Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Role</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {rolesData?.find(
                        role => role.name === userDetail.roleName
                      )?.name || 'Unknown'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Status</h4>
                    <p
                      className={`text-sm mt-1 ${userDetail.isActive ? 'text-green-600' : 'text-gray-600'}`}
                    >
                      {getStatusText(userDetail.isActive)}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">
                      Department/Faculty
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {userDetail.department || 'No information'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => setIsDetailModalOpen(false)}
            className="min-w-[100px]"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
