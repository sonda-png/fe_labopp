import { useState } from 'react'
import {
  RefreshCw,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Users,
  BookOpen,
  Zap,
  Play,
  Pause,
  Eye,
  FileText,
  Calendar,
  Loader2,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Mock data for sync history
const syncHistory = [
  {
    id: 1,
    timestamp: '2024-01-20 14:30:00',
    status: 'success',
    classesFound: 45,
    classesAdded: 3,
    classesUpdated: 12,
    studentsFound: 1250,
    studentsAdded: 25,
    studentsUpdated: 48,
    duration: 125,
    errors: [],
    warnings: ['Lớp LAB211-SE1970 có thông tin không đầy đủ'],
  },
  {
    id: 2,
    timestamp: '2024-01-19 09:15:00',
    status: 'partial',
    classesFound: 42,
    classesAdded: 1,
    classesUpdated: 8,
    studentsFound: 1180,
    studentsAdded: 12,
    studentsUpdated: 35,
    duration: 98,
    errors: ['Không thể kết nối đến FAP API trong 2 lần thử'],
    warnings: [],
  },
  {
    id: 3,
    timestamp: '2024-01-18 16:45:00',
    status: 'failed',
    classesFound: 0,
    classesAdded: 0,
    classesUpdated: 0,
    studentsFound: 0,
    studentsAdded: 0,
    studentsUpdated: 0,
    duration: 15,
    errors: ['FAP API không phản hồi', 'Timeout sau 30 giây'],
    warnings: [],
  },
]

// Mock data for current sync status
const mockSyncData = {
  classes: [
    {
      id: 'LAB211-SE1973',
      name: 'LAB211 - SE1973',
      semester: 'Summer2025',
      instructor: 'Nguyễn Thị Hải Nàng',
      students: 30,
      status: 'new',
      lastSync: null,
    },
    {
      id: 'LAB211-SE1968',
      name: 'LAB211 - SE1968',
      semester: 'Summer2025',
      instructor: 'Nguyễn Thị Hải Nàng',
      students: 30,
      status: 'updated',
      lastSync: '2024-01-15',
      changes: ['Thêm 2 sinh viên mới', 'Cập nhật thông tin giảng viên'],
    },
    {
      id: 'LAB211-IA1908',
      name: 'LAB211 - IA1908',
      semester: 'Summer2025',
      instructor: 'Nguyễn Đình Mạnh Linh',
      students: 32,
      status: 'unchanged',
      lastSync: '2024-01-15',
    },
  ],
  students: [
    {
      id: 'HE173241',
      name: 'Trịnh Đình Dũng',
      email: 'dunghe173241@fpt.edu.vn',
      class: 'LAB211-SE1973',
      status: 'new',
    },
    {
      id: 'HE194829',
      name: 'Nguyễn Tuấn Hùng',
      email: 'hungnthe194829@fpt.edu.vn',
      class: 'LAB211-SE1973',
      status: 'updated',
      changes: ['Cập nhật email'],
    },
  ],
}

export default function FAPSyncPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStep, setSyncStep] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected') // connected, disconnected, error
  const [lastSyncTime, setLastSyncTime] = useState('2024-01-20 14:30:00')
  const [autoSync, setAutoSync] = useState(true)
  const [syncInterval, setSyncInterval] = useState('daily')
  const [selectedSemester, setSelectedSemester] = useState('Summer2025')
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  // Simulate connection test
  const testConnection = async () => {
    setIsConnecting(true)
    setConnectionStatus('disconnected')

    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false)
      setConnectionStatus('connected')
    }, 2000)
  }

  // Simulate sync process
  const startSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    setSyncStep('Đang kết nối đến FAP API...')

    const steps = [
      { step: 'Đang kết nối đến FAP API...', progress: 10 },
      { step: 'Đang lấy danh sách lớp học...', progress: 30 },
      { step: 'Đang lấy danh sách sinh viên...', progress: 50 },
      { step: 'Đang ánh xạ dữ liệu...', progress: 70 },
      { step: 'Đang lưu vào hệ thống...', progress: 90 },
      { step: 'Hoàn thành đồng bộ!', progress: 100 },
    ]

    for (const { step, progress } of steps) {
      setSyncStep(step)
      setSyncProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setLastSyncTime(new Date().toLocaleString('vi-VN'))
    setIsSyncing(false)
  }

  // Preview sync data
  const previewSync = async () => {
    setIsConnecting(true)
    setSyncStep('Đang lấy dữ liệu preview...')

    setTimeout(() => {
      setPreviewData(mockSyncData)
      setShowPreview(true)
      setIsConnecting(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600'
      case 'partial':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'failed':
        return 'bg-red-500 hover:bg-red-600'
      case 'new':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'updated':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'unchanged':
        return 'bg-gray-500 hover:bg-gray-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Thành công'
      case 'partial':
        return 'Một phần'
      case 'failed':
        return 'Thất bại'
      case 'new':
        return 'Mới'
      case 'updated':
        return 'Đã cập nhật'
      case 'unchanged':
        return 'Không thay đổi'
      default:
        return 'Không xác định'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'partial':
        return <AlertTriangle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'new':
        return <Plus className="h-4 w-4" />
      case 'updated':
        return <RefreshCw className="h-4 w-4" />
      case 'unchanged':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredHistory = syncHistory.filter(log => {
    const matchesSearch = log.timestamp
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-orange-500" />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đồng bộ lớp học từ FAP
          </h1>
          <p className="text-gray-600">Hệ thống đồng bộ dữ liệu tự động</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-8">
        {/* Connection Status & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Trạng thái kết nối</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">FAP API</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected'
                        ? 'bg-green-500'
                        : connectionStatus === 'error'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {connectionStatus === 'connected'
                      ? 'Đã kết nối'
                      : connectionStatus === 'error'
                        ? 'Lỗi kết nối'
                        : 'Chưa kết nối'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Lần đồng bộ cuối: {lastSyncTime}
              </div>

              <Button
                onClick={testConnection}
                disabled={isConnecting}
                className="w-full"
                variant={
                  connectionStatus === 'connected' ? 'outline' : 'default'
                }
              >
                {isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                {isConnecting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
              </Button>
            </CardContent>
          </Card>

          {/* Sync Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Điều khiển đồng bộ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Học kỳ</Label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Summer2025">Summer 2025</SelectItem>
                    <SelectItem value="Fall2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring2024">Spring 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={previewSync}
                  disabled={isConnecting || connectionStatus !== 'connected'}
                  variant="outline"
                  className="flex-1"
                >
                  {isConnecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  Preview
                </Button>
                <Button
                  onClick={startSync}
                  disabled={isSyncing || connectionStatus !== 'connected'}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Đồng bộ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auto Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Tự động đồng bộ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSync">Bật tự động đồng bộ</Label>
                <Switch
                  id="autoSync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>

              {autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="interval">Tần suất</Label>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Mỗi giờ</SelectItem>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="text-xs text-gray-500">
                {autoSync
                  ? `Đồng bộ tự động ${syncInterval === 'hourly' ? 'mỗi giờ' : syncInterval === 'daily' ? 'hàng ngày lúc 6:00' : 'chủ nhật hàng tuần'}`
                  : 'Tự động đồng bộ đã tắt'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Progress */}
        {isSyncing && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Đang đồng bộ dữ liệu
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSyncing(false)}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Dừng
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{syncStep}</span>
                    <span className="font-medium">{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Data */}
        {showPreview && previewData && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Preview dữ liệu đồng bộ</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Đóng
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={startSync}
                  >
                    Xác nhận đồng bộ
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Classes Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Lớp học ({previewData.classes.length})</span>
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {previewData.classes.map(cls => (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-sm">{cls.name}</div>
                          <div className="text-xs text-gray-500">
                            {cls.instructor} • {cls.students} sinh viên
                          </div>
                          {cls.changes && (
                            <div className="text-xs text-orange-600 mt-1">
                              {cls.changes.join(', ')}
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(cls.status)}>
                          {getStatusIcon(cls.status)}
                          <span className="ml-1">
                            {getStatusText(cls.status)}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Students Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Sinh viên ({previewData.students.length})</span>
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {previewData.students.map(student => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.id} • {student.class}
                          </div>
                          {student.changes && (
                            <div className="text-xs text-orange-600 mt-1">
                              {student.changes.join(', ')}
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1">
                            {getStatusText(student.status)}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Lịch sử đồng bộ</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="partial">Một phần</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.map(log => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">
                            {log.timestamp}
                          </span>
                          <Badge className={getStatusColor(log.status)}>
                            {getStatusIcon(log.status)}
                            <span className="ml-1">
                              {getStatusText(log.status)}
                            </span>
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {log.duration}s
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Lớp học:</span>
                            <div className="text-gray-900">
                              {log.classesFound} tìm thấy • {log.classesAdded}{' '}
                              thêm • {log.classesUpdated} cập nhật
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Sinh viên:</span>
                            <div className="text-gray-900">
                              {log.studentsFound} tìm thấy • {log.studentsAdded}{' '}
                              thêm • {log.studentsUpdated} cập nhật
                            </div>
                          </div>
                        </div>

                        {log.errors.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-red-600 mb-1">
                            <XCircle className="h-4 w-4" />
                            <span>{log.errors.length} lỗi</span>
                          </div>
                        )}

                        {log.warnings.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{log.warnings.length} cảnh báo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log)
                        setIsLogModalOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Log Detail Modal */}
        <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <span>Chi tiết đồng bộ</span>
                {selectedLog && (
                  <Badge className={getStatusColor(selectedLog.status)}>
                    {getStatusIcon(selectedLog.status)}
                    <span className="ml-1">
                      {getStatusText(selectedLog.status)}
                    </span>
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedLog &&
                  `Thời gian: ${selectedLog.timestamp} • Thời lượng: ${selectedLog.duration}s`}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6 py-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Lớp học</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tìm thấy:</span>
                        <span className="font-medium">
                          {selectedLog.classesFound}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thêm mới:</span>
                        <span className="font-medium text-green-600">
                          {selectedLog.classesAdded}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="font-medium text-orange-600">
                          {selectedLog.classesUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Sinh viên
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tìm thấy:</span>
                        <span className="font-medium">
                          {selectedLog.studentsFound}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thêm mới:</span>
                        <span className="font-medium text-green-600">
                          {selectedLog.studentsAdded}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cập nhật:</span>
                        <span className="font-medium text-orange-600">
                          {selectedLog.studentsUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {selectedLog.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Lỗi ({selectedLog.errors.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLog.errors.map((error, index) => (
                        <div
                          key={index}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {selectedLog.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>Cảnh báo ({selectedLog.warnings.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLog.warnings.map((warning, index) => (
                        <div
                          key={index}
                          className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700"
                        >
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsLogModalOpen(false)}
              >
                Đóng
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Tải log
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
