import { useState } from 'react'
import { Search, Eye, Trophy, Medal, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useSearch } from '@tanstack/react-router'
import { Route as LOCRankingRoute } from '@/routes/_auth/loc-ranking'
import { useQuery } from '@/hooks/useQuery/useQuery'
import { locRankingQueries } from '@/api/actions/loc-ranking/loc-ranking.queries'
import type {
  LocRankingResponse,
  StudentRankingData,
} from '@/api/actions/loc-ranking/loc-ranking.type'

export default function LOCRankingSystem() {
  const search = useSearch({ from: LOCRankingRoute.id })
  const [selectedStudent, setSelectedStudent] =
    useState<StudentRankingData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: rankingData,
    isLoading,
    error,
  } = useQuery<LocRankingResponse>(
    locRankingQueries.getLocRanking(search.classId)
  )

  // For debugging
  console.log('Debug Data:', {
    rankingData,
    isLoading,
    error,
    classId: search.classId,
    hasData: rankingData?.data?.length,
    success: rankingData?.success,
  })

  const students = rankingData?.data || []
  const filteredStudents = students.filter(
    student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading rankings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl">⚠️ Error loading data</div>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!rankingData?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-yellow-500 text-xl">⚠️ No data available</div>
          <p className="text-muted-foreground">
            Could not load ranking data. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-blue-600">
            #{rank}
          </span>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LOC Ranking</h1>
              <p className="text-sm text-gray-500">
                View and track student LOC rankings for class {search.classId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredStudents.length === 0 && !isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            filteredStudents.map(student => (
              <Card
                key={student.studentId}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadgeColor(student.rank)}`}
                      >
                        {getRankIcon(student.rank)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {student.fullName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({student.studentId})
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total LOC</div>
                        <div className="font-semibold text-gray-900">
                          {student.totalLOC}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Passed Assignments
                        </div>
                        <div className="font-semibold text-gray-900">
                          {student.passedAssignments}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Student Detail Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-xl">
                    {selectedStudent.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-gray-500">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500">
                    Student ID: {selectedStudent.studentId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Total LOC</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedStudent.totalLOC}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">
                    Passed Assignments
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedStudent.passedAssignments}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Current Rank</div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadgeColor(selectedStudent.rank)}`}
                  >
                    {getRankIcon(selectedStudent.rank)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    Rank #{selectedStudent.rank}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
