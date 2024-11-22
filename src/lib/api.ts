import { supabase } from './auth';
import { Category, Expense, CSVExpense } from './types';
import Papa from 'papaparse';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) throw error;
  return data as Category[];
};

export const createCategory = async (name: string, budget: number) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, budget }])
    .select()
    .single();
    
  if (error) throw error;
  return data as Category;
};

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*');
    
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

export const importCSV = async (file: File): Promise<CSVExpense[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const expenses = results.data as CSVExpense[];
          // Validation basique
          const validExpenses = expenses.filter(exp => 
            exp.amount && !isNaN(exp.amount) && 
            exp.date && !isNaN(Date.parse(exp.date))
          );
          
          resolve(validExpenses);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
};

export const bulkCreateExpenses = async (expenses: CSVExpense[]) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenses.map(exp => ({
      amount: exp.amount,
      description: exp.description,
      date: exp.date
    })))
    .select();
    
  if (error) throw error;
  return data as Expense[];
};