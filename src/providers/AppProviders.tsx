import { FC, ReactNode } from 'react'
import { AppProvidersProps } from './AppProviders.type'
import ApiClientContextController from '@/context/apiClient/apiClientContextController/ApiClientContextController'

const AppProviders: FC<AppProvidersProps> = ({
  children,
}: AppProvidersProps): ReactNode => {
  return <ApiClientContextController>{children} </ApiClientContextController>
}

export default AppProviders
