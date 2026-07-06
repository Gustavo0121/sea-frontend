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

Os dados vêm de `clienteService.listar` (`GET /clientes`, paginado pelo backend) via o hook `useClientesResumo`, que usa React Query para cache/loading/erro. A rota `/clientes` por enquanto exibe apenas um placeholder — a listagem completa (busca, paginação, ações) é entregue na Fase 4.
