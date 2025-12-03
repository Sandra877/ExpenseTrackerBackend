import { getPool } from "../config/db";

interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
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
    .input("Note", data.note || "")
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

export const updateExpense = async (
  id: number,
  userId: number,
  data: ExpenseInput
) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Id", id)
    .input("UserId", userId)
    .input("Title", data.title)
    .input("Amount", data.amount)
    .input("Category", data.category)
    .input("Date", data.date)
    .input("Note", data.note || "")
    .execute("UpdateExpense");

  if (result.recordset.length === 0) {
    throw new Error("Expense not found or unauthorized");
  }

  return result.recordset[0];
};

export const deleteExpense = async (id: number, userId: number) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Id", id)
    .input("UserId", userId)
    .execute("DeleteExpense");

  if (result.rowsAffected[0] === 0) {
    throw new Error("Expense not found or unauthorized");
  }
};
