import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  User,
  Code,
  Calendar,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import CodeFileViewer from '@/components/features/code-viewer'
import { useSearch } from '@tanstack/react-router'
import { useQuery as useQueryTanstack } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/useApiClient/useApiClient'
import { teacherSubmissionQueries } from '@/api/actions/teacher-submit/teacher-submit.queries'
import {
  TeacherSubmissionData,
  SubmissionStatus,
} from '@/api/actions/teacher-submit/teacher-submit.type'
import TeacherGradeDetail from '@/components/features/teacher-grade/teacher-grade-grading'
import TeacherSubmissionDetail from '@/components/features/teacher-grade/teacher-grade-detail'
import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { useQuery } from '@/hooks'

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

export default function TeacherGradingSystem() {
  const { classId = '' } = useSearch({ from: '/_auth/teacher-grade/' })
  const { client } = useApiClient()

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>(
    'all'
  )

  const queryOptions = teacherSubmissionQueries.getWaiting(
    classId,
    statusFilter !== 'all' ? statusFilter : undefined
  )
  const { data, isLoading, refetch } = useQueryTanstack({
    ...queryOptions,
    queryFn: queryOptions.queryFn(client),
    enabled: !!classId,
  })

  const { data: assignmentsData } = useQuery({
    ...teacherAssignmentQueries.getAll(classId),
  })

  // API trả về { data: TeacherSubmissionData[] }
  const submissions: TeacherSubmissionData[] = Array.isArray(data) ? data : []

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] =
    useState<TeacherSubmissionData | null>(null)
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const openCodeViewer = (submission: TeacherSubmissionData) => {
    setSelectedSubmission(submission)
    setIsCodeViewerOpen(true)
  }

  const getAssignmentName = (assignmentId: string) => {
    const assignment = assignmentsData?.find(
      assignment => assignment.id === assignmentId
    )
    return assignment?.title || 'Unknown'
  }

  const filteredSubmissions = submissions.filter(
    (submission: TeacherSubmissionData) => {
      const matchesSearch =
        submission.studentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.assignmentCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      return matchesSearch
    }
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  console.log(filteredSubmissions)
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              List of submissions
            </h1>
            <p className="text-gray-600">
              Manage and grade student submissions
            </p>
          </div>
        </div>

        {/* Filters luôn hiển thị */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by student name, assignment code..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={val =>
                  setStatusFilter(val as SubmissionStatus | 'all')
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Drafted">Pending</SelectItem>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items per page selector */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredSubmissions.length} submissions
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
          </CardContent>
        </Card>

        {/* Submissions Table hoặc Empty State */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No submissions found
                </h3>
                <p className="text-gray-600">
                  Try changing the filter or search keyword.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Student
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Assignment
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Submission time
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        LOC
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Note
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSubmissions.map(
                      (submission: TeacherSubmissionData) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {submission.studentName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">
                                {getAssignmentName(submission.assignmentCode)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600 text-sm">
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleString('vi-VN')}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                            >
                              {submission.loc}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200"
                            >
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className="text-sm text-gray-600 max-w-32 truncate"
                              title={submission.comment}
                            >
                              {submission.comment || 'No comment'}
                            </span>
                          </td>
                          <td className="py-4 px-6 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCodeViewer(submission)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View Code
                            </Button>
                            <TeacherGradeDetail
                              submissionId={submission.id}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Grade
                                </Button>
                              }
                              onSuccess={refetch}
                            />
                            <TeacherSubmissionDetail
                              submissionId={submission.id}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Detail
                                </Button>
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredSubmissions.length}
              itemsPerPage={itemsPerPage}
              startItem={startIndex}
              endItem={Math.min(endIndex, filteredSubmissions.length)}
            />
          </CardContent>
        </Card>

        {/* Code Viewer Dialog */}
        <Dialog open={isCodeViewerOpen} onOpenChange={setIsCodeViewerOpen}>
          <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Viewer - {selectedSubmission?.studentName}
              </DialogTitle>
              <DialogDescription>
                Assignment: {selectedSubmission?.assignmentCode} | Submitted:{' '}
                {selectedSubmission
                  ? new Date(selectedSubmission.submittedAt).toLocaleString(
                      'vi-VN'
                    )
                  : ''}{' '}
                | LOC: {selectedSubmission?.loc} | Status:{' '}
                {selectedSubmission?.status}
              </DialogDescription>
            </DialogHeader>

            {selectedSubmission && (
              <div className="flex-1 overflow-y-auto">
                <CodeFileViewer
                  studentId={selectedSubmission.id}
                  submission={selectedSubmission}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
