# Como hospedar no Vercel

## Método 1: Via Interface Web (Mais Fácil)

### Passo 1: Preparar o código
1. Certifique-se de que seu código está no GitHub, GitLab ou Bitbucket
2. Faça commit de todas as alterações:
   ```bash
   git add .
   git commit -m "Preparando para deploy"
   git push
   ```

### Passo 2: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" e faça login com GitHub/GitLab/Bitbucket

### Passo 3: Importar projeto
1. No dashboard do Vercel, clique em "Add New..." → "Project"
2. Escolha seu repositório (ia_game)
3. O Vercel detectará automaticamente que é um projeto Vite
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Clique em "Deploy"

### Passo 4: Aguardar deploy
- O Vercel fará o build automaticamente
- Quando terminar, você terá uma URL como: `ia-game-xyz.vercel.app`

---

## Método 2: Via CLI (Terminal)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Fazer login
```bash
vercel login
```

### Passo 3: Deploy
Na pasta do projeto, execute:
```bash
vercel
```

Siga as instruções:
- Set up and deploy? **Y**
- Which scope? (escolha sua conta)
- Link to existing project? **N** (primeiro deploy) ou **Y** (deploys seguintes)
- Project name: **ia-game** (ou outro nome)
- Directory: **./** (pressione Enter)
- Override settings? **N**

### Passo 4: Deploy de produção
Para fazer deploy na produção (não preview):
```bash
vercel --prod
```

---

## Configurações Importantes

### Variáveis de Ambiente
Se precisar de variáveis de ambiente:
1. No dashboard do Vercel → Settings → Environment Variables
2. Adicione suas variáveis
3. Faça um novo deploy

### Domínio Personalizado
1. Vá em Settings → Domains
2. Adicione seu domínio
3. Configure o DNS conforme instruções

### Build Settings
O arquivo `vercel.json` já está configurado, mas você pode ajustar:
- **buildCommand**: Comando de build
- **outputDirectory**: Pasta de saída (dist para Vite)
- **installCommand**: Comando de instalação

---

## Comandos Úteis

```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod

# Ver logs
vercel logs

# Listar projetos
vercel ls

# Remover deploy
vercel remove
```

---

## Notas

- O Vercel detecta automaticamente projetos Vite e configura tudo
- Cada push no branch principal (main/master) faz deploy automático
- Pull requests geram previews automáticos
- Builds são gratuitos e rápidos
- HTTPS é automático e gratuito

---

## Troubleshooting

### Build falha
- Verifique os logs no dashboard do Vercel
- Teste localmente: `npm run build`
- Verifique se todas as dependências estão no `package.json`

### Assets não carregam
- Certifique-se de que os arquivos estão em `public/` ou `src/assets/`
- Vite resolve automaticamente os caminhos

### Erro 404 em rotas
- Para React Router, adicione `_redirects` ou configure no `vercel.json`

