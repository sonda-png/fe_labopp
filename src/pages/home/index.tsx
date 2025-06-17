import { useState, useEffect } from 'react'
import {
  Trophy,
  Users,
  FileText,
  Code,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Shield,
  Clock,
  Rocket,
  Heart,
  User,
  GraduationCap,
  UserCheck,
  Crown,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { HeaderComponent } from '@/layout/header'

// Mock user data - in real app this would come from auth context
const currentUser = {
  name: 'Nguyễn Văn An',
  role: 'student', // admin, teacher, head_of_department, student
  avatar: '/placeholder.svg?height=40&width=40',
  email: 'an.nguyen@fpt.edu.vn',
  studentId: 'HE173456', // only for students
}

const systemStats = {
  totalStudents: 1250,
  totalTeachers: 45,
  totalClasses: 32,
  totalAssignments: 127,
  totalLOC: 125000,
  passRate: 78.5,
}

const features = [
  {
    icon: Code,
    title: 'Làm bài tập lập trình',
    description:
      'Sinh viên nhận và hoàn thành các bài tập được giao bởi giảng viên',
    color: 'bg-blue-500',
    roles: ['student'],
  },
  {
    icon: FileText,
    title: 'Submit & Tính LOC',
    description: 'Nộp bài và hệ thống tự động tính toán Lines of Code (LOC)',
    color: 'bg-green-500',
    roles: ['student'],
  },
  {
    icon: Trophy,
    title: 'Theo dõi tiến độ',
    description: 'Xem tiến độ LOC và thứ hạng so với các sinh viên khác',
    color: 'bg-yellow-500',
    roles: ['student'],
  },
  {
    icon: Users,
    title: 'Quản lý lớp học',
    description: 'Giảng viên quản lý sinh viên và theo dõi tiến độ học tập',
    color: 'bg-purple-500',
    roles: ['teacher'],
  },
  {
    icon: CheckCircle,
    title: 'Chấm bài & Review',
    description: 'Review code và đánh giá kết quả học tập của sinh viên',
    color: 'bg-orange-500',
    roles: ['teacher'],
  },
  {
    icon: Award,
    title: 'Quản lý toàn diện',
    description: 'Trưởng bộ môn giám sát tất cả lớp học và hoạt động giảng dạy',
    color: 'bg-red-500',
    roles: ['head_of_department'],
  },
  {
    icon: Shield,
    title: 'Quản trị hệ thống',
    description: 'Admin quản lý người dùng, phân quyền và cấu hình hệ thống',
    color: 'bg-gray-600',
    roles: ['admin'],
  },
]

const howItWorks = [
  {
    step: 1,
    title: 'Nhận bài tập',
    description: 'Giảng viên tạo và giao bài tập lập trình cho sinh viên',
    icon: BookOpen,
  },
  {
    step: 2,
    title: 'Viết code',
    description: 'Sinh viên hoàn thành bài tập theo yêu cầu đã được đưa ra',
    icon: Code,
  },
  {
    step: 3,
    title: 'Submit bài làm',
    description: 'Nộp bài lên hệ thống, tự động tính LOC và lưu trữ',
    icon: FileText,
  },
  {
    step: 4,
    title: 'Đạt mục tiêu LOC',
    description: 'Tích lũy đủ LOC theo yêu cầu để pass môn học',
    icon: Target,
  },
]

const getRoleInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        title: 'Quản trị viên',
        icon: Crown,
        color: 'bg-gray-600',
        description: 'Quản lý toàn bộ hệ thống',
      }
    case 'teacher':
      return {
        title: 'Giảng viên',
        icon: UserCheck,
        color: 'bg-blue-600',
        description: 'Quản lý lớp học và sinh viên',
      }
    case 'head_of_department':
      return {
        title: 'Trưởng bộ môn',
        icon: Briefcase,
        color: 'bg-purple-600',
        description: 'Giám sát toàn bộ hoạt động giảng dạy',
      }
    case 'student':
      return {
        title: 'Sinh viên',
        icon: GraduationCap,
        color: 'bg-green-600',
        description: 'Học tập và hoàn thành bài tập',
      }
    default:
      return {
        title: 'Người dùng',
        icon: User,
        color: 'bg-gray-600',
        description: 'Sử dụng hệ thống',
      }
  }
}

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const roleInfo = getRoleInfo(currentUser.role)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getRelevantFeatures = () => {
    return features.filter(feature => feature.roles.includes(currentUser.role))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <HeaderComponent />

      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className={`p-4 ${roleInfo.color} rounded-2xl shadow-lg`}>
              <roleInfo.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Chào mừng đến với{' '}
                <span className="text-blue-600">LOC Tracking System</span>
              </h2>
              <p className="text-xl text-gray-600">
                Hệ thống quản lý và theo dõi Lines of Code cho sinh viên lập
                trình
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Mục tiêu của hệ thống
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Giúp sinh viên hoàn thành các bài tập lập trình, tự động tính
                  toán Lines of Code (LOC), và theo dõi tiến độ học tập. Khi đạt
                  đủ LOC yêu cầu, sinh viên sẽ được pass môn học.
                </p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                    <roleInfo.icon className="h-4 w-4 mr-2" />
                    {roleInfo.title}
                  </Badge>
                  {currentUser.studentId && (
                    <Badge variant="outline" className="px-3 py-1">
                      MSSV: {currentUser.studentId}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {systemStats.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">Sinh viên</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Code className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    {systemStats.totalLOC.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Tổng LOC</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    {systemStats.totalAssignments}
                  </div>
                  <div className="text-sm text-purple-600">Bài tập</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900">
                    {systemStats.passRate}%
                  </div>
                  <div className="text-sm text-orange-600">Tỷ lệ Pass</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Quy trình hoạt động
            </h3>
            <p className="text-xl text-gray-600">
              Từ việc nhận bài tập đến khi pass môn học
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="bg-white/60 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step.step}
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features for Current Role */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng dành cho {roleInfo.title}
            </h3>
            <p className="text-xl text-gray-600">
              Các chức năng chính bạn có thể sử dụng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getRelevantFeatures().map((feature, index) => (
              <Card
                key={index}
                className="group bg-white/60 backdrop-blur-sm border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 ${feature.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Rocket className="h-10 w-10" />
                <h3 className="text-3xl font-bold">Sẵn sàng bắt đầu?</h3>
              </div>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                {currentUser.role === 'student'
                  ? 'Hãy bắt đầu hành trình lập trình của bạn! Hoàn thành các bài tập, tích lũy LOC và đạt được mục tiêu pass môn.'
                  : currentUser.role === 'teacher'
                    ? 'Tạo bài tập mới, theo dõi tiến độ sinh viên và hỗ trợ họ đạt được mục tiêu học tập.'
                    : currentUser.role === 'head_of_department'
                      ? 'Giám sát toàn bộ hoạt động giảng dạy, phân tích dữ liệu và đưa ra các quyết định chiến lược.'
                      : 'Quản lý hệ thống, cấu hình các tham số và đảm bảo hoạt động ổn định cho tất cả người dùng.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Vào Dashboard
                  </Button>
                </Link>
                {currentUser.role === 'student' && (
                  <Link to="/assignments">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-8 py-3"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Xem bài tập
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Cập nhật: {currentTime.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Hệ thống hoạt động ổn định</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Phát triển bởi FPT University</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
