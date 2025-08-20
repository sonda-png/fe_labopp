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
import { useQuery } from '@/hooks'
import { Plus, TestTube } from 'lucide-react'
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

  const { data: testCases } = useQuery({
    ...problemQueries.getByAssignment(selectedLab?.id || ''),
  })

  const handleDeleteTestCase = () => {
    if (!selectedLab) return

    toast.success('Test case deleted successfully')
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Input:</Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono">
                            {testCase.input}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Expected Output:
                          </Label>
                          <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-mono">
                            {testCase.expectedOutput}
                          </p>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTestCase(testCase.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
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
  )
}
