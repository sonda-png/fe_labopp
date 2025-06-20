import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Settings, Users, BookOpen, GraduationCap } from "lucide-react"

// Dữ liệu cứng cho các lớp học
const classData = [
  {
    id: 1,
    name: "Summer2025 - LAB211 - IA1908",
    status: "Inactive",
    mentors: "Nguyễn Đình Mạnh Linh - LinhNDM3, Nguyễn Thị Hải Nang - nangnth",
    studentsCount: 32,
    assignmentsCount: 73,
    subject: "LAB 02- Java OOP",
  },
  {
    id: 2,
    name: "Summer2025 - LAB211 - SE1967",
    status: "Inactive",
    mentors: "Nguyễn Đình Mạnh Linh - LinhNDM3, Nguyễn Thị Hải Nang - nangnth",
    studentsCount: 31,
    assignmentsCount: 72,
    subject: "LAB 02- Java OOP",
  },
  {
    id: 3,
    name: "Summer2025 - LAB211 - SE1968",
    status: "Inactive",
    mentors: "Nguyễn Thị Hải Nang - nangnth",
    studentsCount: 30,
    assignmentsCount: 106,
    subject: "LAB 02- Java OOP",
  },
  {
    id: 4,
    name: "Summer2025 - LAB211 - SE1973",
    status: "Active",
    mentors: "Nguyễn Thị Hải Nang - nangnth",
    studentsCount: 30,
    assignmentsCount: 127,
    subject: "LAB 02- Java OOP",
  },
]

export default function ClassManagement() {
  const handleStartLabServer = (classId: number, className: string) => {
    console.log(`Starting lab server for class: ${className}`)
    // Xử lý khởi tạo lab server
  }

  const handleClassSettings = (classId: number, className: string) => {
    console.log(`Opening settings for class: ${className}`)
    // Xử lý cài đặt lớp học
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="text-gray-600">Xem và truy cập các lớp được phân công</p>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classData.map((classItem) => (
          <Card key={classItem.id} className="relative overflow-hidden border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</CardTitle>
                  <Badge
                    variant={classItem.status === "Active" ? "default" : "secondary"}
                    className={
                      classItem.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                    }
                  >
                    {classItem.status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-green-200 hover:bg-green-50"
                    onClick={() => handleStartLabServer(classItem.id, classItem.name)}
                  >
                    <Play className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50"
                    onClick={() => handleClassSettings(classItem.id, classItem.name)}
                  >
                    <Settings className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mentors */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Mentors</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{classItem.mentors}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Students</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {classItem.studentsCount}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-600" />
                    <span className="text-sm font-medium text-gray-700">Assignments</span>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
                    {classItem.assignmentsCount}
                  </Badge>
                </div>
              </div>
            </CardContent>

            {/* Status indicator bar */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 ${
                classItem.status === "Active" ? "bg-green-500" : "bg-orange-400"
              }`}
            />
          </Card>
        ))}
      </div>

      {/* Empty state if no classes */}
      {classData.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lớp học nào</h3>
          <p className="text-gray-600">Bạn chưa được phân công lớp học nào.</p>
        </div>
      )}
    </div>
  )
}
