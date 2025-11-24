import { getPool } from "../config/db";

interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
}

export const addExpense = async (userId: number, data: ExpenseInput) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("UserId", userId)
    .input("Title", data.title)
    .input("Amount", data.amount)
    .input("Category", data.category)
    .input("Date", data.date)
    .execute("AddExpense");

  return result.recordset[0];
};

export const getExpenses = async (userId: number) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("UserId", userId)
    .execute("GetExpensesByUser");

  return result.recordset;
};

export const updateExpense = async (id: string, data: ExpenseInput) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Id", Number(id))
    .input("Title", data.title)
    .input("Amount", data.amount)
    .input("Category", data.category)
    .input("Date", data.date)
    .execute("UpdateExpense");

  return result.recordset[0];
};

export const deleteExpense = async (id: number) => {
  const pool = await getPool();

  await pool
    .request()
    .input("Id", id)
    .execute("DeleteExpense");
};
