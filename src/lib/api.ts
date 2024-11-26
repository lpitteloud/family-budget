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
      category_id: exp.category_id
    })))
    .select();
    
  if (error) throw error;
  return data as Expense[];

};

export const getUncategorizedExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .is('category_id', null)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data as Expense[];
};

export const updateExpense = async (id: string, updates: Partial<Expense>) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Expense;
};

export const splitExpense = async (id: string, split: {
  amount1: number;
  amount2: number;
  category_id1: string;
  category_id2: string;
}) => {
  const { data: originalExpense } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single();

  if (!originalExpense) throw new Error("Dépense non trouvée");

  const { error } = await supabase.rpc('split_expense', {
    expense_id: id,
    amount_1: split.amount1,
    amount_2: split.amount2,
    category_id_1: split.category_id1,
    category_id_2: split.category_id2,
    description: originalExpense.description,
    expense_date: originalExpense.date
  });

  if (error) throw error;
};
