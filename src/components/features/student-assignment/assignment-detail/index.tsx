import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  FileArchive,
  X,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'
import { useQuery, useMutation } from '@/hooks'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { studentSemesterQueries } from '@/api/actions/student-semester/student-semester.queries'
import axios from 'axios'
import { ENV } from '@/config/env'

interface AssignmentDetailProps {
  assignment: Assignment
  onBack: () => void
}

export const AssignmentDetail = ({
  assignment,
  onBack,
}: AssignmentDetailProps) => {
  const navigate = useNavigate()
  const { assignmentId } = useParams({
    from: '/_auth/student-assignment/$assignmentId/',
  })
  const { authValues } = authStore()

  // File submission state
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState('draft')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: downloadPdfFileData, isLoading: isDownloading } = useQuery({
    ...assignmentQueries.downloadPdfFile(assignmentId as string),
  })

  const { data: currentSemester } = useQuery({
    ...studentSemesterQueries.getCurrentSemester(),
  })

  const { mutateAsync: submitAssignmentMutation, isPending: isSubmitting } =
    useMutation('handleSubmitSubmission', {
      onSuccess: () => {
        toast.success('Assignment submitted successfully')
        setFile(null)
        setUploadStatus('success')
        setSubmissionStatus('draft')
        navigate({
          to: '/my-submit',
          params: {
            assignmentId: assignmentId as string,
          },
        })
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message)
        setUploadStatus('error')
      },
    })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const handleDownloadPdf = async () => {
    const res = await axios.get(
      `${ENV.BACK_END_URL}/assignment/download-pdf/by-assignment/${assignmentId}`,
      {
        responseType: 'blob',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/pdf',
          Authorization: `Bearer ${authValues.token}`,
        },
      }
    )
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${assignment.title.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // File handling functions
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileSelection = async (selectedFile: File) => {
    if (
      selectedFile &&
      (selectedFile.type === 'application/zip' ||
        selectedFile.type === 'application/x-zip-compressed' ||
        selectedFile.type === 'application/x-rar-compressed')
    ) {
      setFile(selectedFile)
      setErrorMessage('')
      setUploadStatus('idle')
    } else {
      setFile(null)
      setErrorMessage(
        'Only ZIP files are accepted. Please compress your files before uploading.'
      )
      setUploadStatus('error')
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadStatus('idle')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage('Please select a file to submit.')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      await submitAssignmentMutation({
        problemId: assignmentId as string,
        studentId: authValues.userId,
        semesterId: currentSemester?.id ?? 0,
        zipFile: file,
        status: submissionStatus === 'submit' ? 'Submit' : 'Draft',
      })

      setUploadProgress(100)
      clearInterval(progressInterval)
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus('error')
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
          {/* File Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="submission-files">Submission File</Label>

                {!file && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mt-2 ${
                      isDragging
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                        <FileArchive size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          Drag and drop ZIP file or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Only ZIP files accepted
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>
                )}

                {errorMessage && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {file && (
                  <div className="border rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-orange-100 text-orange-600 rounded">
                          <FileArchive size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {uploadStatus === 'uploading' && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-1" />
                      </div>
                    )}

                    {uploadStatus === 'success' && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                        <Check className="h-3 w-3" />
                        <span>Upload successful</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Selection */}
              <div>
                <Label htmlFor="status">Status</Label>
                <RadioGroup
                  value={submissionStatus}
                  onValueChange={setSubmissionStatus}
                  className="flex gap-3 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draft" id="draft" />
                    <Label htmlFor="draft" className="text-sm">
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="submit" id="submit" />
                    <Label htmlFor="submit" className="text-sm">
                      Submit
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {submissionStatus === 'submit'
                      ? 'Submitting...'
                      : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {submissionStatus === 'submit'
                      ? 'Submit Assignment'
                      : 'Save Draft'}
                  </>
                )}
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
