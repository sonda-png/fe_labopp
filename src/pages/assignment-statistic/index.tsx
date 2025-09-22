import { useMemo, useState } from 'react'
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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function ClassProgressDashboard() {
  const [selectedClass, setSelectedClass] =
    useState<AssignmentStatistic | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const { data: assignmentStatisticData } = useQuery({
    ...assignmentManageQueries.getStatistic(),
  })

  const chartData = useMemo(
    () =>
      (assignmentStatisticData ?? []).map(cls => ({
        name: cls.className,
        total: cls.totalStudents,
        passed: cls.studentsPassed,
        failed: Math.max(0, cls.totalStudents - cls.studentsPassed),
        passRate: cls.passRate,
      })),
    [assignmentStatisticData]
  )

  const chartConfig = {
    total: { label: 'Total', color: '#94a3b8' },
    passed: { label: 'Passed', color: '#22c55e' },
    failed: { label: 'Failed', color: '#ef4444' },
    passRate: { label: 'Pass rate (%)', color: '#f59e0b' },
  } as const

  const getPassRateStatus = (passRate: number) => {
    if (passRate >= 80)
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Good' }
    if (passRate >= 60)
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Average',
      }
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'Need improvement' }
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
              Go back to class list
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Class progress {selectedClass.className}
                  </h1>
                  <p className="text-gray-600">
                    Class ID: {selectedClass.classId}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="text-black bg-white hover:bg-gray-100 border border-gray-200"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total students
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
                  Passed students
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
                  Pass rate
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
                  Status
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
              <CardTitle>Progress details</CardTitle>
              <CardDescription>
                Detailed information about the progress of the class{' '}
                {selectedClass.className}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">
                      Students not passed
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedClass.totalStudents -
                        selectedClass.studentsPassed}{' '}
                      students
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
                Class progress
              </h1>
              <p className="text-gray-600">
                List of classes in the current semester
              </p>
            </div>
          </div>
        </div>

        {/* Overall chart (toàn bộ các lớp học) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall across classes</CardTitle>
            <CardDescription>
              Total, passed, failed students and pass rate per class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[360px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="total"
                  fill={chartConfig.total.color}
                />
                <Bar
                  yAxisId="left"
                  dataKey="passed"
                  fill={chartConfig.passed.color}
                />
                <Bar
                  yAxisId="left"
                  dataKey="failed"
                  fill={chartConfig.failed.color}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="passRate"
                  stroke={chartConfig.passRate.color}
                  dot={false}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Per-class charts (biểu đồ từng môn) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentStatisticData?.map((classData: AssignmentStatistic) => {
            const status = getPassRateStatus(classData.passRate)
            const failed = Math.max(
              0,
              classData.totalStudents - classData.studentsPassed
            )

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
                  <CardDescription>
                    Class code: {classData.classId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-3">
                      <ChartContainer
                        config={chartConfig}
                        className="w-full h-[180px]"
                      >
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            dataKey="value"
                            nameKey="name"
                            data={[
                              {
                                name: 'passed',
                                value: classData.studentsPassed,
                              },
                              { name: 'failed', value: failed },
                            ]}
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            <Cell fill={chartConfig.passed.color} />
                            <Cell fill={chartConfig.failed.color} />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total</span>
                        <span className="font-medium">
                          {classData.totalStudents}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Passed</span>
                        <span className="font-medium text-green-600">
                          {classData.studentsPassed}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Failed</span>
                        <span className="font-medium text-red-600">
                          {failed}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Pass rate</span>
                        <span className="font-bold">{classData.passRate}%</span>
                      </div>
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
