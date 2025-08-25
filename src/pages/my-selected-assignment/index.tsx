'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Calendar,
  Code,
  Eye,
  X,
  FileText,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { studentAssignmentQueries } from '@/api/actions/student-assignment/student-assignment.queries'
import { StudentLabAssignment } from '@/api/actions/student-assignment/student-assignment.type'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { useApiClient } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startItem,
  endItem,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
  startItem: number
  endItem: number
}) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mx-6 mb-6">
      <div className="text-sm text-gray-700">
        Showing {startItem + 1} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const SelectedAssignments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [removedIds, setRemovedIds] = useState<number[]>([])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Lấy data thật từ API
  const {
    data: selectedAssignments = [],
    isLoading,
    error,
  } = useQuery({
    ...studentAssignmentQueries.getAll(),
  })

  const navigate = useNavigate()
  const { client } = useApiClient()
  const queryClient = useQueryClient()

  // Xử lý xóa assignment khỏi danh sách hiển thị (chỉ local, không gọi API xóa)
  const handleRemoveAssignment = (id: number) => {
    setRemovedIds(prev => [...prev, id])
  }

  // Lọc assignment đã bị xóa
  const visibleAssignments = selectedAssignments.filter(
    (assignment: StudentLabAssignment) => !removedIds.includes(assignment.id)
  )

  // Lọc theo search
  const filteredAssignments = visibleAssignments.filter(
    assignment =>
      assignment.assignmentId.toString().includes(searchTerm.toLowerCase()) ||
      assignment.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAssignments = filteredAssignments.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Xử lý xóa assignment (gọi API xóa + refetch)
  const handleUnselect = async (assignment: StudentLabAssignment) => {
    try {
      const { queryKey, queryFn } = studentAssignmentQueries.delete(
        assignment.assignmentId,
        {
          assignmentId: assignment.assignmentId,
          semesterId: assignment.semesterId,
        }
      )
      await queryClient.fetchQuery({
        queryKey,
        queryFn: ctx => queryFn(client)(ctx),
      })
      toast.success('Unselected successfully')
      handleRemoveAssignment(assignment.id)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to unselect assignment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selected Assignments
        </h2>
        <p className="text-gray-600">Manage your selected lab assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Selected Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {visibleAssignments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Lines of Code
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* Nếu có trường linesOfCode thì cộng lại, nếu không thì để 0 */}
                  {visibleAssignments.reduce((sum, assignment) => sum + 0, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ready for Submission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {visibleAssignments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by assignmentId or status..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Created date
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Descending
          </Button>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex items-center justify-between mb-4 px-6">
        <p className="text-sm text-gray-600">
          Showing {filteredAssignments.length} of {visibleAssignments.length}{' '}
          selected assignments
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={value => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="px-6 pb-6">
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading assignments...
              </h3>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading assignments
              </h3>
              <p className="text-gray-500">{String(error)}</p>
            </div>
          </Card>
        ) : filteredAssignments.length > 0 ? (
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">
                Selected assignments list
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {paginatedAssignments.map(assignment => (
                  <div
                    key={assignment.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {assignment.assignmentName}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Submitted: {assignment.submittedAt}</span>
                        </div>
                        <div className="flex items-center">
                          <Code className="w-4 h-4 mr-2" />
                          <span>Semester: {assignment.semesterId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() =>
                          navigate({
                            to: `/student-assignment/${assignment.assignmentId}?canSubmit=true`,
                          })
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 md:flex-none"
                        onClick={() => handleUnselect(assignment)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Unselected
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredAssignments.length}
                itemsPerPage={itemsPerPage}
                startItem={startIndex}
                endItem={Math.min(endIndex, filteredAssignments.length)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No assignments selected
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'No assignments match your search criteria.'
                    : "You haven't selected any assignments yet."}
                </p>
              </div>
              {!searchTerm && (
                <Button className="mt-4">Browse Assignments</Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SelectedAssignments
