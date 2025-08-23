import { useState } from 'react'
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
import { Search, User, Code, Calendar, FileText, Eye } from 'lucide-react'
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
                    {filteredSubmissions.map(
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
