import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@/hooks'

interface TeacherGradeDetailProps {
  submissionId: string
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function TeacherGradding({
  submissionId,
  trigger,
  onSuccess,
}: TeacherGradeDetailProps) {
  const [step, setStep] = useState<'grade' | 'feedback'>('grade')
  const [isPass, setIsPass] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false)

  const { mutateAsync: gradeMutate, isPending: isGrading } = useMutation(
    'grade',
    {
      onSuccess: () => setStep('feedback'),
    }
  )
  const { mutateAsync: feedbackMutate, isPending: isFeedbacking } = useMutation(
    'feedback',
    {
      onSuccess: () => {
        setOpen(false)
        setStep('grade')
        setIsPass(null)
        setComment('')
        onSuccess?.()
      },
    }
  )

  function handleGrade(pass: boolean) {
    setIsPass(pass)
    gradeMutate({ submissionId, isPass: pass })
  }

  function handleFeedback() {
    feedbackMutate({ submissionId, comment })
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setStep('grade')
      setIsPass(null)
      setComment('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chấm bài nộp</DialogTitle>
          <DialogDescription>
            {step === 'grade'
              ? 'Chọn kết quả chấm điểm cho bài nộp này.'
              : 'Nhập nhận xét/feedback cho sinh viên.'}
          </DialogDescription>
        </DialogHeader>
        {step === 'grade' && (
          <div className="flex flex-col gap-4">
            <Button
              variant={isPass === true ? 'default' : 'outline'}
              onClick={() => handleGrade(true)}
              disabled={isGrading}
              className="w-full"
            >
              Đạt (Pass)
            </Button>
            <Button
              variant={isPass === false ? 'destructive' : 'outline'}
              onClick={() => handleGrade(false)}
              disabled={isGrading}
              className="w-full"
            >
              Không đạt (Fail)
            </Button>
          </div>
        )}
        {step === 'feedback' && (
          <div className="flex flex-col gap-4">
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Nhập nhận xét cho sinh viên..."
              className="resize-none min-h-[80px]"
              disabled={isFeedbacking}
            />
            <DialogFooter>
              <Button
                onClick={handleFeedback}
                disabled={isFeedbacking || !comment.trim()}
              >
                Gửi nhận xét
              </Button>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Đóng
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TeacherGradding
