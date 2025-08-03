'use client'

import { useState } from 'react'
import { Search, Filter, Upload, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Assignment {
  id: string
  title: string
  code: string
  status: 'Active' | 'Inactive'
  difficulty: string
  difficultyLevel: number
  description: string
  topic: string
  targetLOC: number
  estimatedTime: number
  usageCount: number
  passRate: number
  tags: string[]
  created: string
  updated: string
  author: string
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Selection Sort Algorithm',
    code: 'JLS.P0002',
    status: 'Active',
    difficulty: 'Medium',
    difficultyLevel: 3,
    description:
      'Design a program that allows users to input the number of array. Generate random integer in number range input. Display unsorted array and sorted array using selection sort.',
    topic: 'Java OOP manual grading',
    targetLOC: 50,
    estimatedTime: 120,
    usageCount: 15,
    passRate: 75,
    tags: ['sorting', 'algorithm', 'java', 'beginner'],
    created: '1/15/2024',
    updated: '1/20/2024',
    author: 'Trưởng bộ môn CNTT',
  },
  {
    id: '2',
    title: 'Binary Search Implementation',
    code: 'JLS.P0003',
    status: 'Active',
    difficulty: 'Hard',
    difficultyLevel: 4,
    description:
      'Implement binary search algorithm with recursive and iterative approaches',
    topic: 'Java Algorithm Implementation',
    targetLOC: 75,
    estimatedTime: 180,
    usageCount: 12,
    passRate: 68,
    tags: ['search', 'algorithm', 'java', 'advanced'],
    created: '1/10/2024',
    updated: '1/18/2024',
    author: 'Trưởng bộ môn CNTT',
  },
]

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    difficulty: '',
    topic: '',
    targetLOC: '',
    estimatedTime: '',
  })

  const handleAddAssignment = () => {
    if (
      newAssignment.title &&
      newAssignment.difficulty &&
      newAssignment.topic &&
      newAssignment.targetLOC &&
      newAssignment.estimatedTime
    ) {
      const assignment: Assignment = {
        id: Date.now().toString(),
        title: newAssignment.title,
        code: `JLS.P${String(assignments.length + 1).padStart(4, '0')}`,
        status: 'Active',
        difficulty: newAssignment.difficulty,
        difficultyLevel:
          newAssignment.difficulty === 'Easy'
            ? 2
            : newAssignment.difficulty === 'Medium'
              ? 3
              : newAssignment.difficulty === 'Hard'
                ? 4
                : 5,
        description: `Assignment for ${newAssignment.topic}`,
        topic: newAssignment.topic,
        targetLOC: Number.parseInt(newAssignment.targetLOC),
        estimatedTime: Number.parseInt(newAssignment.estimatedTime),
        usageCount: 0,
        passRate: 0,
        tags: [],
        created: new Date().toLocaleDateString(),
        updated: new Date().toLocaleDateString(),
        author: 'Current User',
      }

      setAssignments([...assignments, assignment])
      setNewAssignment({
        title: '',
        difficulty: '',
        topic: '',
        targetLOC: '',
        estimatedTime: '',
      })
      setIsDialogOpen(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      case 'Expert':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assignments, code, tags..."
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-categories">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="algorithm">Algorithm</SelectItem>
                <SelectItem value="oop">OOP</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-difficulty">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-difficulty">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm Assignment Mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Tên Assignment</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={e =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
                    placeholder="Nhập tên assignment"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select
                    value={newAssignment.difficulty}
                    onValueChange={value =>
                      setNewAssignment({ ...newAssignment, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy (1-2)</SelectItem>
                      <SelectItem value="Medium">Medium (3)</SelectItem>
                      <SelectItem value="Hard">Hard (4)</SelectItem>
                      <SelectItem value="Expert">Expert (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={newAssignment.topic}
                    onChange={e =>
                      setNewAssignment({
                        ...newAssignment,
                        topic: e.target.value,
                      })
                    }
                    placeholder="Nhập topic"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="loc">Target LOC</Label>
                  <Input
                    id="loc"
                    type="number"
                    value={newAssignment.targetLOC}
                    onChange={e =>
                      setNewAssignment({
                        ...newAssignment,
                        targetLOC: e.target.value,
                      })
                    }
                    placeholder="Nhập số dòng code ước tính"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Thời gian ước tính (phút)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={newAssignment.estimatedTime}
                    onChange={e =>
                      setNewAssignment({
                        ...newAssignment,
                        estimatedTime: e.target.value,
                      })
                    }
                    placeholder="Nhập thời gian ước tính"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAddAssignment}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>

          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {assignments.map(assignment => (
          <Card key={assignment.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded">
                  <div className="text-orange-600 font-mono text-sm">
                    {'{}'}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {assignment.code}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {assignment.status}
                    </Badge>
                    <Badge
                      className={getDifficultyColor(assignment.difficulty)}
                    >
                      {assignment.difficulty} ({assignment.difficultyLevel}/5)
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Topic:</div>
                      <div className="text-sm font-medium">
                        {assignment.topic}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Target LOC:
                      </div>
                      <div className="text-sm font-medium">
                        {assignment.targetLOC}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Estimated Time:
                      </div>
                      <div className="text-sm font-medium">
                        {assignment.estimatedTime} minutes
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Usage Count:
                      </div>
                      <div className="text-sm font-medium">
                        {assignment.usageCount} times
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Pass Rate:
                      </div>
                      <div className="text-sm font-medium">
                        {assignment.passRate}%
                      </div>
                    </div>
                  </div>

                  {assignment.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">Tags:</div>
                      <div className="flex gap-2 flex-wrap">
                        {assignment.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-400">
                    Created: {assignment.created} • Updated:{' '}
                    {assignment.updated} • By: {assignment.author}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
