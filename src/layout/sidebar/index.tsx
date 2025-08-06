import { User } from 'lucide-react'
import { NavContent } from '@/components/common/sidebar/nav-content'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { authStore } from '@/stores/authStore'

export const SidebarComponent = () => {
  const { authValues } = authStore()
  return (
    // <>
    //   {/* Mobile Menu Button */}
    //   <div className="lg:hidden fixed top-4 left-4 z-50">
    //     <Sheet open={isOpen} onOpenChange={setIsOpen}>
    //       <SheetTrigger asChild>
    //         <Button variant="ghost" size="icon" className="h-10 w-10">
    //           <Menu className="h-6 w-6" />
    //         </Button>
    //       </SheetTrigger>
    //       <SheetContent side="left" className="w-[300px] p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <h2 className="text-lg font-semibold">Menu</h2>
    //           {/* <Button
    //             variant="ghost"
    //             size="icon"
    //             onClick={() => setIsOpen(false)}
    //           >
    //             <X className="h-6 w-6" />
    //           </Button> */}
    //         </div>
    //         <NavContent setIsOpen={setIsOpen} />
    //       </SheetContent>
    //     </Sheet>
    //   </div>

    //   {/* Desktop Sidebar */}
    //   <aside className="hidden lg:block w-[280px] bg-white border-r border-gray-200 min-h-screen p-6">
    //     <NavContent setIsOpen={setIsOpen} />
    //   </aside>
    // </>

    <Sidebar className="border-r-0">
      <SidebarContent className="bg-gradient-to-b from-white to-gray-50/50 mt-20">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Danh mục
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <NavContent />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Màn hình {authValues.role}
                  </p>
                  <p className="text-xs text-orange-600">Đang hoạt động</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
