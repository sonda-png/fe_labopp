import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download, Upload, Plus } from 'lucide-react'

interface FiltersAndActionsProps {
  onAddAssignment: () => void
}

export const FiltersAndActions = ({
  onAddAssignment,
}: FiltersAndActionsProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title, description..."
            className="pl-10 w-80"
          />
        </div>
{/* 
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All teachers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teachers</SelectItem>
            <SelectItem value="HE183210">HE183210</SelectItem>
          </SelectContent>
        </Select> */}

        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Import
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Export
        </Button>
        <Button
          className="gap-2 bg-orange-500 hover:bg-orange-600"
          onClick={onAddAssignment}
        >
          <Plus className="w-4 h-4" />
          Add Assignment
        </Button>
      </div>
    </div>
  )
}
