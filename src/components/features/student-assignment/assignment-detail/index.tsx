import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
} from 'lucide-react'
import { format } from 'date-fns'

interface AssignmentDetailProps {
  assignment: Assignment
  onBack: () => void
  onSubmit: () => void
  onDownload: () => void
}

export const AssignmentDetail = ({
  assignment,
  onBack,
  onSubmit,
  onDownload,
}: AssignmentDetailProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
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

              <Button variant="outline" onClick={onDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Files
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

          {/* Submission History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No submissions yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submit your first attempt
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
