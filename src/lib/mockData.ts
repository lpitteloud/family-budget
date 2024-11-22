import { Category, BudgetOverview } from './types';

export const mockCategories: Category[] = [
  { 
    id: '1', 
    name: "Alimentation", 
    budget: 400, 
    spent: 350, 
    color: "#10B981",
    user_id: "mock-user-id",
    created_at: new Date().toISOString()
  },
  { 
    id: '2', 
    name: "Transport", 
    budget: 200, 
    spent: 180, 
    color: "#3B82F6",
    user_id: "mock-user-id",
    created_at: new Date().toISOString()
  },
  { 
    id: '3', 
    name: "Loisirs", 
    budget: 150, 
    spent: 200, 
    color: "#EF4444",
    user_id: "mock-user-id",
    created_at: new Date().toISOString()
  },
  { 
    id: '4', 
    name: "Logement", 
    budget: 800, 
    spent: 800, 
    color: "#8B5CF6",
    user_id: "mock-user-id",
    created_at: new Date().toISOString()
  },
];

export const mockOverview: BudgetOverview = {
  totalBudget: 1550,
  totalSpent: 1530,
  remaining: 20,
};