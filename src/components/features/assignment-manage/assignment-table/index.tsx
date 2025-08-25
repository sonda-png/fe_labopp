import { useState, type ChangeEvent } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  MoreHorizontal,
  User,
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TestCaseDialog } from '../../test-case-manage/test-case-dialog'
import { TestCaseCreate } from '../../test-case-manage/test-case-create'
import { Assignment } from '@/api/actions/assignment-manage/assignment.types'
import { AssignmentManageDetail } from '../assignment-manage-detail'
import { useQuery, useMutation } from '@/hooks'
import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { toast } from 'react-toastify'

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

  // PDF Ingest state
  const [isIngestPdfDialogOpen, setIsIngestPdfDialogOpen] = useState(false)
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)
  const [isIngesting, setIsIngesting] = useState(false)

  const { data: accounts } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  // PDF Ingest mutation
  const { mutateAsync: ingestPdfMutation, isPending: isIngestingPdf } =
    useMutation('handleIngestPdf', {
      onSuccess: () => {
        toast.success(
          'PDF ingested successfully! AI can now analyze this assignment.'
        )
        setIsIngestPdfDialogOpen(false)
        setSelectedPdfFile(null)
      },
      onError: (error: unknown) => {
        console.error('Ingest PDF error:', error)
        toast.error('Failed to ingest PDF. Please try again.')
      },
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

  const openIngestPdfDialog = (lab: Assignment) => {
    setSelectedLab(lab)
    setIsIngestPdfDialogOpen(true)
  }

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedPdfFile(file)
    } else if (file) {
      toast.error('Please select a PDF file')
      setSelectedPdfFile(null)
    }
  }

  const handleIngestPdf = async () => {
    if (!selectedPdfFile || !selectedLab) {
      toast.error('Please select a PDF file')
      return
    }

    try {
      setIsIngesting(true)
      await ingestPdfMutation({
        assignmentId: Number(selectedLab.id),
        pdfFile: selectedPdfFile,
      })
    } catch (error) {
      console.error('Error ingesting PDF:', error)
    } finally {
      setIsIngesting(false)
    }
  }

  const removeSelectedFile = () => {
    setSelectedPdfFile(null)
    if (document.getElementById('pdf-file-input') as HTMLInputElement) {
      ;(document.getElementById('pdf-file-input') as HTMLInputElement).value =
        ''
    }
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead>Assignment Information</TableHead>
                <TableHead>Status</TableHead>
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
                          {lab.status}
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
                              onClick={() => openIngestPdfDialog(lab)}
                            >
                              Ingest PDF
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

      {/* PDF Ingest Dialog */}
      <Dialog
        open={isIngestPdfDialogOpen}
        onOpenChange={setIsIngestPdfDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span>Ingest PDF for Assignment</span>
            </DialogTitle>
            <DialogDescription>
              Upload a PDF file to enable AI analysis and test case generation
              for "{selectedLab?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdf-file-input">Assignment PDF</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                {!selectedPdfFile ? (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Click to select or drag and drop a PDF file
                    </p>
                    <p className="text-xs text-gray-500">
                      Only PDF files are accepted
                    </p>
                    <Input
                      id="pdf-file-input"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelection}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById('pdf-file-input')?.click()
                      }
                    >
                      Select PDF File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {selectedPdfFile.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeSelectedFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsIngestPdfDialogOpen(false)
                  setSelectedPdfFile(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleIngestPdf}
                disabled={!selectedPdfFile || isIngestingPdf}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isIngestingPdf ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ingesting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Ingest PDF
                  </>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">What happens after ingestion?</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• AI analyzes the PDF content</li>
                    <li>• Enables intelligent test case generation</li>
                    <li>• Improves code review accuracy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
