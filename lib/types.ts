export enum AccountType {
  CheckingAccount = 1,
  SavingsAccount = 2,
  Wallet = 3,
  Investment = 4,
  CreditCard = 5,
}

export enum TransactionType {
  Income = 1,
  Expense = 2,
  Transfer = 3,
}

export enum CategoryType {
  Income = 1,
  Expense = 2,
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  isActive: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  isRecurring: boolean;
  notes?: string;
  destinationAccountId?: string;
  destinationAccountName?: string;
  // User identification (for group views)
  userId?: string;
  userName?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;
  limitAmount: number;
  spentAmount: number;
  // User identification (for group views)
  userId?: string;
  userName?: string;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate?: string;
  isCompleted: boolean;
  color?: string;
  icon?: string;
  // Shared goal fields
  ownerId?: string;
  ownerName?: string;
  isOwner?: boolean;
  isShared?: boolean;
  sharedWith?: GoalUser[];
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  initialBalance: number;
  color?: string;
  icon?: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: AccountType;
  initialBalance?: number;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  type?: CategoryType;
  color?: string;
  icon?: string;
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  isRecurring?: boolean;
  notes?: string;
  destinationAccountId?: string;
}

export interface UpdateTransactionDto {
  accountId?: string;
  categoryId?: string;
  amount?: number;
  date?: string;
  description?: string;
  type?: TransactionType;
  isRecurring?: boolean;
  notes?: string;
  destinationAccountId?: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  month: number;
  year: number;
  limitAmount: number;
}

export interface UpdateBudgetDto {
  limitAmount?: number;
}

export interface CreateGoalDto {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  startDate: string;
  targetDate?: string;
  color?: string;
  icon?: string;
}

export interface UpdateGoalDto {
  name?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  startDate?: string;
  targetDate?: string;
  isCompleted?: boolean;
  color?: string;
  icon?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
  // User identification (for group views)
  userId?: string;
  userName?: string;
}

export interface MonthlyBalance {
  month: number;
  year: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface Comparison {
  currentMonthIncome: number;
  previousMonthIncome: number;
  incomeChange: number;
  incomeChangePercentage: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  expensesChange: number;
  expensesChangePercentage: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  month: number;
  year: number;
  topSpendingCategories: CategorySpending[];
  balanceHistory: MonthlyBalance[];
  comparison: Comparison;
}

export interface BalanceEvolution {
  date: string;
  balance: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
}

// User Groups & Shared Goals
export enum GroupMemberRole {
  Owner = 1,
  Member = 2,
}

export enum ViewContextType {
  Own = 1,
  Member = 2,
  All = 3,
}

export interface GroupMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: GroupMemberRole;
  joinedAt: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  memberCount: number;
  members: GroupMember[];
}

export interface GoalUser {
  userId: string;
  userName: string;
  isOwner: boolean;
  addedAt: string;
}

export interface CreateUserGroupDto {
  name: string;
  description?: string;
}

export interface UpdateUserGroupDto {
  name?: string;
  description?: string;
}

export interface JoinGroupDto {
  inviteCode: string;
}

export interface ShareGoalDto {
  goalId: string;
  userIds: string[];
}

export interface UnshareGoalDto {
  goalId: string;
  userId: string;
}

export interface ViewContextState {
  type: ViewContextType;
  memberUserId?: string;
  memberUserName?: string;
}

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.CheckingAccount]: "Conta Corrente",
  [AccountType.SavingsAccount]: "Conta Poupança",
  [AccountType.Wallet]: "Carteira",
  [AccountType.Investment]: "Investimento",
  [AccountType.CreditCard]: "Cartão de Crédito",
};

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.Income]: "Receita",
  [TransactionType.Expense]: "Despesa",
  [TransactionType.Transfer]: "Transferência",
};

export const CategoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.Income]: "Receita",
  [CategoryType.Expense]: "Despesa",
};

export const GroupMemberRoleLabels: Record<GroupMemberRole, string> = {
  [GroupMemberRole.Owner]: "Proprietário",
  [GroupMemberRole.Member]: "Membro",
};

export const ViewContextTypeLabels: Record<ViewContextType, string> = {
  [ViewContextType.Own]: "Meus dados",
  [ViewContextType.Member]: "Membro",
  [ViewContextType.All]: "Todos",
};
