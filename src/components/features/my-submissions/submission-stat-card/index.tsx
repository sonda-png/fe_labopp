import { Card, CardContent } from "@/components/ui/card"

export const MySubmissionStatsCard = ({
  icon: Icon,
  title,
  value,
  bgColor,
  textColor,
}: {
  icon: any
  title: string
  value: number
  bgColor: string
  textColor: string
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)
