import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'

export const NotFoundPage = () => {
  const router = useRouter()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="relative inline-block">
              <FileQuestion className="w-24 h-24 text-muted-foreground mx-auto" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Không tìm thấy trang
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
            </p>
            <p className="text-sm text-muted-foreground">
              Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
            </p>
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
            <p className="text-sm text-muted-foreground mb-4">
              Bạn có thể thử:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/home"
                className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                Trang chủ
              </Link>
              <Link
                to="/about"
                className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                Về chúng tôi
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
