import { Request, Response } from "express";
import * as expenseService from "../services/expense.service";

export const addExpense = async (req: Request & { user?: any }, res: Response) => {
  try {
    const result = await expenseService.addExpense(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getExpenses = async (req: Request & { user?: any }, res: Response) => {
  try {
    const result = await expenseService.getExpenses(req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExpense = async (req: Request & { user?: any }, res: Response) => {
  try {
    const result = await expenseService.updateExpense(
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await expenseService.deleteExpense(Number(req.params.id));
    res.json({ message: "Expense deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
