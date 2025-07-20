import { adminAccountQueries } from '@/api/actions/admin-account/admin-account.queries'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@/hooks'
import _ from 'lodash'
import { UserCheck, Users, UserX } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { ElementType } from 'react'

{
  /* Stats Overview */
}
export const ManageAccountOverview = () => {
  const { data: adminAccounts } = useQuery({
    ...adminAccountQueries.getAll(),
  })

  const stats = useMemo(() => {
    return {
      total: adminAccounts?.length || 0,
      active: _.filter(adminAccounts, { isActive: true }).length,
      suspended: _.filter(adminAccounts, { isActive: false }).length,
    }
  }, [adminAccounts])

  /* --------------------------- StatsCard component -------------------------- */
  interface StatsCardProps {
    title: string
    value: number
    icon: ElementType<{ className?: string }>
    color: {
      bg: string
      icon: string
    }
  }

  const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            color.bg
          )}
        >
          <Icon className={cn('h-6 w-6', color.icon)} />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 md:grid-cols-3">
      <StatsCard
        title="Total Users"
        value={stats.total}
        icon={Users}
        color={{ bg: 'bg-blue-100', icon: 'text-blue-600' }}
      />
      <StatsCard
        title="Active"
        value={stats.active}
        icon={UserCheck}
        color={{ bg: 'bg-green-100', icon: 'text-green-600' }}
      />
      <StatsCard
        title="Suspended"
        value={stats.suspended}
        icon={UserX}
        color={{ bg: 'bg-red-100', icon: 'text-red-600' }}
      />
    </div>
  )
}
