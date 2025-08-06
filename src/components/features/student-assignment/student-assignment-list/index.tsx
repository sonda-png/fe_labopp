import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@/hooks'
import { assignmentQueries } from '@/api/actions/assignment/assignment.queries'
import { Assignment } from '@/api/actions/assignment/assignment.type'
import {
  Search,
  FileText,
  Calendar,
  Code,
  BookOpen,
  AlertTriangle,
  SortAsc,
  SortDesc,
  Eye,
  Download,
  Clock,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'

// Assignment Card Component
const AssignmentCard = ({
  assignment,
  onView,
  onDownload,
}: {
  assignment: Assignment
  onView: (assignment: Assignment) => void
  onDownload: (assignment: Assignment) => void
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col"
      onClick={() => onView(assignment)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {assignment.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {assignment.description}
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            Assignment
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Assignment Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Created At: {formatDate(assignment.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Lines of Code
              </span>
              <span className="font-medium">{assignment.locTotal}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={e => {
              e.stopPropagation()
              onView(assignment)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3"
            onClick={e => {
              e.stopPropagation()
              onDownload(assignment)
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Component
const LoadingState = () => (
  <div className="container mx-auto p-6">
    <div className="mb-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

// Error Component
const ErrorState = () => (
  <div className="container mx-auto p-6">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        An error occurred while loading assignments. Please try again later.
      </AlertDescription>
    </Alert>
  </div>
)

// Empty State Component
const EmptyState = () => (
  <div className="container mx-auto p-6">
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No assignments available
      </h3>
      <p className="text-gray-500">
        There are no assignments available at the moment. Check back later!
      </p>
    </div>
  </div>
)

// No Results Component
const NoResultsState = () => (
  <div className="text-center py-12">
    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No assignments found
    </h3>
    <p className="text-gray-500">
      Try changing your search keywords or filters
    </p>
  </div>
)

// Search and Filter Component
const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filteredCount,
  totalCount,
}: {
  searchTerm: string
  setSearchTerm: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (value: 'asc' | 'desc') => void
  filteredCount: number
  totalCount: number
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="createdAt">Created date</SelectItem>
              <SelectItem value="locTotal">Lines of Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full md:w-auto"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCount} of {totalCount} assignments
      </div>
    </CardContent>
  </Card>
)

// Stats Component
const AssignmentStats = ({ assignments }: { assignments: Assignment[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">
              Total Assignments
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {assignments.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Code className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">
              Total Lines of Code
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {assignments.reduce(
                (sum, assignment) => sum + assignment.locTotal,
                0
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">
              Recently Updated
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {
                assignments.filter(a => {
                  const daysSinceUpdate =
                    (Date.now() - new Date(a.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                  return daysSinceUpdate <= 7
                }).length
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Main Component
export const StudentAssignmentList = () => {
  const navigate = useNavigate()
  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery({
    ...assignmentQueries.getAll(),
  })

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleView = (assignment: Assignment) => {
    // Navigate to assignment detail page
    navigate({ to: `/assignment-detail/${assignment.id}` })
  }

  const handleDownload = (assignment: Assignment) => {
    // Handle download assignment
    console.log('Download assignment:', assignment)
  }

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!assignments) return []

    const filtered = assignments.filter(assignment => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'locTotal':
          aValue = a.locTotal
          bValue = b.locTotal
          break
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [assignments, searchTerm, sortBy, sortOrder])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />
  if (!assignments || assignments.length === 0) return <EmptyState />

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lab Assignments
        </h1>
        <p className="text-gray-600">
          Browse and manage all available lab assignments
        </p>
      </div>

      {/* Stats */}
      <AssignmentStats assignments={assignments} />

      {/* Filters and Search */}
      <div className="mb-6">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filteredCount={filteredAndSortedData.length}
          totalCount={assignments.length}
        />
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredAndSortedData.map((assignment: Assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onView={handleView}
            onDownload={handleDownload}
          />
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredAndSortedData.length === 0 &&
        assignments &&
        assignments.length > 0 && <NoResultsState />}
    </div>
  )
}
