import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  AlertCircle,
  Info,
  FileText,
  ArrowLeft,
} from 'lucide-react'
import { useMutation } from '@/hooks'
import {
  ReviewCodeRawResponse,
  ReviewCodeResponse,
} from '@/api/actions/ai-manage/ai-manage.type'
import { toast } from 'react-toastify'
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types'

export default function AICodeReviewPage() {
  const navigate = useNavigate()
  const params = useParams({
    from: '/_auth/my-submit/review/$submissionId/$assignmentId',
  })

  const [reviewResult, setReviewResult] =
    useState<ReviewCodeRawResponse | null>(null)

  const issues: Array<{
    type?: string
    message?: string
    description?: string
    file?: string
    line?: number
  }> = (reviewResult?.rawResponse?.issues as any[]) || []
  const evidence: Array<{
    input?: string
    expectedOutput?: string
    actualOutput?: string
    reason?: string
  }> = (reviewResult?.rawResponse?.evidence as any[]) || []

  const ioCoverage = reviewResult?.rawResponse?.ioCoverage as
    | { provided?: number; used?: number; failed?: number }
    | undefined
  const convertedResponse = useMemo(() => {
    if (!reviewResult?.rawResponse || !reviewResult) return null
    return {
      assignmentId: Number(reviewResult.assignmentId),
      submissionId: Number(reviewResult.submissionId),
      review: reviewResult.review,
      hasErrors: reviewResult.hasErrors,
      errorCount: reviewResult.errorCount,
      summary: reviewResult.summary,
      rawResponse: reviewResult.rawResponse,
    }
  }, [reviewResult])

  const reviewCodeMutation = useMutation('handleReviewCode', {
    onSuccess: (data: ReviewCodeResponse) => {
      let parsed: unknown = data.rawResponse
      let parsedRaw: unknown = data.rawResponse
      if (typeof data.rawResponse === 'string') {
        try {
          parsed = JSON.parse(data.rawResponse)
          parsedRaw = JSON.parse(parsed.rawResponse)
        } catch {
          parsed = data.rawResponse
        }
      }
      const normalized: ReviewCodeRawResponse = {
        assignmentId: data.assignmentId,
        submissionId: data.submissionId,
        reviewAllowed: data.reviewAllowed,
        review: data.review,
        hasErrors: data.hasErrors,
        errorCount: data.errorCount,
        summary: data.summary,
        rawResponse: parsedRaw as ReviewCodeResponse['rawResponse'],
      }
      setReviewResult(normalized)
    },
    onError: (error: StandardizedApiError) => {
      toast.error(error.message)
    },
  })

  useEffect(() => {
    const run = async () => {
      try {
        await reviewCodeMutation.mutateAsync({
          assignmentId: params.assignmentId,
          submissionId: params.submissionId,
        })
      } catch {}
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.assignmentId, params.submissionId])

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/my-submit' })}
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Submissions
        </Button>
        <Badge className="bg-orange-500 text-white">AI Review</Badge>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-orange-500 rounded-md mr-3">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            Code Review • Submission {params.submissionId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewCodeMutation.isPending && (
            <div className="animate-pulse">
              <div className="h-4 bg-orange-100 rounded w-1/3 mb-4" />
              <div className="h-3 bg-orange-50 rounded w-2/3 mb-2" />
              <div className="h-3 bg-orange-50 rounded w-5/6 mb-2" />
              <div className="h-3 bg-orange-50 rounded w-4/6 mb-2" />
              <div className="h-3 bg-orange-50 rounded w-3/6" />
            </div>
          )}

          {reviewResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reviewResult.hasErrors ? (
                    <Badge className="bg-red-500 text-white">
                      {reviewResult.errorCount}{' '}
                      {reviewResult.errorCount === 1 ? 'Error' : 'Errors'}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500 text-white">
                      All Tests Passed
                    </Badge>
                  )}
                  {reviewResult.rawResponse?.status && (
                    <Badge className="bg-orange-100 text-orange-700 border border-orange-300">
                      {reviewResult.rawResponse.status}
                    </Badge>
                  )}
                </div>
              </div>

              {reviewResult.summary && (
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Info className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-orange-900">
                      Summary
                    </h3>
                  </div>
                  <p className="text-gray-800">{reviewResult.summary}</p>
                </div>
              )}

              {reviewResult.hasErrors && issues.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-900">
                        Issues & Errors
                      </h3>
                    </div>
                    <Badge className="bg-red-500 text-white">
                      {reviewResult.errorCount}{' '}
                      {reviewResult.errorCount === 1 ? 'Error' : 'Errors'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {issues.map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-md p-4 border border-red-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-red-800">
                            {it.type || 'issue'}
                          </span>
                          {(it.file || it.line) && (
                            <span className="text-xs text-red-700">
                              {it.file}
                              {it.line != null ? ` :${it.line}` : ''}
                            </span>
                          )}
                        </div>
                        {it.message && (
                          <p className="text-sm text-red-900">{it.message}</p>
                        )}
                        {it.description && (
                          <p className="text-xs text-red-700 mt-1">
                            {it.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviewResult.review && (
                <div className="bg-white rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-orange-900">
                      Detailed Analysis
                    </h3>
                  </div>
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                    {reviewResult.review}
                  </pre>
                </div>
              )}

              {ioCoverage && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600">Provided</div>
                    <div className="text-xl font-semibold text-orange-700">
                      {ioCoverage.provided ?? 0}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600">Used</div>
                    <div className="text-xl font-semibold text-orange-700">
                      {ioCoverage.used ?? 0}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-xs text-gray-600">Failed</div>
                    <div className="text-xl font-semibold text-orange-700">
                      {ioCoverage.failed ?? 0}
                    </div>
                  </div>
                </div>
              )}

              {reviewResult.rawResponse && (
                <div className="bg-white rounded-xl p-5 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    Evidence ({evidence.length} items) - Raw has{' '}
                    {reviewResult.rawResponse.evidence
                      ? (reviewResult.rawResponse.evidence as any[]).length
                      : 0}{' '}
                    evidence
                  </h3>
                  {evidence.length > 0 ? (
                    <div className="space-y-4">
                      {evidence.map((ev, idx) => (
                        <div
                          key={idx}
                          className="border rounded-md p-4 border-orange-200"
                        >
                          {ev.input && (
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-gray-600 mb-1">
                                Input
                              </div>
                              <pre className="text-xs bg-orange-50 p-2 rounded border border-orange-200 whitespace-pre-wrap overflow-x-auto">
                                {ev.input}
                              </pre>
                            </div>
                          )}
                          {ev.expectedOutput && (
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-gray-600 mb-1">
                                Expected Output
                              </div>
                              <pre className="text-xs bg-orange-50 p-2 rounded border border-orange-200 whitespace-pre-wrap overflow-x-auto">
                                {ev.expectedOutput}
                              </pre>
                            </div>
                          )}
                          {ev.actualOutput && (
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-gray-600 mb-1">
                                Actual Output
                              </div>
                              <pre className="text-xs bg-orange-50 p-2 rounded border border-orange-200 whitespace-pre-wrap overflow-x-auto">
                                {ev.actualOutput}
                              </pre>
                            </div>
                          )}
                          {ev.reason && (
                            <div>
                              <div className="text-xs font-semibold text-gray-600 mb-1">
                                Reason
                              </div>
                              <p className="text-sm text-gray-800">
                                {ev.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      No evidence data available in rawResponse
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => navigate({ to: '/my-submit' })}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
