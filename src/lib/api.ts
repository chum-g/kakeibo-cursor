import { supabase } from './supabase.browser'; // ブラウザ用
// import { supabase } from './supabase.node'; // テスト用
import type { Category, Expense } from '../types';

export const api = {
  // カテゴリ関連
  categories: {
    list: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },

    create: async (name: string, icon?: string, color?: string) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.id) throw new Error('認証ユーザーが取得できません');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, icon, color, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Category;
    },

    update: async (id: string, name: string, icon?: string, color?: string) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name, icon, color })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Category;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
  },

  // 支出関連
  expenses: {
    list: async (startDate?: string, endDate?: string) => {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Expense[];
    },

    create: async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.id) throw new Error('認証ユーザーが取得できません');
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select(`
          *,
          category:categories(*)
        `)
        .single();
      if (error) throw error;
      return data as Expense;
    },

    update: async (id: string, expense: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(expense)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();
      
      if (error) throw error;
      return data as Expense;
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
  },
}; 