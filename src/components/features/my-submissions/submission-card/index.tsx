import { MySubmissions } from "@/api/actions/my-submissions/my-submissions.type"
import { statusConfig } from "../submission-status-config"
import { AlertTriangle, Calendar, Code, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

// Submission Card Component
export const SubmissionCard = ({
  submission,
  onCardClick,
  onDownload,
  onView,
}: {
  submission: MySubmissions
  onCardClick: (submission: MySubmissions) => void
  onDownload: (fileUrl: string, fileName: string) => void
  onView: (fileUrl: string) => void
}) => {
  const statusInfo = statusConfig[
    submission.status as keyof typeof statusConfig
  ] || {
    label: submission.status,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertTriangle,
  }
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col"
      onClick={() => onCardClick(submission)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {submission.fileName}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Assignment ID: {submission.assignmentId}
            </CardDescription>
          </div>
          <Badge className={`${statusInfo.color} border`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Submission Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Submitted: {formatDate(submission.submittedAt)}</span>
            </div>

            {submission.locResult > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Lines of Code
                  </span>
                  <span className="font-medium">{submission.locResult}</span>
                </div>
              </div>
            )}
          </div>

          {/* Manual Edit Info */}
          {submission.manuallyEdited && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center text-amber-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Manually edited</span>
              </div>
              {submission.manualReason && (
                <p className="text-xs text-amber-700 mt-1">
                  Reason: {submission.manualReason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={e => {
              e.stopPropagation()
              onDownload(submission.fileUrl, submission.fileName)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            onClick={e => {
              e.stopPropagation()
              onView(submission.fileUrl)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
