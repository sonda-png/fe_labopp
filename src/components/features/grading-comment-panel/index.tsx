import { teacherSubmissionQueries } from '@/api/actions/teacher-submit/teacher-submit.queries'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { Save, User, Edit2 } from 'lucide-react'
import { Fragment, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface GradingCommentPanelProps {
  submissionId: string
  grade: string
  comment: string
  classId: string
}

export const GradingCommentPanel = ({
  submissionId,
  grade,
  comment,
  classId,
}: GradingCommentPanelProps) => {
  const queryClient = useQueryClient()

  // Comment state
  const [newComment, setNewComment] = useState<string>(comment)
  const [newStatus, setNewStatus] = useState<'Passed' | 'Reject'>('Passed')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Initialize status based on grade
  useEffect(() => {
    if (grade === 'Passed') {
      setNewStatus('Passed')
    } else if (grade === 'Reject') {
      setNewStatus('Reject')
    }
  }, [grade])

  // Track changes
  useEffect(() => {
    const statusChanged = newStatus !== grade
    const commentChanged = newComment !== comment
    setHasChanges(statusChanged || commentChanged)
  }, [newComment, newStatus, comment, grade])

  const { mutateAsync: gradeMutate, isPending: isGrading } = useMutation(
    'grade',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: teacherSubmissionQueries.getWaiting(classId).queryKey,
        })
        toast.success('Grade updated successfully')
      },
    }
  )

  const { mutateAsync: feedbackMutate, isPending: isFeedbacking } = useMutation(
    'feedback',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: teacherSubmissionQueries.getWaiting(classId).queryKey,
        })
        toast.success('Feedback updated successfully')
        setIsEditing(false)
      },
    }
  )

  const handleSubmitGrade = async () => {
    await gradeMutate({
      submissionId,
      isPass: newStatus === 'Passed',
    })
  }

  const handleSubmitFeedback = async () => {
    await feedbackMutate({
      submissionId,
      comment: newComment,
    })
  }

  const handleSaveAll = async () => {
    if (newStatus !== grade) {
      await handleSubmitGrade()
    }
    if (newComment !== comment) {
      await handleSubmitFeedback()
    }
  }

  const handleCancelEdit = () => {
    setNewComment(comment)
    setIsEditing(false)
  }

  return (
    <Fragment>
      <div className="flex-1 flex flex-col">
        {/* Grading Section */}
        <div className="p-4 border-b flex-shrink-0">
          <h4 className="font-semibold mb-3">Grading</h4>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={newStatus}
                onValueChange={(value: 'Passed' | 'Reject') => {
                  setNewStatus(value)
                  console.log('Status changed:', value)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passed">✅ Passed</SelectItem>
                  <SelectItem value="Reject">❌ Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save button - only show if there are changes */}
            {hasChanges && (
              <Button
                onClick={handleSaveAll}
                size="sm"
                className="w-full flex items-center gap-2"
                disabled={isGrading || isFeedbacking}
              >
                <Save className="w-3 h-3" />
                {isGrading || isFeedbacking ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="flex-1 flex flex-col min-h-0">
          

          {/* Existing Comment Display */}
          {comment && !isEditing && (
            <div className="p-3">
              <div className="p-3 rounded-md border bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Teacher</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment}</p>
              </div>
            </div>
          )}

          {/* Comment Preview - Show when editing and content changed */}
          {isEditing && newComment.trim() && newComment !== comment && (
            <div className="p-3 border-t">
              <div className="text-xs text-muted-foreground mb-2">Preview:</div>
              <div className="p-3 rounded-md border bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Teacher</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{newComment}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}
