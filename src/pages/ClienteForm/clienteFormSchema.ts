import { z } from 'zod'
import { isValidCpf } from '../../utils/cpf'
import { onlyDigits } from '../../utils/masks'

const NOME_REGEX = /^[\p{L}0-9 ]+$/u
const UF_REGEX = /^[A-Za-z]{2}$/

const telefoneSchema = z
  .object({
    tipo: z.enum(['RESIDENCIAL', 'COMERCIAL', 'CELULAR']),
    numero: z.string().min(1, 'Número é obrigatório.'),
  })
  .superRefine((telefone, ctx) => {
    const digits = onlyDigits(telefone.numero)
    const tamanhoEsperado = telefone.tipo === 'CELULAR' ? 11 : 10
    if (digits.length !== tamanhoEsperado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['numero'],
        message:
          telefone.tipo === 'CELULAR'
            ? 'Celular deve ter 11 dígitos (DDD + 9 dígitos).'
            : 'Telefone deve ter 10 dígitos (DDD + 8 dígitos).',
      })
    }
  })

const emailSchema = z.object({
  endereco: z
    .string()
    .trim()
    .min(1, 'Email é obrigatório.')
    .max(150, 'Email deve ter no máximo 150 caracteres.')
    .email('Email inválido.'),
})

export const clienteFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Nome deve ter entre 3 e 100 caracteres.')
    .max(100, 'Nome deve ter entre 3 e 100 caracteres.')
    .regex(NOME_REGEX, 'Nome deve conter apenas letras, números e espaços.'),
  cpf: z.string().refine(isValidCpf, 'CPF inválido.'),
  endereco: z.object({
    cep: z.string().refine((value) => onlyDigits(value).length === 8, 'CEP deve ter 8 dígitos.'),
    logradouro: z
      .string()
      .trim()
      .min(1, 'Logradouro é obrigatório.')
      .max(150, 'Logradouro deve ter no máximo 150 caracteres.'),
    bairro: z
      .string()
      .trim()
      .min(1, 'Bairro é obrigatório.')
      .max(100, 'Bairro deve ter no máximo 100 caracteres.'),
    cidade: z
      .string()
      .trim()
      .min(1, 'Cidade é obrigatória.')
      .max(100, 'Cidade deve ter no máximo 100 caracteres.'),
    uf: z.string().trim().regex(UF_REGEX, 'UF deve conter exatamente 2 letras.'),
    complemento: z
      .string()
      .trim()
      .max(100, 'Complemento deve ter no máximo 100 caracteres.')
      .optional()
      .or(z.literal('')),
  }),
  telefones: z.array(telefoneSchema).min(1, 'Pelo menos um telefone é obrigatório.'),
  emails: z.array(emailSchema).min(1, 'Pelo menos um email é obrigatório.'),
})

export type ClienteFormValues = z.infer<typeof clienteFormSchema>
