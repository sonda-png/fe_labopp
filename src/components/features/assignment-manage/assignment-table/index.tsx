import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { MoreHorizontal, User } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TestCaseDialog } from '../../test-case-manage/test-case-dialog'
import { TestCaseCreate } from '../../test-case-manage/test-case-create'
import { Assignment } from '@/api/actions/assignment-manage/assignment.types'
import { AssignmentManageDetail } from '../assignment-manage-detail'
import { useQuery } from '@/hooks'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'

interface AssignmentTableProps {
  labs: Assignment[]
  isLoading: boolean
  onEdit: (lab: Assignment) => void
  onDelete: (id: string) => void
}

export const AssignmentTable = ({
  labs,
  isLoading,
  onEdit,
  onDelete,
}: AssignmentTableProps) => {
  const [selectedLab, setSelectedLab] = useState<Assignment | null>(null)
  const [isTestCasesDialogOpen, setIsTestCasesDialogOpen] = useState(false)
  const [isAddTestCaseDialogOpen, setIsAddTestCaseDialogOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  const { data: accounts } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  // Helper function to get teacher name by teacherId
  const getTeacherName = (teacherId: number) => {
    const teacher = accounts?.find(
      account => account.id.toString() === teacherId.toString()
    )
    return teacher?.fullName || 'Unknown'
  }

  const openTestCasesDialog = (lab: Assignment) => {
    setSelectedLab(lab)
    setIsTestCasesDialogOpen(true)
  }

  const openViewDetails = (lab: Assignment) => {
    setSelectedLab(lab)
    setIsViewDetailsOpen(true)
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead>Assignment Information</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>LOC</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-4" colSpan={5}>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : labs.map(lab => (
                    <TableRow key={lab.id} className="border-b border-gray-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {lab.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {lab.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {lab.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {lab.locTotal} LOC
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900">
                            {getTeacherName(lab.teacherId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={e => {
                                e.preventDefault()
                                onEdit(lab)
                              }}
                              onSelect={e => e.preventDefault()}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openTestCasesDialog(lab)}
                            >
                              Manage Test Cases
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openViewDetails(lab)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={e => e.preventDefault()}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirm Delete
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete assignment "
                                    {lab.title}
                                    "? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(lab.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AssignmentManageDetail
        isViewDetailsOpen={isViewDetailsOpen}
        setIsViewDetailsOpen={setIsViewDetailsOpen}
        assignmentData={selectedLab}
      />

      {/* Test Cases Management Dialog */}
      <TestCaseDialog
        isOpen={isTestCasesDialogOpen}
        onOpenChange={setIsTestCasesDialogOpen}
        selectedLab={selectedLab}
        setIsAddTestCaseDialogOpen={setIsAddTestCaseDialogOpen}
      />

      {/* Add Test Case Dialog */}
      <TestCaseCreate
        isOpen={isAddTestCaseDialogOpen}
        onOpenChange={setIsAddTestCaseDialogOpen}
        selectedLab={selectedLab}
      />
    </>
  )
}
