import { BookOpen } from 'lucide-react'

export const PageHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Assignment Management
        </h1>
        <p className="text-gray-600">List of lab assignments</p>
      </div>
    </div>
  )
}
