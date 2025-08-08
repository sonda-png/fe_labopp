import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Folder,
  Play,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import Prism from 'prismjs'
import { useQuery } from '@/hooks'
import { teacherAssignmentQueries } from '@/api/actions/teacher-assignment/teacher-assignment.queries'
import { normalizeJavaFile } from '@/utils/helpers/normalizeJavaFile'
import 'prismjs/components/prism-java'
import { GradingCommentPanel } from '../grading-comment-panel'
import { getLanguageFromExtension } from '@/utils/helpers/get-language-from-extension'
import { FileIconComponent } from '@/components/common/file-icon'
import { TeacherSubmissionData } from '@/api/actions/teacher-submit/teacher-submit.type'
import { convertFileObjectToCodeFiles } from '@/utils/helpers/convert-file-object-to-code-file'
import { CodeFile } from '@/api/actions/teacher-assignment/teacher-assignment.type'

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed' | 'running'
  output?: string
  error?: string
}

interface CodeFileViewerProps {
  studentId: string
  classId: string
  assignmentId: string
  submission: TeacherSubmissionData
}

export default function CodeFileViewer({
  studentId,
  classId,
  assignmentId,
  submission,
}: CodeFileViewerProps) {
  const [internalSelectedFile, setInternalSelectedFile] =
    useState<CodeFile | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  // const { data: viewSubmissionData } = useQuery({
  //   ...teacherAssignmentQueries.viewSubmission({
  //     zipPath: '',
  //     javaFileName: '',
  //   }),
  // })

  const { data: viewJavaFileData } = useQuery({
    ...teacherAssignmentQueries.getViewJavaFile({
      studentId,
      classId,
      assignmentId,
    }),
  })

  const [isRunningTests, setIsRunningTests] = useState(false)

  // Test results state
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: '1',
      name: 'Test Case 1: Basic functionality',
      status: 'passed',
      output: 'All assertions passed successfully',
    },
    {
      id: '2',
      name: 'Test Case 2: Edge cases',
      status: 'passed',
      output: 'Edge case tests completed successfully',
    },
    {
      id: '3',
      name: 'Test Case 3: Error handling',
      status: 'failed',
      error: 'Expected exception not thrown when input is null',
    },
    {
      id: '4',
      name: 'Test Case 4: Performance test',
      status: 'running',
    },
  ])

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

  const getTestIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
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
    console.log(files)
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
      <div className="w-80 border-r bg-muted/30 flex-shrink-0">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRunningTests(true)
                  // Set all tests to running status
                  setTestResults(prev =>
                    prev.map(test => ({ ...test, status: 'running' as const }))
                  )

                  // Simulate test execution
                  setTimeout(() => {
                    setTestResults(prev =>
                      prev.map(test => ({
                        ...test,
                        status: Math.random() > 0.3 ? 'passed' : 'failed',
                        output:
                          Math.random() > 0.3
                            ? 'Test completed successfully'
                            : undefined,
                        error:
                          Math.random() <= 0.3
                            ? 'Test failed with assertion error'
                            : undefined,
                      }))
                    )
                    setIsRunningTests(false)
                  }, 2000)

                  console.log('Running tests for student:', studentId)
                }}
                disabled={isRunningTests}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isRunningTests ? 'Running...' : 'Run Tests'}
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

          {/* Bottom Panel - Test Results & Grading */}
          {testResults.length > 0 && (
            <div className="h-80 border-t bg-muted/30 flex flex-shrink-0">
              {/* Test Results Panel */}
              {testResults.length > 0 && (
                <div className="flex-1 flex flex-col border-r">
                  <div className="p-3 border-b flex-shrink-0">
                    <h4 className="font-semibold">Test Results</h4>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-2">
                      {testResults.map(test => (
                        <div
                          key={test.id}
                          className="p-2 rounded-md border bg-background"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getTestIcon(test.status)}
                            <span className="text-sm font-medium">
                              {test.name}
                            </span>
                          </div>
                          {test.output && (
                            <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mt-1">
                              {test.output}
                            </pre>
                          )}
                          {test.error && (
                            <pre className="text-xs text-red-600 bg-red-50 p-2 rounded mt-1">
                              {test.error}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <GradingCommentPanel
                submissionId={submission.id}
                grade={submission.status}
                comment={submission.comment}
                classId={classId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
