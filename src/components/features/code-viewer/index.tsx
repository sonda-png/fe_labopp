import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Folder, Download } from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import Prism from 'prismjs'
import { useQuery } from '@/hooks'
import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { normalizeJavaFile } from '@/utils/helpers/normalizeJavaFile'
import 'prismjs/components/prism-java'
import { getLanguageFromExtension } from '@/utils/helpers/get-language-from-extension'
import { FileIconComponent } from '@/components/common/file-icon'
import { TeacherSubmissionData } from '@/api/actions/teacher-submit/teacher-submit.type'
import { convertFileObjectToCodeFiles } from '@/utils/helpers/convert-file-object-to-code-file'
import { CodeFile } from '@/api/actions/teacher-assignment/teacher-assignment.type'
import { authStore } from '@/stores/authStore'
import { ENV } from '@/config/env'
import axios from 'axios'
import { Assignment } from '@/api/actions/assignment/assignment.type'

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed'
  output?: string
  error?: string
  duration?: number
  expectedOutput?: string
}

interface CodeFileViewerProps {
  studentId: string
  submission: TeacherSubmissionData
  assignment: Assignment | undefined
}

export default function CodeFileViewer({
  studentId,
  submission,
  assignment,
}: CodeFileViewerProps) {
  const { authValues } = authStore()

  const [internalSelectedFile, setInternalSelectedFile] =
    useState<CodeFile | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const handleDownloadPdf = async () => {
    const res = await axios.get(
      `${ENV.BACK_END_URL}/assignment/download-pdf/by-assignment/${submission.assignmentCode}`,
      {
        responseType: 'blob',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/pdf',
          Authorization: `Bearer ${authValues.token}`,
        },
      }
    )
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(assignment?.title || 'assignment').replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadSubmission = async () => {
    try {
      const res = await axios.get(
        `${ENV.BACK_END_URL}/assignment/download-submission/${submission.id}`,
        {
          responseType: 'blob',
          withCredentials: false,
          headers: {
            'Content-Type': 'application/zip',
            Authorization: `Bearer ${authValues.token}`,
          },
        }
      )
      const blob = new Blob([res.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `submission_${submission.id}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to download submission', e)
    }
  }

  const { data: viewJavaFileData } = useQuery({
    ...teacherAssignmentQueries.getViewJavaFile({
      submissionId: submission.id,
    }),
  })
  // Auto-expand first folder and select first file when data loads
  useEffect(() => {
    if (viewJavaFileData && Object.keys(viewJavaFileData).length > 0) {
      const files = convertFileObjectToCodeFiles(viewJavaFileData)

      // Auto-expand all folders
      const foldersToExpand = new Set<string>()
      const collectFolders = (items: CodeFile[]) => {
        items.forEach(item => {
          if (item.type === 'folder') {
            foldersToExpand.add(item.id)
            if (item.children) {
              collectFolders(item.children)
            }
          }
        })
      }
      collectFolders(files)
      setExpandedFolders(foldersToExpand)

      // Auto-select first file
      const findFirstFile = (items: CodeFile[]): CodeFile | null => {
        for (const item of items) {
          if (item.type === 'file') {
            return item
          }
          if (item.type === 'folder' && item.children) {
            const found = findFirstFile(item.children)
            if (found) return found
          }
        }
        return null
      }

      const firstFile = findFirstFile(files)
      if (firstFile && !internalSelectedFile) {
        setInternalSelectedFile(firstFile)
      }
    }
  }, [viewJavaFileData, internalSelectedFile])

  // Use internal selectedFile state
  const selectedFile = internalSelectedFile

  const handleFileSelect = (file: CodeFile) => {
    setInternalSelectedFile(file)
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (files: CodeFile[], level = 0) => {
    return files.map(file => (
      <div key={file.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
            selectedFile?.id === file.id ? 'bg-muted' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.id)
            } else {
              handleFileSelect(file)
            }
          }}
        >
          {file.type === 'folder' ? (
            <Folder
              className={`w-4 h-4 text-blue-600 ${expandedFolders.has(file.id) ? 'rotate-0' : ''}`}
            />
          ) : (
            <FileIconComponent extension={file.extension} />
          )}
          <span className="text-sm font-medium">{file.name}</span>
          {file.extension && (
            <Badge variant="secondary" className="text-xs ml-auto">
              {file.extension}
            </Badge>
          )}
        </div>
        {file.type === 'folder' &&
          expandedFolders.has(file.id) &&
          file.children && (
            <div>{renderFileTree(file.children, level + 1)}</div>
          )}
      </div>
    ))
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - File Explorer */}
      <div className="border-r bg-muted/30 flex-shrink-0">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Folder className="w-5 h-5" />
              File Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-2">
                {viewJavaFileData &&
                  renderFileTree(
                    convertFileObjectToCodeFiles(viewJavaFileData)
                  )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Code Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Assignment Detail (fake) */}
        <div className="border-b bg-orange-50/60">
          <div className="px-4 py-3 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base font-semibold text-orange-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                {assignment?.title}
              </div>
              <p className="text-sm text-orange-900/80 max-w-4xl">
                {assignment?.description}
              </p>
            </div>
            <Button
              onClick={handleDownloadPdf}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              size="sm"
              variant="default"
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile ? (
                <>
                  <FileIconComponent extension={selectedFile.extension} />
                  <span className="font-medium">{selectedFile.name}</span>
                  {selectedFile.extension && (
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFromExtension(selectedFile.extension)}
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">
                  Select a file to view
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log(
                    'Viewing submission results for student:',
                    studentId
                  )
                  console.log('Submission ID:', submission.id)
                }}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Results
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSubmission}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Submission
              </Button>
            </div>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Code Display */}
          <div className="flex-1 flex min-h-0">
            <ScrollArea className="flex-1">
              {selectedFile ? (
                <div className="p-4 text-sm font-mono bg-muted/20 h-full">
                  <Highlight
                    prism={Prism}
                    theme={themes.oneLight}
                    code={normalizeJavaFile(selectedFile.content || '')}
                    language={'java'}
                  >
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                      <pre style={style} className="h-full">
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            <span className="pr-2">{i + 1}</span>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No file selected</p>
                    <p className="text-sm">
                      Click on a file in the explorer to view its content
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
