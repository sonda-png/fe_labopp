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
} from 'lucide-react'
import { useState } from 'react'
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

  const { mutateAsync: createTestCaseFromFile, isPending: isUploading } =
    useMutation('createTestCaseFromFile', {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: problemQueries.getByAssignment(selectedLab?.id).queryKey,
        })
        toast.success('Test cases uploaded successfully')
      },
      onError: () => {
        toast.error('Failed to upload test cases')
      },
    })

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    console.log(files)
    console.log(files?.length)
    if (!files || !selectedLab) return

    const fileArray = Array.from(files) // tất cả file trong folder

    await createTestCaseFromFile({
      assignmentId: selectedLab.id,
      files: fileArray,
    })

    // reset input để chọn lại được folder khác
    event.target.value = ''
  }

  const handleConfirmUpload = async () => {
    if (!selectedLab || selectedFiles.length === 0) return

    try {
      // TODO: Implement file upload mutation for each file
      for (const file of selectedFiles) {
        console.log(`Processing file: ${file.name}`)
        // await createTestCaseFromFile({ assignmentId: selectedLab.id, file })
      }

      toast.success(`${selectedFiles.length} file(s) uploaded successfully`)
      setSelectedFiles([])
      setShowConfirmUpload(false)
      setShowUploadSection(false)
    } catch (error) {
      toast.error('Failed to upload test cases')
      console.error('Error uploading files:', error)
    }
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
                  <Upload className="w-4 h-4 text-blue-600" />
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
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
                    <FileText className="w-4 h-4 text-blue-600" />
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
