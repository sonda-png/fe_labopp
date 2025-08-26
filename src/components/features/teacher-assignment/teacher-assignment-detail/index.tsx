import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { TeacherAssignment } from '@/api/actions/teacher-assignment/teacher-assignment.type'
import { StatusIcon } from '@/components/common/status-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useQuery } from '@/hooks'
import {
  calculatePassRate,
  getAssignmentStatus,
} from '@/utils/helpers/teacher-assignment-helper'
import { getStatusColor, getStatusText } from '@/utils/helpers/getStatusData'
import { useParams } from '@tanstack/react-router'
import { BookOpen, Calendar, Code, Edit, Trash2, Users } from 'lucide-react'
import { toast } from 'react-toastify'

interface TeacherAssignmentDetailProps {
  isDetailModalOpen: boolean
  setIsDetailModalOpen: (isDetailModalOpen: boolean) => void
  assignmentId: string | undefined
  openEditModal: (assignment: TeacherAssignment) => void
}

export const TeacherAssignmentDetail = ({
  isDetailModalOpen,
  setIsDetailModalOpen,
  assignmentId,
  openEditModal,
}: TeacherAssignmentDetailProps) => {
  const { classId } = useParams({ from: '/_auth/teacher-assignment/$classId/' })

  const { data: assignmentDetailData } = useQuery({
    ...teacherAssignmentQueries.getDetail(assignmentId),
  })

  const deleteAssignmentMutation = () => {
    toast.error('Function is under development')
  }

  const handleDeleteAssignment = (assignment: TeacherAssignment) => {
    if (
      confirm(`Are you sure you want to delete assignment "${assignment.title}"?`)
    ) {
      deleteAssignmentMutation()
    }
  }
  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Assignment Detail
          </DialogTitle>
          <DialogDescription>
            Assignment detail "{assignmentDetailData?.title}"
          </DialogDescription>
        </DialogHeader>

        {assignmentDetailData && (
          <div className="py-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <Badge
                className={`${getStatusColor(getAssignmentStatus(assignmentDetailData))} text-white px-4 py-2 text-base`}
              >
                <StatusIcon
                  status={getAssignmentStatus(assignmentDetailData)}
                />
                <span className="ml-2">
                  {getStatusText(getAssignmentStatus(assignmentDetailData))}
                </span>
              </Badge>
              <div className="text-sm text-gray-500">
                ID: {assignmentDetailData.id}
              </div>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Title
                        </Label>
                        <p className="text-base text-gray-900 mt-1">
                          {assignmentDetailData.title}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Description
                        </Label>
                        <p className="text-base text-gray-900 mt-1 leading-relaxed">
                          {assignmentDetailData.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            LOC Target
                          </Label>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            {assignmentDetailData.locTarget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Class
                          </Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {classId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                      Time
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Due Date
                        </Label>
                        <p className="text-base text-gray-900 mt-1 font-medium">
                          {new Date(
                            assignmentDetailData.dueDate
                          ).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(assignmentDetailData.dueDate) > new Date()
                            ? `Still ${Math.ceil((new Date(assignmentDetailData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                            : 'Expired'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Assignment Status
                        </Label>
                        <div className="flex items-center mt-2">
                          <Badge
                            className={`${getStatusColor(getAssignmentStatus(assignmentDetailData))} text-white`}
                          >
                            <StatusIcon
                              status={getAssignmentStatus(assignmentDetailData)}
                            />
                            <span className="ml-1">
                              {getStatusText(
                                getAssignmentStatus(assignmentDetailData)
                              )}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-orange-500" />
                      Submissions Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-3xl font-bold text-blue-600">
                            {assignmentDetailData.totalSubmissions || 0}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            Total submissions
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-3xl font-bold text-green-600">
                            {assignmentDetailData.passedCount || 0}
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Passed
                          </p>
                        </div>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-4xl font-bold text-orange-600">
                          {calculatePassRate(assignmentDetailData)}%
                        </p>
                        <p className="text-sm text-orange-600 font-medium">
                          Pass rate
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion rate</span>
                          <span className="font-medium">
                            {calculatePassRate(assignmentDetailData)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${calculatePassRate(assignmentDetailData)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2 text-orange-500" />
                      Technical Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600">
                            LOC Target
                          </Label>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {assignmentDetailData.locTarget.toLocaleString()}{' '}
                            dòng
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            LOC Target
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <Label className="text-sm font-medium text-gray-600">
                            Difficulty
                          </Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {assignmentDetailData.locTarget < 200
                              ? 'Easy'
                              : assignmentDetailData.locTarget < 500
                                ? 'Medium'
                                : assignmentDetailData.locTarget < 1000
                                  ? 'Hard'
                                  : 'Very Hard'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Based on LOC Target
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsDetailModalOpen(false)
                          openEditModal(assignmentDetailData)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit assignment
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        View submissions list
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => {
                          setIsDetailModalOpen(false)
                          handleDeleteAssignment(assignmentDetailData)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
