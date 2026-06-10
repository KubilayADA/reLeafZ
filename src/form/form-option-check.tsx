'use client'

interface FormOptionCheckProps {
  selected: boolean
  className?: string
}

export default function FormOptionCheck({ selected, className = '' }: FormOptionCheckProps) {
  return (
    <span
      className={`form-option-check${selected ? ' form-option-check--selected' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  )
}
