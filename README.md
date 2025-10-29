# 🏛️ Backoffice - Portal União de Freguesias

Painel administrativo completo para gestão do Portal da União de Freguesias.

## 📋 Funcionalidades

### ✅ Dashboard
- Estatísticas em tempo real
- Gráficos de barras e pizza
- Visão geral de todas as métricas

### ✅ Gestão de Incidências
- Visualizar todas as incidências
- Filtrar por estado e pesquisar
- Alterar estados (Pendente → Em Análise → Em Resolução → Resolvida)
- Ver detalhes completos com fotos
- Aprovar/Rejeitar incidências

### ✅ Gestão de Notícias
- Criar, editar e eliminar notícias
- Adicionar imagens
- Categorias (Geral, Eventos, Obras, Avisos)
- Preview visual

### ✅ Gestão de Slides
- Adicionar slides para o slideshow da homepage
- Ativar/Desativar slides
- Ordenar slides
- Upload de imagens

### ✅ Links Úteis
- Adicionar links importantes
- Editar e eliminar links
- Descrições opcionais

### ✅ Gestão de Utilizadores
- Ver todos os utilizadores
- Promover/Remover administradores
- Eliminar utilizadores
- Estatísticas de utilizadores

### ✅ Configurações
- Informações do site
- Redes sociais
- Notificações por email
- Configurações de incidências

## 🚀 Instalação Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um ficheiro `.env` na raiz do projeto:
```env
VITE_API_URL=https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api
```

### 3. Executar em Desenvolvimento
```bash
npm run dev
```

O backoffice estará disponível em: `http://localhost:3001`

### 4. Build para Produção
```bash
npm run build
```

## 🔐 Credenciais de Acesso

**Email:** `admin@freguesia.pt`  
**Password:** `Admin123!@#`

## 📦 Deploy no EasyPanel

### Opção 1: Via GitHub

1. **Criar Repositório no GitHub**
   - Vá para https://github.com/new
   - Nome: `backoffice-freguesia`
   - Crie o repositório

2. **Upload do Código**
   ```bash
   cd backoffice-freguesia
   git init
   git add .
   git commit -m "Backoffice completo"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/backoffice-freguesia.git
   git push -u origin main
   ```

3. **Deploy no EasyPanel**
   - Login no EasyPanel
   - Projects → New Project
   - Nome: `freguesia-backoffice`
   - Create Project
   
   - Add Service → App
   - Name: `backoffice`
   - Source: GitHub
   - Repository: `seu-usuario/backoffice-freguesia`
   - Branch: `main`
   
   - Build Settings:
     - Build Command: `npm install && npm run build`
     - Start Command: `npx serve -s dist -l 3000`
   
   - Environment Variables:
     ```
     VITE_API_URL=https://portal-freguesias-freguesia-api.3isjct.easypanel.host/api
     ```
   
   - Domains → Add Domain
   - Deploy!

### Opção 2: Deploy Direto (Sem GitHub)

1. Zipar o projeto localmente
2. No EasyPanel, usar "Upload ZIP"
3. Configurar da mesma forma

## 🎨 Estrutura do Projeto

```
backoffice-freguesia/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Menu lateral
│   │   └── Header.jsx         # Cabeçalho
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto de autenticação
│   ├── pages/
│   │   ├── Login.jsx          # Página de login
│   │   ├── Dashboard.jsx      # Dashboard principal
│   │   ├── Incidencias.jsx    # Gestão de incidências
│   │   ├── Noticias.jsx       # Gestão de notícias
│   │   ├── Slides.jsx         # Gestão de slides
│   │   ├── Links.jsx          # Gestão de links
│   │   ├── Usuarios.jsx       # Gestão de utilizadores
│   │   └── Configuracoes.jsx  # Configurações
│   ├── utils/
│   │   └── api.js             # Configuração Axios
│   ├── App.jsx                # Rotas principais
│   ├── main.jsx               # Ponto de entrada
│   └── index.css              # Estilos globais
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔧 Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP
- **Lucide React** - Ícones
- **Recharts** - Gráficos

## 📱 Funcionalidades em Cada Página

### Dashboard
- Cards com estatísticas totais
- Gráfico de barras (visão geral)
- Gráfico de pizza (estados das incidências)
- Detalhes por estado

### Incidências
- Tabela completa de incidências
- Filtros por estado e pesquisa
- Modal de detalhes com:
  - Informações completas
  - Fotos
  - Botões para alterar estado
  - Coordenadas GPS

### Notícias
- Grid visual de notícias
- Modal de criação/edição com:
  - Título
  - Categoria
  - Conteúdo
  - URL da imagem
  - Preview em tempo real

### Slides
- Grid de slides com preview
- Ativar/Desativar slides
- Ordem de exibição
- Informações sobre dimensões recomendadas

### Links
- Tabela de links úteis
- Modal de criação/edição
- Teste de links (abrir em nova aba)

### Utilizadores
- Cards de estatísticas
- Tabela de utilizadores
- Promover/Remover admin
- Filtros e pesquisa

### Configurações
- Informações do site
- Contactos
- Redes sociais
- Configurações de notificações
- Configurações de incidências

## 🎯 Próximos Passos

Após o deploy do Backoffice:

1. **Testar todas as funcionalidades**
   - Login
   - Criar notícias
   - Adicionar slides
   - Gerir incidências

2. **Adicionar conteúdo inicial**
   - 2-3 notícias
   - 3-5 slides
   - Links úteis importantes

3. **Corrigir Frontend (se necessário)**
   - Resolver problema de login
   - Testar integração completa

## 🐛 Troubleshooting

### Erro de CORS
- Verificar se a URL da API está correta
- Confirmar que o backend está online

### Erro de Login
- Verificar credenciais
- Confirmar que o utilizador admin existe no backend

### Imagens não aparecem
- Verificar URLs das imagens
- Usar URLs públicas (não localhost)

## 📞 Suporte

Para questões ou problemas, contacte o administrador do sistema.

---

**Desenvolvido com ❤️ para a União de Freguesias**
