import type React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileArchive, Upload, X, FileCode, Check } from 'lucide-react'
import { useMutation, useQuery } from '@/hooks'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { authStore } from '@/stores/authStore'
import { SubmitSubmissionResponse } from '@/api/actions/submissions/submissions.type'

export default function StudentSubmission() {
  const navigate = useNavigate()
  const { authValues } = authStore()
  const search = useSearch({ strict: false })

  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState('draft')
  const [comment, setComment] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: assignmentData } = useQuery({
    ...assignmentQueries.getById(search.assignmentId),
  })

  const { mutateAsync: submitAssignmentMutation } = useMutation(
    'handleSubmitSubmission',
    {
      onSuccess: () => {
        toast.success('Assignment submitted successfully')

        navigate({
          to: '/my-submit',
        })
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message)
      },
    }
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
      // await submitAssignmentMutation({
      //   assignmentId: search.assignmentId,
      //   zipFile: selectedFile,
      // })
    } else {
      setFile(null)
      setErrorMessage(
        'Only ZIP files are accepted. Please compress your files before uploading.'
      )
      setUploadStatus('error')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    await submitAssignmentMutation({
      problemId: search.assignmentId,
      studentId: authValues.userId,
      semesterId: 1,
      zipFile: file,
      status: submissionStatus === 'submit' ? 'Submit' : 'Draft',
    })
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-orange-500 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileCode size={24} />
          <h2 className="text-xl font-bold">Submit Assignment</h2>
        </div>
        <p>Summer2025 - LAB211 - SE1973</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Assignment</CardTitle>
              <CardDescription>
                Please submit your assignment in the required format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assignment Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Subject
                    </h3>
                    <p className="font-medium">LAB 02 - Java OOP</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Assignment Code
                    </h3>
                    <p className="font-medium">{search.assignmentId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Assignment Name
                    </h3>
                    <p className="font-medium">{assignmentData?.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Required LOC
                    </h3>
                    <p className="font-medium">{assignmentData?.locTotal}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created At
                    </h3>
                    <p className="font-medium">{assignmentData?.createdAt}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm mt-1">{assignmentData?.description}</p>
                </div>
              </div>

              <Separator />

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="submission-files">Submission File</Label>

                  {!file && (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mt-2 ${
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
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                          <FileArchive size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            Drag and drop ZIP file or click to select file
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Only ZIP files accepted, maximum 50MB
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
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
                    <div className="border rounded-lg p-4 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded">
                            <FileArchive size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {uploadStatus === 'uploading' && (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {uploadStatus === 'success' && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          <span>Upload successful</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <FileCode className="h-4 w-4" />
                    <span>
                      You can compress files using WinRAR, 7-Zip, or built-in
                      compression tools on your computer
                    </span>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <Label htmlFor="status">Status</Label>
                  <RadioGroup
                    value={submissionStatus}
                    onValueChange={setSubmissionStatus}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Draft</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="submit" id="submit" />
                      <Label htmlFor="submit">Submit</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment">Comment (optional)</Label>
                  <Input
                    id="comment"
                    placeholder="Enter comment for instructor..."
                    className="mt-1"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSubmit}>
                {submissionStatus === 'submit' ? 'Submit' : 'Save Draft'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Instructions Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Submission Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Prepare your files</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure your code has been tested and runs correctly before
                  submitting.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Compress files to ZIP</h3>
                <p className="text-sm text-muted-foreground">
                  Compress all necessary files into a single ZIP file.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Upload to system</h3>
                <p className="text-sm text-muted-foreground">
                  Upload the ZIP file to the system by dragging and dropping or
                  selecting the file.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Choose status</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Draft:</strong> Save your submission but don't send it
                  to the instructor yet.
                  <br />
                  <strong>Submit:</strong> Send your submission officially to
                  the instructor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
