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
| `VITE_API_URL` | URL base da API REST consumida | `http://localhost:3000/api`  |

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
