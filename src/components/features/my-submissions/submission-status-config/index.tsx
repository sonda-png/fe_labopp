import { CheckCircle, Clock, XCircle } from "lucide-react";

// Status configuration
export const statusConfig = {
  Draft: {
    label: 'Draft',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  Passed: {
    label: 'Passed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  Reject: {
    label: 'Reject',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
}
