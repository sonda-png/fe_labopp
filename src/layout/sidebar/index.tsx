import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, FileCheck, FileText, Trophy, Users } from 'lucide-react'
import { useState } from 'react'

export const SidebarComponent = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const classes = [
    {
      id: 1,
      name: 'LAB211 - IA1908',
      code: 'Summer2025',
      students: 32,
      assignments: 73,
      status: 'inactive',
      mentors: [
        'Nguyễn Đình Mạnh Linh - LinhNDM3',
        'Nguyễn Thị Hải Nàng - nangnth',
      ],
    },
    {
      id: 2,
      name: 'LAB211 - SE1967',
      code: 'Summer2025',
      students: 31,
      assignments: 72,
      status: 'inactive',
      mentors: [
        'Nguyễn Đình Mạnh Linh - LinhNDM3',
        'Nguyễn Thị Hải Nàng - nangnth',
      ],
    },
    {
      id: 3,
      name: 'LAB211 - SE1968',
      code: 'Summer2025',
      students: 30,
      assignments: 106,
      status: 'inactive',
      mentors: ['Nguyễn Thị Hải Nàng - nangnth'],
    },
    {
      id: 4,
      name: 'LAB211 - SE1973',
      code: 'Summer2025',
      students: 30,
      assignments: 127,
      status: 'active',
      mentors: ['Nguyễn Thị Hải Nàng - nangnth'],
    },
  ]

  const [selectedClass, setSelectedClass] = useState(classes[3])
  return (
    <aside className="w-[380px] bg-white border-r border-gray-200 min-h-screen p-6">
      <nav className="space-y-1 mb-8">
        {[
          { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
          { id: 'assignments', label: 'Quản lý bài tập', icon: FileText },
          { id: 'submissions', label: 'Chấm bài & Review', icon: FileCheck },
          { id: 'ranking', label: 'Bảng xếp hạng LOC', icon: Trophy },
          { id: 'students', label: 'Quản lý sinh viên', icon: Users },
        ].map(item => (
          <Button
            key={item.id}
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
        ))}
      </nav>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Lớp học phụ trách
          </h3>
        </div>
        <div className="space-y-2">
          {classes.map(cls => (
            <Button
              key={cls.id}
              variant={selectedClass.id === cls.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start text-left p-3 h-auto ${
                selectedClass.id === cls.id
                  ? 'bg-orange-50 text-orange-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedClass(cls)}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{cls.code}</div>
                  <Badge
                    variant={cls.status === 'active' ? 'default' : 'secondary'}
                    className={
                      cls.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }
                  >
                    {cls.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">{cls.name}</div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{cls.students} sinh viên</span>
                  <span>{cls.assignments} assignments</span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
