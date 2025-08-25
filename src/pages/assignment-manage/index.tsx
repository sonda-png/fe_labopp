import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@/hooks'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  assignmentSchema,
  AssignmentFormValues,
} from '@/schema/assignmentSchema'
import { assignmentManageQueries } from '@/api/actions/assignment-manage/assignment.query'
import {
  PageHeader,
  StatsCards,
  FiltersAndActions,
  AssignmentTable,
  AssignmentFormDialog,
} from '@/components/features/assignment-manage'


interface Lab {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: number
  status: 'Pending' | 'Active' | 'Inactive'
}

export default function AssignmentManagement() {
  const {
    data: assignmentsData,
    isLoading,
    refetch,
  } = useQuery({
    ...assignmentManageQueries.get(),
  })

  const { mutateAsync: deleteAssignmentMutation } = useMutation(
    'deleteAssignmentMutation',
    {
      onSuccess: () => {
        toast.success('Assignment deleted successfully')
        refetch()
      },
      onError: (error: StandardizedApiError) => {
        toast.error(
          error.message || 'Error occurred while deleting assignment',
          {
            toastId: 'delete-error',
          }
        )
      },
    }
  )

  const [labs, setLabs] = useState<Lab[]>([])

  useEffect(() => {
    if (assignmentsData?.data) {
      setLabs(Array.isArray(assignmentsData.data) ? assignmentsData.data : [])
    }
  }, [assignmentsData])

  // ---------------- Pagination ----------------
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5 // số item trên 1 trang

  const totalPages = Math.ceil(labs.length / pageSize)
  const currentLabs = labs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  // --------------------------------------------

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLab, setEditingLab] = useState<Lab | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      locTotal: 0,
      teacherId: 0,
      status: 'Active',
    },
  })

  const handleEditDialogChange = (isOpen: boolean) => {
    setIsEditDialogOpen(isOpen)
    if (!isOpen) {
      setEditingLab(null)
      reset()
    }
  }

  const handleEdit = (lab: Lab) => {
    setEditingLab(lab)
    setValue('title', lab.title)
    setValue('description', lab.description)
    setValue('locTotal', lab.locTotal)
    setValue('teacherId', lab.teacherId)
    setValue('status', lab.status)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignmentMutation(id)
    } catch (error) {
      console.error('Error deleting assignment:', error)
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader />

        {/* Stats Cards */}
        <StatsCards labs={labs} />

        {/* Filters and Actions */}
        <FiltersAndActions onAddAssignment={() => setIsAddDialogOpen(true)} />

        {/* Labs Table */}
        <AssignmentTable
          labs={currentLabs}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Add Dialog */}
        <AssignmentFormDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Add New Assignment"
          description="Enter information for the new assignment"
          submitButtonText="Add"
          form={{ register, handleSubmit, errors, setValue, watch, reset }}
          onCancel={() => {
            setIsAddDialogOpen(false)
            reset()
          }}
        />

        {/* Edit Dialog */}
        <AssignmentFormDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogChange}
          title="Edit Assignment"
          description="Update assignment information"
          submitButtonText="Update"
          isEditMode={true}
          editingAssignment={editingLab}
          form={{ register, handleSubmit, errors, setValue, watch, reset }}
          onCancel={() => handleEditDialogChange(false)}
        />
      </div>
    </main>
  )
}