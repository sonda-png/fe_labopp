/* View Details Modal */
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  CheckCircle,
  Clock,
  Code,
  FileText,
  Tag,
  XCircle,
  Download,
} from 'lucide-react'
import { Assignment } from '@/api/actions/assignment-manage/assignment.types'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { useQuery } from '@/hooks'

interface AssignmentManageDetailProps {
  isViewDetailsOpen: boolean
  setIsViewDetailsOpen: (isOpen: boolean) => void
  assignmentData: Assignment | null
}

export const AssignmentManageDetail = ({
  isViewDetailsOpen,
  setIsViewDetailsOpen,
  assignmentData,
}: AssignmentManageDetailProps) => {
  const statusStyles = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-red-100 text-red-800',
  }

  const statusIcons = {
    Active: <CheckCircle className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Inactive: <XCircle className="w-3 h-3" />,
  }

  const { data: downloadPdfFileData, isLoading: isDownloading } = useQuery({
    ...assignmentQueries.downloadPdfFile(assignmentData?.id as string),
  })

  const handleDownloadPdf = () => {
    if (downloadPdfFileData) {
      const url = URL.createObjectURL(downloadPdfFileData)
      window.open(url, '_blank')
    }
  }

  return (
    <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Assignment Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the assignment
          </DialogDescription>
        </DialogHeader>

        {assignmentData && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">
                  {assignmentData.id.substring(0, 6).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {assignmentData.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {assignmentData.description}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Assignment ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {assignmentData.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[assignmentData.status]}`}
                    >
                      {statusIcons[assignmentData.status]}
                      {assignmentData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-600" />
                  Technical Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Lines of Code
                    </label>
                    <p className="text-sm text-gray-900 font-semibold">
                      {assignmentData.locTotal} LOC
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Teacher ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {assignmentData.teacherId || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                Additional Information
              </h3>

              {/* PDF Download Section */}
              {downloadPdfFileData ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Assignment PDF Available
                        </p>
                        <p className="text-xs text-green-600">
                          Click download to view the assignment file
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? 'Downloading...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        No PDF Available
                      </p>
                      <p className="text-xs text-gray-500">
                        This assignment doesn't have a PDF file uploaded yet
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* General Information */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  This assignment is part of the course curriculum and may
                  contain test cases, PDF instructions, and other supporting
                  materials.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsViewDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
