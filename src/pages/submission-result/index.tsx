import { useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@/hooks'
import { submissionsQueries } from '@/api/actions/submissions/submissions.queries'
import { SubmissionResult } from '@/api/actions/submissions/submissions.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react'

export default function SubmissionResultPage() {
  const navigate = useNavigate()
  const { submissionId } = useParams({
    from: '/_auth/submit-result/$submissionId/',
  })

  const { data, isLoading, error } = useQuery({
    ...submissionsQueries.getResult(submissionId),
  })

  const { passCount, failCount } = useMemo(() => {
    const results = (data as SubmissionResult[]) || []
    return {
      passCount: results.filter(r => r.status === 'PASS').length,
      failCount: results.filter(r => r.status === 'FAIL').length,
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-orange-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Submission Results</h1>
          </div>
          <p className="text-orange-100">Checking your submission...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-orange-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Submission Results</h1>
          </div>
          <p className="text-orange-100">Something went wrong</p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Unable to load submission results. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const results = (data as SubmissionResult[]) || []

  return (
    <div className="p-6">
      <div className="bg-orange-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Submission Results</h1>
            </div>
            <p className="text-orange-100">Submission ID: {submissionId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white text-orange-600 border-white hover:bg-orange-50"
              onClick={() => navigate({ to: '/my-submit' })}
            >
              Back to My Submissions
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" /> Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" /> Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failCount}</div>
          </CardContent>
        </Card>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(result => {
          const isPass = result.status === 'PASS'
          return (
            <Card key={result.testCaseId} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    Test Case: {result.testCaseId}
                  </CardTitle>
                  <Badge
                    className={
                      isPass
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }
                  >
                    {isPass ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>
                    Duration:{' '}
                    <span className="font-medium">{result.durationMs} ms</span>
                  </span>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-orange-700 mb-1">
                    Description
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 border border-gray-200 rounded p-3 overflow-auto max-h-40">
                    {result.description || 'No description'}
                  </pre>
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-700 mb-1">
                    Expected Output
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 border border-gray-200 rounded p-3 overflow-auto max-h-40">
                    {result.expectedOutput}
                  </pre>
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-700 mb-1">
                    Actual Output
                  </div>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 border border-gray-200 rounded p-3 overflow-auto max-h-40">
                    {result.actualOutput}
                  </pre>
                </div>
                {result.errorLog && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-1">
                      Error Log
                    </div>
                    <pre className="whitespace-pre-wrap text-sm bg-red-50 border border-red-200 text-red-800 rounded p-3 overflow-auto max-h-40">
                      {result.errorLog}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
