import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Code, User } from 'lucide-react'

interface Lab {
  id: string
  title: string
  description: string
  locTotal: number
  teacherId: number
}

interface StatsCardsProps {
  labs: Lab[]
}

export const StatsCards = ({ labs }: StatsCardsProps) => {
  const stats = [
    {
      title: 'Total Assignments',
      value: labs.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Total LOC',
      value: labs.reduce((sum, lab) => sum + lab.locTotal, 0).toString(),
      icon: Code,
      color: 'text-green-600',
    },
    {
      title: 'Teachers',
      value: new Set(labs.map(lab => lab.teacherId)).size.toString(),
      icon: User,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
