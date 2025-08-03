'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, Clock, Eye, FileText, Search } from 'lucide-react'

// Mock data cho các bài đã nộp và draft
const submittedPosts = [
  {
    id: 1,
    title: 'Phân tích thuật toán sắp xếp nhanh',
    subject: 'Cấu trúc dữ liệu',
    submittedDate: '2024-01-15',
    status: 'submitted',
    score: 85,
    content:
      'Thuật toán Quick Sort là một trong những thuật toán sắp xếp hiệu quả nhất với độ phức tạp trung bình O(n log n). Thuật toán hoạt động dựa trên nguyên lý chia để trị (divide and conquer)...',
    feedback: 'Bài làm tốt, phân tích rõ ràng về độ phức tạp thuật toán.',
  },
  {
    id: 2,
    title: 'Báo cáo thực hành React Hooks',
    subject: 'Lập trình Web',
    submittedDate: '2024-01-20',
    status: 'submitted',
    score: 92,
    content:
      'React Hooks được giới thiệu trong React 16.8, cho phép sử dụng state và các tính năng khác của React mà không cần viết class component...',
    feedback: 'Excellent work! Hiểu rõ về lifecycle và state management.',
  },
  {
    id: 3,
    title: 'Nghiên cứu về Machine Learning',
    subject: 'Trí tuệ nhân tạo',
    submittedDate: '2024-01-25',
    status: 'submitted',
    score: 78,
    content:
      'Machine Learning là một nhánh của trí tuệ nhân tạo (AI) tập trung vào việc xây dựng các hệ thống có thể học hỏi từ dữ liệu...',
    feedback: 'Cần bổ sung thêm ví dụ thực tế và case study.',
  },
]

const draftPosts = [
  {
    id: 4,
    title: 'Phân tích hệ thống quản lý cơ sở dữ liệu',
    subject: 'Cơ sở dữ liệu',
    lastModified: '2024-01-28',
    status: 'draft',
    content:
      'Hệ quản trị cơ sở dữ liệu (DBMS) là phần mềm cho phép người dùng tạo, quản lý và truy xuất dữ liệu từ cơ sở dữ liệu...',
    progress: 65,
  },
  {
    id: 5,
    title: 'Ứng dụng blockchain trong tài chính',
    subject: 'Công nghệ Blockchain',
    lastModified: '2024-01-30',
    status: 'draft',
    content:
      'Blockchain là một công nghệ sổ cái phân tán cho phép lưu trữ dữ liệu một cách an toàn, minh bạch và không thể thay đổi...',
    progress: 40,
  },
]

export default function MySubmitPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const allPosts = [...submittedPosts, ...draftPosts]

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject =
      filterSubject === 'all' || post.subject === filterSubject
    return matchesSearch && matchesSubject
  })

  const subjects = Array.from(new Set(allPosts.map(post => post.subject)))

  const getStatusBadge = (status: string, score?: number) => {
    if (status === 'submitted') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Đã nộp
          </Badge>
          {score && (
            <Badge variant="outline" className="text-blue-600">
              {score}/100
            </Badge>
          )}
        </div>
      )
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Bản nháp
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bài nộp của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý và xem lại các bài đã nộp cũng như bản nháp của bạn
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề hoặc môn học..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Lọc theo môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn học</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Tất cả ({allPosts.length})</TabsTrigger>
          <TabsTrigger value="submitted">
            Đã nộp ({submittedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Bản nháp ({draftPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {filteredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {post.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          {post.status === 'submitted' ? (
                            <>
                              <CalendarDays className="h-4 w-4" />
                              {'submittedDate' in post ? (
                                <>
                                  Nộp:{' '}
                                  {new Date(
                                    post.submittedDate
                                  ).toLocaleDateString('vi-VN')}
                                </>
                              ) : (
                                <>
                                  Sửa:{' '}
                                  {new Date(
                                    post.lastModified
                                  ).toLocaleDateString('vi-VN')}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              Sửa:{' '}
                              {new Date(
                                'lastModified' in post
                                  ? post.lastModified
                                  : post.submittedDate
                              ).toLocaleDateString('vi-VN')}
                            </>
                          )}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'submitted'
                        ? getStatusBadge(
                            post.status,
                            (post as (typeof submittedPosts)[number]).score
                          )
                        : getStatusBadge(post.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {post.content.substring(0, 150)}...
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPost(post)}
                          className="ml-4"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {selectedPost?.title}
                          </DialogTitle>
                          <DialogDescription className="flex items-center gap-4">
                            <span>Môn học: {selectedPost?.subject}</span>
                            {selectedPost?.status === 'submitted' ? (
                              <span>
                                Ngày nộp:{' '}
                                {new Date(
                                  selectedPost?.submittedDate
                                ).toLocaleDateString('vi-VN')}
                              </span>
                            ) : (
                              <span>
                                Lần sửa cuối:{' '}
                                {new Date(
                                  selectedPost?.lastModified
                                ).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="mb-4">
                            {getStatusBadge(
                              selectedPost?.status,
                              selectedPost?.score
                            )}
                          </div>
                          <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-3">
                              Nội dung bài làm:
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                              <p className="whitespace-pre-wrap">
                                {selectedPost?.content}
                              </p>
                            </div>
                            {selectedPost?.feedback && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Nhận xét từ giảng viên:
                                </h3>
                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                  <p className="text-blue-800">
                                    {selectedPost?.feedback}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedPost?.progress && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">
                                  Tiến độ hoàn thành:
                                </h3>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{
                                          width: `${selectedPost?.progress}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium">
                                      {selectedPost?.progress}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <div className="grid gap-4">
            {submittedPosts
              .filter(post => {
                const matchesSearch =
                  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.subject.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesSubject =
                  filterSubject === 'all' || post.subject === filterSubject
                return matchesSearch && matchesSubject
              })
              .map(post => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {post.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            Nộp:{' '}
                            {new Date(post.submittedDate).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status, post.score)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {post.content.substring(0, 150)}...
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPost(post)}
                            className="ml-4"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl">
                              {selectedPost?.title}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-4">
                              <span>Môn học: {selectedPost?.subject}</span>
                              <span>
                                Ngày nộp:{' '}
                                {new Date(
                                  selectedPost?.submittedDate
                                ).toLocaleDateString('vi-VN')}
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="mb-4">
                              {getStatusBadge(
                                selectedPost?.status,
                                selectedPost?.score
                              )}
                            </div>
                            <div className="prose max-w-none">
                              <h3 className="text-lg font-semibold mb-3">
                                Nội dung bài làm:
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="whitespace-pre-wrap">
                                  {selectedPost?.content}
                                </p>
                              </div>
                              {selectedPost?.feedback && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">
                                    Nhận xét từ giảng viên:
                                  </h3>
                                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                    <p className="text-blue-800">
                                      {selectedPost?.feedback}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid gap-4">
            {draftPosts
              .filter(post => {
                const matchesSearch =
                  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  post.subject.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesSubject =
                  filterSubject === 'all' || post.subject === filterSubject
                return matchesSearch && matchesSubject
              })
              .map(post => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {post.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Sửa:{' '}
                            {new Date(post.lastModified).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {post.content.substring(0, 150)}...
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPost(post)}
                            className="ml-4"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl">
                              {selectedPost?.title}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-4">
                              <span>Môn học: {selectedPost?.subject}</span>
                              <span>
                                Lần sửa cuối:{' '}
                                {new Date(
                                  selectedPost?.lastModified
                                ).toLocaleDateString('vi-VN')}
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="mb-4">
                              {getStatusBadge(selectedPost?.status)}
                            </div>
                            <div className="prose max-w-none">
                              <h3 className="text-lg font-semibold mb-3">
                                Nội dung bài làm:
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="whitespace-pre-wrap">
                                  {selectedPost?.content}
                                </p>
                              </div>
                              {selectedPost?.progress && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">
                                    Tiến độ hoàn thành:
                                  </h3>
                                  <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-yellow-500 h-2 rounded-full"
                                          style={{
                                            width: `${selectedPost?.progress}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium">
                                        {selectedPost?.progress}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài nào</h3>
          <p className="text-muted-foreground">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
          </p>
        </div>
      )}
    </div>
  )
}
