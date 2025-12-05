import { Request, Response } from "express";
import { getPool } from "../config/db";

// ========================
// 📌 GET ALL USERS
// ========================
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id, email, role, isVerified, createdAt
      FROM Users
      ORDER BY createdAt DESC
    `);

    return res.json({ data: result.recordset });
  } catch (err: any) {
    console.error("Error in getUsers:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};
// ========================
// 📌 DELETE A SPECIFIC EXPENSE (ADMIN ONLY)
// ========================
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = Number(req.params.id);

    if (isNaN(expenseId)) {
      return res.status(400).json({ error: "Invalid expense ID" });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", expenseId)
      .query(`DELETE FROM Expenses WHERE id = @Id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    console.error("Error in deleteExpense:", err);
    return res.status(500).json({ error: "Failed to delete expense" });
  }
};

// ========================
// 📌 DELETE USER (and their expenses)
// ========================
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getPool();

    // First delete expenses
    await pool.request()
      .input("UserId", userId)
      .query(`DELETE FROM Expenses WHERE userId = @UserId`);

    // Then delete the user
    const result = await pool.request()
      .input("UserId", userId)
      .query(`DELETE FROM Users WHERE id = @UserId`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User and related expenses deleted" });
  } catch (err: any) {
    console.error("Error in deleteUser:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};


// ========================
// 📌 GET ALL EXPENSES OF A SPECIFIC USER
// ========================
export const getUserExpenses = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input("UserId", userId)
      .query(`
        SELECT id, title, amount, category, date, note
        FROM Expenses
        WHERE userId = @UserId
        ORDER BY date DESC
      `);

    return res.json({ data: result.recordset });
  } catch (err: any) {
    console.error("Error in getUserExpenses:", err);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
};
