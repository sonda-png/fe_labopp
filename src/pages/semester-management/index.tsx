import { useState } from 'react'
import {
  Calendar,
  Search,
  MoreHorizontal,
  CheckCircle,
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
import { useQuery, useMutation } from '@/hooks'
import { semestersQueries } from '@/api/actions/semesters/semesters.queries'
import { Semester } from '@/api/actions/semesters/semesters.types'
import { toast } from 'react-toastify'
import { OverviewSemesterClass } from '@/components/features/semester-class/overview-semester-class'

export const SemesterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [, setIsDetailModalOpen] = useState(false)
  const [, setSelectedSemester] = useState<Semester | null>(null)

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

  // Helper function to determine semester status
  const getSemesterStatus = (semester: Semester) => {
    const now = new Date()
    const startDate = new Date(semester.startDate)
    const endDate = new Date(semester.endDate)

    if (now < startDate) {
      return {
        status: 'upcoming',
        text: 'Upcoming',
      }
    } else if (now >= startDate && now <= endDate) {
      return {
        status: 'current',
        text: 'Current semester',
      }
    } else {
      return {
        status: 'completed',
        text: 'Completed',
      }
    }
  }

  // Filter
  const filteredSemesters = semesters.filter(semester => {
    const matchesSearch =
      semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      getSemesterStatus(semester).status === statusFilter

    return matchesSearch && matchesStatus
  })

  // ---------------- Pagination ----------------
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6 // số item trên 1 trang
  const totalPages = Math.ceil(filteredSemesters.length / pageSize)

  const currentSemesters = filteredSemesters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  // --------------------------------------------

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
          {currentSemesters.map(semester => (
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
                        <Badge variant="outline">
                          {getSemesterStatus(semester).text}
                        </Badge>
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

        {/* Pagination */}
        {filteredSemesters.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

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