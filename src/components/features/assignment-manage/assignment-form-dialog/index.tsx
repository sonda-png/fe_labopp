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
import { FileText, Upload, X, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@/hooks'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { authStore } from '@/stores/authStore'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { useQueryClient } from '@tanstack/react-query'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { assignmentManageQueries } from '@/api/actions/assignment-manage/assignment.query'
import axios from 'axios'
import { ENV } from '@/config/env'

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
  const queryClient = useQueryClient()
  const { register, handleSubmit, errors, setValue, watch, reset } = form
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const watchedValues = watch()

  const { data: accountData } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  const { data: classData } = useQuery({
    ...assignmentManageQueries.getAllClass(),
  })
  const { data: downloadPdfFileData, isLoading: isDownloading } = useQuery({
    ...assignmentQueries.downloadPdfFile(editingAssignment?.id as string),
  })
  // Auto-select all classes when component mounts or classData changes
  useEffect(() => {
    if (classData && Array.isArray(classData) && classData.length > 0) {
      const allClassIds = classData.map((c: any) => c.id.toString())
      setValue('classIds', allClassIds, { shouldValidate: true })
    }
  }, [classData, setValue])

  // Mutations
  const { mutateAsync: addAssignmentMutation } = useMutation(
    'addAssignmentMutation',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: assignmentManageQueries.get().queryKey,
        })
        toast.success('Assignment created successfully!')
        onSuccess?.()
        onOpenChange(false)
        reset()
        setSelectedPdfFile(null)
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'Error occurred while adding assignment', {
          toastId: 'add-error',
        })
        setIsSubmitting(false)
      },
    }
  )

  const { mutateAsync: updateAssignmentMutation } = useMutation(
    'updateAssignmentMutation',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: assignmentQueries.downloadPdfFile(editingAssignment?.id)
            .queryKey,
        })
        queryClient.invalidateQueries({
          queryKey: assignmentManageQueries.get().queryKey,
        })
        toast.success('Assignment updated successfully')
        onSuccess?.()
        onOpenChange(false)
        reset()
        setSelectedPdfFile(null)
      },
      onError: (error: StandardizedApiError) => {
        toast.error(
          error.message || 'Error occurred while updating assignment',
          {
            toastId: 'update-error',
          }
        )
        setIsSubmitting(false)
      },
    }
  )

  const handleDownloadPdf = async () => {
    const res = await axios.get(
      `${ENV.BACK_END_URL}/assignment/download-pdf/by-assignment/${editingAssignment?.id}`,
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
    link.download = `${editingAssignment?.title.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handlePdfFileSelect = (event: any) => {
    const file = event.target.files?.[0]
    console.log('file', file)
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
    console.log(selectedPdfFile)
    console.log('1')
    setIsSubmitting(true)
    try {
      if (isEditMode && editingAssignment) {
        // Edit mode - update assignment with file
        await updateAssignmentMutation({
          ...data,
          id: editingAssignment.id,
          file: selectedPdfFile || new File([], 'placeholder.pdf'),
        })
      } else {
        // Add mode - create assignment with file
        await addAssignmentMutation({
          ...data,
          id: `lab${Date.now()}`, // Generate temporary ID
          file: selectedPdfFile || new File([], 'placeholder.pdf'),
        })
      }
    } catch (e: unknown) {
      toast.error('Failed to save assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedPdfFile(null)
    reset()
    onCancel()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4">
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
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-2 shadow-sm"
                >
                  <a href="/sample-assignment/Template.docx" download>
                    <Download className="h-4 w-4" />
                    <span>Download Assignment Template</span>
                  </a>
                </Button>
              </div>
            )}
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
                value={watchedValues.teacherId.toString() || '2'}
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
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
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

            {/* Classes multi-select - Auto-selected and disabled */}
            <div className="grid gap-2">
              <Label>Classes (Auto-selected)</Label>
              <div className="max-h-40 overflow-auto rounded border p-2 space-y-1 bg-gray-50">
                {(classData ?? []).map((c: any) => {
                  const idString = c.id?.toString?.() ?? String(c.id)
                  return (
                    <label
                      key={idString}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={true}
                        disabled
                      />
                      <span className="flex-1 truncate">
                        {c.classCode} - {c.subjectCode} ({c.academicYear},
                        Semester {c.semesterId})
                      </span>
                    </label>
                  )
                })}
                {!(classData ?? []).length && (
                  <div className="text-xs text-gray-500">No classes found</div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                All available classes are automatically selected
              </p>
            </div>

            {/* PDF File Upload */}
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmit(handleFormSubmit)()
              }}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
