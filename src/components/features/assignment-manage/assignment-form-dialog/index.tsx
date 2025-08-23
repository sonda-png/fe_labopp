import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AssignmentFormValues } from '@/schema/assignmentSchema'
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import {
  FileText,
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@/hooks'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'

interface AssignmentFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitButtonText: string
  isEditMode?: boolean
  editingAssignment?: any
  form: {
    register: UseFormRegister<AssignmentFormValues>
    handleSubmit: UseFormHandleSubmit<AssignmentFormValues>
    errors: FieldErrors<AssignmentFormValues>
    setValue: UseFormSetValue<AssignmentFormValues>
    watch: UseFormWatch<AssignmentFormValues>
    reset: () => void
  }
  onSuccess?: () => void
  onCancel: () => void
}

export const AssignmentFormDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  submitButtonText,
  isEditMode = false,
  editingAssignment,
  form,
  onSuccess,
  onCancel,
}: AssignmentFormDialogProps) => {
  const { authValues } = authStore()

  const { register, handleSubmit, errors, setValue, watch, reset } = form
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentAssignmentId, setCurrentAssignmentId] = useState<
    string | undefined
  >(editingAssignment?.id)

  const watchedValues = watch()

  const { data: accountData } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  // Mutations
  const { mutateAsync: addAssignmentMutation } = useMutation(
    'addAssignmentMutation',
    {
      onSuccess: () => {
        toast.success(
          'Assignment created successfully! Now you can upload the PDF file.'
        )
      },
      onError: (error: StandardizedApiError) => {
        console.log('onError addAssignmentMutation', error)
        toast.error(error.message || 'Error occurred while adding assignment', {
          toastId: 'add-error',
        })
      },
    }
  )

  const { mutateAsync: updateAssignmentMutation } = useMutation(
    'updateAssignmentMutation',
    {
      onSuccess: () => {
        toast.success('Assignment updated successfully')
      },
      onError: (error: StandardizedApiError) => {
        toast.error(
          error.message || 'Error occurred while updating assignment',
          {
            toastId: 'update-error',
          }
        )
      },
    }
  )

  const { mutateAsync: uploadAssignmentPdfMutation } = useMutation(
    'uploadAssignmentPdfMutation',
    {
      onSuccess: () => {
        toast.success(
          'Assignment updated successfully! Now you can upload the PDF file.'
        )
        // Close dialog and reset after successful upload
        onOpenChange(false)
        setCurrentStep(1)
        setSelectedPdfFile(null)
        setCurrentAssignmentId(undefined)
        reset()
        onSuccess?.()
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'Error occurred while upload pdf file', {
          toastId: 'upload-error',
        })
      },
    }
  )

  const handlePdfFileSelect = (event: any) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedPdfFile(file)
    } else if (file) {
      toast.error('Please select a PDF file')
      event.target.value = ''
    }
  }

  const handleRemovePdfFile = () => {
    setSelectedPdfFile(null)
    // Reset the file input
    const fileInput = document.getElementById('pdf-file') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleFormSubmit = async (data: AssignmentFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && editingAssignment) {
        // Edit mode
        await updateAssignmentMutation({ ...data, id: editingAssignment.id })
        // Set the current assignment ID for edit mode
        setCurrentAssignmentId(editingAssignment.id)
        setCurrentStep(2)
      } else {
        // Add mode
        const result = await addAssignmentMutation({
          ...data,
          id: `lab${Date.now()}`, // Generate temporary ID
        })

        if (typeof result === 'string') {
          // New assignment created, get the ID
          setCurrentAssignmentId(result)
          console.log('currentAssignmentId', result)
          setCurrentStep(2)
        } else {
          // Fallback to step 2
          setCurrentStep(2)
        }
      }
    } catch (e: unknown) {
      toast.error('Failed to save assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePdfUpload = async () => {
    if (!selectedPdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    try {
      // Determine which assignment ID to use
      const targetAssignmentId = isEditMode
        ? editingAssignment?.id
        : currentAssignmentId

      if (!targetAssignmentId) {
        toast.error('Assignment ID not found')
        return
      }

      await uploadAssignmentPdfMutation({
        file: selectedPdfFile,
        uploadBy: authValues.userId,
        assignmentId: targetAssignmentId,
      })
    } catch (error: unknown) {
      toast.error('Failed to upload PDF')
    }
  }

  const handleCancel = () => {
    setCurrentStep(1)
    setSelectedPdfFile(null)
    setCurrentAssignmentId(undefined)
    reset()
    onCancel()
  }

  const goToStep1 = () => {
    setCurrentStep(1)
  }

  const goToStep2 = () => {
    if (currentAssignmentId || (isEditMode && editingAssignment?.id)) {
      setCurrentStep(2)
    } else {
      toast.error('Please save the assignment first before uploading PDF')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === 1 ? (
              <>
                <span>{title}</span>
                <span className="text-sm text-gray-500">(Step 1/2)</span>
              </>
            ) : (
              <>
                <span>Upload Assignment PDF</span>
                <span className="text-sm text-gray-500">(Step 2/2)</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? description
              : `Upload PDF file for assignment: ${currentAssignmentId || editingAssignment?.id || 'Unknown'}`}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div
              className={`w-16 h-0.5 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= 2
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {currentStep === 2 ? (
                '2'
              ) : currentStep > 2 ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                '2'
              )}
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          // Step 1: Assignment Details Form
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter assignment title"
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter assignment description"
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="label">Total Lines of Code</Label>
                <Input
                  id="locTotal"
                  type="number"
                  {...register('locTotal', { valueAsNumber: true })}
                  placeholder="Enter total lines of code"
                />
                {errors.locTotal && (
                  <span className="text-red-500 text-xs">
                    {errors.locTotal.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Teacher</Label>
                <Select
                  value={watch('teacherId').toString() || ''}
                  onValueChange={(value: string) =>
                    setValue('teacherId', Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountData
                      ?.filter(account => account.roleName === 'Teacher')
                      .map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {account.fullName}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ({account.email})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.teacherId && (
                  <span className="text-red-500 text-xs">
                    {errors.teacherId.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watchedValues.status || 'Active'}
                  onValueChange={(value: 'Pending' | 'Active' | 'Inactive') =>
                    setValue('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <span className="text-red-500 text-xs">
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToStep2}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Go to PDF Upload
                </Button>
              )}
              <Button
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isSubmitting ? 'Saving...' : submitButtonText}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // Step 2: PDF Upload
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pdf-file">Assignment PDF File</Label>
              <div className="space-y-2">
                {!selectedPdfFile ? (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pdf-file" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Select PDF File
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="pdf-file"
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfFileSelect}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-500">
                      Only PDF files are allowed
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {selectedPdfFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedPdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePdfFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload a PDF file containing the assignment details,
                requirements, or instructions
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={goToStep1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
              <Button
                onClick={handlePdfUpload}
                disabled={!selectedPdfFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Upload PDF
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
