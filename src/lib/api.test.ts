import 'dotenv/config';
import { supabase } from './supabase.node';
import { api } from './api';
import type { Category, Expense } from '../types';

describe('カテゴリAPI', () => {
  let createdCategory: Category | null = null;
  const testName = 'テストカテゴリ';
  const testEmail = process.env.TEST_EMAIL!;
  const testPassword = process.env.TEST_PASSWORD!;

  beforeAll(async () => {
    // テスト用ユーザーでサインイン
    const { error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error) throw error;
  });

  afterAll(async () => {
    // テストで作成したカテゴリを削除
    if (createdCategory) {
      await api.categories.delete(createdCategory.id);
    }
    await supabase.auth.signOut();
  });

  it('カテゴリを作成できる', async () => {
    createdCategory = await api.categories.create(testName);
    expect(createdCategory).toBeDefined();
    expect(createdCategory.name).toBe(testName);
  });

  it('カテゴリ一覧に作成したカテゴリが含まれる', async () => {
    const categories = await api.categories.list();
    const found = categories.find((cat: Category) => cat.id === createdCategory!.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(testName);
  });

  it('カテゴリを削除できる', async () => {
    await api.categories.delete(createdCategory!.id);
    const categories = await api.categories.list();
    const found = categories.find((cat: Category) => cat.id === createdCategory!.id);
    expect(found).toBeUndefined();
    createdCategory = null;
  });
});

describe('支出API', () => {
  let createdCategory: Category | null = null;
  let createdExpense: Expense | null = null;
  const testEmail = process.env.TEST_EMAIL!;
  const testPassword = process.env.TEST_PASSWORD!;

  beforeAll(async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error) throw error;
    // テスト用カテゴリを作成
    createdCategory = await api.categories.create('テスト支出カテゴリ');
  });

  afterAll(async () => {
    if (createdExpense) {
      await api.expenses.delete(createdExpense.id);
    }
    if (createdCategory) {
      await api.categories.delete(createdCategory.id);
    }
    await supabase.auth.signOut();
  });

  it('支出を作成できる', async () => {
    const today = new Date().toISOString().slice(0, 10);
    createdExpense = await api.expenses.create({
      amount: 1234,
      date: today,
      category_id: createdCategory!.id,
      memo: 'テスト支出',
    } as Omit<Expense, 'id' | 'user_id' | 'created_at'>);
    expect(createdExpense).toBeDefined();
    expect(createdExpense.amount).toBe(1234);
    expect(createdExpense.memo).toBe('テスト支出');
  });

  it('支出一覧に作成した支出が含まれる', async () => {
    const expenses = await api.expenses.list();
    const found = expenses.find((exp: Expense) => exp.id === createdExpense!.id);
    expect(found).toBeDefined();
    expect(found!.amount).toBe(1234);
  });

  it('支出を削除できる', async () => {
    await api.expenses.delete(createdExpense!.id);
    const expenses = await api.expenses.list();
    const found = expenses.find((exp: Expense) => exp.id === createdExpense!.id);
    expect(found).toBeUndefined();
    createdExpense = null;
  });
}); 