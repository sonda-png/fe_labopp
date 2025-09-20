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
  X,
  Sparkles,
} from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { TestCaseArgs } from '@/api/actions/problem/problem.type'
import { SuggestTestCasesResponse } from '@/api/actions/ai-manage/ai-manage.type'

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
  const [showAIGenerate, setShowAIGenerate] = useState(false)
  const [showManualInput, setShowManualInput] = useState(true)
  const [aiGeneratedTestCases, setAiGeneratedTestCases] = useState<
    Array<{ input: string; expectedOutput: string }>
  >([])
  const [aiSuggestions, setAiSuggestions] = useState('')

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

  const { mutateAsync: generateTestCases, isPending: isGenerating } =
    useMutation('handleSuggestTestCases', {
      onSuccess: (data: SuggestTestCasesResponse) => {
        setAiGeneratedTestCases(data.testCases)
        setAiSuggestions(data.suggestions)
        toast.success('AI test cases generated successfully')
      },
      onError: () => {
        toast.error('Failed to generate AI test cases')
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

  const handleGenerateAITestCases = async () => {
    if (!selectedLab) {
      toast.error('No lab selected')
      return
    }

    try {
      await generateTestCases({
        assignmentId: Number(selectedLab.id),
      })
    } catch (error) {
      console.error('Error generating AI test cases:', error)
    }
  }

  const handleCancel = () => {
    reset()
    setShowUploadSection(false)
    setSelectedFiles([])
    setShowConfirmUpload(false)
    setUploadDescription('')
    setShowAIGenerate(false)
    setShowManualInput(true)
    setAiGeneratedTestCases([])
    setAiSuggestions('')
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-8xl max-h-[100vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Test Case</DialogTitle>
            <DialogDescription>
              Create test cases manually, upload from files, or generate with AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                type="button"
                variant={showManualInput ? 'default' : 'outline'}
                onClick={() => {
                  setShowManualInput(true)
                  setShowUploadSection(false)
                  setShowAIGenerate(false)
                }}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Manual Input
              </Button>

              <Button
                type="button"
                variant={showUploadSection ? 'default' : 'outline'}
                onClick={() => {
                  setShowUploadSection(true)
                  setShowManualInput(false)
                  setShowAIGenerate(false)
                }}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>

              <Button
                type="button"
                variant={showAIGenerate ? 'default' : 'outline'}
                onClick={() => {
                  setShowAIGenerate(true)
                  setShowUploadSection(false)
                  setShowManualInput(false)
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:text-white"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </Button>

              <div className="text-sm text-gray-500">
                Choose your preferred method to create test cases
              </div>
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

            {/* AI Generate Section */}
            {showAIGenerate && (
              <div className="border rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 flex flex-col h-[75vh]">
                {/* Header - Compact */}
                <div className="p-3 border-b border-orange-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <h4 className="font-medium text-orange-900">
                        Generate Test Cases with AI
                      </h4>
                    </div>
                    <Button
                      type="button"
                      onClick={handleGenerateAITestCases}
                      disabled={isGenerating}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGenerating ? 'Generating...' : 'Generate Test Cases'}
                    </Button>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    <strong>Assignment:</strong> {selectedLab?.title}
                  </div>
                </div>

                {/* Content Area - Maximized */}
                {(aiSuggestions || aiGeneratedTestCases.length > 0) && (
                  <div className="flex-1 flex min-h-0">
                    <div className="flex w-full h-full">
                      {/* AI Suggestions - Compact Sidebar */}
                      {aiSuggestions && (
                        <div className="w-80 flex-shrink-0 border-r border-orange-200">
                          <div className="p-3 h-full bg-white">
                            <h5 className="font-semibold text-orange-900 mb-2 text-sm flex items-center gap-2">
                              <Sparkles className="w-3 h-3" />
                              AI Suggestions
                            </h5>
                            <div className="text-xs text-gray-700 leading-relaxed overflow-y-auto h-full pr-2">
                              {aiSuggestions}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Generated Test Cases - Main Content - Maximized */}
                      {aiGeneratedTestCases.length > 0 && (
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="p-3 border-b border-orange-200 bg-orange-50 flex-shrink-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-orange-900 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Generated Test Cases (
                                {aiGeneratedTestCases.length})
                              </h5>
                              <div className="text-xs text-gray-500">
                                Scroll to view all test cases
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-6">
                              {aiGeneratedTestCases.map((testCase, index) => (
                                <div
                                  key={`test-case-${index}-${testCase.input.slice(0, 10)}`}
                                  className="bg-white rounded-lg border border-orange-200 shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                  {/* Test Case Header */}
                                  <div className="p-4 border-b border-orange-100 bg-orange-50">
                                    <div className="text-lg font-semibold text-orange-800 bg-orange-200 px-4 py-2 rounded-full inline-block">
                                      Test Case #{index + 1}
                                    </div>
                                  </div>

                                  {/* Test Case Content - Full Width with More Space */}
                                  <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                      {/* Input Section */}
                                      <div className="space-y-3">
                                        <div className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                                          <span className="w-3 h-3 bg-blue-500 rounded-full" />
                                          Input:
                                        </div>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-48 max-h-96 overflow-y-auto">
                                          <pre className="text-base text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                                            {testCase.input}
                                          </pre>
                                        </div>
                                      </div>

                                      {/* Expected Output Section */}
                                      <div className="space-y-3">
                                        <div className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                                          <span className="w-3 h-3 bg-green-500 rounded-full" />
                                          Expected Output:
                                        </div>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-48 max-h-96 overflow-y-auto">
                                          <pre className="text-base text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                                            {testCase.expectedOutput}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Form */}
            {showManualInput && (
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
