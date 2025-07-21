export const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Đang hoạt động'
    case 'completed':
      return 'Đã hoàn thành'
    case 'draft':
      return 'Bản nháp'
    case 'archived':
      return 'Đã lưu trữ'
    default:
      return 'Unknown'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 hover:bg-green-600'
    case 'completed':
      return 'bg-blue-500 hover:bg-blue-600'
    case 'draft':
      return 'bg-yellow-500 hover:bg-yellow-600'
    case 'archived':
      return 'bg-gray-500 hover:bg-gray-600'
    default:
      return 'bg-gray-500 hover:bg-gray-600'
  }
}
