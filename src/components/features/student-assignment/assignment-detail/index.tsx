import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Assignment } from '@/api/actions/assignment/assignment.type'
import {
  FileText,
  Calendar,
  Code,
  ArrowLeft,
  Download,
  Upload,
  Clock,
  BookOpen,
  FileDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { useQuery } from '@/hooks'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { useParams } from '@tanstack/react-router'

interface AssignmentDetailProps {
  assignment: Assignment
  onBack: () => void
  onSubmit: () => void
}

export const AssignmentDetail = ({
  assignment,
  onBack,
  onSubmit,
}: AssignmentDetailProps) => {
  const { assignmentId } = useParams({
    from: '/_auth/student-assignment/$assignmentId/',
  })
  const { data: downloadPdfFileData, isLoading: isDownloading } = useQuery({
    ...assignmentQueries.downloadPdfFile(assignmentId as string),
  })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const handleDownloadPdf = () => {
    if (downloadPdfFileData) {
      // Create a blob from the PDF data and download it
      const blob = new Blob([downloadPdfFileData], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${assignment.title.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {assignment.title}
            </h1>
            <p className="text-gray-600 text-lg">{assignment.description}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            Assignment
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 font-medium">
                    {formatDate(assignment.createdAt)}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Code className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Lines of Code:</span>
                  <span className="ml-2 font-medium">
                    {assignment.locTotal}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {assignment.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Download Materials - MOVED HERE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDown className="h-5 w-5 mr-2" />
                Download Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Assignment PDF
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download detailed requirements and instructions
                </p>
                <Button
                  onClick={handleDownloadPdf}
                  disabled={!downloadPdfFileData || isDownloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>

              {!downloadPdfFileData && !isDownloading && (
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    No materials available for download
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">
                    Complete all required functions according to the
                    specifications
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">
                    Ensure your code follows the coding standards
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">
                    Test your implementation thoroughly
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">Submit before the deadline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={onSubmit}
                className="w-full bg-orange-500 hover:bg-green-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            </CardContent>
          </Card>

          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Open
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium">Lab Assignment</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <span className="text-sm font-medium">Medium</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="text-sm font-medium">2-3 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
