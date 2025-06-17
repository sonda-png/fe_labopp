import { useState } from 'react'
import {
  BarChart3,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Award,
  Target,
  PieChart,
  LineChart,
  Activity,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Line,
  Area,
  AreaChart,
} from 'recharts'

// Mock data for statistics
const overallStats = {
  totalStudents: 1250,
  totalAssignments: 127,
  totalSubmissions: 3850,
  overallPassRate: 72.5,
  averageLOC: 485,
  targetLOC: 750,
  activeClasses: 45,
  completedAssignments: 89,
}

const passRateByClass = [
  {
    class: 'LAB211-SE1973',
    students: 30,
    passed: 24,
    passRate: 80,
    avgLOC: 520,
  },
  {
    class: 'LAB211-SE1968',
    students: 30,
    passed: 21,
    passRate: 70,
    avgLOC: 480,
  },
  {
    class: 'LAB211-IA1908',
    students: 32,
    passed: 26,
    passRate: 81.25,
    avgLOC: 550,
  },
  {
    class: 'LAB211-SE1967',
    students: 31,
    passed: 20,
    passRate: 64.5,
    avgLOC: 420,
  },
  {
    class: 'LAB211-AI1901',
    students: 28,
    passed: 22,
    passRate: 78.6,
    avgLOC: 510,
  },
]

const passRateByAssignment = [
  {
    assignment: 'Selection Sort',
    code: 'J1.S.P0002',
    submissions: 145,
    passed: 108,
    passRate: 74.5,
    avgLOC: 52,
  },
  {
    assignment: 'Binary Search',
    code: 'J1.S.P0003',
    submissions: 132,
    passed: 89,
    passRate: 67.4,
    avgLOC: 68,
  },
  {
    assignment: 'Student Management',
    code: 'J1.S.P0010',
    submissions: 98,
    passed: 71,
    passRate: 72.4,
    avgLOC: 185,
  },
  {
    assignment: 'Calculator App',
    code: 'J1.S.P0001',
    submissions: 156,
    passed: 134,
    passRate: 85.9,
    avgLOC: 35,
  },
  {
    assignment: 'File Processing',
    code: 'J1.S.P0005',
    submissions: 87,
    passed: 58,
    passRate: 66.7,
    avgLOC: 95,
  },
]

const monthlyTrend = [
  { month: 'T1', totalSubmissions: 245, passed: 178, passRate: 72.7 },
  { month: 'T2', totalSubmissions: 289, passed: 215, passRate: 74.4 },
  { month: 'T3', totalSubmissions: 312, passed: 221, passRate: 70.8 },
  { month: 'T4', totalSubmissions: 298, passed: 225, passRate: 75.5 },
  { month: 'T5', totalSubmissions: 334, passed: 248, passRate: 74.3 },
  { month: 'T6', totalSubmissions: 287, passed: 198, passRate: 69.0 },
]

const difficultyStats = [
  {
    difficulty: 'Dễ (1-2)',
    count: 45,
    passed: 41,
    passRate: 91.1,
    color: '#10B981',
  },
  {
    difficulty: 'TB (3)',
    count: 38,
    passed: 28,
    passRate: 73.7,
    color: '#F59E0B',
  },
  {
    difficulty: 'Khó (4)',
    count: 32,
    passed: 19,
    passRate: 59.4,
    color: '#EF4444',
  },
  {
    difficulty: 'Rất khó (5)',
    count: 12,
    passed: 5,
    passRate: 41.7,
    color: '#7C2D12',
  },
]

const locDistribution = [
  { range: '0-100', count: 45, percentage: 12.5 },
  { range: '101-300', count: 89, percentage: 24.7 },
  { range: '301-500', count: 125, percentage: 34.7 },
  { range: '501-750', count: 78, percentage: 21.7 },
  { range: '750+', count: 23, percentage: 6.4 },
]

const topPerformers = [
  {
    name: 'Trịnh Đình Dũng',
    studentId: 'HE173241',
    class: 'LAB211-SE1973',
    totalLOC: 680,
    passRate: 95,
  },
  {
    name: 'Nguyễn Tuấn Hùng',
    studentId: 'HE194829',
    class: 'LAB211-SE1973',
    totalLOC: 650,
    passRate: 90,
  },
  {
    name: 'Lê Văn An',
    studentId: 'HE181203',
    class: 'LAB211-IA1908',
    totalLOC: 620,
    passRate: 88,
  },
  {
    name: 'Phạm Thị Lan',
    studentId: 'HE186556',
    class: 'LAB211-SE1968',
    totalLOC: 590,
    passRate: 85,
  },
  {
    name: 'Hoàng Minh Tuấn',
    studentId: 'HE175432',
    class: 'LAB211-SE1967',
    totalLOC: 570,
    passRate: 82,
  },
]

export default function AcademicOutcomeReport() {
  const [selectedSemester, setSelectedSemester] = useState('Summer2025')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  const chartConfig = {
    passRate: {
      label: 'Tỷ lệ Pass (%)',
      color: 'hsl(var(--chart-1))',
    },
    submissions: {
      label: 'Submissions',
      color: 'hsl(var(--chart-2))',
    },
    passed: {
      label: 'Đã Pass',
      color: 'hsl(var(--chart-3))',
    },
    avgLOC: {
      label: 'LOC Trung bình',
      color: 'hsl(var(--chart-4))',
    },
  }

  const exportToExcel = () => {
    // Simulate Excel export
    console.log('Exporting to Excel...')
  }

  const exportToPDF = () => {
    // Simulate PDF export
    console.log('Exporting to PDF...')
  }

  const shareReport = () => {
    // Simulate sharing
    console.log('Sharing report...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-orange-500" />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thống kê kết quả học tập
          </h1>
          <p className="text-gray-600">
            {' '}
            Phân tích tỷ lệ pass và hiệu suất sinh viên người dùng
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Bộ lọc thống kê
              </h3>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" onClick={exportToPDF}>
                  <Printer className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" onClick={shareReport}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cập nhật
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Học kỳ
                </label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summer2025">Summer 2025</SelectItem>
                    <SelectItem value="Fall2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring2024">Spring 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Lớp học
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả lớp</SelectItem>
                    <SelectItem value="LAB211-SE1973">LAB211-SE1973</SelectItem>
                    <SelectItem value="LAB211-SE1968">LAB211-SE1968</SelectItem>
                    <SelectItem value="LAB211-IA1908">LAB211-IA1908</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Bài tập
                </label>
                <Select
                  value={selectedAssignment}
                  onValueChange={setSelectedAssignment}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả bài tập</SelectItem>
                    <SelectItem value="J1.S.P0002">Selection Sort</SelectItem>
                    <SelectItem value="J1.S.P0003">Binary Search</SelectItem>
                    <SelectItem value="J1.S.P0010">
                      Student Management
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Khoảng thời gian
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="7days">7 ngày qua</SelectItem>
                    <SelectItem value="30days">30 ngày qua</SelectItem>
                    <SelectItem value="90days">90 ngày qua</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Tìm kiếm..." className="pl-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng sinh viên
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overallStats.totalStudents}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">
                      +5.2% so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tỷ lệ Pass tổng
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overallStats.overallPassRate}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">
                      +2.1% so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    LOC trung bình
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overallStats.averageLOC}
                  </p>
                  <div className="flex items-center mt-1">
                    <Progress
                      value={
                        (overallStats.averageLOC / overallStats.targetLOC) * 100
                      }
                      className="w-16 h-2 mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      {Math.round(
                        (overallStats.averageLOC / overallStats.targetLOC) * 100
                      )}
                      % mục tiêu
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng submissions
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {overallStats.totalSubmissions}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">
                      -1.5% so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="classes">Theo lớp</TabsTrigger>
            <TabsTrigger value="assignments">Theo bài tập</TabsTrigger>
            <TabsTrigger value="trends">Xu hướng</TabsTrigger>
            <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pass Rate by Difficulty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Tỷ lệ Pass theo độ khó</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPieChart data={difficultyStats}>
                          {difficultyStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {difficultyStats.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.difficulty}</span>
                        </div>
                        <span className="font-medium">{item.passRate}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* LOC Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Phân bố LOC sinh viên</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-submissions)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top 5 sinh viên xuất sắc</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((student, index) => (
                    <div
                      key={student.studentId}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                          <span className="text-sm font-semibold text-orange-600">
                            #{index + 1}
                          </span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {student.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentId} • {student.class}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {student.totalLOC} LOC
                        </div>
                        <div className="text-sm text-orange-600">
                          {student.passRate}% pass rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Tỷ lệ Pass theo lớp học</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={passRateByClass}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="passRate" fill="var(--color-passRate)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết theo lớp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Lớp học
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Tổng SV
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Đã Pass
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Tỷ lệ Pass
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          LOC TB
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {passRateByClass.map(cls => (
                        <tr
                          key={cls.class}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {cls.class}
                          </td>
                          <td className="p-4 text-gray-700">{cls.students}</td>
                          <td className="p-4 text-gray-700">{cls.passed}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={cls.passRate}
                                className="w-16 h-2"
                              />
                              <span className="font-medium">
                                {cls.passRate}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">{cls.avgLOC}</td>
                          <td className="p-4">
                            <Badge
                              className={
                                cls.passRate >= 75
                                  ? 'bg-orange-500'
                                  : cls.passRate >= 60
                                    ? 'bg-orange-400'
                                    : 'bg-red-500'
                              }
                            >
                              {cls.passRate >= 75
                                ? 'Tốt'
                                : cls.passRate >= 60
                                  ? 'Trung bình'
                                  : 'Cần cải thiện'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Tỷ lệ Pass theo bài tập</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={passRateByAssignment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="assignment" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="passRate" fill="var(--color-passRate)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết theo bài tập</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Bài tập
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Mã
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Submissions
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Đã Pass
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          Tỷ lệ Pass
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">
                          LOC TB
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {passRateByAssignment.map(assignment => (
                        <tr
                          key={assignment.code}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {assignment.assignment}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className="border-orange-200 text-orange-700"
                            >
                              {assignment.code}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-700">
                            {assignment.submissions}
                          </td>
                          <td className="p-4 text-gray-700">
                            {assignment.passed}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={assignment.passRate}
                                className="w-16 h-2"
                              />
                              <span className="font-medium">
                                {assignment.passRate}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">
                            {assignment.avgLOC}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5" />
                  <span>Xu hướng tỷ lệ Pass theo tháng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="passRate"
                        stroke="var(--color-passRate)"
                        fill="var(--color-passRate)"
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="passRate"
                        stroke="var(--color-passRate)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Submissions theo tháng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="totalSubmissions"
                          fill="var(--color-submissions)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Số lượng Pass theo tháng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="passed" fill="var(--color-passed)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Hiệu suất tổng thể
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallStats.overallPassRate / 100)}`}
                        className="text-orange-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {overallStats.overallPassRate}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Tỷ lệ Pass tổng thể</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Tiến độ LOC</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallStats.averageLOC / overallStats.targetLOC)}`}
                        className="text-orange-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {Math.round(
                          (overallStats.averageLOC / overallStats.targetLOC) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {overallStats.averageLOC}/{overallStats.targetLOC} LOC
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Hoạt động lớp</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallStats.activeClasses / 50)}`}
                        className="text-orange-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {overallStats.activeClasses}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Lớp đang hoạt động</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số hiệu suất chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      85.9%
                    </div>
                    <div className="text-sm text-gray-600">Bài tập dễ nhất</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Calculator App
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      66.7%
                    </div>
                    <div className="text-sm text-gray-600">
                      Bài tập khó nhất
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      File Processing
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      81.25%
                    </div>
                    <div className="text-sm text-gray-600">Lớp tốt nhất</div>
                    <div className="text-xs text-gray-500 mt-1">
                      LAB211-IA1908
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      64.5%
                    </div>
                    <div className="text-sm text-gray-600">
                      Lớp cần cải thiện
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      LAB211-SE1967
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
