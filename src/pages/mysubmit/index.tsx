import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Code,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, Clock, Eye, FileText, Search } from 'lucide-react'
import { useQuery } from '@/hooks'
import { mySubmissionsQueries } from '@/api/actions/my-submissions/my-submissions.queries'
import { MySubmissions } from '@/api/actions/my-submissions/my-submissions.type'

const submittedPosts = [
  {
    id: "LAB01",
    title: "Basic Java Programming",
    subject: "LAB 01 - Java Fundamentals",
    status: "Pass",
    loc: 245,
    maxLoc: 200,
    submittedDate: "2025-04-15",
    deadline: "2025-04-20",
    feedback:
      "Excellent work! Your code is well-structured and follows best practices. The algorithm implementation is efficient and the comments are clear.",
    instructor: "Nguyễn Văn A",
    grade: 9.5,
  },
  {
    id: "LAB02",
    title: "Selection Sort Algorithm",
    subject: "LAB 02 - Java OOP",
    status: "Draft",
    loc: 150,
    maxLoc: 150,
    submittedDate: "2025-05-07",
    deadline: "2025-08-10",
    feedback:
      "Good start, but needs improvement in error handling and code optimization. Please review the sorting logic.",
    instructor: "Trần Thị B",
    grade: null,
  },
  {
    id: "LAB03",
    title: "Data Structures Implementation",
    subject: "LAB 03 - Advanced Java",
    status: "Reject",
    loc: 89,
    maxLoc: 300,
    submittedDate: "2025-03-22",
    deadline: "2025-03-25",
    feedback:
      "The implementation is incomplete and doesn't meet the requirements. Please implement all required methods and add proper documentation.",
    instructor: "Lê Văn C",
    grade: 4.0,
  },
  {
    id: "LAB04",
    title: "GUI Application Development",
    subject: "LAB 04 - Java Swing",
    status: "Pass",
    loc: 420,
    maxLoc: 400,
    submittedDate: "2025-06-10",
    deadline: "2025-06-15",
    feedback:
      "Great UI design and functionality. The event handling is implemented correctly and the code is well-organized.",
    instructor: "Phạm Thị D",
    grade: 8.8,
  },
]

const draftPosts = [
  {
    id: 4,
    title: 'Phân tích hệ thống quản lý cơ sở dữ liệu',
    subject: 'Cơ sở dữ liệu',
    lastModified: '2024-01-28',
    status: 'draft',
    content:
      'Hệ quản trị cơ sở dữ liệu (DBMS) là phần mềm cho phép người dùng tạo, quản lý và truy xuất dữ liệu từ cơ sở dữ liệu...',
    progress: 65,
  },
  {
    id: 5,
    title: 'Ứng dụng blockchain trong tài chính',
    subject: 'Công nghệ Blockchain',
    lastModified: '2024-01-30',
    status: 'draft',
    content:
      'Blockchain là một công nghệ sổ cái phân tán cho phép lưu trữ dữ liệu một cách an toàn, minh bạch và không thể thay đổi...',
    progress: 40,
  },
]

export default function MySubmitPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [selectedPost, setSelectedPost] = useState<MySubmissions | null>(null)

  const { data: mySubmissionsData } = useQuery({
    ...mySubmissionsQueries.getAll(),
  })

  const allPosts = [...submittedPosts, ...draftPosts]

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject =
      filterSubject === 'all' || post.subject === filterSubject
    return matchesSearch && matchesSubject
  })

  const subjects = Array.from(new Set(allPosts.map(post => post.subject)))

  const getStatusBadge = (status: string, score?: number) => {
    if (status === 'submitted') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Đã nộp
          </Badge>
          {score && (
            <Badge variant="outline" className="text-blue-600">
              {score}/100
            </Badge>
          )}
        </div>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Bản nháp
      </Badge>
    )
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pass":
      return "bg-green-100 text-green-800 border-green-200"
    case "Draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Reject":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Main Student Results Component
export default function StudentResults() {
  const passedAssignments = assignments.filter((a) => a.status === "Pass").length
  const totalAssignments = assignments.length
  const averageLOC = Math.round(assignments.reduce((sum, a) => sum + a.loc, 0) / assignments.length)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Assignment Results</h1>
        </div>
        <p className="text-orange-100">Summer2025 - LAB211 - SE1973</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passed Assignments</p>
                <p className="text-2xl font-bold text-green-600">
                  {passedAssignments}/{totalAssignments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average LOC</p>
                <p className="text-2xl font-bold text-blue-600">{averageLOC}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assignment List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <Badge className={`${getStatusColor(assignment.status)} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          {assignment.status}
                        </div>
                      </Badge>
                      {assignment.grade && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Grade: {assignment.grade}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span>
                          LOC: {assignment.loc}/{assignment.maxLoc}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {assignment.submittedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {assignment.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Instructor Feedback</span>
                    <span className="text-xs text-gray-500">- {assignment.instructor}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{assignment.feedback}</p>
                </div>

                {/* LOC Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Lines of Code</span>
                    <span>
                      {assignment.loc}/{assignment.maxLoc}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        assignment.loc >= assignment.maxLoc
                          ? "bg-green-500"
                          : assignment.loc >= assignment.maxLoc * 0.8
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((assignment.loc / assignment.maxLoc) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
