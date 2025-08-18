import { CodeFile } from '@/api/actions/teacher-assignment/teacher-assignment.type'

// Utility function to convert file object to CodeFile structure
export const convertFileObjectToCodeFiles = (
  fileObject: Record<string, string>
): CodeFile[] => {
  const fileMap = new Map<string, CodeFile>()
  const rootFiles: CodeFile[] = []

  // Process each file path
  Object.entries(fileObject).forEach(([filePath, content]) => {
    const pathParts = filePath.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const extension = fileName.includes('.')
      ? fileName.split('.').pop()
      : undefined

    // Create file object
    const file: CodeFile = {
      id: filePath,
      name: fileName,
      type: 'file',
      extension,
      content,
    }

    // Build folder structure first
    let currentPath = ''
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i]
      const newPath = currentPath ? `${currentPath}/${folderName}` : folderName

      if (!fileMap.has(newPath)) {
        const folder: CodeFile = {
          id: newPath,
          name: folderName,
          type: 'folder',
          children: [],
        }
        fileMap.set(newPath, folder)

        // Add to parent or root
        if (currentPath === '') {
          // This is a root folder
          rootFiles.push(folder)
        } else {
          // Add to parent folder
          const parent = fileMap.get(currentPath)
          if (parent && parent.children) {
            parent.children.push(folder)
          }
        }
      }
      currentPath = newPath
    }

    // Add file to appropriate location
    if (pathParts.length === 1) {
      // File is in root
      rootFiles.push(file)
    } else {
      // File is in a folder
      const parentPath = pathParts.slice(0, -1).join('/')
      const parent = fileMap.get(parentPath)
      if (parent && parent.children) {
        parent.children.push(file)
      }
    }
  })

  // Sort folders and files
  const sortItems = (items: CodeFile[]): CodeFile[] => {
    return items
      .sort((a, b) => {
        // Folders first, then files
        if (a.type === 'folder' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'folder') return 1
        // Then sort alphabetically
        return a.name.localeCompare(b.name)
      })
      .map(item => {
        if (item.type === 'folder' && item.children) {
          return { ...item, children: sortItems(item.children) }
        }
        return item
      })
  }
  console.log(rootFiles)
  return sortItems(rootFiles)
}
