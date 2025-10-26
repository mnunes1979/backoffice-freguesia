# 🚀 GUIA COMPLETO DE DEPLOYMENT - BACKOFFICE

Siga este guia passo a passo para fazer o deploy do Backoffice no EasyPanel.

---

## 📋 OPÇÃO 1: Deploy via GitHub (Recomendado)

### PASSO 1: Preparar o Código

#### 1.1 Descarregar o Projeto
✅ Você já tem a pasta `backoffice-freguesia` com todos os ficheiros

#### 1.2 Verificar Ficheiros Essenciais
Confirme que tem estes ficheiros:
```
backoffice-freguesia/
├── package.json ✓
├── vite.config.js ✓
├── tailwind.config.js ✓
├── index.html ✓
├── .gitignore ✓
├── .env.example ✓
└── src/ ✓
```

---

### PASSO 2: Criar Repositório no GitHub

#### 2.1 Ir para GitHub
1. Abra: https://github.com/new
2. Nome do repositório: `backoffice-freguesia`
3. Deixe **Public** ou **Private** (escolha)
4. **NÃO** marque "Add README" (já temos)
5. Clique em **"Create repository"**

#### 2.2 Upload do Código

**Opção A: Via GitHub Web (Mais Fácil)**
1. Na página do repositório criado
2. Clique em **"uploading an existing file"**
3. Arraste TODA a pasta `backoffice-freguesia` ou selecione os ficheiros
4. Escreva: "Backoffice completo"
5. Clique em **"Commit changes"**

**Opção B: Via Git Command Line**
```bash
cd backoffice-freguesia
git init
git add .
git commit -m "Backoffice completo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/backoffice-freguesia.git
git push -u origin main
```

---

### PASSO 3: Deploy no EasyPanel

#### 3.1 Criar Novo Projeto
1. Login no EasyPanel: https://seu-easypanel.com
2. Clique em **"Projects"** (menu lateral)
3. Clique em **"+ New Project"**
4. Nome: `freguesia-backoffice`
5. Clique em **"Create Project"**

#### 3.2 Adicionar Serviço App
1. Dentro do projeto, clique em **"+ Add Service"**
2. Escolha **"App"**
3. Preencha:
   - **Name:** `backoffice`
   - **Source:** `GitHub`
   - **Repository:** `seu-usuario/backoffice-freguesia`
   - **Branch:** `main`

#### 3.3 Configurar Build
Em **"Build Settings"**:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npx serve -s dist -l 3000
```

**Port:** `3000`

#### 3.4 Adicionar Variáveis de Ambiente
1. Clique na tab **"Environment"**
2. Adicione esta variável:

```
VITE_API_URL=https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api
```

⚠️ **IMPORTANTE:** Cole EXATAMENTE como está acima, SEM espaços!

3. Clique em **"Save"**

#### 3.5 Configurar Domínio
1. Clique na tab **"Domains"**
2. Clique em **"+ Add Domain"**
3. Escolha um subdomínio: `backoffice-freguesia` (ou o que preferir)
4. Vai ficar: `backoffice-freguesia.SEU-DOMINIO.easypanel.host`
5. Clique em **"Add"**

#### 3.6 Deploy!
1. Clique no botão verde **"Deploy"** (no topo da página)
2. ⏳ Aguarde 3-5 minutos
3. Acompanhe os logs na secção **"Logs"**
4. Quando ver **"Ready"** ou **"Running"** com bolinha verde → ✅ SUCESSO!

---

### PASSO 4: Testar o Backoffice

#### 4.1 Abrir o Backoffice
1. Clique no link do domínio (ou copie e cole no browser)
2. Exemplo: `https://backoffice-freguesia.seu-dominio.easypanel.host`

#### 4.2 Fazer Login
- **Email:** `admin@freguesia.pt`
- **Password:** `Admin123!@#`

#### 4.3 Verificar Funcionalidades
✅ Dashboard carrega com estatísticas  
✅ Pode ver incidências  
✅ Pode criar notícias  
✅ Pode adicionar slides  
✅ Pode gerir utilizadores  

---

## 📋 OPÇÃO 2: Deploy Direto (Sem GitHub)

Se não quer usar GitHub, pode fazer upload direto:

### PASSO 1: Zipar o Projeto
1. Vá para a pasta `backoffice-freguesia`
2. Selecione TODOS os ficheiros (Ctrl+A ou Cmd+A)
3. Clique com botão direito → **"Comprimir"** ou **"Zip"**
4. Nome: `backoffice-freguesia.zip`

### PASSO 2: Upload no EasyPanel
1. No EasyPanel, crie o projeto (igual Opção 1, Passo 3.1)
2. Em "Add Service" → "App"
3. Source: Escolha **"Upload ZIP"** ou **"Local"**
4. Faça upload do `backoffice-freguesia.zip`
5. Configure Build Commands (igual Opção 1, Passo 3.3)
6. Adicione variáveis de ambiente (igual Opção 1, Passo 3.4)
7. Configure domínio (igual Opção 1, Passo 3.5)
8. Deploy!

---

## 🐛 TROUBLESHOOTING

### Problema: Build Falha

**Erro:** `command not found: npm`
- **Solução:** No EasyPanel, em "Runtime", escolha **"Node.js 18"** ou superior

**Erro:** `Cannot find module`
- **Solução:** Verifique se o `package.json` está na raiz do projeto

### Problema: Backoffice Não Carrega

**Página em branco:**
- Abra o Console do Browser (F12)
- Se ver erro de API → Verifique se a variável `VITE_API_URL` está correta
- Refaça o deploy depois de corrigir

**Erro 404:**
- Verifique se o comando de start está correto: `npx serve -s dist -l 3000`
- Confirme que o build foi feito antes

### Problema: Não Consigo Fazer Login

**"Invalid credentials":**
- Confirme que o backend está online
- Teste o backend: abra `https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api/health`
- Deve retornar: `{"status":"OK"}`

**"Network Error":**
- Verifique a variável de ambiente `VITE_API_URL`
- Deve ser: `https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api`
- **SEM barra no final!**

### Problema: CORS Error

Se aparecer erro de CORS no console:
1. O backend precisa permitir o domínio do backoffice
2. Contacte quem configurou o backend
3. O domínio do backoffice precisa ser adicionado nas origens permitidas

---

## ✅ CHECKLIST FINAL

Antes de considerar completo, verifique:

- [ ] Backoffice carrega corretamente
- [ ] Login funciona
- [ ] Dashboard mostra estatísticas
- [ ] Consegue ver incidências
- [ ] Consegue criar notícias
- [ ] Consegue adicionar slides
- [ ] Consegue adicionar links
- [ ] Consegue ver utilizadores
- [ ] Todas as páginas carregam sem erros

---

## 🎉 PRÓXIMOS PASSOS

Depois do Backoffice online:

### 1. Adicionar Conteúdo Inicial
- Crie 2-3 notícias de teste
- Adicione 3-5 slides para a homepage
- Configure links úteis importantes

### 2. Testar Fluxo Completo
- Vá ao frontend público
- Tente reportar uma incidência
- Volte ao backoffice e aprove-a
- Mude o estado da incidência

### 3. Corrigir Frontend (Se Necessário)
- Se o login do frontend público não funciona
- Podemos corrigir juntos
- É só uma questão de configuração

---

## 📞 Precisa de Ajuda?

Se encontrar qualquer problema:

1. **Tire screenshots** do erro
2. **Copie mensagens** de erro do console (F12)
3. **Descreva** o que estava a fazer
4. **Partilhe** comigo para ajudar!

---

**🎯 Boa sorte com o deployment! Está quase! 🚀**
