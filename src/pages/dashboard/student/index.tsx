
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Code,
  FileText,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  GraduationCap,
  CheckCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { dashboardStudentQueries } from '@/api/actions/dashboard-student/dashboard-student.queries';
import { useQuery } from '@/hooks/useQuery/useQuery';



export const StudentDashboard = () => {
  // Lấy dữ liệu từ 2 API
  const { data: progressRes, isLoading: loadingProgress, isError: errorProgress } = useQuery(dashboardStudentQueries.getProgress());
  const { data: profileRes, isLoading: loadingProfile, isError: errorProfile } = useQuery(dashboardStudentQueries.getProfile());

  const progressData = progressRes;
  const profile = profileRes;

  if (loadingProgress || loadingProfile) {
    return <div className="p-8 text-center text-lg">Loading dashboard...</div>;
  }
  if (errorProgress || errorProfile || !progressData || !profile) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  // Parse dữ liệu từ API progress
  // "Total LOC": "2160/750", "Assignment": "1/3", "Ranking": "1/1"
  const [totalLOC, targetLOC] = progressData["Total LOC"].split('/').map(Number);
  const [completedAssignments, totalAssignments] = progressData["Assignment"].split('/').map(Number);
  const [rank, totalStudents] = progressData["Ranking"].split('/').map(Number);
  const progressPercentage = targetLOC ? (totalLOC / targetLOC) * 100 : 0;
  const assignmentProgress = totalAssignments ? (completedAssignments / totalAssignments) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {profile.name}!
            </h1>
            <p className="text-gray-600">
              {profile.studentCode}
            </p>
          </div>
        </div>
        <div className="text-right">
          {/* GPA và Pass Rate không có trong API, có thể bỏ hoặc lấy từ API khác nếu có */}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total LOC</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalLOC.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  / {targetLOC.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Code className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progressPercentage} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </Progress>
              <p className="text-xs text-gray-500 mt-1">
                {progressPercentage.toFixed(1)}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedAssignments}
                </p>
                <p className="text-sm text-gray-500">
                  / {totalAssignments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={assignmentProgress} className="h-2 bg-gray-200">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${assignmentProgress}%` }}
                />
              </Progress>
              <p className="text-xs text-gray-500 mt-1">
                {assignmentProgress.toFixed(1)}% completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ranking</p>
                <p className="text-3xl font-bold text-gray-900">
                  #{rank}
                </p>
                <p className="text-sm text-gray-500">
                  / {totalStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +3 positions this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {/* Không có subjects trong API, có thể bỏ hoặc lấy từ API khác nếu cần */}
                  0
                </p>
                <p className="text-sm text-gray-500">subjects enrolled</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                {/* Không có dữ liệu subject completed */}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects Progress */}
        
        {/* Profile (view-only) */}
        <Card className="border-amber-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-600">Student Profile</CardTitle>
            <CardDescription>View your personal information (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
           

            <Separator className="my-6 bg-amber-100" />

            {/* Read-only fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={profile.name} disabled readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studentCode">Student code</Label>
                <Input id="studentCode" value={profile.studentCode} disabled readOnly />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={profile.phone} disabled readOnly />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major">Major</Label>
                <Input id="major" value={profile.major} disabled readOnly />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dob">Date of birth</Label>
                <Input id="dob" value={new Date(profile.dateOfBirth).toLocaleDateString("en-GB")} disabled readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={profile.gender} disabled readOnly />
              </div>

              <div className="md:col-span-2 grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={profile.address} disabled readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick info */}
        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-600">Quick info</CardTitle>
            <CardDescription>Contact & Academics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Contact</div>
              <div className="rounded-lg border border-amber-100 p-3 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="line-clamp-1 font-medium">{profile.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium uppercase text-muted-foreground">Academics</div>
              <div className="rounded-lg border border-amber-100 p-3 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Major</span>
                    <span className="font-medium">{profile.major}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Class</span>
                    {/* Không có class trong API */}
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cohort</span>
                    {/* Không có cohort trong API */}
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date of birth</span>
                    <span className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
              </div>
            </div>

            
               
              
            
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto p-4 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Submit New</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span>View Statistics</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule</span>
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 h-auto p-4 flex-col space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>Leaderboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard
