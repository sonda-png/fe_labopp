"use client"

import type React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Search, Bell, BarChart3, FileText, CheckSquare, Trophy, Users, Calendar } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface CommonProps {
  className?: string;
  children: React.ReactNode;
}

interface ButtonProps extends CommonProps {
  variant?: "ghost" | "default";
  size?: "icon" | "default";
}

interface BadgeProps extends CommonProps {
  variant?: "default" | "secondary";
}

interface SidebarMenuButtonProps extends CommonProps {
  asChild?: boolean;
  isActive?: boolean;
}

interface AvatarImageProps {
  src?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// Sidebar Components
const SidebarHeader = ({ className, children }: CommonProps) => <div className={className}>{children}</div>
const SidebarTrigger = () => (
  <button className="p-2 rounded-md hover:bg-gray-100">
    <MenuIcon />
  </button>
)

// UI Components
// Using imported Input component from @/components/ui/input
// Using imported Card components from @/components/ui/card
// Using imported Avatar components from @/components/ui/avatar

// Icon Components
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
)

// Dữ liệu mẫu cho biểu đồ LOC
const locData = [
  { week: "Tuần 1", loc: 120, target: 150 },
  { week: "Tuần 2", loc: 180, target: 200 },
  { week: "Tuần 3", loc: 250, target: 250 },
  { week: "Tuần 4", loc: 320, target: 300 },
  { week: "Tuần 5", loc: 280, target: 350 },
  { week: "Tuần 6", loc: 420, target: 400 },
  { week: "Tuần 7", loc: 380, target: 450 },
  { week: "Tuần 8", loc: 520, target: 500 },
]

const progressData = [
  { name: "Hoàn thành", value: 75, color: "#22c55e" },
  { name: "Đang làm", value: 15, color: "#f59e0b" },
  { name: "Chưa làm", value: 10, color: "#ef4444" },
]

const recentAssignments = [
  {
    id: 1,
    title: "Selection Sort Algorithm",
    course: "LAB 02 - Java OOP",
    dueDate: "2025-08-10",
    loc: 150,
    status: "completed",
  },
  {
    id: 2,
    title: "Binary Search Tree",
    course: "LAB 03 - Data Structure",
    dueDate: "2025-08-15",
    loc: 200,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Web API Development",
    course: "LAB 04 - Web Programming",
    dueDate: "2025-08-20",
    loc: 300,
    status: "pending",
  },
]

const sidebarItems = [
  {
    title: "Tổng quan",
    icon: BarChart3,
    isActive: true,
  },
  {
    title: "Quản lý bài tập",
    icon: FileText,
    isActive: false,
  },
  {
    title: "Chấm bài & Review",
    icon: CheckSquare,
    isActive: false,
  },
  {
    title: "Bảng xếp hạng LOC",
    icon: Trophy,
    isActive: false,
  },
  {
    title: "Quản lý sinh viên",
    icon: Users,
    isActive: false,
  },
]

const classes = [
  { name: "Summer2025", code: "LAB211 - IA1908", students: 32, assignments: 73, status: "Inactive" },
  { name: "Summer2025", code: "LAB211 - SE1967", students: 31, assignments: 72, status: "Inactive" },
  { name: "Summer2025", code: "LAB211 - SE1968", students: 30, assignments: 106, status: "Inactive" },
  { name: "Summer2025", code: "LAB211 - SE1969", students: 28, assignments: 127, status: "Active" },
]

// Using imported SidebarGroupLabel from @/components/ui/sidebar

export default function ClassTrackingDashboard() {
  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Biểu đồ LOC</h1>
        </div>
        <p className="text-orange-100">Summer2025 - LAB211 - SE1973</p>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LOC Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng LOC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,490</div>
              <p className="text-xs text-green-600">+12% so với tuần trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">LOC tuần này</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">520</div>
              <p className="text-xs text-green-600">+4% so với mục tiêu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Bài tập hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/20</div>
              <p className="text-xs text-blue-600">75% hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Xếp hạng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#3</div>
              <p className="text-xs text-orange-600">Trong lớp</p>
            </CardContent>
          </Card>
        </div>

        {/* LOC Progress Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tiến độ LOC theo tuần</CardTitle>
            <CardDescription>So sánh LOC thực tế với mục tiêu đề ra</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="loc" fill="#f97316" name="LOC thực tế" />
                <Bar dataKey="target" fill="#fed7aa" name="Mục tiêu" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng bài tập</CardTitle>
            <CardDescription>Phân bố trạng thái các bài tập</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={progressData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {progressData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bài tập gần đây</CardTitle>
            <CardDescription>Danh sách các bài tập và LOC đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        assignment.status === "completed"
                          ? "bg-green-500"
                          : assignment.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{assignment.loc} LOC</div>
                    <div className="text-sm text-muted-foreground">Hạn: {assignment.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
