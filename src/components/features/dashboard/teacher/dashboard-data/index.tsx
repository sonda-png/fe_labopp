import React from 'react'
import { useQuery } from '@/hooks'
import { teacherDashboardQueries } from '@/api/actions/teacher-dashboard/teacher-dashboard.queries'
import { DashboardData } from '@/api/actions/teacher-dashboard/teacher-dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, TrendingUp, Clock } from 'lucide-react'

interface DashboardDataProps {
  classId: string
  onBack?: () => void
}

export function dashboard({ classId, onBack }: DashboardDataProps) {
  const { data, isLoading } = useQuery(
    teacherDashboardQueries.dashboard(classId)
  )
  const dashboard: DashboardData | undefined = data

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-white text-black border border-gray-200 rounded hover:bg-gray-100"
      >
        ← Back to class list
      </button>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Class Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading...</div>}
          {!isLoading && dashboard && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded bg-green-100 text-center">
                  <Users className="mx-auto mb-1 text-green-700" />
                  <div className="text-2xl font-bold">
                    {dashboard.totalStudents}
                  </div>
                  <div className="text-sm text-gray-700">Total Students</div>
                </div>
                <div className="p-4 rounded bg-yellow-100 text-center">
                  <FileText className="mx-auto mb-1 text-yellow-700" />
                  <div className="text-2xl font-bold">
                    {dashboard.totalAssignments}
                  </div>
                  <div className="text-sm text-gray-700">Assignments</div>
                </div>
                <div className="p-4 rounded bg-red-100 text-center">
                  <Clock className="mx-auto mb-1 text-red-700" />
                  <div className="text-2xl font-bold">
                    {dashboard.submissionsWaitingReview}
                  </div>
                  <div className="text-sm text-gray-700">Waiting Review</div>
                </div>
                <div className="p-4 rounded bg-green-100 text-center">
                  <TrendingUp className="mx-auto mb-1 text-green-700" />
                  <div className="text-2xl font-bold">
                    {dashboard.passRate}%
                  </div>
                  <div className="text-sm text-gray-700">Pass Rate</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Recent Assignments</h3>
                {dashboard.recentAssignments.length === 0 && (
                  <div className="text-gray-500">No recent assignments.</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboard.recentAssignments.map(a => (
                    <Card key={a.code} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="font-bold text-lg mb-1">{a.title}</div>
                        <div className="text-sm text-gray-600 mb-1">
                          Code: {a.code}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span>
                            Target LOC: <b>{a.targetLOC}</b>
                          </span>
                          <span>
                            Passed: <b>{a.passedCount}</b>
                          </span>
                          <span>
                            Total: <b>{a.totalSubmission}</b>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Recent Submissions</h3>
                {dashboard.recentSubmissions.length === 0 && (
                  <div className="text-gray-500">No recent submissions.</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboard.recentSubmissions.map((s, idx) => (
                    <Card key={idx} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="font-bold text-lg mb-1">
                          {s.studentName}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          Assignment: {s.assignmentCode}
                        </div>
                        <div className="flex gap-4 text-sm mb-1">
                          <span>
                            Status:{' '}
                            <Badge className="bg-green-100 text-green-800">
                              {s.status}
                            </Badge>
                          </span>
                          <span>
                            LOC: <b>{s.loc}</b>
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted at:{' '}
                          {new Date(s.submittedAt).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
