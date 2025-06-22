"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileArchive,
  Upload,
  X,
  FileCode,
  Check,
} from "lucide-react"

export default function StudentSubmission() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState("draft")
  const [comment, setComment] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === "application/zip") {
      setFile(selectedFile)
      setErrorMessage("")
      simulateUpload()
    } else {
      setFile(null)
      setErrorMessage("Chỉ chấp nhận file ZIP. Vui lòng nén file trước khi tải lên.")
      setUploadStatus("error")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const simulateUpload = () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const removeFile = () => {
    setFile(null)
    setUploadStatus("idle")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!file) {
      setErrorMessage("Vui lòng chọn file để nộp bài.")
      return
    }

    const action = submissionStatus === "submit" ? "nộp bài" : "lưu bản nháp"
    alert(`Đã ${action} thành công!`)
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-orange-500 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileCode size={24} />
          <h2 className="text-xl font-bold">Nộp bài tập</h2>
        </div>
        <p>Summer2025 - LAB211 - SE1973</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nộp bài Assignment</CardTitle>
              <CardDescription>Vui lòng nộp bài đúng định dạng yêu cầu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assignment Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Môn học</h3>
                    <p className="font-medium">LAB 02 - Java OOP</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mã bài tập</h3>
                    <p className="font-medium">J1.S.P0002</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tên bài tập</h3>
                    <p className="font-medium">Selection sort algorithm</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">LOC yêu cầu</h3>
                    <p className="font-medium">150</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</h3>
                    <p className="font-medium">2025-05-07</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Hạn nộp</h3>
                    <p className="font-medium text-red-500">2025-08-10</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mô tả</h3>
                  <p className="text-sm mt-1">
                    Implement the selection sort algorithm in Java. The program should allow users to input an array
                    of integers and display the sorted result using the selection sort algorithm. Include detailed
                    comments explaining each step of the algorithm.
                  </p>
                </div>
              </div>

              <Separator />

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="submission-files">File bài nộp</Label>

                  {!file && (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mt-2 ${
                        isDragging
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                          <FileArchive size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Kéo thả file ZIP hoặc nhấn để chọn file</p>
                          <p className="text-sm text-muted-foreground">Chỉ chấp nhận file ZIP, tối đa 50MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Chọn file
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                    </div>
                  )}

                  {errorMessage && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {file && (
                    <div className="border rounded-lg p-4 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded">
                            <FileArchive size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={removeFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {uploadStatus === "uploading" && (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Đang tải lên...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {uploadStatus === "success" && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          <span>Tải lên thành công</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <FileCode className="h-4 w-4" />
                    <span>Bạn có thể nén file bằng WinRAR, 7-Zip hoặc công cụ nén file có sẵn trên máy tính</span>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <RadioGroup
                    value={submissionStatus}
                    onValueChange={setSubmissionStatus}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft" />
                      <Label htmlFor="draft">Draft</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="submit" id="submit" />
                      <Label htmlFor="submit">Submit</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment">Ghi chú (không bắt buộc)</Label>
                  <Input
                    id="comment"
                    placeholder="Nhập ghi chú cho giảng viên..."
                    className="mt-1"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Hủy</Button>
              <Button onClick={handleSubmit}>{submissionStatus === "submit" ? "Nộp bài" : "Lưu bản nháp"}</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Instructions Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn nộp bài</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Chuẩn bị file</h3>
                <p className="text-sm text-muted-foreground">
                  Đảm bảo code của bạn đã được kiểm tra và chạy thử trước khi nộp.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Nén file thành ZIP</h3>
                <p className="text-sm text-muted-foreground">
                  Nén tất cả file cần thiết vào một file ZIP duy nhất.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Tải lên hệ thống</h3>
                <p className="text-sm text-muted-foreground">
                  Tải file ZIP lên hệ thống bằng cách kéo thả hoặc chọn file.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Chọn trạng thái</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Draft:</strong> Lưu bài nộp nhưng chưa gửi cho giảng viên.
                  <br />
                  <strong>Submit:</strong> Gửi bài nộp chính thức cho giảng viên.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
