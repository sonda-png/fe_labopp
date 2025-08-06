import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { authStore } from '@/stores/authStore'
import { allNavigationItems } from '@/utils/helpers/configSidebar'
import { Link, useRouterState } from '@tanstack/react-router'
import { useMemo } from 'react'

export const NavContent = () => {
  const { authValues } = authStore()
  const location = useRouterState({ select: s => s.location })
  console.log(location)
  const navigationItems = useMemo(() => {
    return authValues.role
      ? allNavigationItems.filter(item => item.roles.includes(authValues.role!))
      : []
  }, [authValues.role])
  return (
    // <div className="space-y-2">
    //   <nav className="space-y-1">
    //     {navigationItems.map(item => (
    //       <Link
    //         key={item.id}
    //         to={item.path}
    //         className="block"
    //         onClick={() => setIsOpen(false)}
    //       >
    //         <Button
    //           variant={activeTab === item.id ? 'default' : 'ghost'}
    //           className={`w-full justify-start h-10 ${
    //             activeTab === item.id
    //               ? 'bg-orange-500 hover:bg-orange-600 text-white'
    //               : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
    //           }`}
    //           onClick={() => setActiveTab(item.id)}
    //         >
    //           <item.icon className="mr-3 h-4 w-4" />
    //           {item.label}
    //         </Button>
    //       </Link>
    //     ))}
    //   </nav>

    //   {/* No access message */}
    //   {navigationItems.length === 0 && (
    //     <div className="text-center py-8 text-gray-500">
    //       <Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
    //       <p className="text-sm">No access</p>
    //     </div>
    //   )}
    // </div>
    <div>
      {navigationItems?.map(item => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            isActive={item.path === location.pathname}
            className={`
          group relative h-12 rounded-xl transition-all duration-200 hover:shadow-md
          ${
            item.path === location.pathname
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
              : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200'
          }
        `}
          >
            <Link to={item.path} className="flex items-center gap-3 px-4">
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  item.path === location.pathname
                    ? 'text-white'
                    : 'text-gray-600 group-hover:text-orange-600'
                }`}
              />
              <span
                className={`font-medium transition-colors ${
                  item.path === location.pathname
                    ? 'text-white'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                {item.label}
              </span>
              {item.path === location.pathname && (
                <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-white/30" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  )
}
