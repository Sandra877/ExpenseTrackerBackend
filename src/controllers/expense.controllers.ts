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
    res.json({ data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExpense = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user!.id;

    const result = await expenseService.updateExpense(
      Number(req.params.id),
      userId,
      req.body
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteExpense = async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user!.id;

    await expenseService.deleteExpense(Number(req.params.id), userId);

    res.json({ message: "Expense deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
