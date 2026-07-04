import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import styled from 'styled-components'

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.blueDark};
`

const StyledInput = styled.input<{ $hasError: boolean }>`
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.grayMedium)};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.transition.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.petrol)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayLight};
    cursor: not-allowed;
  }
`

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldWrapper>
      <Label htmlFor={inputId}>{label}</Label>
      <StyledInput id={inputId} ref={ref} $hasError={!!error} aria-invalid={!!error} {...rest} />
      {error && <ErrorText>{error}</ErrorText>}
    </FieldWrapper>
  )
})
