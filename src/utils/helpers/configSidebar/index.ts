import {
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  GraduationCap,
  Layers,
  LucideIcon,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
  roles: string[]
}

// Define all navigation items with their allowed roles
export const allNavigationItems: NavigationItem[] = [
  // Dashboard
  {
    id: 'dashboard/admin',
    label: 'Admin Dashboard',
    icon: ShieldCheck,
    path: '/dashboard/admin',
    roles: ['Admin'],
  },
  {
    id: 'dashboard/student',
    label: 'Student Dashboard',
    icon: BookOpen,
    path: '/dashboard/student',
    roles: ['Student'],
  },
  {
    id: 'dashboard/teacher',
    label: 'Teacher Dashboard',
    icon: GraduationCap,
    path: '/dashboard/teacher',
    roles: ['Teacher'],
  },
  {
    id: 'dashboard/head-subject',
    label: 'Head Subject Dashboard',
    icon: GraduationCap,
    path: '/dashboard/head-subject',
    roles: ['Head Subject'],
  },
  // Admin specific items
  {
    id: 'users',
    label: 'Account Management',
    icon: ShieldCheck,
    path: '/manage-account',
    roles: ['Admin'],
  },
  {
    id: 'worker-management',
    label: 'Worker Management',
    icon: Settings,
    path: '/worker-management',
    roles: ['Teacher'],
  },
  // Head Subject specific items

  {
    id: 'assignment manage',
    label: 'Assignment Management',
    icon: Layers,
    path: '/assignment-manage',
    roles: ['Head Subject'],
  },
  {
    id: 'semester-management',
    label: 'Semester Management',
    icon: Calendar,
    path: '/semester-management',
    roles: ['Head Subject'],
  },
  {
    id: 'assignment-statistic',
    label: 'Assignment Statistic',
    icon: TrendingUp,
    path: '/assignment-statistic',
    roles: ['Head Subject'],
  },
  {
    id: 'teacher-submission',
    label: 'Teacher Submission Management',
    icon: TrendingUp,
    path: '/teacher-submission',
    roles: ['Teacher'],
  },

  // Teacher specific items

  {
    id: 'classes',
    label: 'Class Management',
    icon: Users,
    path: '/class-manage',
    roles: ['Teacher'],
  },

  {
    id: 'worker-management',
    label: 'Worker Management',
    icon: Settings,
    path: '/worker-management',
    roles: ['Teacher   '],
  },

  // Student specific items
  {
    id: 'student-assignment',
    label: 'Assignment List',
    icon: BookOpen,
    path: '/student-assignment',
    roles: ['Student'],
  },
  {
    id: 'my-submit',
    label: 'My Submission',
    icon: BookOpen,
    path: '/my-submit',
    roles: ['Student'],
  },
{
    id: 'my-selected-assignment',
    label: 'My Selected Assignment',
    icon: BookOpen,
    path: '/my-selected-assignment',
    roles: ['Student'],
  },
// thêm sidebar ở đây là được

  // Shared items (Teacher, Student, Head Subject)
  // {
  //   id: 'ranking',
  //   label: 'Xếp hạng',
  //   icon: Trophy,
  //   path: '/ranking',
  //   roles: ['Teacher', 'Student', 'Head Subject'],
  // },
  // {
  //   id: 'academic-outcome-report',
  //   label: 'Academic Outcome Report',
  //   icon: BarChart3,
  //   path: '/academic-outcome-report',
  //   roles: ['Teacher', 'Head Subject', 'Admin'],
  // },
]
