import { Assignment } from '@/api/actions/assignment-manage/assignment.types'
import { problemQueries } from '@/api/actions/problem/problem.queries'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  TestTube,
  Upload,
  Trash2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'

interface TestCaseDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedLab: Assignment | null
  setIsAddTestCaseDialogOpen: (open: boolean) => void
}
export const TestCaseDialog = ({
  isOpen,
  onOpenChange,
  selectedLab,
  setIsAddTestCaseDialogOpen,
}: TestCaseDialogProps) => {
  const queryClient = useQueryClient()
  const { data: testCases } = useQuery({
    ...problemQueries.getByAssignment(selectedLab?.id || ''),
  })

  const { mutateAsync: deleteTestCase } = useMutation('deleteTestCase', {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: problemQueries.getByAssignment(selectedLab?.id).queryKey,
      })
      toast.success('Test case deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete test case')
    },
  })

  const { mutateAsync: updateTestCaseFromFiles } = useMutation(
    'updateTestCase',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: problemQueries.getByAssignment(selectedLab?.id).queryKey,
        })
        toast.success('Test case updated successfully')
      },
      onError: () => {
        toast.error('Failed to update test case')
      },
    }
  )

  const [updatingTestId, setUpdatingTestId] = useState<string | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateFiles, setUpdateFiles] = useState<File[]>([])
  const [updateDescription, setUpdateDescription] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null)

  const confirmDelete = (testCaseId: string) => {
    setDeletingTestId(testCaseId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTestCase = async () => {
    if (!selectedLab || !deletingTestId) return
    try {
      await deleteTestCase(deletingTestId)
      setIsDeleteDialogOpen(false)
      setDeletingTestId(null)
    } catch {}
  }

  const openUpdateDialog = (testCaseId: string) => {
    setUpdatingTestId(testCaseId)
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setUpdateFiles(files)
  }

  const handleConfirmUpdate = async () => {
    if (!selectedLab || !updatingTestId) return
    if (updateFiles.length === 0 || !updateDescription.trim()) {
      toast.error('Please select files and enter a description')
      return
    }
    try {
      await updateTestCaseFromFiles({
        id: updatingTestId,
        assignmentId: selectedLab.id,
        descriptions: updateDescription.trim(),
        files: updateFiles,
      })
      setIsUpdateDialogOpen(false)
      setUpdateFiles([])
      setUpdateDescription('')
      setUpdatingTestId(null)
    } catch {}
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Manage Test Cases - {selectedLab?.title}
            </DialogTitle>
            <DialogDescription>
              Manage test cases for this assignment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAddTestCaseDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test Case
              </Button>

              <div className="text-sm text-gray-500">
                File format: input|expectedOutput|description (one test case per
                line)
              </div>
            </div>

            {/* Test Cases List */}
            <div className="border rounded-lg">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h4 className="font-medium">
                  Test Cases List ({testCases?.length || 0})
                </h4>
              </div>
              <div className="divide-y">
                {testCases?.map(testCase => (
                  <div key={testCase.id} className="p-4">
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Input:
                            </Label>
                            <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono">
                              {testCase.input}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Expected Output:
                            </Label>
                            <pre className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono whitespace-pre-wrap">
                              {testCase.expectedOutput}
                            </pre>
                          </div>
                        </div>
                        {testCase.updatedAt && (
                          <div>
                            <Label className="text-sm font-medium">
                              Updated At:
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(
                                new Date(testCase.updatedAt).getTime() +
                                  7 * 60 * 60 * 1000
                              ).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[220px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUpdateDialog(testCase.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Upload className="w-4 h-4 mr-1" /> Update from files
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(testCase.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="p-8 text-center text-gray-500">
                    <TestTube className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No test cases yet</p>
                    <p className="text-sm">Add your first test case</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update from files dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-lg border-orange-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-700">
              <Upload className="w-5 h-5 text-orange-600" /> Update Test Case
              from Files
            </DialogTitle>
            <DialogDescription className="text-orange-600">
              Select files and provide a description for this update.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium text-orange-800">Files</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-files" className="text-orange-800">
                  Select files *
                </Label>
                <input
                  id="update-files"
                  type="file"
                  multiple
                  accept=".txt,.csv"
                  onChange={handleUpdateFileChange}
                  className="block w-full text-sm text-orange-900 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                />
                {updateFiles.length > 0 && (
                  <div className="text-xs text-orange-700">
                    Selected: {updateFiles.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium text-orange-800">Description</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-description" className="text-orange-800">
                  Description *
                </Label>
                <textarea
                  id="update-description"
                  className="w-full border border-orange-200 rounded p-3 min-h-[100px] bg-white focus:outline-none focus:ring-2 focus:ring-orange-600"
                  value={updateDescription}
                  onChange={e => setUpdateDescription(e.target.value)}
                  placeholder="Enter update description"
                />
                <p className="text-xs text-orange-700">
                  Explain what changed in these files.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false)
                setUpdateFiles([])
                setUpdateDescription('')
                setUpdatingTestId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5 text-orange-600" /> Confirm delete
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this test
              case?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setDeletingTestId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTestCase}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
