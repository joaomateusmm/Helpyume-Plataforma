# 🔧 Configuração de Autenticação Google - Better Auth

## ✅ Correções Aplicadas

1. **Adicionado `baseURL`** no servidor (`auth.ts`)
2. **Adicionado `trustedOrigins`** para aceitar requisições da Vercel
3. **Adicionado `baseURL`** no cliente (`auth-client.ts`)

## 📋 Variáveis de Ambiente Necessárias

### No arquivo `.env` local:

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### Na Vercel (Environment Variables):

```env
BETTER_AUTH_URL=https://logyc.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://logyc.vercel.app
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
DATABASE_URL=sua_connection_string
```

## 🔐 Configuração no Google Console

### ✅ Origens JavaScript autorizadas:

```
http://localhost:3000
https://logyc.vercel.app
```

### ⚠️ URIs de redirecionamento - CORRIJA PARA:

```
http://localhost:3000/api/auth/callback/google
https://logyc.vercel.app/api/auth/callback/google
```

**Observação Importante:** O Better Auth usa o padrão `/api/auth/callback/google`. Verifique se está exatamente assim no Google Console.

## 🚀 Passos para Deploy

1. **Configure as variáveis de ambiente na Vercel:**
   - Vá em: Settings → Environment Variables
   - Adicione todas as variáveis listadas acima
   - ⚠️ **IMPORTANTE:** Use `https://logyc.vercel.app` (sem barra no final)

2. **Reconstrua o projeto na Vercel:**
   - Vá em: Deployments → [último deploy] → ⋯ → Redeploy

3. **Teste a autenticação:**
   - Limpe o cache do navegador
   - Teste em aba anônima
   - Verifique o console do navegador por erros

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

- Verifique se o URI no Google Console está **exatamente** igual
- Certifique-se de não ter barra `/` no final da URL
- Aguarde alguns minutos após alterar no Google Console

### Erro: "Access blocked"

- Verifique se o app está em modo de teste no Google Console
- Adicione seu email como usuário de teste
- Ou publique o app (necessário para uso público)

### Autenticação funciona local mas não na Vercel:

- Confirme que `BETTER_AUTH_URL` está configurado na Vercel
- Confirme que `NEXT_PUBLIC_BETTER_AUTH_URL` está configurado na Vercel
- Faça um redeploy completo após adicionar as variáveis

## 📝 Checklist

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] URIs de redirecionamento corretos no Google Console
- [ ] Redeploy feito na Vercel
- [ ] Testado em aba anônima
- [ ] Cache do navegador limpo
