import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Shield, ArrowLeft, Lock } from 'lucide-react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'

export const ForbiddenPage = () => {
  const router = useRouter()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="relative inline-block">
              <Shield className="w-24 h-24 text-muted-foreground mx-auto" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                403
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Truy cập bị từ chối
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Bạn không có quyền truy cập vào trang này.
            </p>
            <p className="text-sm text-muted-foreground">
              Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <Lock className="w-5 h-5" />
              <span className="font-medium text-sm">
                Tài nguyên được bảo vệ - Cần quyền truy cập đặc biệt
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Home className="w-4 h-4" />
              Về trang chủ
            </Button>

            <Button
              variant="outline"
              onClick={() => router.history.back()}
              className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Cần hỗ trợ?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/home"
                className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                Trang chủ
              </Link>
              <span className="text-orange-600 hover:text-orange-700 hover:underline cursor-pointer flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Liên hệ hỗ trợ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
