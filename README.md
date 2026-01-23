# FinanceApp - Frontend

Sistema de gestão financeira pessoal desenvolvido com Next.js 14, TypeScript e TailwindCSS.

## 🚀 Stack Tecnológica

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Componentes)
- **React Hook Form + Zod** (Formulários e validação)
- **TanStack Query** (Cache e estado do servidor)
- **Axios** (Cliente HTTP)
- **Recharts** (Gráficos)
- **Lucide React** (Ícones)
- **date-fns** (Manipulação de datas)

## 📱 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Registro de novos usuários
- ✅ Proteção de rotas autenticadas
- ✅ Logout

### Dashboard
- ✅ Resumo financeiro do mês (receitas, despesas, saldo)
- ✅ Gráfico de pizza: Gastos por categoria (top 5)
- ✅ Gráfico de linha: Evolução do saldo (últimos 6 meses)
- ✅ Lista das últimas 5 transações
- ✅ Progresso dos orçamentos do mês

### Contas
- ✅ Listagem de contas em cards
- ✅ Criação de novas contas
- ✅ Edição de contas existentes
- ✅ Ativar/Desativar contas
- ✅ Deletar contas
- ✅ Filtros: Todas/Ativas/Inativas
- ✅ Tipos de conta: Corrente, Poupança, Carteira, Investimento, Cartão de Crédito

### Transações
- ✅ Tabela com todas as transações
- ✅ Criação de novas transações
- ✅ Edição de transações existentes
- ✅ Deletar transações
- ✅ Tipos: Receita, Despesa, Transferência
- ✅ Badges coloridas por tipo
- ✅ Validação de formulários

### Categorias
- ✅ Listagem separada por tipo (Receitas/Despesas)
- ✅ Criação de novas categorias
- ✅ Edição de categorias
- ✅ Deletar categorias
- ✅ Seletor de cor personalizado

### Orçamentos
- ✅ Visualização de orçamentos do mês
- ✅ Barras de progresso (Gasto vs Limite)
- ✅ Alertas visuais quando ultrapassar limite
- ✅ Porcentagem de utilização

### Metas
- ✅ Listagem de metas financeiras
- ✅ Barras de progresso (Atual vs Alvo)
- ✅ Porcentagem de conclusão
- ✅ Badge de "Concluída" para metas atingidas
- ✅ Visualização de data alvo

## 🎨 Design

- **Mobile-First**: Interface responsiva otimizada para dispositivos móveis
- **Dark Mode Ready**: Estrutura preparada para tema escuro
- **Cores Consistentes**:
  - Receita: Verde (#10b981)
  - Despesa: Vermelho (#ef4444)
  - Transferência: Azul (#3b82f6)
  - Primary: Indigo (#6366f1)

## 📁 Estrutura do Projeto

```
app/
├── (dashboard)/          # Rotas protegidas
│   ├── layout.tsx        # Layout com sidebar
│   ├── page.tsx          # Dashboard principal
│   ├── accounts/         # Página de contas
│   ├── transactions/     # Página de transações
│   ├── categories/       # Página de categorias
│   ├── budgets/          # Página de orçamentos
│   └── goals/            # Página de metas
└── layout.tsx            # Layout raiz

components/
├── ui/                   # Componentes shadcn/ui
├── accounts/             # Componentes específicos de contas
├── transactions/         # Componentes específicos de transações
├── categories/           # Componentes específicos de categorias
├── providers.tsx         # Providers (Query, Auth)
├── sidebar.tsx           # Sidebar de navegação
└── protected-route.tsx   # HOC para proteção de rotas

contexts/
└── AuthContext.tsx       # Contexto de autenticação

hooks/
├── use-toast.ts          # Hook de notificações
├── use-dashboard.ts      # Hooks do dashboard
├── use-accounts.ts       # Hooks de contas
├── use-transactions.ts   # Hooks de transações
├── use-categories.ts     # Hooks de categorias
└── use-budgets.ts        # Hooks de orçamentos

lib/
├── api.ts                # Instância do Axios
├── types.ts              # Tipos TypeScript
├── utils.ts              # Utilitários
├── utils/
│   └── format.ts         # Funções de formatação
└── validations/          # Schemas Zod
    ├── auth.ts
    ├── account.ts
    └── transaction.ts

services/
├── auth.service.ts       # Serviço de autenticação
├── accounts.service.ts   # Serviço de contas
├── transactions.service.ts
├── categories.service.ts
├── budgets.service.ts
├── goals.service.ts
└── dashboard.service.ts
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:
- Token armazenado no localStorage
- Interceptor do Axios adiciona token automaticamente
- Redirecionamento automático em caso de token inválido/expirado
- Proteção de rotas com ProtectedRoute

## 📊 Estado e Cache

Utiliza **TanStack Query** para:
- Cache inteligente de dados do servidor
- Refetch automático após mutações
- Otimização de performance
- Loading states e error handling

## 🎯 Próximas Melhorias

- [ ] Conta DEMO
- [ ] PWA / Service Workers
- [ ] Testes automatizados
- [ ] Exportação de relatórios PDF
- [ ] Importação de extratos bancários
- [ ] Notificações push
- [ ] Multi-idioma
- [ ] Dark mode completo
- [ ] Filtros avançados em transações
- [ ] Gráficos adicionais no dashboard

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

## 📄 Licença

Projeto pessoal - Uso privado
