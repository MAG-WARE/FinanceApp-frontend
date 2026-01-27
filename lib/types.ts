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
  goalId?: string;
  goalName?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;
  limitAmount: number;
  spentAmount: number;
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
  goalId?: string;
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
  goalId?: string | null;
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

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  month: number;
  year: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  color?: string;
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
  goalId?: string;
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
