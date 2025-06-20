"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import {
  BookOpen,
  Code,
  Trophy,
  Users,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample data for LOC progress over time
const locProgressData = [
  { week: "Tuần 1", loc: 45, labs: 1 },
  { week: "Tuần 2", loc: 120, labs: 2 },
  { week: "Tuần 3", loc: 180, labs: 3 },
  { week: "Tuần 4", loc: 226, labs: 4 },
  { week: "Tuần 5", loc: 280, labs: 5 },
  { week: "Tuần 6", loc: 340, labs: 6 },
]

// Sample lab data
const labData = [
  {
    id: 1,
    name: "Basic Java Programming",
    subtitle: "LAB 01 - Java Fundamentals",
    status: "Pass",
    score: 9.5,
    loc: 245,
    maxLoc: 200,
    submittedDate: "2025-04-15",
    deadline: "2025-04-20",
    feedback: "Excellent work! Your code is well-structured and follows best practices.",
    teacher: "Nguyễn Văn A",
  },
  {
    id: 2,
    name: "Selection Sort Algorithm",
    subtitle: "LAB 02 - Java OOP",
    status: "Draft",
    score: null,
    loc: 156,
    maxLoc: 180,
    submittedDate: null,
    deadline: "2025-04-25",
    feedback: null,
    teacher: null,
  },
  {
    id: 3,
    name: "Data Structures",
    subtitle: "LAB 03 - Arrays & Lists",
    status: "Pending",
    score: null,
    loc: 89,
    maxLoc: 150,
    submittedDate: "2025-04-18",
    deadline: "2025-04-22",
    feedback: null,
    teacher: null,
  },
  {
    id: 4,
    name: "Object Oriented Design",
    subtitle: "LAB 04 - Inheritance",
    status: "Rejected",
    score: 4.2,
    loc: 67,
    maxLoc: 200,
    submittedDate: "2025-04-10",
    deadline: "2025-04-15",
    feedback: "Code needs improvement in error handling and documentation.",
    teacher: "Trần Thị B",
  },
]

// Sidebar navigation items
const navigationItems = [
  { title: "Tổng quan", icon: BarChart, active: true },
  { title: "Quản lý bài tập", icon: BookOpen },
  { title: "Chấm bài & Review", icon: FileText },
  { title: "Bảng xếp hạng LOC", icon: Trophy },
  { title: "Quản lý sinh viên", icon: Users },
  { title: "Quản lý lớp học", icon: User },
  { title: "Quản lý tài khoản", icon: User },
  { title: "Danh sách bài tập", icon: FileText },
]

function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Class Tracking System</h2>
            <p className="text-xs text-muted-foreground">LOC Management & Assignment Tracking</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className={item.active ? "bg-orange-500 text-white hover:bg-orange-600" : ""}
                  >
                    <a href="#" className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-orange-500 text-white text-xs">HN</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Nguyễn Thị Hải Nang</p>
            <p className="text-xs text-muted-foreground">Student • SE1973</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Pass":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pass</Badge>
    case "Draft":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>
    case "Pending":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang chờ</Badge>
    case "Rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Bị từ chối</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pass":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "Draft":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />
    case "Pending":
      return <Clock className="w-4 h-4 text-blue-600" />
    case "Rejected":
      return <XCircle className="w-4 h-4 text-red-600" />
    default:
      return null
  }
}

export default function StudentDashboard() {
  const totalLabs = labData.length
  const passedLabs = labData.filter((lab) => lab.status === "Pass").length
  const averageLoc = Math.round(labData.reduce((sum, lab) => sum + lab.loc, 0) / totalLabs)
  const pendingLabs = labData.filter((lab) => lab.status === "Pending").length
  const rejectedLabs = labData.filter((lab) => lab.status === "Rejected").length

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <Button className="bg-orange-500 hover:bg-orange-600">Đăng nhập</Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Results Summary Card */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kết quả bài tập
              </CardTitle>
              <CardDescription className="text-orange-100">Summer2025 - LAB211 - SE1973</CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bài đã Pass</p>
                    <p className="text-2xl font-bold text-green-600">
                      {passedLabs}/{totalLabs}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LOC trung bình</p>
                    <p className="text-2xl font-bold text-blue-600">{averageLoc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đang chờ</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingLabs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bị từ chối</p>
                    <p className="text-2xl font-bold text-red-600">{rejectedLabs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LOC Progress Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tiến độ LOC theo thời gian
                </CardTitle>
                <CardDescription>Theo dõi sự cải thiện LOC qua các tuần</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={locProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="loc" stroke="#f97316" fill="#fed7aa" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* LOC by Lab */}
            <Card>
              <CardHeader>
                <CardTitle>LOC theo từng bài Lab</CardTitle>
                <CardDescription>So sánh LOC đã hoàn thành với yêu cầu</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={labData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="loc" fill="#f97316" name="LOC đã làm" />
                    <Bar dataKey="maxLoc" fill="#fed7aa" name="LOC yêu cầu" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Assignment List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Danh sách bài tập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {labData.map((lab) => (
                <div key={lab.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{lab.name}</h3>
                        {getStatusBadge(lab.status)}
                        {lab.score && <Badge variant="outline">Điểm: {lab.score}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{lab.subtitle}</p>
                    </div>
                    {getStatusIcon(lab.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      📅 LOC: {lab.loc}/{lab.maxLoc}
                    </span>
                    {lab.submittedDate && <span>📅 Nộp: {lab.submittedDate}</span>}
                    <span>⏰ Hạn: {lab.deadline}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lines of Code</span>
                      <span>
                        {lab.loc}/{lab.maxLoc}
                      </span>
                    </div>
                    <Progress value={(lab.loc / lab.maxLoc) * 100} className="h-2" />
                  </div>

                  {lab.feedback && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">💬 Feedback từ giảng viên</span>
                        {lab.teacher && <span className="text-sm text-muted-foreground">- {lab.teacher}</span>}
                      </div>
                      <p className="text-sm">{lab.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
