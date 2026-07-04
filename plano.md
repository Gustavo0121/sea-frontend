# Plano de Desenvolvimento — SPA React de Cadastro de Clientes (SEA Tecnologia)

Baseado no escopo do documento de requisitos, este plano está dividido em fases, pensado para execução incremental, com cada fase entregando algo testável.

## Fase 0 — Setup e Fundação

**Objetivo:** ambiente pronto e arquitetura definida antes de codar features.

- Criar projeto com **Vite + React + TypeScript**
- Instalar stack: `react-router-dom`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@tanstack/react-query`, `styled-components` (ou CSS Modules — definir um só, não misturar)
- Configurar ESLint + Prettier (regras SOLID/Clean Code)
- Criar estrutura de pastas conforme o documento: `components/`, `pages/`, `layouts/`, `services/`, `hooks/`, `context/`, `routes/`, `types/`, `utils/`, `styles/`, `assets/`
- Definir **design tokens** (cores, tipografia, espaçamentos) num arquivo central — evita retrabalho visual depois:
  - Azul petróleo, azul escuro, azul claro, branco, cinza claro, laranja (CTA)
- Configurar `axios` com instância base (`services/api.ts`) + interceptors (token, erros)
- Configurar `.env` para URL da API

**Entregável:** projeto rodando com rota "hello world", lint limpo, tokens de design aplicados num componente de exemplo.

---

## Fase 1 — Autenticação e Roteamento Protegido

- Tela de **Login** (form com Zod + RHF: usuário/senha)
- Serviço de auth (`services/authService.ts`) consumindo endpoint de login, JWT
- `AuthContext` (Context API) para estado de sessão
- Persistência do token (JWT) — **decisão de segurança**: usar cookie HttpOnly se o backend suportar; caso contrário, `sessionStorage` (não `localStorage`) minimizando exposição
- `ProtectedRoute` component
- Interceptor axios: anexa token nas requisições, trata 401 (logout automático)
- Timeout de sessão / logout automático ao expirar token
- Toast de erro em falha de login (mensagem genérica, sem detalhes técnicos)

**Entregável:** login funcional, rotas protegidas, logout manual e automático.

---

## Fase 2 — Layout Base e Componentes Reutilizáveis

Construir a "biblioteca" de componentes antes das telas de negócio, para reaproveitar em tudo depois:

- `Button`, `Input` (com máscara opcional), `Card`, `Modal`, `ConfirmDialog`
- `Table` (genérica, com slots para colunas)
- `Pagination`
- `Loading` / `Skeleton`
- `Toast` (sucesso/erro/aviso — provavelmente via context + portal)
- `Layout` principal (header, sidebar/nav, área de conteúdo)

**Entregável:** showcase de componentes (pode ser uma página `/dev/components` temporária) validando visual e reuso.

---

## Fase 3 — Dashboard

- Tela inicial pós-login
- Cards de resumo (ex: total de clientes, últimos cadastrados) — dados via React Query
- Navegação para listagem de clientes

---

## Fase 4 — Listagem de Clientes

- Página de listagem consumindo API com **paginação do backend**
- Busca por **Nome** e **CPF** (debounce no input de busca)
- Tabela com ações: visualizar, editar, excluir
- `ConfirmDialog` antes de excluir + Toast de resultado
- Loading/Skeleton durante fetch
- Cache e invalidação via React Query (`useQuery`/`useMutation`)

---

## Fase 5 — Formulário de Cliente (Cadastro/Edição)

Parte mais complexa do projeto — merece atenção extra:

- Schema Zod completo: Nome, CPF, Endereço, Telefones (array), Emails (array)
- Máscaras: CPF, CEP, Telefone — criar `utils/masks.ts` reutilizável
- Integração **ViaCEP**: ao preencher CEP válido, auto-preenche logradouro/bairro/cidade/UF, mantendo edição manual liberada
- **Telefones dinâmicos**: `useFieldArray` do RHF, com seletor de tipo (celular/fixo/etc.) e máscara condicional por tipo
- **Emails dinâmicos**: `useFieldArray`, validação em tempo real (Zod)
- Sanitização de todos os campos antes do submit (evitar XSS/injeção)
- Um único componente de formulário reaproveitado em Cadastro e Edição (evitar duplicação — DRY)
- Feedback visual em todas as ações (loading no submit, toast de sucesso/erro)

**Entregável:** cadastro e edição funcionais, com validação e integração ViaCEP.

---

## Fase 6 — Visualização de Detalhes

- Página somente leitura com dados completos do cliente
- Ações rápidas: editar, excluir (com confirmação)

---

## Fase 7 — Segurança e Hardening

Revisar tudo construído até aqui contra a checklist do documento:

- Auditoria de onde o token é armazenado (evitar localStorage se possível)
- Escapar conteúdo dinâmico (evitar `dangerouslySetInnerHTML` sem sanitização)
- Revisar mensagens de erro exibidas ao usuário (nunca stack trace/erro técnico)
- Rodar `npm audit` / verificar CVEs nas dependências
- Checklist rápido do OWASP Top 10 (XSS, auth, exposição de dados, controle de acesso)
- Confirmar que rotas protegidas realmente bloqueiam acesso sem token válido (testar diretamente por URL)

---

## Fase 8 — Polimento de UX e Testes

- Revisar consistência visual (espaçamentos, animações leves, estados de hover/foco)
- Testes unitários dos componentes críticos (formulário, máscaras, validações)
- Testes de integração dos fluxos principais (login → listagem → cadastro → edição → exclusão)
- Ajustes de responsividade

---


**Nunca cortar:** validação frontend, máscaras, sanitização e proteção de rotas — são requisitos explícitos de segurança do documento.
