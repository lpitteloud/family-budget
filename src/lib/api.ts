import { supabase } from './auth';
import { Category, Expense, CSVExpense } from './types';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as Category[];
};

export const createCategory = async (name: string, budget: number) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ 
      name, 
      budget,
      spent: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data as Category;
};

export const getExpenses = async (month: Date) => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('date', startOfMonth.toISOString())
    .lte('date', endOfMonth.toISOString());
    
  if (error) throw error;
  return data as Expense[];
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();
    
  if (error) throw error;
  return data as Expense;
};

export const bulkCreateExpenses = async (expenses: CSVExpense[]) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenses.map(exp => ({
      amount: exp.amount,
      description: exp.description,
      date: exp.date,
      category: exp.category
    })))
    .select();
    
  if (error) throw error;
  return data as Expense[];
};