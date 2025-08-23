import { ReactNode, useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { teacherSubmissionQueries } from '@/api/actions/teacher-submit/teacher-submit.queries'
import { useApiClient } from '@/hooks/useApiClient/useApiClient'
import { TeacherSubmissionDetailData } from '@/api/actions/teacher-submit/teacher-submit.type'

interface TeacherSubmissionDetailProps {
  submissionId: string
  trigger: ReactNode
}

export function TeacherSubmissionDetail({
  submissionId,
  trigger,
}: TeacherSubmissionDetailProps) {
  const [open, setOpen] = useState(false)
  const { client } = useApiClient()
  const queryOptions = teacherSubmissionQueries.getDetail(submissionId)
  const { data, isLoading, isError } = useQuery({
    ...queryOptions,
    queryFn: queryOptions.queryFn(client),
    enabled: open && !!submissionId,
  })

  const detail =
    data && !Array.isArray(data)
      ? (data as TeacherSubmissionDetailData)
      : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl h-[70vh] overflow-y-auto pt-2 pb-2 px-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Submission Detail
          </DialogTitle>
          <DialogDescription>
            Full information about the student's submission
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            Loading data...
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-sm text-destructive">
            Error loading data
          </div>
        ) : detail ? (
          <div className="space-y-5 pt-4 text-sm">
            <InfoItem
              label="Student"
              value={`${detail.studentName} (${detail.studentId})`}
            />
            <InfoItem
              label="Assignment"
              value={`${detail.assignmentTitle} (${detail.assignmentId})`}
            />
            <InfoItem
              label="LOC / Target"
              value={`${detail.loc} / ${detail.locTarget}`}
            />
            <InfoItem
              label="Submitted Time"
              value={new Date(detail.submittedAt).toLocaleString('vi-VN')}
            />
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Badge>{detail.status}</Badge>
              </div>
            </div>

            <div>
              <Label>Feedbacks & Grades</Label>
              <div className="mt-1 text-sm text-muted-foreground">
                {detail.feedbacks.length ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {detail.feedbacks.map((fb, i) => (
                      <li key={i}>{fb}</li>
                    ))}
                  </ul>
                ) : (
                  <span>No feedback</span>
                )}
              </div>
            </div>
            <div>
              <Label>Test case results</Label>
              <div className="mt-2 overflow-auto">
                {detail.testCaseResults.length ? (
                  <table className="w-full text-sm border rounded-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border px-2 py-1 text-left">ID</th>
                        <th className="border px-2 py-1 text-left">TestCase</th>
                        <th className="border px-2 py-1 text-left">Output</th>
                        <th className="border px-2 py-1 text-left">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.testCaseResults.map(tc => (
                        <tr key={tc.id}>
                          <td className="border px-2 py-1">{tc.id}</td>
                          <td className="border px-2 py-1">{tc.testCaseId}</td>
                          <td className="border px-2 py-1">
                            {tc.actualOutput}
                          </td>
                          <td className="border px-2 py-1">
                            {tc.isPassed ? (
                              <span className="text-green-600 font-medium">
                                Passed
                              </span>
                            ) : (
                              <span className="text-red-600 font-medium">
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No test case
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No data</div>
        )}

        <DialogClose asChild>
          <Button variant="outline" className="mt-6 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 text-sm text-muted-foreground">{value}</div>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <div className="text-sm font-medium text-foreground">{children}</div>
}

export default TeacherSubmissionDetail
