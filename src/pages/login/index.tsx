import { FC } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { LoginMutationResponse } from '@/api/actions/auth/auth.types'
import { authStore } from '@/stores/authStore'
import { getNavigateByRole } from '@/utils/helpers/getNavigateByRole'
import { useMutation } from '@/hooks'

export const LoginPage: FC = () => {
  const { setAuthData } = authStore()
  const search = useSearch({ strict: false })

  const navigate = useNavigate()
  
  // Get URL search parameters (e.g., /login?redirect=/dashboard&token=abc -> { redirect: "/dashboard", token: "abc" })
  const searchParams = useSearch({ from: '/_public/login/' })
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    
    // Navigate to redirect URL if provided in search params, otherwise go to default page
    // const redirectTo = getRedirectPath(searchParams)
    //navigate({ to: redirectTo })
  }

  const handleLoginNavigate = (role: string) => {
    if (search.redirectTo) {
      navigate({ to: '/' + search.redirectTo, replace: true })
      return
    }
    const path = getNavigateByRole(role)
    if (path) {
      navigate({ to: path, replace: true })
    }
  }

  const { mutateAsync: loginMutation } = useMutation('loginMutation', {
    onSuccess: (res: LoginMutationResponse) => {
      setAuthData({
        isAuthenticated: true,
        userId: res.userId,
        email: res.email,
        role: res.role,
        token: res.token,
      })
      
      // Lấy đường dẫn trước khi logout từ localStorage
      const preLogoutPath = localStorage.getItem('preLogoutPath')
      if (preLogoutPath) {
        localStorage.removeItem('preLogoutPath') // Xóa sau khi dùng
        navigate({ to: preLogoutPath })
      } else {
        // Nếu không có thì dùng redirect mặc định
        const redirectTo = getRedirectPath(searchParams)
        navigate({ to: redirectTo })
      }
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    await loginMutation({
      idToken: credentialResponse.credential ?? '',
    })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
        <Card className="w-full max-w-[400px]">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-lg">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facility">Cơ sở</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Lựa chọn cơ sở" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facility1">Hòa Lạc</SelectItem>
                    <SelectItem value="facility2">Hồ Chí Minh</SelectItem>
                    <SelectItem value="facility3">Đà Nẵng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Đăng nhập
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <GoogleLogin width={'100%'} onSuccess={handleGoogleLogin} />
              </div>
              <div className="text-sm text-center">
                <Link
                  to="/forgot-pass"
                  className="text-orange-500 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right side - Background image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/FPT_University.jpeg')" }}
      >
        <div className="h-full w-full bg-black/40 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg">
              Sign in to access your account and manage your facilities
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
