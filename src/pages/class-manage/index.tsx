"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, BookOpen, GraduationCap, Eye, Calendar, Hash, Trophy } from "lucide-react"
import { useQuery } from "@/hooks/useQuery/useQuery"
import { teacherDashboardQueries } from "@/api/actions/teacher-dashboard/teacher-dashboard.queries"
import type { TeacherClass } from "@/api/actions/teacher-dashboard/teacher-dashboard.type"
import { authStore } from "@/stores/authStore"
import { useNavigate } from "@tanstack/react-router"

export default function ClassManagement() {
  const teacherId = authStore.getState().authValues.userId
  const navigate = useNavigate()
  console.log("Current Teacher ID:", teacherId)

  const { data: classListData, isLoading, error } = useQuery(teacherDashboardQueries.classList(teacherId))
  console.log("Class List Data:", classListData)

  const handleViewClass = (classId: string) => {
    navigate({ to: "/student-manage", search: { classId } })
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
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading classes</h3>
        <p className="text-muted-foreground">{error?.message || "An error occurred"}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <GraduationCap className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
            <p className="text-muted-foreground mt-1">Manage and access your assigned classes</p>
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
                    <p className="text-sm text-muted-foreground mt-1 font-mono">ID: {classItem.id}</p>
                  </div>
                  <Badge
                    variant={classItem.isActive ? "default" : "secondary"}
                    className={
                      classItem.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"
                    }
                  >
                    {classItem.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Class Information Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">Subject</p>
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
                      <p className="font-medium text-muted-foreground">Semester</p>
                      <p className="font-semibold">{classItem.semester}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Users className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-muted-foreground">LOC Pass</p>
                      <p className="font-semibold">{classItem.locToPass}</p>
                    </div>
                  </div>
                </div>

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
                    onClick={() => navigate({ to: "/loc-ranking", search: { classId: classItem.id } })}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    LOC Ranking
                  </Button>
                </div>
              </CardContent>

              {/* Status Indicator */}
              <div
                className={`h-1 w-full ${
                  classItem.isActive
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-orange-400 to-orange-600"
                }`}
              />
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
            You haven't been assigned to any classes yet. Contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  )
}
