import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { BarChart3, FileCheck, FileText, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

export const SidebarComponent = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')

  const navigationItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, path: '/' },
    {
      id: 'assignments',
      label: 'Quản lý bài tập',
      icon: FileText,
      path: '/assignment-manage',
    },
    {
      id: 'submissions',
      label: 'Chấm bài & Review',
      icon: FileCheck,
      path: '/submissions',
    },
    {
      id: 'ranking',
      label: 'Bảng xếp hạng LOC',
      icon: Trophy,
      path: '/ranking',
    },
    {
      id: 'students',
      label: 'Quản lý sinh viên',
      icon: Users,
      path: '/student-manage',
    },
    {
      id: 'classes',
      label: 'Quản lý lớp học',
      icon: Users,
      path: '/class-manage',
    },
  ]

  return (
    <aside className="w-[380px] bg-white border-r border-gray-200 min-h-screen p-6">
      <nav className="space-y-1 mb-8">
        {navigationItems.map(item => (
          <Link key={item.id} to={item.path} className="block">
            <Button
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start h-10 ${
                activeTab === item.id
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
