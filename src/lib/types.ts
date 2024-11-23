export interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
  user_id: string;
  created_at: string;
}

export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  category_id?: string;
  user_id: string;
  created_at: string;
}

export interface CSVExpense {
  date: string;
  amount: number;
  description?: string;
  category_id?: string;
}