import { useState, useEffect } from 'react';
import { format, endOfMonth, format as formatDate } from 'date-fns';
import { api } from '../lib/api';
import type { Expense, Category } from '../types';

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return format(now, 'yyyy-MM');
  });

  const [newExpense, setNewExpense] = useState({
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category_id: '',
    memo: '',
  });

  const loadData = async () => {
    try {
      const start = `${selectedMonth}-01`;
      const end = formatDate(endOfMonth(new Date(`${selectedMonth}-01`)), 'yyyy-MM-dd');
      const [expensesData, categoriesData] = await Promise.all([
        api.expenses.list(start, end),
        api.categories.list(),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
    } catch {
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category_id) return;

    try {
      const expense = await api.expenses.create({
        amount: Number(newExpense.amount),
        date: newExpense.date,
        category_id: newExpense.category_id,
        memo: newExpense.memo,
      });
      setExpenses([expense, ...expenses]);
      setNewExpense({
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category_id: '',
        memo: '',
      });
    } catch {
      setError('支出の登録に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この支出を削除してもよろしいですか？')) return;

    try {
      await api.expenses.delete(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch {
      setError('支出の削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">支出管理</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-8">
        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">新しい支出を登録</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">金額</label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">日付</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">カテゴリ</label>
            <select
              value={newExpense.category_id}
              onChange={e => setNewExpense({ ...newExpense, category_id: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">選択してください</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">メモ</label>
            <input
              type="text"
              value={newExpense.memo}
              onChange={e => setNewExpense({ ...newExpense, memo: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            登録
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メモ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(expense.date), 'yyyy/MM/dd')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ¥{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {expense.memo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 