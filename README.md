# Kontas 💰

Aplicativo mobile para gestão financeira de repúblicas e moradias compartilhadas. Desenvolvido com React Native e Expo, o Kontas facilita o controle de contas, divisão de despesas e gerenciamento de moradores.

## 📱 Funcionalidades

### Autenticação

- Login com Google OAuth
- Persistência de sessão
- Logout seguro

### Gestão de República

- Cadastro de república com nome e foto personalizada
- Edição de informações da república
- Visualização de resumo com total de moradores

### Gestão de Moradores

- Cadastro de moradores com nome, chave PIX e foto de perfil
- Edição e exclusão de moradores
- Cópia rápida de chave PIX para transferências
- Visualização de dívidas individuais por morador
- Contagem de contas pendentes por morador

### Gestão de Contas

- Cadastro de contas com descrição, valor, vencimento e método de pagamento
- Edição e exclusão de contas
- Divisão de despesas:
  - **Divisão igual**: divide o valor igualmente entre os moradores selecionados
  - **Divisão customizada**: permite definir valores específicos para cada morador
- Controle de pagamento:
  - Marcação de conta como paga
  - Marcação individual de responsáveis como pagos
  - Data de pagamento registrada automaticamente
- Status visual:
  - 🟢 **Pago**: conta totalmente quitada
  - 🔵 **Em Aberto**: conta dentro do prazo
  - 🟠 **Vencida**: conta fora do prazo
- Filtros por mês de vencimento
- Agrupamento de contas pagas e em aberto

### Resumo Financeiro

- Total de contas registradas
- Total de contas pagas
- Total de contas pendentes
- Dívidas detalhadas por morador
- Status de pagamento (Em dia / Pendente)

## 🛠️ Tecnologias

- **React Native** 0.81.5 - Framework mobile multiplataforma
- **Expo** ~54.0.26 - Plataforma e ferramentas para React Native
- **Expo Router** ~6.0.16 - Roteamento baseado em arquivos
- **TypeScript** ~5.9.2 - Tipagem estática
- **NativeWind** ^4.2.1 - Tailwind CSS para React Native
- **AsyncStorage** 2.2.0 - Armazenamento local persistente
- **Google Sign-In** ^16.0.0 - Autenticação Google
- **Expo Image Picker** ~17.0.8 - Seleção de imagens
- **React Navigation** ^7.1.8 - Navegação entre telas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente ou via npx)
- **Git**

### Para desenvolvimento mobile

**Android:**

- Android Studio
- Android SDK
- Emulador Android configurado OU dispositivo físico

**iOS (apenas macOS):**

- Xcode (versão mais recente)
- CocoaPods
- Simulador iOS OU dispositivo físico

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/warlleyrocha/Kontas.git
cd Kontas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Google OAuth (Opcional para desenvolvimento)

O aplicativo já vem configurado com credenciais de desenvolvimento. Para usar suas próprias credenciais:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Ative a API "Google Sign-In"
4. Configure as credenciais OAuth 2.0:
   - **Android**: Adicione o SHA-1 do seu certificado
   - **iOS**: Configure o Bundle ID
5. Atualize as credenciais em `app/_layout.tsx`:

   ```typescript
   GoogleSignin.configure({
     iosClientId: "SEU_IOS_CLIENT_ID",
     webClientId: "SEU_WEB_CLIENT_ID",
   });
   ```

6. Atualize o `app.json` com o `iosUrlScheme` correto

## ▶️ Executando o Projeto

### Modo Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm start
# ou
npx expo start
```

Escolha uma das opções:

- Pressione `a` para abrir no emulador Android
- Pressione `i` para abrir no simulador iOS
- Escaneie o QR code com o **Expo Go** no seu dispositivo físico
- Pressione `w` para abrir no navegador web

### Modo Desenvolvimento com Dev Client

Para usar recursos nativos (como Google Sign-In), use o dev client:

```bash
npm run dev
```

**Nota:** O dev client requer um build nativo. Veja a seção [Build](#-build) abaixo.

### Executar em plataformas específicas

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📁 Estrutura do Projeto

```
Kontas/
├── app/                    # Rotas da aplicação (Expo Router)
│   ├── _layout.tsx        # Layout raiz e configuração de navegação
│   ├── index.tsx          # Tela de login
│   ├── register.tsx       # Cadastro de república
│   ├── residents.tsx      # Cadastro de moradores
│   └── dashboard.tsx      # Dashboard principal
├── components/            # Componentes reutilizáveis
│   ├── Accounts/          # Componente de gestão de contas
│   ├── AddAccountModal/   # Modal para adicionar/editar contas
│   ├── EditRepublicModal/ # Modal para editar república
│   ├── ResidentsPage/     # Componente de gestão de moradores
│   ├── Resume.tsx         # Componente de resumo financeiro
│   ├── Tabs.tsx           # Componente de abas
│   └── ui/                # Componentes de UI base
├── contexts/              # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── hooks/                 # Hooks customizados
│   └── useAsyncStorage.ts # Hook para AsyncStorage
├── types/                 # Definições de tipos TypeScript
│   ├── resume.ts          # Tipos de dados da república
│   └── tabs.ts            # Tipos de abas
├── assets/                # Recursos estáticos (imagens, ícones)
├── app.json               # Configuração do Expo
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração TypeScript
```

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start

# Iniciar com dev client
npm run dev

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na Web
npm run web

# Executar linter
npm run lint

# Resetar projeto (limpar cache)
npm run reset-project
```

## 🏗️ Build

### Build com EAS (Expo Application Services)

O projeto está configurado para usar o EAS Build. Para criar builds de produção:

1. Instale o EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Faça login:

   ```bash
   eas login
   ```

3. Configure o projeto:

   ```bash
   eas build:configure
   ```

4. Crie um build:

   ```bash
   # Android
   eas build --platform android

   # iOS
   eas build --platform ios

   # Ambos
   eas build --platform all
   ```

5. Consulte `eas.json` para configurações de build personalizadas.

### Build Local

Para builds locais (requer ambiente nativo configurado):

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

## 🐳 Docker (SonarQube)

O projeto inclui configuração Docker para análise de código com SonarQube:

```bash
# Iniciar SonarQube
docker-compose up -d

# Executar análise
docker-compose run --rm node-sonar
```

Acesse o SonarQube em: `http://localhost:9000`

## 📱 Armazenamento de Dados

O aplicativo utiliza **AsyncStorage** para persistência local de dados:

- Dados do usuário autenticado
- Informações da república (nome, moradores, contas)
- Imagens da república e moradores

**Nota:** Os dados são armazenados localmente no dispositivo. Para sincronização entre dispositivos, seria necessário implementar um backend.

## 🔐 Segurança

- Autenticação via Google OAuth
- Dados armazenados localmente no dispositivo
- Validação de permissões para acesso à galeria de imagens

## 🐛 Troubleshooting

### Problemas com Google Sign-In

- Verifique se as credenciais OAuth estão corretas
- No Android, certifique-se de que o SHA-1 está configurado no Google Cloud Console
- No iOS, verifique o Bundle ID no `app.json`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NewFeature`)
3. Commit suas mudanças (`git commit -m 'Add some NewFeature'`)
4. Push para a branch (`git push origin feature/NewFeature`)
5. Abrir um Pull Request

## 👤 Autor

**Warlley Rocha**

- GitHub: [@warlleyrocha](https://github.com/warlleyrocha)

---

⌨️ Feito por [Warlley Rocha](https://github.com/warlleyrocha)
