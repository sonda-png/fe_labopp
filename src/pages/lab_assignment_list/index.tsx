import { useState } from "react"
import { Building, Download, Edit, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

// Mock data based on the Lab_Assignment table
const labAssignments = [
  {
    id: "LAB001",
    title: "Selection sort algorithm",
    description: "Implement the selection sort algorithm in Java",
    teacher_id: "TEACHER001",
    loc_total: 150,
    created_by: "admin",
    created_at: "2025-05-01T10:00:00",
    updated_by: "admin",
    updated_at: "2025-05-01T10:00:00",
    code: "J1.S.P0002",
    start_date: "2025-05-07",
    end_date: "2025-08-10",
    subject: "LAB 02 - Java OOP",
    mentor: "Nguyễn Thị Hải Năng - nangnth",
  },
  {
    id: "LAB002",
    title: "Bubble sort algorithm",
    description: "Implement the bubble sort algorithm in Java",
    teacher_id: "TEACHER001",
    loc_total: 120,
    created_by: "admin",
    created_at: "2025-05-02T10:00:00",
    updated_by: "admin",
    updated_at: "2025-05-02T10:00:00",
    code: "J1.S.P0003",

    start_date: "2025-05-07",
    end_date: "2025-08-10",
    subject: "LAB 02 - Java OOP",
    mentor: "Nguyễn Thị Hải Năng - nangnth",
  },
  {
    id: "LAB003",
    title: "Linear search algorithm",
    description: "Implement the linear search algorithm in Java",
    teacher_id: "TEACHER001",
    loc_total: 100,
    created_by: "admin",
    created_at: "2025-05-03T10:00:00",
    updated_by: "admin",
    updated_at: "2025-05-03T10:00:00",
    code: "J1.S.P0004",
   
    start_date: "2025-05-07",
    end_date: "2025-08-10",
    subject: "LAB 02 - Java OOP",
    mentor: "Nguyễn Thị Hải Năng - nangnth",
  },
  {
    id: "LAB004",
    title: "Binary search algorithm",
    description: "Implement the binary search algorithm in Java",
    teacher_id: "TEACHER001",
    loc_total: 130,
    created_by: "admin",
    created_at: "2025-05-04T10:00:00",
    updated_by: "admin",
    updated_at: "2025-05-04T10:00:00",
    code: "J1.S.P0005",
  
    start_date: "2025-05-07",
    end_date: "2025-08-10",
    subject: "LAB 02 - Java OOP",
    mentor: "Nguyễn Thị Hải Năng - nangnth",
  },
  {
    id: "LAB005",
    title: "Merge sort algorithm",
    description: "Implement the merge sort algorithm in Java",
    teacher_id: "TEACHER001",
    loc_total: 180,
    created_by: "admin",
    created_at: "2025-05-05T10:00:00",
    updated_by: "admin",
    updated_at: "2025-05-05T10:00:00",
    code: "J1.S.P0006",
 
    start_date: "2025-05-07",
    end_date: "2025-08-10",
    subject: "LAB 02 - Java OOP",
    mentor: "Nguyễn Thị Hải Năng - nangnth",
  },
]

export default function LabAssignmentList() {
  const [searchTerm, setSearchTerm] = useState("")


  // Filter assignments based on search term and status
  const filteredAssignments = labAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.code.toLowerCase().includes(searchTerm.toLowerCase())
  
    return matchesSearch 
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">Class Detail</h1>
            <p className="text-sm">Summer2025 - LAB211 - SE1973</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 bg-gray-50">
        {/* Class info card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-gray-600">Subject</p>
                <p>{labAssignments[0].subject}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Start Date</p>
                <p>{labAssignments[0].start_date}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">End Date</p>
                <p>{labAssignments[0].end_date}</p>
              </div>
              <div className="md:col-span-3">
                <p className="font-semibold text-gray-600">Mentors</p>
                <p>{labAssignments[0].mentor}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="assignments" className="mb-6">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            {/* Filter section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Lab Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <div className="relative">
                      <Input
                        placeholder="Search by title or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10"
                      />
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                    <Button variant="outline">Reset</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">Search</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignments table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Assignment Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>LOC Total</TableHead>

                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment, index) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p>{assignment.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-md">{assignment.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.code}</TableCell>
                        <TableCell>{assignment.loc_total}</TableCell>
                        <TableCell>{new Date(assignment.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing 1 to {filteredAssignments.length} of {filteredAssignments.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
