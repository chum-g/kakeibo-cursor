import { useState, useEffect } from 'react';
import { format, endOfMonth, format as formatDate } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { api } from '../lib/api';
import type { Expense, Category } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const DashboardPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return format(now, 'yyyy-MM');
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

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // カテゴリ名→色のマップを作成
  const categoryColorMap: Record<string, string> = {};
  categories.forEach(cat => {
    categoryColorMap[cat.name] = cat.color || '#2196f3';
  });

  const categoryData = expenses.reduce((acc, exp) => {
    const categoryName = exp.category?.name || '未分類';
    acc[categoryName] = (acc[categoryName] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map(
          name => categoryColorMap[name] || '#2196f3'
        ),
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: '支出金額',
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map(
          name => categoryColorMap[name] || '#36A2EB'
        ),
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

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

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">今月の支出総額</h2>
        <p className="text-3xl font-bold text-primary">
          ¥{totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">カテゴリ別支出（円グラフ）</h2>
          <div className="h-80">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">カテゴリ別支出（棒グラフ）</h2>
          <div className="h-80">
            <Bar
              data={barChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: value => `¥${value.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 