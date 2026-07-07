import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import styled from 'styled-components'
import { z } from 'zod'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

const loginSchema = z.object({
  login: z.string().trim().min(1, 'Informe o usuário'),
  senha: z.string().min(1, 'Informe a senha'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Wrapper = styled.main`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 360px;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

function getRedirectPath(location: Location): string {
  const state = location.state as { from?: Location } | null
  return state?.from?.pathname ?? '/'
}

export function Login() {
  const { login, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location)} replace />
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values)
      navigate(getRedirectPath(location), { replace: true })
    } catch {
      showToast('Usuário ou senha inválidos.', 'error')
      resetField('senha')
      setFocus('senha')
    }
  }

  return (
    <Wrapper>
      <StyledCard>
        <Title>Entrar</Title>
        <Subtitle>Acesse o sistema de cadastro de clientes</Subtitle>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Usuário"
            autoComplete="username"
            error={errors.login?.message}
            {...register('login')}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.senha?.message}
            {...register('senha')}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </StyledCard>
    </Wrapper>
  )
}
