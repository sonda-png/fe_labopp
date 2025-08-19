import { useState, useEffect, ReactNode } from 'react'
import {
  ArrowLeft,
  Mail,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@tanstack/react-router'

export const ForgotPasswordPage = (): ReactNode => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>(
    'email'
  )
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSendOTP = async () => {
    setErrors({})

    if (!email) {
      setErrors({ email: 'Please enter your email address' })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Invalid email address' })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
      setCountdown(60) // Start 60 second countdown
    }, 2000)
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCountdown(60) // Reset countdown
    }, 1000)
  }

  const handleVerifyOTP = async () => {
    setErrors({})

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (otp === '123456') {
        // Mock verification
        setStep('reset')
      } else {
        setErrors({ otp: 'Invalid OTP' })
      }
    }, 1500)
  }

  const handleResetPassword = async () => {
    setErrors({})

    if (!newPassword) {
      setErrors({ newPassword: 'Please enter a new password' })
      return
    }

    if (!validatePassword(newPassword)) {
      setErrors({ newPassword: 'Password must be at least 8 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Confirm password does not match' })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('success')
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Class Tracking System
          </h1>
          <p className="text-gray-600 mt-2">Class Tracking System</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-lg border-orange-200/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {step === 'email' && 'Forgot password'}
              {step === 'otp' && 'OTP verification'}
              {step === 'reset' && 'Reset password'}
              {step === 'success' && 'Success'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 'email' &&
                'Enter your email to receive the verification code'}
              {step === 'otp' && `The OTP has been sent to ${email}`}
              {step === 'reset' && 'Create a new password for your account'}
              {step === 'success' && 'Password has been reset successfully'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-700 font-medium">
                    OTP (6 digits)
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                      setOtp(value)
                    }}
                    className={`text-center text-lg tracking-widest font-mono border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.otp ? 'border-red-500' : ''
                    }`}
                    maxLength={6}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Did not receive OTP?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isLoading}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium"
                  >
                    <RefreshCw
                      className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`}
                    />
                    {countdown > 0
                      ? `Resend (${formatTime(countdown)})`
                      : 'Resend'}
                  </Button>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-gray-700 font-medium"
                  >
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className={`pr-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        errors.newPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Enter new password again"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`pr-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Password requirements:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          newPassword.length >= 8
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[A-Z]/.test(newPassword)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span>At least 1 uppercase letter</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[0-9]/.test(newPassword)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span>At least 1 number</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Password reset successfully!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your password has been updated. You can login with the new
                    password.
                  </p>
                </div>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5">
                    Login now
                  </Button>
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {step !== 'success' && (
              <div className="pt-4 border-t border-gray-200">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go back to login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Class Tracking System. All rights reserved.</p>
          <p className="mt-1">FPT University</p>
        </div>
      </div>
    </div>
  )
}
