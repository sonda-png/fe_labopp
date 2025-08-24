import { useState } from 'react'
import {
  Calendar,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  FolderSync,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQuery, useMutation } from '@/hooks'
import { semestersQueries } from '@/api/actions/semesters/semesters.queries'
import { Semester } from '@/api/actions/semesters/semesters.types'
import { toast } from 'react-toastify'
import { OverviewSemesterClass } from '@/components/features/semester-class/overview-semester-class'

export const SemesterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  )

  const { data: semestersData, isLoading } = useQuery({
    ...semestersQueries.getAll(),
  })

  const { mutateAsync: syncFapMutation, isPending: isSyncing } = useMutation(
    'handleSyncFap',
    {
      onSuccess: data => {
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

  const semesters: Semester[] = semestersData || []

  // Helper function to determine semester status based on dates
  const getSemesterStatus = (semester: Semester) => {
    const now = new Date()
    const startDate = new Date(semester.startDate)
    const endDate = new Date(semester.endDate)

    if (now < startDate) {
      return {
        status: 'upcoming',
        color: 'bg-yellow-500 hover:bg-yellow-600',
        text: 'Upcoming',
        icon: <Clock className="h-4 w-4" />,
        isActive: false,
      }
    } else if (now >= startDate && now <= endDate) {
      return {
        status: 'current',
        color: 'bg-green-500 hover:bg-green-600',
        text: 'Current semester',
        icon: <Star className="h-4 w-4" />,
        isActive: true,
      }
    } else {
      return {
        status: 'completed',
        color: 'bg-blue-500 hover:bg-blue-600',
        text: 'Completed',
        icon: <CheckCircle className="h-4 w-4" />,
        isActive: false,
      }
    }
  }

  const filteredSemesters = semesters.filter(semester => {
    const matchesSearch =
      semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      getSemesterStatus(semester).status === statusFilter

    return matchesSearch && matchesStatus
  })

  const openDetailModal = (semester: Semester) => {
    setSelectedSemester(semester)
    setIsDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Semester Management
          </h1>
          <p className="text-gray-600">Manage semesters and classes</p>
        </div>
      </div>

      <div className="">
        <OverviewSemesterClass />

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search semester..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced filter
            </Button> */}
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

        {/* Semesters Grid */}
        <div className="grid gap-6">
          {filteredSemesters.map(semester => (
            <Card
              key={semester.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {semester.name}
                        </h3>
                        {(() => {
                          const status = getSemesterStatus(semester)
                          return (
                            <Badge
                              variant="outline"
                              className={`${
                                status.status === 'current'
                                  ? 'border-green-200 text-green-700'
                                  : status.status === 'upcoming'
                                    ? 'border-yellow-200 text-yellow-700'
                                    : 'border-blue-200 text-blue-700'
                              }`}
                            >
                              {status.text}
                            </Badge>
                          )
                        })()}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="text-gray-500">Start:</span>
                          <br />
                          <span className="font-medium">
                            {new Date(semester.startDate).toLocaleDateString(
                              'en-US'
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span>
                          <br />
                          <span className="font-medium">
                            {new Date(semester.endDate).toLocaleDateString(
                              'en-US'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openDetailModal(semester)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Semester details</DialogTitle>
              <DialogDescription>
                Detailed information about semester {selectedSemester?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedSemester && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedSemester.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {(() => {
                        const status = getSemesterStatus(selectedSemester)
                        return (
                          <Badge
                            variant="outline"
                            className={`${
                              status.status === 'current'
                                ? 'border-green-200 text-green-700'
                                : status.status === 'upcoming'
                                  ? 'border-yellow-200 text-yellow-700'
                                  : 'border-blue-200 text-blue-700'
                            }`}
                          >
                            {status.text}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Basic information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester code:</span>
                          <span className="font-medium">
                            {selectedSemester.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Semester name:</span>
                          <span className="font-medium">
                            {selectedSemester.name}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`font-medium ${
                              getSemesterStatus(selectedSemester).status ===
                              'current'
                                ? 'text-green-600'
                                : getSemesterStatus(selectedSemester).status ===
                                    'upcoming'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                            }`}
                          >
                            {getSemesterStatus(selectedSemester).text}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Time information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedSemester.startDate
                            ).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedSemester.endDate
                            ).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredSemesters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No semester found
              </h3>
              <p className="text-gray-600 mb-4">
                No semester found matching the search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              >
                Clear filter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
