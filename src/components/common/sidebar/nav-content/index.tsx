import { Button } from '@/components/ui/button'
import { authStore } from '@/stores/authStore'
import { allNavigationItems } from '@/utils/helpers/configSidebar'
import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useMemo, useState } from 'react'

interface NavContentProps {
  setIsOpen: (isOpen: boolean) => void
}

export const NavContent = ({ setIsOpen }: NavContentProps) => {
  const [activeTab, setActiveTab] = useState('overview')

  const { authValues } = authStore()

  const navigationItems = useMemo(() => {
    return authValues.role
      ? allNavigationItems.filter(item => item.roles.includes(authValues.role!))
      : []
  }, [authValues.role])
  return (
    <div className="space-y-2">
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

      {/* No access message */}
      {navigationItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No access</p>
        </div>
      )}
    </div>
  )
}
