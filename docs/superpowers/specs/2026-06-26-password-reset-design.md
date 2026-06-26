# Fluxo de Reset de Password — Design

**Data:** 2026-06-26
**Repo:** raphabruno7/arcus-crm (fork de thaleslaray/nossocrm)
**Estado atual:** A app não tem qualquer fluxo de recuperação de password. O `/login` só
faz `signInWithPassword`. O `/auth/callback` só trata do flow OAuth (`?code=`), não do
recovery. Não existe link "Esqueci a senha" nem página para definir nova senha. A única
forma de recuperar acesso era via admin API do Supabase — o que motivou esta feature.

## Objetivo

Permitir que um utilizador recupere o acesso sozinho, pela UI, sem intervenção manual:
login → "Esqueci a senha" → email → página de nova senha → dashboard.

## Stack relevante

- Next.js App Router
- `@supabase/ssr` ^0.8.0 (browser client com PKCE + `detectSessionInUrl` ativo por padrão —
  processa o token de recovery da URL automaticamente)
- i18n via `next-intl` / `useTranslations`; ficheiros `messages/pt.json` e `messages/en.json`
- `lib/supabase/client.ts` expõe `createClient()` (pode devolver `null` se Supabase não
  configurado — o código novo tem de tratar esse caso, como o login já faz)

## Componentes

### 1. `app/forgot-password/page.tsx` (novo, client component)

- Campo email + botão "Enviar link de recuperação"
- Submit → `supabase.auth.resetPasswordForEmail(email, { redirectTo: \`${window.location.origin}/reset-password\` })`
- Em sucesso, mostra estado confirmado: "Se existir uma conta com esse email, enviámos um
  link de recuperação." — **mensagem genérica**, não revela se a conta existe (evita
  enumeração de utilizadores). Mostrar este mesmo estado mesmo que o Supabase devolva erro
  de "email não encontrado".
- Erros reais (rede, Supabase não configurado) → mensagem de erro no mesmo estilo do login
- Link "Voltar ao login" → `/login`

### 2. `app/reset-password/page.tsx` (novo, client component)

- Ao montar: o browser client já processou o token da URL (`detectSessionInUrl`). Subscrever
  `supabase.auth.onAuthStateChange` e aguardar o evento `PASSWORD_RECOVERY`, OU verificar
  `getSession()` na montagem — se já houver sessão de recovery, mostrar o formulário.
- Estado "link inválido/expirado": se ao montar não houver sessão de recovery e não chegar
  evento `PASSWORD_RECOVERY`, mostrar mensagem com link para `/forgot-password`.
- Formulário: dois campos (nova senha + confirmar)
  - Validação: ambos coincidem **e** comprimento ≥ 8
  - Submit → `supabase.auth.updateUser({ password })`
  - Sucesso → `router.push('/dashboard')` (a sessão já está ativa)
  - Erro → mensagem no estilo do login

### 3. `app/login/page.tsx` (edição)

- Adicionar link "Esqueci a senha?" entre o campo de senha e o bloco de erro/botão, alinhado
  à direita, a apontar para `/forgot-password`
- Estilo: `text-sm text-primary-600 hover:text-primary-500` (coerente com a paleta existente)

### 4. i18n — `messages/pt.json` e `messages/en.json` (edição)

Adicionar chaves novas. Estrutura proposta:

```
"login": { ..., "forgotPassword": "Esqueci a senha?" }
"forgotPassword": {
  "title": "Recuperar acesso",
  "subtitle": "Indica o teu email e enviamos um link.",
  "email": "Email",
  "submit": "Enviar link de recuperação",
  "sent": "Se existir uma conta com esse email, enviámos um link de recuperação.",
  "backToLogin": "Voltar ao login"
}
"resetPassword": {
  "title": "Definir nova senha",
  "newPassword": "Nova senha",
  "confirmPassword": "Confirmar senha",
  "submit": "Guardar nova senha",
  "mismatch": "As senhas não coincidem.",
  "tooShort": "A senha deve ter pelo menos 8 caracteres.",
  "invalidLink": "Este link é inválido ou expirou.",
  "requestNew": "Pedir novo link"
}
```

Texto em **pt-PT** (não pt-BR): "senha"/"palavra-passe" — manter "senha" por consistência
com o login existente, que já usa "Senha".

## Config manual no Supabase (fora do código — o utilizador faz)

- Authentication → URL Configuration → Redirect URLs → adicionar:
  `https://nossocrm-two-theta.vercel.app/reset-password`
- Site URL já está correto (`https://nossocrm-two-theta.vercel.app`)

Sem este passo, o link do email é rejeitado pelo Supabase (redirect não permitido).

## Tratamento de erros

| Situação | Comportamento |
|----------|---------------|
| Supabase não configurado (`createClient()` devolve null) | Mensagem "Supabase não configurado" (reutilizar chave existente) |
| Email não existe | Estado de sucesso genérico (anti-enumeração) |
| Senhas não coincidem / < 8 chars | Validação client-side, sem chamada à API |
| Token de recovery inválido/expirado | Página de reset mostra "link inválido" + botão para pedir novo |
| `updateUser` falha | Mensagem de erro no estilo do login |

## Teste

Um teste leve (Vitest, já no projeto) para a lógica pura de validação:
- senhas coincidem + ≥ 8 → válido
- senhas diferentes → inválido
- < 8 chars → inválido

Extrair a validação para uma função pura (ex.: `validateNewPassword(pw, confirm)`) para ser
testável sem render de browser.

## Entrega

1. Branch `feat/password-reset`
2. Implementação + teste
3. `npm run lint && npm run typecheck && npm run test:run`
4. PR para `main`
5. Após merge, Vercel faz deploy automático
6. Utilizador adiciona a Redirect URL no Supabase
7. Verificação end-to-end no domínio de produção

## Fora de âmbito (YAGNI)

- Rate limiting custom no envio de email (o Supabase já limita)
- Política de senha além de comprimento mínimo
- Magic link / login sem senha
- Alteração de senha a partir das definições (utilizador já autenticado) — feature distinta
