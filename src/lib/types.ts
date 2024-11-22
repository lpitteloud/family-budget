export interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface BudgetOverview {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}