import {
  createExpense,
  findExpensesByUser,
  updateExpenseRecord,
  deleteExpenseRecord
} from "../../../src/repositories/expense.repository";

import * as expenseService from "../../../src/services/expense.service";

// Mock repository
jest.mock("../../../src/repositories/expense.repository");

describe("Expense Service Test Suite", () => {
  afterEach(() => jest.clearAllMocks());

  // ADD EXPENSE
  it("should create an expense", async () => {
    (createExpense as jest.Mock).mockResolvedValue({ id: 1 });

    const res = await expenseService.addExpense(10, {
      title: "Food",
      amount: 500,
      category: "Food",
      date: "2025-12-05"
    });

    expect(createExpense).toHaveBeenCalledWith(10, {
      title: "Food",
      amount: 500,
      category: "Food",
      date: "2025-12-05"
    });

    expect(res).toEqual({ id: 1 });
  });

  // GET EXPENSES
  it("should get expenses for a user", async () => {
    const mockData = [{ id: 1, title: "Food" }];
    (findExpensesByUser as jest.Mock).mockResolvedValue(mockData);

    const res = await expenseService.getExpenses(10);

    expect(findExpensesByUser).toHaveBeenCalledWith(10);
    expect(res).toEqual(mockData);
  });

  // UPDATE EXPENSE
  it("should update expense when record exists", async () => {
    const updated = { message: "Updated" };
    (updateExpenseRecord as jest.Mock).mockResolvedValue(updated);

    const res = await expenseService.updateExpense(1, 10, {
      title: "New",
      amount: 100,
      category: "Other",
      date: "2025-12-05"
    });

    expect(updateExpenseRecord).toHaveBeenCalled();
    expect(res).toEqual(updated);
  });

  it("should throw error when updating non-existing expense", async () => {
    (updateExpenseRecord as jest.Mock).mockResolvedValue(null);

    await expect(
      expenseService.updateExpense(1, 10, {
        title: "New",
        amount: 100,
        category: "Food",
        date: "2025-12-05"
      })
    ).rejects.toThrow("Expense not found or unauthorized");
  });

  // DELETE EXPENSE
  it("should delete expense when record exists", async () => {
    (deleteExpenseRecord as jest.Mock).mockResolvedValue(1);

    const res = await expenseService.deleteExpense(1, 10);

    expect(deleteExpenseRecord).toHaveBeenCalledWith(1, 10);
    expect(res).toBeUndefined();
  });

  it("should throw error when deleting non-existing expense", async () => {
    (deleteExpenseRecord as jest.Mock).mockResolvedValue(0);

    await expect(expenseService.deleteExpense(1, 10))
      .rejects
      .toThrow("Expense not found or unauthorized");
  });
});
