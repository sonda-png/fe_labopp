import {
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  GraduationCap,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
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
  // Dashboard
  {
    id: 'dashboard/admin',
    label: 'Bảng điều khiển',
    icon: ShieldCheck,
    path: '/dashboard/admin',
    roles: ['Admin'],
  },
  {
    id: 'dashboard/student',
    label: 'Bảng điều khiển',
    icon: BookOpen,
    path: '/dashboard/student',
    roles: ['Student'],
  },
  {
    id: 'dashboard/teacher',
    label: 'Bảng điều khiển',
    icon: GraduationCap,
    path: '/dashboard/teacher',
    roles: ['Teacher'],
  },
  {
    id: 'dashboard/head-subject',
    label: 'Bảng điều khiển',
    icon: GraduationCap,
    path: '/dashboard/head-subject',
    roles: ['Head Subject'],
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
    id: 'worker-management',
    label: 'Quản lý Worker',
    icon: Settings,
    path: '/worker-management',
    roles: ['Teacher'],
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
    id: 'assignment manage',
    label: 'Quản lý đề',
    icon: Layers,
    path: '/assignment-manage',
    roles: ['Head Subject'],
  },
  {
    id: 'semester-management',
    label: 'Quản lý học kỳ',
    icon: Calendar,
    path: '/semester-management',
    roles: ['Head Subject'],
  },
  {
    id: 'assignment-statistic',
    label: 'Thống kê Assignment',
    icon: TrendingUp,
    path: '/assignment-statistic',
    roles: ['Head Subject'],
  },
  {
    id: 'teacher-submission',
    label: 'Quản lý bài tập của giáo viên',
    icon: TrendingUp,
    path: '/teacher-submission',
    roles: ['Teacher'],
  },

  // Teacher specific items

  {
    id: 'classes',
    label: 'Quản lý lớp học',
    icon: Users,
    path: '/class-manage',
    roles: ['Teacher'],
  },

  {
    id: 'worker-management',
    label: 'Quản lý Worker',
    icon: Settings,
    path: '/worker-management',
    roles: ['Teacher   '],
  },

  // Student specific items
  {
    id: 'student-assignment',
    label: 'Danh sách bài tập',
    icon: BookOpen,
    path: '/student-assignment',
    roles: ['Student'],
  },
  {
    id: 'my-submit',
    label: 'Bài tập đã nộp',
    icon: BookOpen,
    path: '/my-submit',
    roles: ['Student'],
  },

  // Shared items (Teacher, Student, Head Subject)
  // {
  //   id: 'ranking',
  //   label: 'Xếp hạng',
  //   icon: Trophy,
  //   path: '/ranking',
  //   roles: ['Teacher', 'Student', 'Head Subject'],
  // },
  {
    id: 'academic-outcome-report',
    label: 'Báo cáo kết quả học tập',
    icon: BarChart3,
    path: '/academic-outcome-report',
    roles: ['Teacher', 'Head Subject', 'Admin'],
  },
]
