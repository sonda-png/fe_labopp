import {
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  FileCheck,
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
    label: 'Đồng bộ FAP',
    icon: Database,
    path: '/fap-sync',
    roles: ['Admin'],
  },

  // Head Subject specific items
  {
    id: 'assignment-bank',
    label: 'Quản lý ngân hàng bài tập',
    icon: Layers,
    path: '/assignment-bank',
    roles: ['Head Subject', 'Admin'],
  },
  {
    id: 'semester-management',
    label: 'Quản lý học kỳ',
    icon: Calendar,
    path: '/semester-management',
    roles: ['Head Subject', 'Admin'],
  },
  {
    id: 'assignment-statistic',
    label: 'Thống kê Assignment',
    icon: TrendingUp,
    path: '/assignment-statistic',
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
    id: 'assignments',
    label: 'Quản lý bài tập',
    icon: FileText,
    path: '/assignment-manage',
    roles: ['Teacher'],
  },
  {
    id: 'submissions',
    label: 'Chấm bài & Review',
    icon: FileCheck,
    path: '/submissions',
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
    label: 'Quản lý lớp học',
    icon: Users,
    path: '/class-manage',
    roles: ['Teacher', 'Admin'],
  },

  // Student specific items
  {
    id: 'assignment-list',
    label: 'Danh sách bài tập',
    icon: BookOpen,
    path: '/assignmentlist',
    roles: ['Student'],
  },

  // Shared items (Teacher, Student, Head Subject)
  {
    id: 'ranking',
    label: 'Bảng xếp hạng LOC',
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
