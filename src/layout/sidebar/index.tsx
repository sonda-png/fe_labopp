import { Button } from '@/components/ui/button'
import { Menu, X, Settings } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { authStore } from '@/stores/authStore'
import { allNavigationItems } from '@/utils/helpers/configSidebar'

export const SidebarComponent = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isOpen, setIsOpen] = useState(false)
  const { authValues } = authStore()

  // Filter navigation items based on user role
  const navigationItems = useMemo(() => {
    return authValues.role
      ? allNavigationItems.filter(item => item.roles.includes(authValues.role!))
      : []
  }, [authValues.role])

  const NavContent = () => (
    <div className="space-y-2">
      {/* Role indicator */}
      <div className="mb-6 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">
          {authValues.role || 'Chưa xác định'}
        </div>
        <div className="text-sm text-orange-800">{authValues.email}</div>
      </div>

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
          <p className="text-sm">Không có quyền truy cập</p>
        </div>
      )}
    </div>
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
      <aside className="hidden lg:block w-[280px] bg-white border-r border-gray-200 min-h-screen p-6">
        <NavContent />
      </aside>
    </>
  )
}
