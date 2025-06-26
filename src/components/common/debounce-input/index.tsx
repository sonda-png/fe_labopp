import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { Input } from '@/components/ui/input'

interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  delay?: number // default 3000ms
  placeholder?: string
  className?: string
}

/* --------------------------- DebouncedInput component -------------------------- */
const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  delay = 3000,
  placeholder,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(value)

  const debouncedOnChange = useMemo(
    () => _.debounce(onChange, delay),
    [onChange, delay]
  )

  useEffect(() => {
    debouncedOnChange(internalValue)
    return () => {
      debouncedOnChange.cancel() // cleanup debounce when component unmounts or value changes
    }
  }, [internalValue, debouncedOnChange])

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <Input
      type="text"
      value={internalValue}
      onChange={e => setInternalValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}

export default DebouncedInput
