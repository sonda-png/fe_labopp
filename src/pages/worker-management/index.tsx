import { ReactNode, useState } from 'react'
import {
  Settings,
  Play,
  Square,
  Users,
  Activity,
  Plus,
  RefreshCw,
  Server,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery, useMutation } from '@/hooks'
import { workerQueries } from '@/api/actions/worker/worker.queries'
import { StartMultiWorkerArgs } from '@/api/actions/worker/worker.type'
import { toast } from 'react-toastify'

export const WorkerManagementPage = (): ReactNode => {
  // State for multi-worker form
  const [isStartMultiDialogOpen, setIsStartMultiDialogOpen] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [workerCount, setWorkerCount] = useState<number>(1)

  const {
    data: workersResponse,
    isLoading: isWorkersLoading,
    refetch: refetchWorkers,
    error: workersError,
  } = useQuery({
    ...workerQueries.getAllWorker(),
  })

  const {
    data: statusResponse,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
    error: statusError,
  } = useQuery({
    ...workerQueries.getStatus(),
  })

  // Extract data from API responses
  const systemRunning = statusResponse?.running ?? false
  const workersRunning = workersResponse?.running ?? false
  const activeWorkers = workersResponse?.activeWorkers ?? []

  // Mutations
  const { mutateAsync: startMultiWorker, isPending: isStartingMulti } =
    useMutation('startMultiWorker', {
      onSuccess: () => {
        toast.success('Started multiple workers successfully')
        setIsStartMultiDialogOpen(false)
        setClassCode('')
        setWorkerCount(1)
        refetchWorkers()
        refetchStatus()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Failed to start workers'
        toast.error(message)
      },
    })

  const { mutateAsync: startSingleWorker, isPending: isStartingSingle } =
    useMutation('startSingleWorker', {
      onSuccess: () => {
        toast.success('Started worker successfully')
        refetchWorkers()
        refetchStatus()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Failed to start worker'
        toast.error(message)
      },
    })

  const { mutateAsync: stopAllWorkers, isPending: isStoppingAll } = useMutation(
    'stopAllWorker',
    {
      onSuccess: () => {
        toast.success('Stopped all workers successfully')
        refetchWorkers()
        refetchStatus()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Failed to stop workers'
        toast.error(message)
      },
    }
  )

  const { mutateAsync: stopSingleWorker, isPending: isStoppingSingle } =
    useMutation('stopSingleWorker', {
      onSuccess: () => {
        toast.success('Stopped worker successfully')
        refetchWorkers()
        refetchStatus()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Failed to stop worker'
        toast.error(message)
      },
    })

  // Handlers
  const handleStartMultiWorker = async () => {
    if (!classCode.trim()) {
      toast.error('Please enter a class code')
      return
    }
    if (workerCount < 1) {
      toast.error('Worker count must be at least 1')
      return
    }

    const args: StartMultiWorkerArgs = {
      classCode: classCode.trim(),
      count: workerCount,
    }
    await startMultiWorker(args)
  }

  const handleStartSingleWorker = async (workerName: string) => {
    await startSingleWorker(workerName)
  }

  const handleStopSingleWorker = async (workerName: string) => {
    await stopSingleWorker(workerName)
  }

  const handleStopAllWorkers = async () => {
    await stopAllWorkers(undefined)
  }

  const handleRefresh = () => {
    refetchWorkers()
    refetchStatus()
  }

  const isLoading = isWorkersLoading || isStatusLoading
  const isAnyActionPending =
    isStartingMulti || isStartingSingle || isStoppingAll || isStoppingSingle

  return (
    <div className="min-h-screen bg-gray-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Worker Management
            </h1>
            <p className="text-gray-600">Manage and monitor system workers</p>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {statusError ? (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  Error
                </Badge>
              ) : (
                <Badge
                  variant={systemRunning ? 'default' : 'destructive'}
                  className={systemRunning ? 'bg-green-500' : ''}
                >
                  {isStatusLoading
                    ? 'Loading...'
                    : systemRunning
                      ? 'Running'
                      : 'Stopped'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workers Status
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {workersError ? (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  Error
                </Badge>
              ) : (
                <Badge
                  variant={workersRunning ? 'default' : 'secondary'}
                  className={workersRunning ? 'bg-green-500' : ''}
                >
                  {isWorkersLoading
                    ? 'Loading...'
                    : workersRunning
                      ? 'Active'
                      : 'Inactive'}
                </Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-orange-600 mt-2">
              {isWorkersLoading ? '...' : activeWorkers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeWorkers.length === 1 ? 'Active worker' : 'Active workers'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  statusError || workersError ? 'bg-red-500' : 'bg-green-500'
                }`}
              ></div>
              <span
                className={`text-sm ${
                  statusError || workersError
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {statusError || workersError ? 'Unhealthy' : 'Healthy'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            Worker Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multi Worker Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog
              open={isStartMultiDialogOpen}
              onOpenChange={setIsStartMultiDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                  disabled={isAnyActionPending}
                >
                  <Plus className="h-4 w-4" />
                  Start Multiple Workers
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Multiple Workers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="classCode">Class Code</Label>
                    <Input
                      id="classCode"
                      placeholder="Enter class code"
                      value={classCode}
                      onChange={e => setClassCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workerCount">Number of Workers</Label>
                    <Input
                      id="workerCount"
                      type="number"
                      min="1"
                      max="10"
                      value={workerCount}
                      onChange={e =>
                        setWorkerCount(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleStartMultiWorker}
                      disabled={isStartingMulti}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isStartingMulti ? 'Starting...' : 'Start Workers'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsStartMultiDialogOpen(false)}
                      disabled={isStartingMulti}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => handleStopAllWorkers()}
              variant="destructive"
              className="flex items-center gap-2"
              disabled={isAnyActionPending || activeWorkers.length === 0}
            >
              <Square className="h-4 w-4" />
              {isStoppingAll ? 'Stopping...' : 'Stop All Workers'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Worker Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Worker Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isWorkersLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
              <span className="ml-2">Loading worker status...</span>
            </div>
          ) : workersError ? (
            <div className="flex flex-col items-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-muted-foreground">
                Failed to load worker status. Please try refreshing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Display workers from activeWorkers array */}
                  {activeWorkers.length > 0 ? (
                    activeWorkers.map((workerId: string) => (
                      <TableRow key={workerId}>
                        <TableCell className="font-medium">
                          {workerId.charAt(0).toUpperCase() +
                            workerId.slice(1).replace('-', ' ')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500">
                            Running
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartSingleWorker(workerId)}
                              disabled={true}
                              className="flex items-center gap-1 opacity-50"
                            >
                              <Play className="h-3 w-3" />
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStopSingleWorker(workerId)}
                              disabled={isAnyActionPending}
                              className="flex items-center gap-1"
                            >
                              <Square className="h-3 w-3" />
                              Stop
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-muted-foreground">
                            No workers are currently running
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Use "Start Multiple Workers" to create and start
                            workers
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {activeWorkers.length > 0 && (
                <div className="text-center py-2 border-t bg-green-50">
                  <p className="text-sm text-green-700">
                    {activeWorkers.length} worker
                    {activeWorkers.length > 1 ? 's' : ''} currently active:{' '}
                    {activeWorkers.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
