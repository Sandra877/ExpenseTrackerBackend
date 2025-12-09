import {
  createExpense,
  findExpensesByUser,
  updateExpenseRecord,
  deleteExpenseRecord
} from "../repositories/expense.repository";

interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export const addExpense = async (userId: number, data: ExpenseInput) => {
  return await createExpense(userId, data);
};

export const getExpenses = async (userId: number) => {
  return await findExpensesByUser(userId);
};

export const updateExpense = async (
  id: number,
  userId: number,
  data: ExpenseInput
) => {
  const result = await updateExpenseRecord(id, userId, data);

  if (!result) {
    throw new Error("Expense not found or unauthorized");
  }

  return result;
};

export const deleteExpense = async (id: number, userId: number) => {
  const rowsAffected = await deleteExpenseRecord(id, userId);

  if (rowsAffected === 0) {
    throw new Error("Expense not found or unauthorized");
  }
};
