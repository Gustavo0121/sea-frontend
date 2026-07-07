import { useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Loading } from '../../components/Loading'
import { Select } from '../../components/Select'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { clienteService } from '../../services/clienteService'
import { enderecoService } from '../../services/enderecoService'
import type { Cliente, ClienteRequestDTO, TipoTelefone } from '../../types/cliente'
import { maskCep, maskCpf, maskTelefone, onlyDigits } from '../../utils/masks'
import { sanitizeText } from '../../utils/sanitize'
import { clienteFormSchema, type ClienteFormValues } from './clienteFormSchema'

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.blueDark};
  margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.grayText};
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const HintText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.grayText};
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  > *:not(:last-child) {
    flex: 1;
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const EMPTY_VALUES: ClienteFormValues = {
  nome: '',
  cpf: '',
  endereco: { cep: '', logradouro: '', bairro: '', cidade: '', uf: '', complemento: '' },
  telefones: [{ tipo: 'CELULAR', numero: '' }],
  emails: [{ endereco: '' }],
}

function toFormValues(cliente: Cliente): ClienteFormValues {
  return {
    nome: cliente.nome,
    cpf: '',
    endereco: {
      cep: maskCep(cliente.endereco.cep),
      logradouro: cliente.endereco.logradouro,
      bairro: cliente.endereco.bairro,
      cidade: cliente.endereco.cidade,
      uf: cliente.endereco.uf,
      complemento: cliente.endereco.complemento ?? '',
    },
    telefones: cliente.telefones.map((telefone) => ({
      tipo: telefone.tipo,
      numero: maskTelefone(telefone.numero, telefone.tipo),
    })),
    emails: cliente.emails.map((email) => ({ endereco: email.endereco })),
  }
}

export function ClienteForm() {
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const clienteId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const isAdmin = user?.role === 'ADMIN'

  const clienteQuery = useQuery({
    queryKey: ['clientes', clienteId],
    queryFn: () => clienteService.buscarPorId(clienteId!),
    enabled: isEditMode && isAdmin,
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: EMPTY_VALUES,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  useEffect(() => {
    if (clienteQuery.data) reset(toFormValues(clienteQuery.data))
  }, [clienteQuery.data, reset])

  const telefonesArray = useFieldArray({ control, name: 'telefones' })
  const emailsArray = useFieldArray({ control, name: 'emails' })
  const telefonesValues = useWatch({ control, name: 'telefones' })

  const cepMutation = useMutation({
    mutationFn: (cep: string) => enderecoService.buscarPorCep(cep),
    onSuccess: (endereco) => {
      setValue('endereco.logradouro', endereco.logradouro)
      setValue('endereco.bairro', endereco.bairro)
      setValue('endereco.cidade', endereco.cidade)
      setValue('endereco.uf', endereco.uf)
    },
    onError: () => {
      showToast('CEP não encontrado. Preencha o endereço manualmente.', 'error')
    },
  })

  const salvarMutation = useMutation({
    mutationFn: (dto: ClienteRequestDTO) =>
      isEditMode ? clienteService.atualizar(clienteId!, dto) : clienteService.cadastrar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      showToast(isEditMode ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.', 'success')
      navigate('/clientes')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showToast('CPF já cadastrado.', 'error')
      } else {
        showToast('Não foi possível salvar o cliente.', 'error')
      }
    },
  })

  function onSubmit(values: ClienteFormValues) {
    const dto: ClienteRequestDTO = {
      nome: sanitizeText(values.nome),
      cpf: onlyDigits(values.cpf),
      endereco: {
        cep: onlyDigits(values.endereco.cep),
        logradouro: sanitizeText(values.endereco.logradouro),
        bairro: sanitizeText(values.endereco.bairro),
        cidade: sanitizeText(values.endereco.cidade),
        uf: values.endereco.uf.trim().toUpperCase(),
        complemento: values.endereco.complemento ? sanitizeText(values.endereco.complemento) : null,
      },
      telefones: values.telefones.map((telefone) => ({
        tipo: telefone.tipo,
        numero: onlyDigits(telefone.numero),
      })),
      emails: values.emails.map((email) => ({ endereco: sanitizeText(email.endereco) })),
    }
    salvarMutation.mutate(dto)
  }

  if (!isAdmin) {
    return (
      <Card>
        <Title>Acesso restrito</Title>
        <Subtitle>Apenas administradores podem cadastrar ou editar clientes.</Subtitle>
      </Card>
    )
  }

  if (isEditMode && clienteQuery.isLoading) {
    return <Loading />
  }

  if (isEditMode && clienteQuery.isError) {
    return (
      <Card>
        <Title>Cliente não encontrado</Title>
        <Subtitle>Não foi possível carregar os dados deste cliente.</Subtitle>
      </Card>
    )
  }

  return (
    <Card>
      <Title>{isEditMode ? 'Editar cliente' : 'Novo cliente'}</Title>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid>
          <Input label="Nome" error={errors.nome?.message} {...register('nome')} />
          <FieldGroup>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <Input
                  label="CPF"
                  value={field.value}
                  onChange={(event) => field.onChange(maskCpf(event.target.value))}
                  onBlur={field.onBlur}
                  error={errors.cpf?.message}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              )}
            />
            {isEditMode && clienteQuery.data && (
              <HintText>
                CPF cadastrado: {clienteQuery.data.cpf}. Por segurança, digite o CPF completo para mantê-lo ou
                alterá-lo.
              </HintText>
            )}
          </FieldGroup>
        </Grid>

        <SectionTitle>Endereço</SectionTitle>
        <Grid>
          <Controller
            control={control}
            name="endereco.cep"
            render={({ field }) => (
              <Input
                label="CEP"
                value={field.value}
                onChange={(event) => field.onChange(maskCep(event.target.value))}
                onBlur={() => {
                  field.onBlur()
                  const digits = onlyDigits(field.value)
                  if (digits.length === 8) cepMutation.mutate(digits)
                }}
                error={errors.endereco?.cep?.message}
                placeholder="00000-000"
                maxLength={9}
              />
            )}
          />
          <Input
            label="Logradouro"
            error={errors.endereco?.logradouro?.message}
            {...register('endereco.logradouro')}
          />
          <Input label="Bairro" error={errors.endereco?.bairro?.message} {...register('endereco.bairro')} />
          <Input label="Cidade" error={errors.endereco?.cidade?.message} {...register('endereco.cidade')} />
          <Input label="UF" maxLength={2} error={errors.endereco?.uf?.message} {...register('endereco.uf')} />
          <Input
            label="Complemento"
            error={errors.endereco?.complemento?.message}
            {...register('endereco.complemento')}
          />
        </Grid>

        <SectionTitle>Telefones</SectionTitle>
        {telefonesArray.fields.map((field, index) => {
          const tipo = (telefonesValues?.[index]?.tipo ?? 'CELULAR') as TipoTelefone
          return (
            <Row key={field.id}>
              <Select label="Tipo" {...register(`telefones.${index}.tipo`)}>
                <option value="CELULAR">Celular</option>
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
              </Select>
              <Controller
                control={control}
                name={`telefones.${index}.numero`}
                render={({ field: numeroField }) => (
                  <Input
                    label="Número"
                    value={numeroField.value}
                    onChange={(event) => numeroField.onChange(maskTelefone(event.target.value, tipo))}
                    onBlur={numeroField.onBlur}
                    error={errors.telefones?.[index]?.numero?.message}
                    placeholder={tipo === 'CELULAR' ? '(00) 00000-0000' : '(00) 0000-0000'}
                  />
                )}
              />
              <Button
                type="button"
                $variant="danger"
                onClick={() => telefonesArray.remove(index)}
                disabled={telefonesArray.fields.length <= 1}
              >
                Remover
              </Button>
            </Row>
          )
        })}
        <Button
          type="button"
          $variant="secondary"
          onClick={() => telefonesArray.append({ tipo: 'CELULAR', numero: '' })}
        >
          Adicionar telefone
        </Button>

        <SectionTitle>Emails</SectionTitle>
        {emailsArray.fields.map((field, index) => (
          <Row key={field.id}>
            <Input
              label="Email"
              type="email"
              error={errors.emails?.[index]?.endereco?.message}
              {...register(`emails.${index}.endereco`)}
            />
            <Button
              type="button"
              $variant="danger"
              onClick={() => emailsArray.remove(index)}
              disabled={emailsArray.fields.length <= 1}
            >
              Remover
            </Button>
          </Row>
        ))}
        <Button type="button" $variant="secondary" onClick={() => emailsArray.append({ endereco: '' })}>
          Adicionar email
        </Button>

        <FormActions>
          <Button type="button" $variant="secondary" onClick={() => navigate('/clientes')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </FormActions>
      </form>
    </Card>
  )
}
