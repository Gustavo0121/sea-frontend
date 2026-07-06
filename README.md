# sea-frontend

SPA em React para o sistema de cadastro de clientes da SEA Tecnologia.

## Stack

- Vite + React + TypeScript
- React Router
- Axios
- React Hook Form + Zod
- TanStack Query (React Query)
- styled-components

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de variáveis de ambiente de exemplo e ajuste a URL da API se necessário:

```bash
cp .env.example .env
```

| Variável       | Descrição                      | Padrão                       |
| -------------- | ------------------------------- | ---------------------------- |
| `VITE_API_URL` | URL base da API REST consumida | `http://localhost:8080`      |

## Rodando o projeto

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173` (porta padrão do Vite).

## Outros comandos

```bash
npm run build         # build de produção (type-check + bundle em dist/)
npm run preview        # serve o build de produção localmente
npm run lint            # roda o ESLint
npm run format          # formata o código com Prettier
npm run format:check   # verifica formatação sem alterar arquivos
```

## Estrutura de pastas

```
src
├── components   # componentes reutilizáveis (Button, Card, etc.)
├── pages        # telas da aplicação
├── layouts      # layouts (header, sidebar, etc.)
├── services     # integração com API (axios, endpoints)
├── hooks        # hooks customizados
├── context      # Context API (auth, etc.)
├── routes       # configuração de rotas
├── types        # tipos TypeScript compartilhados
├── utils        # funções utilitárias (máscaras, storage, etc.)
├── styles       # design tokens, tema e estilos globais
└── assets       # imagens, ícones, etc.
```

## Componentes reutilizáveis

Biblioteca de componentes construída na Fase 2 do plano de desenvolvimento, usada como base para as telas de negócio:

- `Button` — variantes `primary`, `secondary` e `danger`
- `Input` — com suporte a label e mensagem de erro
- `Select` — mesmo padrão visual do `Input`, para campos de escolha (ex: tipo de telefone)
- `Card`
- `Modal`
- `ConfirmDialog` — confirmação antes de ações destrutivas (ex: exclusão)
- `Table` — genérica, com colunas configuráveis e estado de loading
- `Pagination`
- `Loading` / `Skeleton`
- `Toast` — feedback de sucesso/erro via context

Todos os componentes têm uma vitrine de uso na rota `/dev/components` (`DevComponents`), útil para validar visual e comportamento isoladamente.

## Layout

`MainLayout` (`src/layouts`) define a casca das telas autenticadas: header com marca e usuário logado, sidebar de navegação e área de conteúdo (via `Outlet` do React Router). É aplicado às rotas protegidas em `routes/router.tsx`.

## Dashboard

Tela inicial pós-login (Fase 3 do plano de desenvolvimento), na rota `/`:

- Card de resumo com o total de clientes cadastrados
- Tabela com os últimos clientes cadastrados (`Nome`, `CPF`)
- Botão de navegação para a listagem de clientes (`/clientes`)

Os dados vêm de `clienteService.listar` (`GET /clientes`, paginado pelo backend) via o hook `useClientesResumo`, que usa React Query para cache/loading/erro.

## Listagem de clientes

Rota `/clientes` (Fase 4 do plano de desenvolvimento):

- Busca por **Nome** e **CPF**, com debounce (`useDebouncedValue`) para evitar uma requisição a cada tecla
- Paginação consumida do backend (`Pagination` + `useClientesListagem`)
- Ações por linha: **Ver**, **Editar** e **Excluir** — as duas últimas só aparecem para usuários com role `ADMIN` (mesma regra de autorização do backend)
- Exclusão com `ConfirmDialog` antes de efetivar e `Toast` de sucesso/erro
- Cache via React Query, invalidado (`queryKey: ['clientes']`) após excluir, o que também mantém o resumo do Dashboard sincronizado

A rota `/clientes/:id` leva à página de visualização de detalhes (Fase 6).

## Formulário de cliente (Cadastro/Edição)

Rotas `/clientes/novo` e `/clientes/:id/editar` (Fase 5 do plano de desenvolvimento), ambas servidas pelo **mesmo componente** `ClienteForm` (evita duplicação entre cadastro e edição):

- Validação completa com Zod + React Hook Form (nome, CPF, endereço, telefones e emails), com revalidação em tempo real (`reValidateMode: 'onChange'`)
- Máscaras reutilizáveis de CPF, CEP e telefone (`utils/masks.ts`), aplicadas via `Controller` do RHF
- CEP: ao sair do campo, consulta `GET /enderecos/{cep}` (o próprio backend, que por sua vez integra com o ViaCEP) e preenche logradouro/bairro/cidade/UF automaticamente — o preenchimento continua editável manualmente
- Telefones e emails dinâmicos (`useFieldArray`), telefone com máscara condicional por tipo (`RESIDENCIAL`/`COMERCIAL`/`CELULAR`)
- Sanitização (`utils/sanitize.ts`) de todos os campos de texto antes do envio, evitando XSS
- Restrito a usuários `ADMIN` — quem não for admin vê uma mensagem de acesso restrito em vez do formulário
- Toast de sucesso/erro em loading no submit, com tratamento específico para CPF duplicado (409)

**Observação de segurança:** o backend retorna o CPF mascarado de forma irreversível (ex: `100.***.***-08`), então no modo de edição o campo CPF não é pré-preenchido — fica vazio com uma dica mostrando o valor mascarado, exigindo que o CPF completo seja redigitado para salvar a edição.

## Visualização de detalhes

Rota `/clientes/:id` (Fase 6 do plano de desenvolvimento), página somente leitura com os dados completos do cliente:

- Nome, CPF (mascarado como retornado pelo backend), endereço completo, telefones (com label do tipo) e emails
- Ações rápidas: **Editar** e **Excluir** (com `ConfirmDialog` + Toast), visíveis apenas para `ADMIN`
- **Voltar** para a listagem, disponível a todos os usuários autenticados
