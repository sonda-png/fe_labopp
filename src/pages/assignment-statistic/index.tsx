import { useState } from 'react'
import {
  BookOpen,
  Users,
  TrendingUp,
  Download,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AssignmentStatistic } from '@/api/actions/assignment-manage/assignment.types'
import { assignmentManageQueries } from '@/api/actions/assignment-manage/assignment.query'
import { useQuery } from '@/hooks'

export default function ClassProgressDashboard() {
  const [selectedClass, setSelectedClass] =
    useState<AssignmentStatistic | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const { data: assignmentStatisticData } = useQuery({
    ...assignmentManageQueries.getStatistic(),
  })

  const getPassRateStatus = (passRate: number) => {
    if (passRate >= 80)
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Tốt' }
    if (passRate >= 60)
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Trung bình',
      }
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'Cần cải thiện' }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    // Simulate API call
    setTimeout(() => {
      setIsExporting(false)
      // In real implementation, this would call the export API
      console.log('Exporting to Excel...')
    }, 2000)
  }

  const handleClassClick = (classData: AssignmentStatistic) => {
    setSelectedClass(classData)
  }

  const handleBackToList = () => {
    setSelectedClass(null)
  }

  if (selectedClass) {
    const status = getPassRateStatus(selectedClass.passRate)

    return (
      <div className="bg-gray-50">
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="mb-4 text-black bg-white hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách lớp
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Tiến độ lớp {selectedClass.className}
                  </h1>
                  <p className="text-gray-600">
                    Mã lớp: {selectedClass.classId}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="text-black bg-white hover:bg-gray-100 border border-gray-200"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng sinh viên
                </CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedClass.totalStudents}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Sinh viên đạt
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedClass.studentsPassed}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tỷ lệ đạt
                </CardTitle>
                <FileText className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedClass.passRate}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className={`${status.bg} ${status.text} hover:${status.bg}`}
                >
                  {status.label}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Progress Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết tiến độ</CardTitle>
              <CardDescription>
                Thông tin chi tiết về tiến độ học tập của lớp{' '}
                {selectedClass.className}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">
                      Sinh viên chưa đạt
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedClass.totalStudents -
                        selectedClass.studentsPassed}{' '}
                      sinh viên
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      {(
                        ((selectedClass.totalStudents -
                          selectedClass.studentsPassed) /
                          selectedClass.totalStudents) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedClass.passRate}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="   bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tiến độ các lớp
              </h1>
              <p className="text-gray-600">
                Danh sách các lớp trong kì hiện tại
              </p>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng lớp học
              </CardTitle>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {assignmentStatisticData?.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng sinh viên
              </CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {assignmentStatisticData?.reduce(
                  (sum: number, cls: AssignmentStatistic) =>
                    sum + cls.totalStudents,
                  0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tỷ lệ đạt trung bình
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(
                  (assignmentStatisticData?.reduce(
                    (sum: number, cls: AssignmentStatistic) =>
                      sum + cls.passRate,
                    0
                  ) ?? 0) / (assignmentStatisticData?.length ?? 1)
                ).toFixed(1)}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentStatisticData?.map((classData: AssignmentStatistic) => {
            const status = getPassRateStatus(classData.passRate)

            return (
              <Card
                key={classData.classId}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleClassClick(classData)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {classData.className}
                    </CardTitle>
                    <Badge
                      className={`${status.bg} ${status.text} hover:${status.bg}`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <CardDescription>Mã lớp: {classData.classId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Tổng sinh viên:
                      </span>
                      <span className="font-medium">
                        {classData.totalStudents}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sinh viên đạt:
                      </span>
                      <span className="font-medium text-green-600">
                        {classData.studentsPassed}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tỷ lệ đạt:</span>
                      <span className="font-bold text-lg">
                        {classData.passRate}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${classData.passRate}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
