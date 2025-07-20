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
    warnings: ['Class LAB211-SE1970 has incomplete information'],
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
    errors: ['Unable to connect to FAP API after 2 attempts'],
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
    errors: ['FAP API not responding', 'Timeout after 30 seconds'],
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
      changes: ['Added 2 new students', 'Updated instructor information'],
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
      changes: ['Updated email'],
    },
  ],
}

// Type definitions
type SyncData = typeof mockSyncData
type SyncHistoryItem = (typeof syncHistory)[0]

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
  const [previewData, setPreviewData] = useState<SyncData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<SyncHistoryItem | null>(null)

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
    setSyncStep('Connecting to FAP API...')

    const steps = [
      { step: 'Connecting to FAP API...', progress: 10 },
      { step: 'Fetching class list...', progress: 30 },
      { step: 'Fetching student list...', progress: 50 },
      { step: 'Mapping data...', progress: 70 },
      { step: 'Saving to system...', progress: 90 },
      { step: 'Sync completed!', progress: 100 },
    ]

    for (const { step, progress } of steps) {
      setSyncStep(step)
      setSyncProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setLastSyncTime(new Date().toLocaleString('en-US'))
    setIsSyncing(false)
  }

  // Preview sync data
  const previewSync = async () => {
    setIsConnecting(true)
    setSyncStep('Fetching preview data...')

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
        return 'Success'
      case 'partial':
        return 'Partial'
      case 'failed':
        return 'Failed'
      case 'new':
        return 'New'
      case 'updated':
        return 'Updated'
      case 'unchanged':
        return 'Unchanged'
      default:
        return 'Unknown'
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
            Sync Classes from FAP
          </h1>
          <p className="text-gray-600">Automatic data synchronization system</p>
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
                <span>Connection Status</span>
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
                      ? 'Connected'
                      : connectionStatus === 'error'
                        ? 'Connection Error'
                        : 'Not Connected'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Last sync: {lastSyncTime}
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
                {isConnecting ? 'Testing...' : 'Test Connection'}
              </Button>
            </CardContent>
          </Card>

          {/* Sync Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Sync Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
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
                  Sync
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auto Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Auto Sync</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSync">Enable auto sync</Label>
                <Switch
                  id="autoSync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>

              {autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="interval">Frequency</Label>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="text-xs text-gray-500">
                {autoSync
                  ? `Auto sync ${syncInterval === 'hourly' ? 'every hour' : syncInterval === 'daily' ? 'daily at 6:00 AM' : 'every Sunday'}`
                  : 'Auto sync is disabled'}
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
                    Syncing Data
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSyncing(false)}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
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
                  <span>Sync Data Preview</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={startSync}
                  >
                    Confirm Sync
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
                    <span>Classes ({previewData.classes.length})</span>
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
                            {cls.instructor} • {cls.students} students
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
                    <span>Students ({previewData.students.length})</span>
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
                <span>Sync History</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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
                            <span className="font-medium">Classes:</span>
                            <div className="text-gray-900">
                              {log.classesFound} found • {log.classesAdded}{' '}
                              added • {log.classesUpdated} updated
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Students:</span>
                            <div className="text-gray-900">
                              {log.studentsFound} found • {log.studentsAdded}{' '}
                              added • {log.studentsUpdated} updated
                            </div>
                          </div>
                        </div>

                        {log.errors.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-red-600 mb-1">
                            <XCircle className="h-4 w-4" />
                            <span>{log.errors.length} errors</span>
                          </div>
                        )}

                        {log.warnings.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-orange-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{log.warnings.length} warnings</span>
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
                      Details
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
                <span>Sync Details</span>
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
                  `Time: ${selectedLog.timestamp} • Duration: ${selectedLog.duration}s`}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6 py-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Classes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Found:</span>
                        <span className="font-medium">
                          {selectedLog.classesFound}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Added:</span>
                        <span className="font-medium text-green-600">
                          {selectedLog.classesAdded}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-medium text-orange-600">
                          {selectedLog.classesUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Students</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Found:</span>
                        <span className="font-medium">
                          {selectedLog.studentsFound}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Added:</span>
                        <span className="font-medium text-green-600">
                          {selectedLog.studentsAdded}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
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
                      <span>Errors ({selectedLog.errors.length})</span>
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
                      <span>Warnings ({selectedLog.warnings.length})</span>
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
                Close
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Log
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
