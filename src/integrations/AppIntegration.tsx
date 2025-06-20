import { FC, ReactNode } from 'react'
import { AppIntegrationProps } from './AppIntegrationType'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GlobalLoadingIndicator } from '@/components/common/global-loading-indicator'
import { ENV } from '@/config/env'

const AppIntegration: FC<AppIntegrationProps> = ({
  children,
}: AppIntegrationProps): ReactNode => {
  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      {children}
      <GlobalLoadingIndicator />
      <ToastContainer autoClose={3000} />
    </GoogleOAuthProvider>
  )
}

export default AppIntegration
