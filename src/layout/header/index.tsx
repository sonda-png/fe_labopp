import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  Trophy,
  User,
  LogIn,
} from 'lucide-react'
import { authStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

export const HeaderComponent = () => {
  const { authValues } = authStore()
  const navigate = useNavigate()
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between  mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Class Tracking System
              </h1>
              <p className="text-sm text-gray-500">
                LOC Management & Assignment Tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {authValues.isAuthenticated ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-5" />
                <Input
                  placeholder="Tìm kiếm sinh viên, bài tập..."
                  className="pl-10 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-full"
                />
              </div>
              {/* Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              {/* Avatar Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 text-gray-900 px-2 py-1 rounded-full hover:bg-orange-50 transition"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          authValues.image ||
                          '/placeholder.svg?height=32&width=32'
                        }
                      />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {authValues.userName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="font-medium">{authValues.userName}</div>
                      <div className="text-xs text-gray-500">
                        {authValues.email}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 cursor-pointer"
                >
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt hệ thống
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate({ to: '/login' })
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 shadow"
              onClick={() => {
                navigate({ to: '/login' })
              }}
            >
              <LogIn className="h-5 w-5" />
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
