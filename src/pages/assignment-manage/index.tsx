import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Eye,
  Download,
  Upload,
  FileText,
  Calendar,
  User,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"

// Dữ liệu cứng cho thông tin lớp
const classInfo = {
  name: "Summer2025 - LAB211 - SE1973",
  subject: "LAB 02- Java OOP",
  startDate: "05/07/2025",
  endDate: "08/10/2025",
  mentors: "Nguyễn Thị Hải Nang - nangnth",
}

// Dữ liệu cứng cho bài làm sinh viên
const submissionsData = [
  {
    id: 1,
    studentName: "Nguyễn Văn An",
    studentCode: "SE171234",
    assignmentName: "Selection Sort Algorithm",
    code: "J1.S.P0002",
    achievedLOC: 145,
    lastUploaded: "05/28/2025, 10:20:03 AM",
    status: "Submitted",
    score: 8.5,
    submissionFile: "SelectionSort_SE171234.zip",
  },
  {
    id: 2,
    studentName: "Trần Thị Bình",
    studentCode: "SE171235",
    assignmentName: "Bubble Sort Algorithm",
    code: "J1.S.P0003",
    achievedLOC: 118,
    lastUploaded: "05/27/2025, 02:15:22 PM",
    status: "Graded",
    score: 9.2,
    submissionFile: "BubbleSort_SE171235.zip",
  },
  {
    id: 3,
    studentName: "Lê Minh Cường",
    studentCode: "SE171236",
    assignmentName: "Quick Sort Algorithm",
    code: "J1.S.P0004",
    achievedLOC: 89,
    lastUploaded: "05/26/2025, 08:45:15 AM",
    status: "Draft",
    score: null,
    submissionFile: "QuickSort_SE171236.zip",
  },
  {
    id: 4,
    studentName: "Phạm Thu Dung",
    studentCode: "SE171237",
    assignmentName: "Merge Sort Algorithm",
    code: "J1.S.P0005",
    achievedLOC: 156,
    lastUploaded: "05/29/2025, 04:30:45 PM",
    status: "Passed",
    score: 9.8,
    submissionFile: "MergeSort_SE171237.zip",
  },
  {
    id: 5,
    studentName: "Hoàng Văn Em",
    studentCode: "SE171238",
    assignmentName: "Binary Search",
    code: "J1.S.P0006",
    achievedLOC: 67,
    lastUploaded: "05/25/2025, 11:20:30 AM",
    status: "Rejected",
    score: 4.5,
    submissionFile: "BinarySearch_SE171238.zip",
  },
]

// Dữ liệu cứng cho danh sách đề bài
const assignmentsData = [
  {
    id: 1,
    title: "Selection Sort Algorithm",
    code: "J1.S.P0002",
    description: "Implement selection sort algorithm in Java",
    fileName: "SelectionSort_Assignment.pdf",
    uploadDate: "01/15/2025",
    assignedClasses: ["SE1973", "SE1967"],
    status: "Active",
  },
  {
    id: 2,
    title: "Bubble Sort Algorithm",
    code: "J1.S.P0003",
    description: "Implement bubble sort algorithm with optimization",
    fileName: "BubbleSort_Assignment.pdf",
    uploadDate: "01/20/2025",
    assignedClasses: ["SE1973"],
    status: "Active",
  },
]

export default function AssignmentManagement() {
  const [activeTab, setActiveTab] = useState("submissions")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [studentFilter, setStudentFilter] = useState("all")
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissionsData)

  // States cho tạo đề mới
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    code: "",
    description: "",
    file: null as File | null,
  })

  // Xử lý thay đổi trạng thái bài làm
  const handleStatusChange = (submissionId: number, newStatus: string) => {
    console.log(`Changing status of submission ${submissionId} to ${newStatus}`)
    // Cập nhật trạng thái trong database
  }

  // Lọc bài làm
  const filterSubmissions = (search: string, status: string, student: string) => {
    let filtered = submissionsData

    if (search) {
      filtered = filtered.filter(
        (submission) =>
          submission.studentName.toLowerCase().includes(search.toLowerCase()) ||
          submission.assignmentName.toLowerCase().includes(search.toLowerCase()) ||
          submission.code.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((submission) => submission.status.toLowerCase() === status.toLowerCase())
    }

    if (student !== "all") {
      filtered = filtered.filter((submission) => submission.studentCode === student)
    }

    setFilteredSubmissions(filtered)
  }

  const handleSearch = () => {
    filterSubmissions(searchTerm, statusFilter, studentFilter)
  }

  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setStudentFilter("all")
    setFilteredSubmissions(submissionsData)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Submitted</Badge>
      case "graded":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Graded</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewAssignment((prev) => ({ ...prev, file }))
    }
  }

  const handleCreateAssignment = () => {
    console.log("Creating new assignment:", newAssignment)
    // Xử lý tạo đề mới
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header thông tin lớp */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{classInfo.name}</h1>
            <p className="text-gray-600">{classInfo.subject}</p>
          </div>
        </div>

        {/* Thông tin chi tiết lớp */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-medium">{classInfo.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{classInfo.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{classInfo.endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Mentors</p>
                  <p className="font-medium">{classInfo.mentors}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs cho các chức năng */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Quản lý bài làm</TabsTrigger>
          <TabsTrigger value="create-assignment">Tạo đề</TabsTrigger>
        </TabsList>

        {/* Tab Quản lý bài làm */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài làm sinh viên</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Bộ lọc */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="student-filter">Student</Label>
                  <Select value={studentFilter} onValueChange={setStudentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All --</SelectItem>
                      {Array.from(new Set(submissionsData.map((s) => s.studentCode))).map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Bảng danh sách bài làm */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Assignment Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Achieved LOC</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Last Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission, index) => (
                      <TableRow key={submission.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.studentName}</p>
                            <p className="text-sm text-gray-500">{submission.studentCode}</p>
                          </div>
                        </TableCell>
                        <TableCell>{submission.assignmentName}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.code}</TableCell>
                        <TableCell>{submission.achievedLOC}</TableCell>
                        <TableCell>
                          {submission.score ? (
                            <span className="font-semibold">{submission.score}</span>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{submission.lastUploaded}</TableCell>
                        <TableCell>
                          <Select
                            value={submission.status.toLowerCase()}
                            onValueChange={(value) => handleStatusChange(submission.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="graded">Graded</SelectItem>
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài làm</h3>
                  <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Tạo đề */}
        <TabsContent value="create-assignment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form tạo đề mới */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Tạo đề bài mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề đề bài</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề đề bài..."
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="code">Mã đề bài</Label>
                  <Input
                    id="code"
                    placeholder="VD: J1.S.P0007"
                    value={newAssignment.code}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, code: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về đề bài..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Upload file đề bài</Label>
                  <div className="mt-2">
                    <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                    {newAssignment.file && (
                      <p className="text-sm text-gray-600 mt-2">Đã chọn: {newAssignment.file.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Gán cho lớp</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="current-class" defaultChecked />
                      <Label htmlFor="current-class">{classInfo.name}</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateAssignment} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Tạo đề bài
                </Button>
              </CardContent>
            </Card>

            {/* Danh sách đề bài hiện có */}
            <Card>
              <CardHeader>
                <CardTitle>Đề bài hiện có</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignmentsData.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Code: {assignment.code}</span>
                            <span>Upload: {assignment.uploadDate}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{assignment.assignedClasses.length} lớp</Badge>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
