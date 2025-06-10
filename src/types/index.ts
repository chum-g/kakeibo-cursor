export interface User {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export type Category = {
  id: string;
  name: string;
  icon?: string;
  user_id: string;
  created_at: string;
  color?: string;
};

export type Expense = {
  id: string;
  amount: number;
  date: string;
  memo?: string;
  category_id: string;
  user_id: string;
  created_at: string;
  category?: Category;
};

export interface MonthlyExpenseSummary {
  month: string;
  total_amount: number;
  category_summaries: {
    category_id: string;
    category_name: string;
    amount: number;
  }[];
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  total_amount: number;
  percentage: number;
} 