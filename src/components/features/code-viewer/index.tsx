import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  FileText,
  Folder,
  Code,
  FileIcon,
  Play,
  Save,
  MessageSquare,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'

export interface CodeFile {
  id: string
  name: string
  type: 'file' | 'folder'
  extension?: string
  content?: string
  children?: CodeFile[]
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  lineNumber?: number
  fileName?: string
}

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed' | 'running'
  output?: string
  error?: string
}

interface CodeFileViewerProps {
  files?: CodeFile[]
  onFileSelect?: (file: CodeFile) => void
  selectedFile?: CodeFile | null
  // Grading features
  showGradingPanel?: boolean
  currentStatus?: 'passed' | 'not_passed' | 'pending'
  onStatusChange?: (status: 'passed' | 'not_passed') => void
  onSubmitGrade?: (status: 'passed' | 'not_passed', feedback: string) => void
  // Comments features
  comments?: Comment[]
  onAddComment?: (comment: Omit<Comment, 'id' | 'timestamp'>) => void
  // Test features
  testResults?: TestResult[]
  onRunTests?: () => void
  isRunningTests?: boolean
}

const sampleFiles: CodeFile[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'App.tsx',
        type: 'file',
        extension: 'tsx',
        content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello React!</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;`,
      },
      {
        id: '3',
        name: 'index.tsx',
        type: 'file',
        extension: 'tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
      {
        id: '4',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: '5',
            name: 'Button.tsx',
            type: 'file',
            extension: 'tsx',
            content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`,
          },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'package.json',
    type: 'file',
    extension: 'json',
    content: `{
  "name": "my-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.11.56",
    "@types/react": "^18.0.17",
    "@types/react-dom": "^18.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.7.4",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
  },
  {
    id: '7',
    name: 'README.md',
    type: 'file',
    extension: 'md',
    content: `# My React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### \`npm test\`

Launches the test runner in the interactive watch mode.

### \`npm run build\`

Builds the app for production to the \`build\` folder.`,
  },
]

const getFileIcon = (extension?: string) => {
  switch (extension) {
    case 'tsx':
    case 'jsx':
    case 'ts':
    case 'js':
      return <Code className="w-4 h-4 text-blue-500" />
    case 'json':
      return <FileText className="w-4 h-4 text-yellow-500" />
    case 'md':
      return <FileText className="w-4 h-4 text-green-500" />
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />
  }
}

const getLanguageFromExtension = (extension?: string) => {
  switch (extension) {
    case 'tsx':
    case 'jsx':
      return 'jsx'
    case 'ts':
      return 'typescript'
    case 'js':
      return 'javascript'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'text'
  }
}

export default function CodeFileViewer({
  files = sampleFiles,
  onFileSelect,
  selectedFile: externalSelectedFile,
  showGradingPanel = false,
  currentStatus = 'pending',
  onStatusChange,
  onSubmitGrade,
  comments = [],
  onAddComment,
  testResults = [],
  onRunTests,
  isRunningTests = false,
}: CodeFileViewerProps = {}) {
  const [internalSelectedFile, setInternalSelectedFile] =
    useState<CodeFile | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['1'])
  )

  // Grading state
  const [tempStatus, setTempStatus] = useState(currentStatus)
  const [gradingFeedback, setGradingFeedback] = useState('')

  // Comments state
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  // Use external selectedFile if provided, otherwise use internal state
  const selectedFile =
    externalSelectedFile !== undefined
      ? externalSelectedFile
      : internalSelectedFile

  const handleFileSelect = (file: CodeFile) => {
    if (onFileSelect) {
      onFileSelect(file)
    } else {
      setInternalSelectedFile(file)
    }
  }

  const handleSubmitGrade = () => {
    if (onSubmitGrade && tempStatus !== 'pending') {
      onSubmitGrade(tempStatus, gradingFeedback)
    }
  }

  const handleAddComment = () => {
    if (onAddComment && newComment.trim()) {
      onAddComment({
        author: 'Teacher', // This should come from user context
        content: newComment.trim(),
        fileName: selectedFile?.name,
      })
      setNewComment('')
    }
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
            getFileIcon(file.extension)
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
              <div className="p-2">{renderFileTree(files)}</div>
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
                  {getFileIcon(selectedFile.extension)}
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
              {onRunTests && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRunTests}
                  disabled={isRunningTests}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isRunningTests ? 'Running...' : 'Run Tests'}
                </Button>
              )}

              {showGradingPanel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Comments ({comments.length})
                </Button>
              )}
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
                    theme={themes.oneLight}
                    code={selectedFile.content || ''}
                    language="tsx"
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
          {(testResults.length > 0 || showGradingPanel) && (
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

              {/* Grading & Comments Panel */}
              {showGradingPanel && (
                <div className="flex-1 flex flex-col">
                  {/* Grading Section */}
                  <div className="p-4 border-b flex-shrink-0">
                    <h4 className="font-semibold mb-3">Grading</h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={tempStatus}
                          onValueChange={(value: 'passed' | 'not_passed') => {
                            setTempStatus(value)
                            onStatusChange?.(value)
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">✅ Passed</SelectItem>
                            <SelectItem value="not_passed">
                              ❌ Not Passed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Feedback</label>
                        <Textarea
                          placeholder="Enter feedback..."
                          value={gradingFeedback}
                          onChange={e => setGradingFeedback(e.target.value)}
                          className="mt-1 h-16 resize-none text-xs"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitGrade}
                        size="sm"
                        className="w-full flex items-center gap-2"
                        disabled={tempStatus === 'pending'}
                      >
                        <Save className="w-3 h-3" />
                        Submit Grade
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-3 border-b flex-shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Comments</h4>
                        <Badge variant="secondary" className="text-xs">
                          {comments.length}
                        </Badge>
                      </div>

                      {/* Add Comment */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          className="h-12 resize-none text-xs"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                          Add Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <ScrollArea className="flex-1">
                      <div className="p-3 space-y-2">
                        {comments.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            No comments yet
                          </p>
                        ) : (
                          comments.map(comment => (
                            <div
                              key={comment.id}
                              className="p-2 rounded-md border bg-background"
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <User className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              {comment.fileName && (
                                <div className="text-xs text-muted-foreground mb-1">
                                  On file: {comment.fileName}
                                </div>
                              )}
                              <p className="text-xs">{comment.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
