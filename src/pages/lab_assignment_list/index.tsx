import { useState } from 'react'
import { StudentAssignmentList } from '@/components/features/student-assignment/student-assignment-list'

// Mock data based on the Lab_Assignment table
const labAssignments = [
  {
    id: 'LAB001',
    title: 'Selection sort algorithm',
    description: 'Implement the selection sort algorithm in Java',
    teacher_id: 'TEACHER001',
    loc_total: 150,
    created_by: 'admin',
    created_at: '2025-05-01T10:00:00',
    updated_by: 'admin',
    updated_at: '2025-05-01T10:00:00',
    code: 'J1.S.P0002',
    start_date: '2025-05-07',
    end_date: '2025-08-10',
    subject: 'LAB 02 - Java OOP',
    mentor: 'Nguyễn Thị Hải Năng - nangnth',
  },
  {
    id: 'LAB002',
    title: 'Bubble sort algorithm',
    description: 'Implement the bubble sort algorithm in Java',
    teacher_id: 'TEACHER001',
    loc_total: 120,
    created_by: 'admin',
    created_at: '2025-05-02T10:00:00',
    updated_by: 'admin',
    updated_at: '2025-05-02T10:00:00',
    code: 'J1.S.P0003',

    start_date: '2025-05-07',
    end_date: '2025-08-10',
    subject: 'LAB 02 - Java OOP',
    mentor: 'Nguyễn Thị Hải Năng - nangnth',
  },
  {
    id: 'LAB003',
    title: 'Linear search algorithm',
    description: 'Implement the linear search algorithm in Java',
    teacher_id: 'TEACHER001',
    loc_total: 100,
    created_by: 'admin',
    created_at: '2025-05-03T10:00:00',
    updated_by: 'admin',
    updated_at: '2025-05-03T10:00:00',
    code: 'J1.S.P0004',

    start_date: '2025-05-07',
    end_date: '2025-08-10',
    subject: 'LAB 02 - Java OOP',
    mentor: 'Nguyễn Thị Hải Năng - nangnth',
  },
  {
    id: 'LAB004',
    title: 'Binary search algorithm',
    description: 'Implement the binary search algorithm in Java',
    teacher_id: 'TEACHER001',
    loc_total: 130,
    created_by: 'admin',
    created_at: '2025-05-04T10:00:00',
    updated_by: 'admin',
    updated_at: '2025-05-04T10:00:00',
    code: 'J1.S.P0005',

    start_date: '2025-05-07',
    end_date: '2025-08-10',
    subject: 'LAB 02 - Java OOP',
    mentor: 'Nguyễn Thị Hải Năng - nangnth',
  },
  {
    id: 'LAB005',
    title: 'Merge sort algorithm',
    description: 'Implement the merge sort algorithm in Java',
    teacher_id: 'TEACHER001',
    loc_total: 180,
    created_by: 'admin',
    created_at: '2025-05-05T10:00:00',
    updated_by: 'admin',
    updated_at: '2025-05-05T10:00:00',
    code: 'J1.S.P0006',

    start_date: '2025-05-07',
    end_date: '2025-08-10',
    subject: 'LAB 02 - Java OOP',
    mentor: 'Nguyễn Thị Hải Năng - nangnth',
  },
]

const LabAssignmentList = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter assignments based on search term and status
  const filteredAssignments = labAssignments.filter(assignment => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.code.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return <StudentAssignmentList />
}

export default LabAssignmentList
