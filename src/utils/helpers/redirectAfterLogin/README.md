# Redirect After Login System

Hệ thống này đảm bảo rằng khi người dùng bị logout (do token hết hạn hoặc logout thủ công), sau khi đăng nhập lại họ sẽ được redirect về trang mà họ đang ở trước đó.

## Cách hoạt động

### 1. Khi token hết hạn (401 error)
- Response interceptor sẽ bắt lỗi 401
- Lưu trang hiện tại vào URL parameter `redirect`
- Redirect về `/login?redirect=/current-page`

### 2. Khi user logout thủ công
- Header component sẽ lưu trang hiện tại
- Redirect về `/login?redirect=/current-page`

### 3. Khi user truy cập trang protected mà chưa đăng nhập
- Route guard sẽ lưu trang hiện tại
- Redirect về `/login?redirect=/current-page`

### 4. Sau khi đăng nhập thành công
- Login page sẽ đọc parameter `redirect` từ URL
- Redirect về trang đó, hoặc `/class-manage` nếu không có redirect parameter

## Utility Functions

### `getLoginUrlWithRedirect(currentPath?)`
Tạo URL login với redirect parameter.

```typescript
// Ví dụ:
getLoginUrlWithRedirect() // "/login?redirect=%2Fdashboard"
getLoginUrlWithRedirect('/profile') // "/login?redirect=%2Fprofile"
```

### `getRedirectPath(searchParams, defaultPath?)`
Lấy đường dẫn redirect từ search parameters.

```typescript
// Ví dụ:
getRedirectPath({ redirect: '/dashboard' }) // "/dashboard"
getRedirectPath({}, '/home') // "/home"
```

## Ví dụ sử dụng

### Trong component

```typescript
import {
  getLoginUrlWithRedirect,
  getRedirectPath,
} from '@/utils/helpers/redirectAfterLogin'

// Khi logout
const handleLogout = () => {
  const loginUrl = getLoginUrlWithRedirect()
  navigate({ to: loginUrl })
}

// Khi login thành công
const searchParams = useSearch({ from: '/_public/login/' })
const redirectTo = getRedirectPath(searchParams)
navigate({ to: redirectTo })
```

## URL Examples

- User đang ở `/dashboard` → Token hết hạn → `/login?redirect=%2Fdashboard`
- User đang ở `/profile?tab=settings` → Logout → `/login?redirect=%2Fprofile%3Ftab%3Dsettings`
- User đăng nhập thành công với redirect → Về trang ban đầu
- User đăng nhập thành công không có redirect → `/class-manage`
