import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  FileCheck,
  FileText,
  Menu,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export const SidebarComponent = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isOpen, setIsOpen] = useState(false)

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
    {
      id: 'users',
      label: 'Quản lý tài khoản',
      icon: Users,
      path: '/users',
    },
    {
      id: 'assignment-list ',
      label: 'Danh sách bài tập',
      icon: Users,
      path: '/assignmentlist',
    },
    {
      id: 'academic-outcome-report',
      label: 'Báo cáo kết quả học tập',
      icon: BarChart3,
      path: '/academic-outcome-report',
    },
    {
      id: 'fap-sync',
      label: 'Đồng bộ FAP',
      icon: BarChart3,
      path: '/fap-sync',
    },
    {
      id: 'semester-management',
      label: 'Quản lý học kỳ',
      icon: BarChart3,
      path: '/semester-management',
    },
    {
      id: 'assignment-bank',
      label: 'Quản lý ngân hàng bài tập',
      icon: BarChart3,
      path: '/assignment-bank',
    },
  ]

  const NavContent = () => (
    <nav className="space-y-1">
      {navigationItems.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className="block"
          onClick={() => setIsOpen(false)}
        >
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
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[250px] bg-white border-r border-gray-200 min-h-screen p-6">
        <NavContent />
      </aside>
    </>
  )
}
