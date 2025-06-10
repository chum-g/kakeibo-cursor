import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Category } from '../types';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2196f3');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingColor, setEditingColor] = useState('#2196f3');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (_err) {
      setError('カテゴリの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const category = await api.categories.create(newCategoryName, undefined, newCategoryColor);
      setCategories([...categories, category]);
      setNewCategoryName('');
      setNewCategoryColor('#2196f3');
    } catch (_err) {
      setError('カテゴリの作成に失敗しました');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const updated = await api.categories.update(
        editingCategory.id,
        editingCategory.name,
        undefined,
        editingColor
      );
      setCategories(
        categories.map(cat => (cat.id === updated.id ? updated : cat))
      );
      setEditingCategory(null);
    } catch (_err) {
      setError('カテゴリの更新に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？')) return;

    try {
      await api.categories.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (_err) {
      setError('カテゴリの削除に失敗しました');
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
      <h1 className="text-2xl font-bold mb-6">カテゴリ管理</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-8">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="新しいカテゴリ名"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={e => setNewCategoryColor(e.target.value)}
            className="w-10 h-10 p-0 border-none bg-transparent"
            title="色を選択"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            追加
          </button>
        </div>
      </form>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y">
          {categories.map(category => (
            <li key={category.id} className="p-4">
              {editingCategory?.id === category.id ? (
                <form onSubmit={handleUpdate} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={e =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="color"
                    value={editingColor}
                    onChange={e => setEditingColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none bg-transparent"
                    title="色を選択"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-lg flex items-center gap-2">
                    <span style={{ background: category.color || '#2196f3', width: 16, height: 16, display: 'inline-block', borderRadius: 4 }} />
                    {category.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setEditingColor(category.color || '#2196f3');
                      }}
                      className="text-primary hover:text-primary-dark"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 