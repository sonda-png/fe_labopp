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
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { LoginMutationResponse } from '@/api/actions/auth/auth.types'
import { authStore } from '@/stores/authStore'
import { getNavigateByRole } from '@/utils/helpers/getNavigateByRole'
import { useMutation } from '@/hooks'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schema/loginSchema'

export const LoginPage = () => {
  const { setAuthData } = authStore()
  const search = useSearch({ strict: false })
  const navigate = useNavigate()

  // Setup form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

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

  const handleLoginSuccess = (res: LoginMutationResponse) => {
    setAuthData({
      isAuthenticated: true,
      userId: res.userId,
      email: res.email,
      role: res.role,
      token: res.token,
    })

    toast.success('Login success')
    // handle login navigate
    handleLoginNavigate(res.role)
  }

  const { mutateAsync: googleLoginMutation } = useMutation(
    'loginGoogleMutation',
    {
      onSuccess: (res: LoginMutationResponse) => {
        handleLoginSuccess(res)
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message)
      },
    }
  )

  const { mutateAsync: credentialLoginMutation } = useMutation(
    'credentialLogin',
    {
      onSuccess: (res: LoginMutationResponse) => {
        handleLoginSuccess(res)
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message)
      },
    }
  )

  const handleLogin = async (data: LoginFormData) => {
    await credentialLoginMutation({
      userName: data.username,
      password: data.password,
    })
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    await googleLoginMutation({
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
          <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  {...register('username')}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">
                    Or continue with
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
                  Forgot password?
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
