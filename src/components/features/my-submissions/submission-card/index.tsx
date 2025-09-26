import { MySubmissions } from '@/api/actions/my-submissions/my-submissions.type'
import { statusConfig } from '../submission-status-config'
import {
  AlertTriangle,
  Calendar,
  Code,
  Download,
  Eye,
  MessageSquare,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
// import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { authStore } from '@/stores/authStore'
import axios from 'axios'
import { ENV } from '@/config/env'
// import { ReviewCodeResponse } from '@/api/actions/ai-manage/ai-manage.type'

// Submission Card Component
export const SubmissionCard = ({
  submission,
  onCardClick,
}: {
  submission: MySubmissions
  onCardClick: (submission: MySubmissions) => void
  onView: (fileUrl: string) => void
}) => {
  const navigate = useNavigate()
  const { authValues } = authStore()

  const handleDownload = async (submissionId: string) => {
    const res = await axios.get(
      `${ENV.BACK_END_URL}/assignment/download-submission/${submissionId}`,
      {
        responseType: 'blob',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/zip',
          Authorization: `Bearer ${authValues.token}`,
        },
      }
    )
    // Tạo blob từ dữ liệu ZIP
    const blob = new Blob([res.data as BlobPart], {
      type: 'application/zip',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `submission_${submissionId}.zip` // đặt tên file
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

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

  const handleNavigate = (submissionId: string) => {
    navigate({
      to: '/submit-result/$submissionId',
      params: { submissionId },
    })
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col"
      onClick={() => {
        onCardClick(submission)
      }}
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
              <span>Uploaded: {formatDate(submission.submittedAt)}</span>
            </div>

            {submission.locResult >= 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    LOC
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

          {/* Review Code Section - Only show for Draft status */}
          {submission.status === 'Draft' && (
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate({
                    to: '/my-submit/review/$submissionId/$assignmentId',
                    params: {
                      submissionId: String(submission.submissionId),
                      assignmentId: String(submission.assignmentId),
                    },
                  })
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Code with AI
              </Button>
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
              handleDownload(submission.submissionId as string)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            onClick={() => {
              handleNavigate(submission.submissionId)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
