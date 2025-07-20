import { CheckCircle, Clock, Star, XCircle } from 'lucide-react'

interface StatusIconProps {
  status: string
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'active':
      return <Star className="h-4 w-4" />
    case 'completed':
      return <CheckCircle className="h-4 w-4" />
    case 'draft':
      return <Clock className="h-4 w-4" />
    case 'archived':
      return <XCircle className="h-4 w-4" />
    default:
      return <XCircle className="h-4 w-4" />
  }
}
