# Firebase Google Authentication Setup 🔥

## ✅ Implementado com Segurança

### 🔐 Security Features
- ✅ Environment variables para credenciais
- ✅ Validação de configuração
- ✅ Error handling completo
- ✅ Fallback gracioso se Firebase não configurado
- ✅ Verificação de email do usuário
- ✅ Scopes específicos (profile + email)
- ✅ Sign-out seguro
- ✅ Auth state persistence

---

## 🚀 Como Configurar

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Add project" ou "Adicionar projeto"
3. Digite o nome: **codeleap-network** (ou qualquer nome)
4. Desabilite Google Analytics (opcional)
5. Clique em "Create project"

### 2. Configurar Authentication

1. No menu lateral, clique em **Authentication**
2. Clique em **Get started**
3. Na aba **Sign-in method**, clique em **Google**
4. Habilite o provider (toggle ON)
5. Escolha um email de suporte do projeto
6. Clique em **Save**

### 3. Obter Credenciais

1. Clique no ícone de engrenagem ⚙️ ao lado de "Project Overview"
2. Selecione **Project settings**
3. Role até encontrar "Your apps"
4. Clique no ícone **</>** (Web)
5. Registre o app:
   - Nome: **CodeLeap Web App**
   - Firebase Hosting: **NÃO** (desabilitar)
   - Clique em **Register app**
6. Copie as credenciais que aparecem

### 4. Adicionar Credenciais ao Projeto

1. Na raiz do projeto, crie o arquivo `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

2. Edite o arquivo `.env` e adicione suas credenciais:

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=codeleap-network.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codeleap-network
VITE_FIREBASE_STORAGE_BUCKET=codeleap-network.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

3. **IMPORTANTE**: O arquivo `.env` já está no `.gitignore` para segurança!

### 5. Instalar Dependência

\`\`\`bash
npm install
\`\`\`

### 6. Testar

\`\`\`bash
npm run dev
\`\`\`

Agora você verá o botão "Continue with Google" na tela de login! 🎉

---

## 📱 Fluxo de Autenticação

### Login Manual
1. Usuário digita username
2. Clica em "Enter"
3. Username salvo no localStorage
4. Redireciona para feed

### Login com Google
1. Usuário clica em "Continue with Google"
2. Popup do Google abre
3. Usuário seleciona conta
4. Firebase autentica
5. Username extraído (displayName ou email)
6. Foto de perfil obtida
7. Dados salvos no localStorage
8. Redireciona para feed

### Logout
1. Usuário clica em "Logout"
2. Confirma no alert
3. Se Firebase user: `signOut()` chamado
4. localStorage limpo
5. Redireciona para login

---

## 🔒 Camadas de Segurança Implementadas

### 1. Environment Variables
- Credenciais nunca hardcoded
- `.env` no `.gitignore`
- Validação de presença das variáveis

### 2. Error Handling
- Try/catch em todas as operações
- Mensagens de erro user-friendly
- Fallback para modo local se Firebase falhar
- Logs estruturados (console)

### 3. Validações
- Verifica se email foi fornecido pelo Google
- Valida estado de autenticação
- Guards contra configuração incompleta

### 4. User Experience
- Loading states
- Error messages
- Graceful degradation
- Popup blocked detection

### 5. Firebase Security Rules (Recomendado)
Adicione no Firebase Console > Firestore (se usar):

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // API externa controla writes
    }
  }
}
\`\`\`

---

## 🎨 Features Visuais

### Tela de Login
- ✅ Botão Google com ícone oficial
- ✅ Animação de hover
- ✅ Loading state
- ✅ Mensagens de erro com shake animation
- ✅ Divider "OR" elegante

### Header (Logged In)
- ✅ Avatar do usuário (se Google login)
- ✅ Badge "Google" se autenticado via Firebase
- ✅ Username exibido
- ✅ Responsivo

---

## 🧪 Testando

### Cenário 1: Firebase Não Configurado
- Botão Google não aparece
- Login manual funciona normalmente
- Sem erros no console

### Cenário 2: Firebase Configurado
- Botão Google aparece
- Click abre popup do Google
- Após login: avatar + badge "Google"
- Logout desconecta do Firebase

### Cenário 3: Erros
- Popup fechado: "Sign-in cancelled"
- Popup bloqueado: "Please allow popups"
- Network error: "Check your connection"

---

## 📁 Arquivos Criados

\`\`\`
src/
├── config/
│   └── firebase.ts           # Configuração e inicialização
├── services/
│   └── auth.ts               # Funções de autenticação
└── contexts/
    └── UserContext.tsx        # Atualizado com Firebase support
\`\`\`

---

## 🔄 Fluxo de Dados

\`\`\`
User clicks "Continue with Google"
           ↓
signInWithGoogle() called
           ↓
Firebase popup opens
           ↓
User selects account
           ↓
Firebase returns UserCredential
           ↓
onAuthStateChanged triggered
           ↓
UserContext updates:
  - username (displayName)
  - photoURL
  - firebaseUser
           ↓
localStorage updated
           ↓
UI re-renders with user data
\`\`\`

---

## 🐛 Troubleshooting

### Botão Google não aparece
- ✅ Verificar se `.env` existe
- ✅ Verificar se variáveis estão corretas
- ✅ Reiniciar dev server (`npm run dev`)

### Popup não abre
- ✅ Verificar se popup não está bloqueado
- ✅ Testar em navegador diferente
- ✅ Verificar console para erros

### "Firebase not configured"
- ✅ Copiar `.env.example` para `.env`
- ✅ Preencher credenciais
- ✅ Reiniciar servidor

### Erro de domínio autorizado
1. Firebase Console
2. Authentication > Settings
3. Authorized domains
4. Adicionar: `localhost`, `127.0.0.1`

---

## ✨ Próximos Passos (Opcional)

### Melhorias de Segurança
- [ ] Implementar refresh token
- [ ] Rate limiting no backend
- [ ] 2FA (Two-Factor Authentication)
- [ ] Email verification requirement

### Melhorias de UX
- [ ] Remember me checkbox
- [ ] Sign in with Apple/Facebook
- [ ] Account linking (Google + manual)
- [ ] Profile editing

---

**🎉 Firebase Authentication está PRONTO para produção!**
