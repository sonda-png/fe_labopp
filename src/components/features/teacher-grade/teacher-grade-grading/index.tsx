import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation } from '@/hooks'

interface TeacherGradeDetailProps {
  submissionId: string
  trigger: ReactNode
  onSuccess?: () => void
}

export function TeacherGradding({
  submissionId,
  trigger,
  onSuccess,
}: TeacherGradeDetailProps) {
  const [step, setStep] = useState<'grade' | 'feedback'>('grade')
  const [isPass, setIsPass] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)

  const { mutateAsync: gradeMutate, isPending: isGrading } = useMutation(
    'grade',
    {
      onSuccess: () => {
        // Finish immediately after grading
        setOpen(false)
        setStep('grade')
        setIsPass(null)
        onSuccess?.()
      },
    }
  )

  function handleGrade(pass: boolean) {
    setIsPass(pass)
    gradeMutate({ submissionId, isPass: pass })
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setStep('grade')
      setIsPass(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Choose the grade result for this submission.
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
              Pass
            </Button>
            <Button
              variant={isPass === false ? 'destructive' : 'outline'}
              onClick={() => handleGrade(false)}
              disabled={isGrading}
              className="w-full"
            >
              Fail
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TeacherGradding
