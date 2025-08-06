import { MySubmissions } from '@/api/actions/my-submissions/my-submissions.type'
import {
  AlertTriangle,
  Calendar,
  Code,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { statusConfig } from '../submission-status-config'

// Submission Detail Dialog Component
export const SubmissionDetailDialog = ({
  submission,
  isOpen,
  onClose,
  onDownload,
}: {
  submission: MySubmissions
  isOpen: boolean
  onClose: () => void
  onDownload: (fileUrl: string, fileName: string) => void
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submission Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about your submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              File Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  File name
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {submission.fileName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assignment ID
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {submission.assignmentId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Submission ID
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {submission.submissionId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  <Badge className={`${statusInfo.color} border`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Submission Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Submission Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-gray-600">Submission time:</span>
                <span className="ml-2 font-medium">
                  {formatDate(submission.submittedAt)}
                </span>
              </div>

              {submission.locResult > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Code className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-gray-600">Lines of Code:</span>
                    <span className="ml-2 font-medium">
                      {submission.locResult}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Edit Information */}
          {submission.manuallyEdited && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manual Edit
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center text-amber-800 mb-2">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="font-medium">
                      Submission has been manually edited
                    </span>
                  </div>
                  {submission.manualReason && (
                    <div className="text-sm text-amber-700">
                      <span className="font-medium">Reason:</span>{' '}
                      {submission.manualReason}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                onDownload(submission.fileUrl, submission.fileName)
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Download file
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(submission.fileUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View file
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
