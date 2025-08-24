"use client"

import { useState } from "react"
import { useQuery } from "@/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Code, Eye, X, FileText, Clock, TrendingUp, ChevronDown } from "lucide-react"
import { studentAssignmentQueries } from "@/api/actions/student-assignment/student-assignment.queries"
import { StudentLabAssignment } from "@/api/actions/student-assignment/student-assignment.type"

const SelectedAssignments = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [removedIds, setRemovedIds] = useState<number[]>([])

  // Lấy data thật từ API
  const { data: selectedAssignments = [], isLoading, error } = useQuery({
    ...studentAssignmentQueries.getAll(),
  })

  // Xử lý xóa assignment khỏi danh sách hiển thị (chỉ local, không gọi API xóa)
  const handleRemoveAssignment = (id: number) => {
    setRemovedIds((prev) => [...prev, id])
  }

  // Lọc assignment đã bị xóa
  const visibleAssignments = selectedAssignments.filter(
    (assignment: StudentLabAssignment) => !removedIds.includes(assignment.id),
  )

  // Lọc theo search
  const filteredAssignments = visibleAssignments.filter(
    (assignment) =>
      assignment.assignmentId.toString().includes(searchTerm.toLowerCase()) ||
      assignment.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selected Assignments</h2>
        <p className="text-gray-600">Manage your selected lab assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Selected Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{visibleAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lines of Code</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* Nếu có trường linesOfCode thì cộng lại, nếu không thì để 0 */}
                  {visibleAssignments.reduce((sum, assignment) => sum + (0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Submission</p>
                <p className="text-2xl font-bold text-gray-900">{visibleAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by assignmentId or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Created date
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Descending
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 px-6">
        Showing {filteredAssignments.length} of {visibleAssignments.length} selected assignments
      </p>

      {/* Assignment Cards */}
      <div className="px-6 pb-6">
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading assignments...</h3>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading assignments</h3>
              <p className="text-gray-500">{String(error)}</p>
            </div>
          </Card>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        Assignment #{assignment.assignmentId}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {assignment.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    Semester: {assignment.semesterId}
                  </p>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Submitted At: {assignment.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Unselected
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments selected</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No assignments match your search criteria."
                    : "You haven't selected any assignments yet."}
                </p>
              </div>
              {!searchTerm && <Button className="mt-4">Browse Assignments</Button>}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SelectedAssignments
