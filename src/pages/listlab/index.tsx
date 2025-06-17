import { useState } from "react"
import { Building, Download, Edit, Eye, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

// Override default badge color to orange
const badgeVariants = {
  default: "bg-orange-500 text-white hover:bg-orange-600",
}

// Mock data based on the Submission table
const submissions = [
  {
    id: "SUB001",
    student_id: "HE194829",
    student_name: "Nguyễn Tuấn Hùng",
    assignment_id: "LAB001",
    assignment_name: "Selection sort algorithm",
    zip_code: "selection_sort.zip",
    status: "Submitted",
    submitted_at: "2025-05-28T10:20:03",
    loc_result: 145,
    manually_edited: false,
    manual_reason: null,
    created_by: "student",
    created_at: "2025-05-28T10:20:03",
    updated_by: "student",
    updated_at: "2025-05-28T10:20:03",
    code: "J1.S.P0002",
    achieved_loc: 145,
  },
  {
    id: "SUB002",
    student_id: "HE194830",
    student_name: "Trần Văn Nam",
    assignment_id: "LAB002",
    assignment_name: "Bubble sort algorithm",
    zip_code: "bubble_sort.zip",
    status: "Graded",
    submitted_at: "2025-05-27T14:15:22",
    loc_result: 118,
    manually_edited: true,
    manual_reason: "Code optimization required",
    created_by: "student",
    created_at: "2025-05-27T14:15:22",
    updated_by: "teacher",
    updated_at: "2025-05-29T09:30:15",
    code: "J1.S.P0003",
    achieved_loc: 118,
  },
  {
    id: "SUB003",
    student_id: "HE194831",
    student_name: "Lê Thị Mai",
    assignment_id: "LAB003",
    assignment_name: "Linear search algorithm",
    zip_code: "linear_search.zip",
    status: "Submitted",
    submitted_at: "2025-05-29T16:45:10",
    loc_result: 95,
    manually_edited: false,
    manual_reason: null,
    created_by: "student",
    created_at: "2025-05-29T16:45:10",
    updated_by: "student",
    updated_at: "2025-05-29T16:45:10",
    code: "J1.S.P0004",
    achieved_loc: 95,
  },
  {
    id: "SUB004",
    student_id: "HE194832",
    student_name: "Phạm Minh Đức",
    assignment_id: "LAB004",
    assignment_name: "Binary search algorithm",
    zip_code: "binary_search.zip",
    status: "Resubmit Required",
    submitted_at: "2025-05-26T11:30:45",
    loc_result: 85,
    manually_edited: true,
    manual_reason: "Logic error in implementation",
    created_by: "student",
    created_at: "2025-05-26T11:30:45",
    updated_by: "teacher",
    updated_at: "2025-05-28T08:20:30",
    code: "J1.S.P0005",
    achieved_loc: 85,
  },
  {
    id: "SUB005",
    student_id: "HE194833",
    student_name: "Hoàng Thị Lan",
    assignment_id: "LAB005",
    assignment_name: "Merge sort algorithm",
    zip_code: "merge_sort.zip",
    status: "Submitted",
    submitted_at: "2025-05-30T09:15:33",
    loc_result: 175,
    manually_edited: false,
    manual_reason: null,
    created_by: "student",
    created_at: "2025-05-30T09:15:33",
    updated_by: "student",
    updated_at: "2025-05-30T09:15:33",
    code: "J1.S.P0006",
    achieved_loc: 175,
  },
]

// Get unique students for filter
const students = Array.from(new Set(submissions.map((s) => s.student_name))).map((name) => {
  const submission = submissions.find((s) => s.student_name === name)
  return {
    id: submission?.student_id || "",
    name: name,
  }
})

export default function ListLab() {
  const [studentFilter, setStudentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [lastUploadedDate, setLastUploadedDate] = useState("")

  // Filter submissions based on filters
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStudent = studentFilter === "all" || submission.student_name === studentFilter
    const matchesStatus = statusFilter === "all" || submission.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesDate = !lastUploadedDate || submission.submitted_at.includes(lastUploadedDate)
    return matchesStudent && matchesStatus && matchesDate
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "default" // Mặc định sẽ sử dụng màu cam từ className bên dưới
      case "graded":
        return "secondary"
      case "resubmit required":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">Class Detail</h1>
            <p className="text-sm">Summer2025 - LAB211 - SE1973</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 bg-gray-50">
        {/* Class info card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-gray-600">Subject</p>
                <p>LAB 02- Java OOP</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Start Date</p>
                <p>05/07/2025</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">End Date</p>
                <p>08/10/2025</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-semibold text-gray-600">Mentors</p>
                <p>Nguyễn Thị Hải Năng - nangnth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="students" className="mb-6">
          <TabsList className="bg-orange-100">
            <TabsTrigger value="students" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Students
            </TabsTrigger>
            <TabsTrigger value="vdi" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              VDI Setting
            </TabsTrigger>
            <TabsTrigger value="grading" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Grading
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            {/* Filter section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                    <Select value={studentFilter} onValueChange={setStudentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- All --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- All --</SelectItem>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.name}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                        <SelectItem value="resubmit required">Resubmit Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Uploaded</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={lastUploadedDate}
                        onChange={(e) => setLastUploadedDate(e.target.value)}
                        className="w-full"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStudentFilter("all")
                        setStatusFilter("all")
                        setLastUploadedDate("")
                      }}
                    >
                      Reset
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">Search</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submissions table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Assignment Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Achieved LOC</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((submission, index) => (
                        <TableRow key={submission.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{submission.student_name}</p>
                              <p className="text-sm text-gray-600">{submission.assignment_name}</p>
                              {submission.manually_edited && submission.manual_reason && (
                                <p className="text-xs text-orange-500 mt-1">Manual edit: {submission.manual_reason}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{submission.code}</TableCell>
                          <TableCell>{submission.achieved_loc}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(submission.status)}
                              className={
                                getStatusBadgeVariant(submission.status) === "default"
                                  ? "bg-orange-400 text-white hover:bg-orange-500"
                                  : ""
                              }
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDateTime(submission.submitted_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Download">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No matching records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination and info */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {filteredSubmissions.length > 0 ? 1 : 0} to {filteredSubmissions.length} of{" "}
                    {filteredSubmissions.length} entries
                    {filteredSubmissions.length !== submissions.length &&
                      ` (filtered from ${submissions.length} total entries)`}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive className="bg-orange-500">
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vdi">
            <Card>
              <CardContent className="p-6">
                <p>VDI Setting content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grading">
            <Card>
              <CardContent className="p-6">
                <p>Grading content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
