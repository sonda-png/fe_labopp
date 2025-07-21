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
import CodeFileViewer, { CodeFile } from '@/components/features/code-viewer'
import { useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '@/hooks/useApiClient/useApiClient'
import { teacherSubmissionQueries } from '@/api/actions/teacher-submit/teacher-submit.queries'
import {
  TeacherSubmissionData,
  SubmissionStatus,
} from '@/api/actions/teacher-submit/teacher-submit.type'
import TeacherGradeDetail from '@/components/features/teacher-grade/teacher-grade-grading'
import TeacherSubmissionDetail from '@/components/features/teacher-grade/teacher-grade-detail'

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
  const { data, isLoading, refetch } = useQuery({
    ...queryOptions,
    queryFn: queryOptions.queryFn(client),
    enabled: !!classId,
  })

  // API trả về { data: TeacherSubmissionData[] }
  const submissions: TeacherSubmissionData[] = Array.isArray(data) ? data : []

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] =
    useState<TeacherSubmissionData | null>(null)
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false)

  // Sample code files - Replace with actual API call
  const generateSampleFiles = (
    submission: TeacherSubmissionData
  ): CodeFile[] => {
    return [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: '2',
            name: 'Main.java',
            type: 'file',
            extension: 'java',
            content: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        
        // Student: ${submission.studentName}
        // Assignment: ${submission.assignmentCode}
        
        // Calculate fibonacci numbers
        int n = 10;
        for (int i = 0; i < n; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
          },
          {
            id: '3',
            name: 'Utils.java',
            type: 'file',
            extension: 'java',
            content: `public class Utils {
    public static boolean isPrime(int num) {
        if (num <= 1) return false;
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) return false;
        }
        return true;
    }
    
    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}`,
          },
        ],
      },
      {
        id: '4',
        name: 'README.md',
        type: 'file',
        extension: 'md',
        content: `# ${submission.assignmentCode} Solution

## Author: ${submission.studentName}

### Implementation Details
- Implemented fibonacci calculation using recursion
- Added utility functions for mathematical operations
- Total LOC: ${submission.loc}
- Status: ${submission.status}

### How to run
\`\`\`bash
javac src/*.java
java -cp src Main
\`\`\`

### Comments
${submission.comment || 'No comments provided'}`,
      },
    ]
  }

  const openCodeViewer = (submission: TeacherSubmissionData) => {
    setSelectedSubmission(submission)
    setIsCodeViewerOpen(true)
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách bài nộp
            </h1>
            <p className="text-gray-600">
              Quản lý và chấm điểm các bài nộp của sinh viên
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
                    placeholder="Tìm kiếm theo tên sinh viên, mã bài tập..."
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
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Drafted">Chờ chấm</SelectItem>
                  <SelectItem value="Passed">Đạt</SelectItem>
                  <SelectItem value="Rejected">Không đạt</SelectItem>
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
                  Không tìm thấy bài nộp nào
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Sinh viên
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Bài tập
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Thời gian nộp
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        LOC
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Trạng thái
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Ghi chú
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">
                        Chấm bài
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
                                {submission.assignmentCode}
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
                              {submission.comment || 'Không có ghi chú'}
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
                              Xem Code
                            </Button>
                            <TeacherGradeDetail
                              submissionId={submission.id}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Chấm bài
                                </Button>
                              }
                              onSuccess={refetch}
                            />
                            <TeacherSubmissionDetail
                              submissionId={submission.id}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Chi tiết
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
                  files={generateSampleFiles(selectedSubmission)}
                  showGradingPanel={true}
                  currentStatus={
                    selectedSubmission.status === 'Passed'
                      ? 'passed'
                      : selectedSubmission.status === 'Rejected'
                        ? 'not_passed'
                        : 'pending'
                  }
                  onStatusChange={status =>
                    console.log('Status changed:', status)
                  }
                  onSubmitGrade={(status, feedback) => {
                    console.log('Grade submitted:', { status, feedback })
                    // TODO: Implement grade submission API call
                    // You can integrate with TeacherGradeDetail component's logic here
                  }}
                  comments={[
                    // Sample comments - replace with API data
                    {
                      id: '1',
                      author: 'Teacher',
                      content:
                        selectedSubmission.comment || 'No previous comments',
                      timestamp: new Date().toISOString(),
                      fileName: 'Main.java',
                    },
                  ]}
                  onAddComment={comment => {
                    console.log('Comment added:', comment)
                    // TODO: Implement add comment API call
                  }}
                  testResults={[
                    {
                      id: '1',
                      name: 'Test Case 1: Basic functionality',
                      status:
                        selectedSubmission.status === 'Passed'
                          ? 'passed'
                          : 'failed',
                      output:
                        selectedSubmission.status === 'Passed'
                          ? 'All assertions passed'
                          : undefined,
                      error:
                        selectedSubmission.status === 'Rejected'
                          ? 'Some test cases failed'
                          : undefined,
                    },
                    {
                      id: '2',
                      name: 'Test Case 2: Edge cases',
                      status: 'passed',
                      output: 'Edge case tests completed successfully',
                    },
                  ]}
                  onRunTests={() => {
                    console.log(
                      'Running tests for submission:',
                      selectedSubmission.id
                    )
                    // TODO: Implement test runner API call
                  }}
                  isRunningTests={false}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
