import { Code, FileIcon, FileText } from 'lucide-react'

interface FileIconComponentProps {
  extension?: string
}

export const FileIconComponent = ({ extension }: FileIconComponentProps) => {
  switch (extension) {
    case 'tsx':
    case 'jsx':
    case 'ts':
    case 'js':
      return <Code className="w-4 h-4 text-blue-500" />
    case 'java':
      return <Code className="w-4 h-4 text-orange-500" />
    case 'json':
      return <FileText className="w-4 h-4 text-yellow-500" />
    case 'md':
      return <FileText className="w-4 h-4 text-green-500" />
    case 'txt':
      return <FileText className="w-4 h-4 text-gray-500" />
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />
  }
}
