import { TableCell, TableRow } from '@/components/ui/table'

export const TableSkeleton = ({
  columns = 3,
  rows = 5,
}: {
  columns?: number
  rows?: number
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-gray-200 rounded w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
