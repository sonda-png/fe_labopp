import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { authStore } from '@/stores/authStore'
import { allNavigationItems } from '@/utils/helpers/configSidebar'
import { Link, useRouterState } from '@tanstack/react-router'
import { useMemo } from 'react'

export const NavContent = () => {
  const { authValues } = authStore()
  const location = useRouterState({ select: s => s.location })
  const navigationItems = useMemo(() => {
    return authValues.role
      ? allNavigationItems.filter(item => item.roles.includes(authValues.role!))
      : []
  }, [authValues.role])

  const checkIsActive = (itemPath: string, pathname: string) => {
    if (pathname.includes(itemPath)) return true

    // các rule đặc biệt
    if (pathname.includes('loc-ranking') && itemPath === '/class-manage') return true
    if (pathname.includes('teacher-grade') && itemPath === '/teacher-submission') return true

    return false
  }

  return (
    <div>
      {navigationItems?.map(item => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            isActive={checkIsActive(item.path, location.pathname)}
            className={`
          group relative h-12 rounded-xl transition-all duration-200 hover:shadow-md
          ${
            checkIsActive(item.path, location.pathname)
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
              : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200'
          }
        `}
          >
            <Link to={item.path} className="flex items-center gap-3 px-4">
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  checkIsActive(item.path, location.pathname)
                    ? 'text-white'
                    : 'text-gray-600 group-hover:text-orange-600'
                }`}
              />
              <span
                className={`font-medium transition-colors ${
                  checkIsActive(item.path, location.pathname)
                    ? 'text-white'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                {item.label}
              </span>
              {checkIsActive(item.path, location.pathname) && (
                <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-white/30" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  )
}
