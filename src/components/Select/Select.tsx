import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
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

const StyledSelect = styled.select<{ $hasError: boolean }>`
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
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(214, 69, 69, 0.25)' : 'rgba(11, 79, 108, 0.25)')};
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

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, children, ...rest },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <FieldWrapper>
      <Label htmlFor={selectId}>{label}</Label>
      <StyledSelect id={selectId} ref={ref} $hasError={!!error} aria-invalid={!!error} {...rest}>
        {children}
      </StyledSelect>
      {error && <ErrorText>{error}</ErrorText>}
    </FieldWrapper>
  )
})
