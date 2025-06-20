import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const GlobalLoadingIndicator = () => {
  const status = useRouterState({ select: s => s.status })

  useEffect(() => {
    if (status === 'pending') {
      NProgress.start()
      document.body.style.overflow = 'hidden'
    } else {
      NProgress.done()
      document.body.style.overflow = 'auto'
    }
  }, [status])

  const isLoading = useRouterState({ select: s => s.status === 'pending' })

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
    </div>
  )
}
