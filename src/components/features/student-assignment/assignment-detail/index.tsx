import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ReactMarkdown from 'react-markdown'
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
  TestTube,
  AlertCircle,
  Info,
} from 'lucide-react'
import { format } from 'date-fns'
import { useQuery, useMutation } from '@/hooks'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import {
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from 'react'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { studentSemesterQueries } from '@/api/actions/student-semester/student-semester.queries'
import axios from 'axios'
import { ENV } from '@/config/env'
import { SuggestTestCasesResponse } from '@/api/actions/ai-manage/ai-manage.type'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const canSubmit =
    useSearch({
      from: '/_auth/student-assignment/$assignmentId/',
    })?.canSubmit ?? false

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

  // AI Test Cases state
  const [testCasesResult, setTestCasesResult] =
    useState<SuggestTestCasesResponse | null>(null)
  const [showTestCasesModal, setShowTestCasesModal] = useState(false)

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

  // (AI suggest test cases mutation temporarily disabled)

  // PDF preview state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setShowPdfViewer(true)
      setIsPdfLoading(true)
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
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl)
      }
      setPdfUrl(url)
    } catch (error) {
      toast.error('Failed to load PDF')
      setShowPdfViewer(false)
    } finally {
      setIsPdfLoading(false)
    }
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
        semesterId: currentSemester?.data?.id ?? 0,
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
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Assignment PDF
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  View detailed requirements and instructions
                </p>
                <Button
                  onClick={handleDownloadPdf}
                  disabled={!downloadPdfFileData || isDownloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      View PDF
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

          {/* AI Tools Section */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                AI-Powered Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TestTube className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                  AI Test Case Generator
                </h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Get intelligent test case suggestions powered by AI to help
                  you validate your assignment implementation
                </p>
                <Button
                  onClick={handleSuggestTestCases}
                  disabled={isSuggestingTestCases}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSuggestingTestCases ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Test Cases...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Generate Test Cases
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-center space-x-2 text-orange-700">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    AI tools help you write better code and test more thoroughly
                  </span>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar */}
        <div className={'space-y-6'}>
          {/* File Submission Form */}
          <Card className={`${canSubmit ? 'block' : 'hidden'}`}>
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
          <Card className={`${canSubmit ? '' : '!mt-0'}`}>
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
      </div>

      {/* AI Test Cases Modal */}
      <Dialog open={showTestCasesModal} onOpenChange={setShowTestCasesModal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <TestTube className="h-8 w-8 text-white" />
              </div>
              <div>
                <div>AI Test Cases Suggestion</div>
                <div className="text-sm font-normal text-gray-600 mt-1">
                  {assignment.title} • Assignment ID: {assignmentId}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Intelligent test case recommendations for your assignment
            </DialogDescription>
          </DialogHeader>

          {testCasesResult && (
            <div className="space-y-6 py-4">
              {/* Test Cases */}
              {testCasesResult.testCases &&
                testCasesResult.testCases.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TestTube className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-orange-900">
                        Suggested Test Cases ({testCasesResult.testCases.length}
                        )
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {testCasesResult.testCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-orange-800">
                              Test Case #{index + 1}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs border-orange-200 text-orange-700"
                            >
                              Case {index + 1}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Input
                              </label>
                              <div className="bg-gray-50 rounded p-3 border border-orange-100">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                                  {testCase.input}
                                </pre>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Expected Output
                              </label>
                              <div className="bg-gray-50 rounded p-3 border border-orange-100">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                                  {testCase.expectedOutput}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Suggestions */}
              {testCasesResult.suggestions && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      AI Suggestions
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{testCasesResult.suggestions}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Error Details */}
              {testCasesResult.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-900">
                      Error Details
                    </h3>
                  </div>
                  <p className="text-red-700 text-sm bg-red-100 p-3 rounded border-l-4 border-red-400">
                    {testCasesResult.error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Test cases generated at {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTestCasesModal(false)
                      setTestCasesResult(null)
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowTestCasesModal(false)
                      setTestCasesResult(null)
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
      {/* PDF Viewer Modal */}
      <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
        <DialogContent className="max-w-9xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            
            <DialogDescription className="px-0 hidden">
              PDF Viewer
            </DialogDescription>
          </DialogHeader>
          <div className="h-[calc(90vh-72px)]">
            {isPdfLoading && (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700 mr-2"></div>
                Loading PDF...
              </div>
            )}
            {!isPdfLoading && pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                className="border-0"
                title="Assignment PDF"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
