import { FallbackProps } from 'react-error-boundary'

const FallbackRender = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <span>Something went wrong:</span>
      <pre className="text-red-500">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default FallbackRender
