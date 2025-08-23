import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  BookOpen,
  GraduationCap,
  Eye,
  Calendar,
  Hash,
  Trophy,
  Play,
  Pause,
  Clock,
} from 'lucide-react'
import { useQuery } from '@/hooks/useQuery/useQuery'
import { teacherDashboardQueries } from '@/api/actions/teacher-dashboard/teacher-dashboard.queries'
import { classMutations } from '@/api/actions/class/class.mutations'
import { classQueries } from '@/api/actions/class/class.queries'
import type { TeacherClass } from '@/api/actions/teacher-dashboard/teacher-dashboard.type'
import type { ClassStatus } from '@/api/actions/class/class.type'
import { authStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { useApiClient } from '@/hooks/useApiClient/useApiClient'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useMutation } from '@/hooks'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

// Component to display class status indicator
function ClassStatusIndicator({ classId }: { classId: string }) {
  const {
    data: classStatusList,
    isLoading,
    error,
  } = useQuery(classQueries.getAll())
  // If there's an error (like 404) or loading, show gray indicator
  if (isLoading || error || !classStatusList) {
    return (
      <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-600" />
    )
  }

  // Find the status for this specific class
  const currentClassStatus = classStatusList.find(
    (status: ClassStatus) => status.classId === classId
  )
  const isEnabled = currentClassStatus?.isEnabled ?? false

  return (
    <div
      className={`h-1 w-full ${
        isEnabled
          ? 'bg-gradient-to-r from-green-400 to-green-600'
          : 'bg-gradient-to-r from-orange-400 to-orange-600'
      }`}
    />
  )
}

// Component to display class status with real-time data and toggle button
function ClassStatusDisplay({
  classId,
  onToggleStatus,
  isUpdating,
}: {
  classId: string
  onToggleStatus: (classId: string, currentStatus: boolean) => void
  isUpdating: boolean
}) {
  const {
    data: classStatusList,
    isLoading,
    error,
  } = useQuery(classQueries.getAll())

  // Find the status for this specific class
  const currentClassStatus = classStatusList?.find(
    (status: ClassStatus) => status.classId === classId
  )
  const isEnabled = currentClassStatus?.isEnabled ?? false

  if (isLoading) {
    return (
      <div className="min-h-[120px] flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">
              Loading status...
            </span>
          </div>
          <Button
            disabled={true}
            size="sm"
            className="w-full h-10 bg-gray-400 text-white border-0"
          >
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm">Loading...</span>
            </div>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[120px] flex flex-col justify-between">
      {/* Status Display Section - Fixed Height */}
      <div className="space-y-3">
        {error || !currentClassStatus ? (
          // Class Not Started State
          <div className="p-3 bg-orange-50 rounded-lg border h-[120px] border-orange-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-700 font-medium">
                Class Not Started
              </span>
            </div>
          </div>
        ) : isEnabled ? (
          // Class Active State
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 h-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Class Active</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium text-green-600">Start</p>
                  <p className="font-semibold text-green-700">
                    {new Date(
                      currentClassStatus.startTime
                    ).toLocaleTimeString()}
                  </p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium text-green-600">End</p>
                  <p className="font-semibold text-green-700">
                    {new Date(currentClassStatus.endTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Class Inactive State
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-700 font-medium">
                Class Inactive
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button Section - Fixed Position */}
      <div className="pt-2">
        <Button
          onClick={() => onToggleStatus(classId, isEnabled)}
          disabled={isUpdating}
          size="sm"
          className={`w-full h-10 transition-all duration-200 ${
            isEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          } ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm">Updating...</span>
            </div>
          ) : isEnabled ? (
            <div className="flex items-center justify-center gap-2">
              <Pause className="h-4 w-4" />
              <span className="text-sm font-medium">Stop Class</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Start Class</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function ClassManagement() {
  const teacherId = authStore.getState().authValues.userId
  const navigate = useNavigate()
  const [updatingClassId, setUpdatingClassId] = useState<string | null>(null)

  const {
    data: classListData,
    isLoading,
    error,
    refetch,
  } = useQuery(teacherDashboardQueries.classList(teacherId))

  const { refetch: refetchClassStatus } = useQuery(classQueries.getAll())
  const handleViewClass = (classId: string) => {
    navigate({ to: '/student-manage', search: { classId } })
  }

  const { mutateAsync: startClassMutation } = useMutation(
    'startClassMutation',
    {
      onSuccess: () => {
        toast.success('Class started successfully')
        refetch() // Refresh the class list
        refetchClassStatus()
      },
      onError: (error: StandardizedApiError) => {
        toast.error(error.message || 'Error occurred while starting class', {
          toastId: 'start-class-error',
        })
      },
    }
  )

  const { mutateAsync: stopClassMutation } = useMutation('stopClassMutation', {
    onSuccess: () => {
      toast.success('Class stopped successfully')
      refetch() // Refresh the class list
      refetchClassStatus()
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message || 'Error occurred while stopping class', {
        toastId: 'stop-class-error',
      })
    },
  })

  const handleToggleClassStatus = async (
    classId: string,
    currentStatus: boolean
  ) => {
    setUpdatingClassId(classId)
    try {
      if (currentStatus) {
        await stopClassMutation(classId)
      } else {
        await startClassMutation(classId)
      }
    } finally {
      setUpdatingClassId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Error loading classes
        </h3>
        <p className="text-muted-foreground">
          {error?.message || 'An error occurred'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <GraduationCap className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Class Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and access your assigned classes
            </p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {classListData?.length || 0} Classes
        </Badge>
      </div>

      <Separator />

      {/* Class Cards Grid */}
      {classListData && classListData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classListData.map((classItem: TeacherClass) => (
            <Card
              key={classItem.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {classItem.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      ID: {classItem.id}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                  >
                    {classItem.subject}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Class Information Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Subject
                      </p>
                      <p className="font-semibold">{classItem.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">Year</p>
                      <p className="font-semibold">{classItem.academicYear}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Hash className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Semester
                      </p>
                      <p className="font-semibold">{classItem.semester}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Users className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        LOC Pass
                      </p>
                      <p className="font-semibold">{classItem.locToPass}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Real-time Class Status with Toggle Button */}
                <ClassStatusDisplay
                  classId={classItem.id}
                  onToggleStatus={handleToggleClassStatus}
                  isUpdating={updatingClassId === classItem.id}
                />

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleViewClass(classItem.id)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Class
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-muted bg-transparent"
                    onClick={() =>
                      navigate({
                        to: '/loc-ranking',
                        search: { classId: classItem.id },
                      })
                    }
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    LOC Ranking
                  </Button>
                </div>
              </CardContent>

              {/* Status Indicator - Based on real-time data */}
              <ClassStatusIndicator classId={classItem.id} />
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No classes available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't been assigned to any classes yet. Contact your
            administrator if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  )
}
