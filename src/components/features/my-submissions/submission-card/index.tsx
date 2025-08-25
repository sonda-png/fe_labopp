import { MySubmissions } from '@/api/actions/my-submissions/my-submissions.type'
import { statusConfig } from '../submission-status-config'
import {
  AlertTriangle,
  Calendar,
  Code,
  Download,
  Eye,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
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
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { useQuery, useMutation } from '@/hooks'
import { useEffect, useState } from 'react'
import { authStore } from '@/stores/authStore'
import axios from 'axios'
import { ENV } from '@/config/env'
import { ReviewCodeResponse } from '@/api/actions/ai-manage/ai-manage.type'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

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
  const [reviewResult, setReviewResult] = useState<ReviewCodeResponse | null>(
    null
  )
  const [showReviewModal, setShowReviewModal] = useState(false)

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

  const reviewCodeMutation = useMutation('handleReviewCode', {
    onSuccess: (data: ReviewCodeResponse) => {
      setReviewResult(data)
      setShowReviewModal(true)
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const handleReviewCode = async () => {
    try {
      await reviewCodeMutation.mutateAsync({
        assignmentId: submission.assignmentId.toString(),
        submissionId: submission.submissionId.toString(),
      })
    } catch (error) {
      console.error('Error in review code:', error)
    }
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col"
      onClick={() => {
        if (showReviewModal) return
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
              <span>Submitted: {formatDate(submission.submittedAt)}</span>
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
                className="w-full"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleReviewCode()
                }}
                disabled={reviewCodeMutation.isPending}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {reviewCodeMutation.isPending
                  ? 'Reviewing...'
                  : 'Review Code with AI'}
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

      {/* Review Result Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <div>AI Code Review</div>
                <div className="text-sm font-normal text-gray-600 mt-1">
                  {submission.fileName} • Assignment ID:{' '}
                  {submission.assignmentId}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Comprehensive analysis of your code submission
            </DialogDescription>
          </DialogHeader>

          {reviewResult && (
            <div className="space-y-6 py-4">
              {/* Summary Section */}
              {reviewResult.summary && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Executive Summary
                    </h3>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {reviewResult.summary}
                  </p>
                </div>
              )}

              {/* Error Analysis */}
              {reviewResult.hasErrors && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-900">
                        Issues & Errors
                      </h3>
                    </div>
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      {reviewResult.errorCount}{' '}
                      {reviewResult.errorCount === 1 ? 'Issue' : 'Issues'} Found
                    </Badge>
                  </div>
                  {reviewResult.error && (
                    <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded">
                      <p className="text-red-800 font-medium">Error Details:</p>
                      <p className="text-red-700 mt-2">{reviewResult.error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Review */}
              {reviewResult.review && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Detailed Code Analysis
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                      {reviewResult.review}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Review completed at {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewModal(false)
                      setReviewResult(null)
                    }}
                  >
                    Close Review
                  </Button>
                  <Button
                    onClick={() => {
                      setShowReviewModal(false)
                      setReviewResult(null)
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Got it, thanks!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
