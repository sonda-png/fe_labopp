"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Eye,
  Users,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  Download,
  Calendar,
  Code,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  Award,
} from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useQuery } from "@/hooks/useQuery/useQuery"
import { teacherStudentQueries } from "@/api/actions/teacher-student/teacher-student.queries"
import type { Student } from "@/api/actions/teacher-student/teacher-student.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format as formatDate } from "date-fns"

export default function StudentManagement() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const classId = search.classId as string

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: studentsResponse, isLoading } = useQuery(teacherStudentQueries.getAll(classId))

  const { data: studentDetailResponse, isLoading: isLoadingDetail } = useQuery(
    teacherStudentQueries.getStudentDetail(classId, selectedStudentId || ""),
    {
      enabled: !!selectedStudentId && !!classId,
    },
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])

  useEffect(() => {
    if (studentsResponse && Array.isArray(studentsResponse)) {
      setFilteredStudents(studentsResponse)
    }
  }, [studentsResponse])

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setIsDialogOpen(true)
  }

  // Filter students by search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (!studentsResponse || !Array.isArray(studentsResponse)) return

    const filtered = studentsResponse.filter(
      (student: Student) =>
        student.fullName.toLowerCase().includes(value.toLowerCase()) ||
        student.studentId.toLowerCase().includes(value.toLowerCase()) ||
        student.email.toLowerCase().includes(value.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }

  const handleBack = () => {
    navigate({ to: "/class-manage" })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    )
  }

  if (!studentsResponse || !Array.isArray(studentsResponse)) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <Users className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Students</h3>
        <p className="text-muted-foreground">Failed to load student data</p>
      </div>
    )
  }

  const students = searchTerm ? filteredStudents : studentsResponse
  const totalStudents = students.length
  const totalAssignments = students[0]?.totalAssignments || 0
  const averageLOC =
    students.length > 0
      ? Math.round(students.reduce((acc: number, student: Student) => acc + student.totalLOC, 0) / students.length)
      : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with class information */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Class ID: {classId}</p>
          </div>
        </div>
      </div>

      {/* Overview statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average LOC</p>
                <p className="text-2xl font-bold">{averageLOC}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student List ({totalStudents})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Student list table */}
          {students && students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Total LOC</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: Student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.studentId}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {student.passedAssignments}/{student.totalAssignments}
                          </span>
                          <span className="font-medium">
                            {Math.round((student.passedAssignments / student.totalAssignments) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(student.passedAssignments / student.totalAssignments) * 100}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.totalLOC}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewStudent(student.studentId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try changing your search keywords." : "There are no students in this class yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Student Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Student Details</DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : studentDetailResponse ? (
            <div className="space-y-6">
              {/* Student Profile Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl font-semibold">
                        {studentDetailResponse.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{studentDetailResponse.fullName}</h3>
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{studentDetailResponse.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{studentDetailResponse.studentId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {studentDetailResponse.progress?.length || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Assignments</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {studentDetailResponse.progress?.filter((p) => p.status.toLowerCase() === "passed")
                              .length || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {studentDetailResponse.progress?.reduce((acc, p) => acc + p.loc, 0) || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Total LOC</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Assignment Progress Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-orange-600" />
                  <h4 className="text-lg font-semibold">Assignment Progress</h4>
                </div>

                <div className="grid gap-4">
                  {studentDetailResponse.progress?.map((assignment, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(assignment.status)}
                              <h5 className="font-semibold">{assignment.title}</h5>
                              <Badge variant="outline" className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Assignment ID: {assignment.assignmentId}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Lines of Code:</span>
                                <Badge variant="secondary">{assignment.loc}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <span className="font-medium">Submitted:</span>
                                <span className="text-muted-foreground">
                                  {formatDate(new Date(assignment.submittedAt), "MMM dd, yyyy HH:mm")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-red-600">Failed to load student details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
