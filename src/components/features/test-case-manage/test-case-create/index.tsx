import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Assignment } from '@/api/actions/assignment-manage/assignment.types'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useMutation } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { problemQueries } from '@/api/actions/problem/problem.queries'
import {
  Download,
  Upload,
  FileText,
  AlertCircle,
  Eye,
  EyeClosed,
  X,
} from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { TestCaseArgs } from '@/api/actions/problem/problem.type'

interface TestCaseFormData {
  input: string
  expectedOutput: string
}

interface TestCaseCreateProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedLab: Assignment | null
}

export const TestCaseCreate = ({
  isOpen,
  onOpenChange,
  selectedLab,
}: TestCaseCreateProps) => {
  const queryClient = useQueryClient()
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showConfirmUpload, setShowConfirmUpload] = useState(false)
  const [uploadDescription, setUploadDescription] = useState('')

  const { mutateAsync: createTestCase, isPending: isCreating } = useMutation(
    'createTestCase',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: problemQueries.getByAssignment(selectedLab?.id).queryKey,
        })
        toast.success('Test case added successfully')
        reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to add test case')
      },
    }
  )

  const { mutateAsync: createTestCaseFromFile } = useMutation(
    'createTestCaseFromFile',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: problemQueries.getByAssignment(selectedLab?.id).queryKey,
        })
        toast.success('Test cases uploaded successfully')
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to upload test cases')
      },
    }
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TestCaseFormData>({
    defaultValues: {
      input: '',
      expectedOutput: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: TestCaseFormData) => {
    if (!selectedLab) {
      toast.error('No lab selected')
      return
    }

    const testCases: TestCaseArgs[] = [
      {
        input: data.input,
        expectedOutput: data.expectedOutput,
        loc: 0,
      },
    ]

    try {
      await createTestCase({
        assignmentId: selectedLab.id,
        title: `Test Case - ${selectedLab.title} - ${Date.now()}`, // Generate a title
        testCases: testCases,
      })
    } catch (error) {
      console.error('Error creating test case:', error)
    }
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !selectedLab) return

    const fileArray = Array.from(files) as File[] // tất cả file trong folder

    // Store selected files instead of calling API immediately
    setSelectedFiles(fileArray)

    // reset input để chọn lại được folder khác
    event.target.value = ''
  }

  const handleConfirmUpload = async () => {
    if (
      !selectedLab ||
      selectedFiles.length === 0 ||
      !uploadDescription.trim()
    ) {
      toast.error('Please select files and enter a description')
      return
    }

    await createTestCaseFromFile({
      assignmentId: selectedLab.id,
      description: uploadDescription.trim(),
      files: selectedFiles,
    })

    setSelectedFiles([])
    setShowConfirmUpload(false)
    setShowUploadSection(false)
    setUploadDescription('')
  }

  const downloadSampleFile = (type: 'input' | 'output') => {
    const fileName = type === 'input' ? 'input.txt' : 'output.txt'
    const link = document.createElement('a')
    link.href = `sample-test-case/${fileName}` // vì file trong public
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCancel = () => {
    reset()
    setShowUploadSection(false)
    setSelectedFiles([])
    setShowConfirmUpload(false)
    setUploadDescription('')
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Test Case</DialogTitle>
            <DialogDescription>
              Enter information for the new test case or upload from files
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Section Toggle */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={showUploadSection ? 'default' : 'outline'}
                onClick={() => setShowUploadSection(!showUploadSection)}
                className="flex items-center gap-2"
              >
                {showUploadSection ? (
                  <>
                    <EyeClosed className="w-4 h-4" />
                    Hide Upload
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Upload
                  </>
                )}
              </Button>

              {!showUploadSection && (
                <div className="text-sm text-gray-500">
                  Or upload test cases from files
                </div>
              )}
            </div>

            {/* Upload Section */}
            {showUploadSection && (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-orange-600" />
                  <h4 className="font-medium">Upload Test Cases from Files</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <FileText className="w-4 h-4 mr-2" />
                          Select Files
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".txt,.csv"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Description Field for File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="upload-description">Description *</Label>
                    <Textarea
                      id="upload-description"
                      placeholder="Enter description for the uploaded test cases"
                      value={uploadDescription}
                      onChange={e => setUploadDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-500">
                      Provide a description to identify these test cases
                    </p>
                  </div>

                  {/* Selected Files Display */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Selected Files ({selectedFiles.length}):
                      </Label>
                      <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newFiles = selectedFiles.filter(
                                  (_, i) => i !== index
                                )
                                setSelectedFiles(newFiles)
                              }}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Click the X button to remove individual files
                      </p>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <p>Supported formats: .txt</p>
                    <p>
                      Please submit <strong>both</strong> files:{' '}
                      <code>input.txt</code> and <code>output.txt</code> to
                      upload.
                    </p>
                    <p>File format for each line: input|expectedOutput|loc</p>
                  </div>

                  {/* Download Sample Files */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Download Sample Files:
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSampleFile('input')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" />
                        input.txt
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSampleFile('output')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" />
                        output.txt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Form */}
            {!showUploadSection && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="input">Input *</Label>
                    <Textarea
                      id="input"
                      placeholder="Enter test case input"
                      {...register('input', {
                        required: 'Input is required',
                        minLength: {
                          value: 1,
                          message: 'Input cannot be empty',
                        },
                      })}
                      className={errors.input ? 'border-red-500' : ''}
                    />
                    {errors.input && (
                      <p className="text-sm text-red-500">
                        {errors.input.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedOutput">Expected Output *</Label>
                    <Textarea
                      id="expectedOutput"
                      placeholder="Enter expected output"
                      {...register('expectedOutput', {
                        required: 'Expected output is required',
                        minLength: {
                          value: 1,
                          message: 'Expected output cannot be empty',
                        },
                      })}
                      className={errors.expectedOutput ? 'border-red-500' : ''}
                    />
                    {errors.expectedOutput && (
                      <p className="text-sm text-red-500">
                        {errors.expectedOutput.message}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isValid || isCreating}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white"
                  >
                    {isCreating ? 'Adding...' : 'Add Test Case'}
                  </Button>
                </DialogFooter>
              </form>
            )}

            {/* Upload Section Footer */}
            {showUploadSection && (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmUpload}
                  disabled={!uploadDescription.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                >
                  Upload Files
                </Button>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Confirmation Dialog */}
      <Dialog open={showConfirmUpload} onOpenChange={setShowConfirmUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Confirm Upload
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to upload these files?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Files to upload:</strong>
              </p>
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span className="font-mono text-xs">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmUpload(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUpload}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
