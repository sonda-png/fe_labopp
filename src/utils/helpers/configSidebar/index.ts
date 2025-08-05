import {
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  FileText,
  GraduationCap,
  Layers,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  roles: string[]
}

// Define all navigation items with their allowed roles
export const allNavigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    icon: BarChart3,
    path: '/',
    roles: ['Admin', 'Teacher', 'Student', 'Head Subject'],
  },
  {
    id: 'home',
    label: 'Trang chủ',
    icon: BarChart3,
    path: '/',
    roles: ['Admin', 'Teacher', 'Student', 'Head Subject'],
  },


  // Admin specific items
  {
    id: 'users',
    label: 'Quản lý tài khoản',
    icon: ShieldCheck,
    path: '/manage-account',
    roles: ['Admin'],
  },
  {
    id: 'fap-sync',
    label: 'Fap-sync',
    icon: Database,
    path: '/fap-sync',
    roles: ['Admin'],
  },
  {
    id: 'dashboard/admin',
    label: 'Admin Dashboard',
    icon: ShieldCheck,
    path: '/dáshboard/admin',
    roles: ['Admin'],
  },
  {
    id: 'academic-outcome-report',
    label: 'Báo cáo kết quả học tập',
    icon: ShieldCheck,
    path: '/academic-outcome-report',
    roles: ['Admin'],
  },


  // Head Subject specific items
  {
    id: 'dashboard/head-subject',
    label: 'Head-Subject Dashboard',
    icon: TrendingUp,
    path: '/head-subject-dashboard',
    roles: ['Head Subject'],
  },

  {
    id: 'assignment manage',
    label: 'Quản lý đề',
    icon: Layers,
    path: '/assignment-manage',
    roles: ['Head Subject', 'Teacher'],
  },
  {
    id: 'semester-management',
    label: 'Quản lý học kì',
    icon: Calendar,
    path: '/semester-management',
    roles: ['Head Subject', 'Admin', 'Teacher'],
  },
  {
    id: 'assignment-statistic',
    label: 'Thống kê đề',
    icon: TrendingUp,
    path: '/assignment-statistic',
    roles: ['Head Subject', 'Teacher'],
  },
  {
    id: 'assignment-bank',
    label: 'Ngân hàng đề',
    icon: TrendingUp,
    path: '/assignment-bank',
    roles: ['Head Subject', 'Teacher'],
  },
   {
    id: 'teacher-submission',
    label: 'Quản lý bài tập của giáo viên',
    icon: TrendingUp,
    path: '/teacher-submission',
    roles: ['Head Subject', 'Teacher'],
  },
  


  // Teacher specific items
  {
    id: 'dashboard/teacher',
    label: 'Teacher Dashboard',
    icon: GraduationCap,
    path: '/dashboard/teacher',
    roles: ['Teacher'],
  },

  {
    id: 'Teacher Grade',
    label: 'Quản lý điểm',
    icon: FileText,
    path: '/teacher-grade',
    roles: ['Teacher'],
  },

  {
    id: 'assignments',
    label: 'danh sách bài tập',
    icon: FileText,
    path: '/assignmentlist',
    roles: ['Teacher'],
  },
  {
    id: 'students',
    label: 'Quản lý sinh viên',
    icon: Users,
    path: '/student-manage',
    roles: ['Teacher', 'Admin'],
  },
  {
    id: 'classes',
    label: 'Quản lý lớp',
    icon: Users,
    path: '/class-manage',
    roles: ['Teacher', 'head subject'],
  },

  // Student specific items
  {
    id: 'assignment-list',
    label: 'Danh sách bài tập',
    icon: BookOpen,
    path: '/assignmentlist',
    roles: ['Student','teacher', 'Head Subject'],
  },
   {
    id: 'dashboard/student',
    label: 'Student Dashboard',
    icon: BookOpen,
    path: '/dashboard/student',
    roles: ['Student'],
  },
  {
    id: 'mysubmit',
    label: 'Bài tập đã nộp',
    icon: BookOpen,
    path: '/mysubmit',
    roles: ['Student'],
  },
  {
    id: 'submit-lab',
    label: 'Nộp bài tập',
    icon: BookOpen,
    path: '/submitlab',
    roles: ['Student'],
  },





  // Shared items (Teacher, Student, Head Subject)
  {
    id: 'ranking',
    label: 'Xếp hạng',
    icon: Trophy,
    path: '/ranking',
    roles: ['Teacher', 'Student', 'Head Subject'],
  },
  {
    id: 'academic-outcome-report',
    label: 'Báo cáo kết quả học tập',
    icon: BarChart3,
    path: '/academic-outcome-report',
    roles: ['Teacher', 'Head Subject', 'Admin'],
  },
]
