jest.mock("mssql");
import { __setMockRecordset } from "../../../__mocks__/mssql";

import * as expenseService from "../expense.service";


describe("Expense Service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("addExpense() inserts a new expense", async () => {
    __setMockRecordset([{ id: 10, title: "Food" }]);

    const res = await expenseService.addExpense(1, {
      title: "Food",
      amount: 200,
      category: "Food",
      date: "2025-01-01",
    });

    expect(res.id).toBe(10);
  });

  test("getExpenses() returns list", async () => {
    __setMockRecordset([{ id: 1 }, { id: 2 }]);

    const res = await expenseService.getExpenses(1);

    expect(res.length).toBe(2);
  });

  test("updateExpense() returns updated record", async () => {
    __setMockRecordset([{ id: 33, title: "Updated" }]);

    const res = await expenseService.updateExpense("33", {
      title: "Updated",
      amount: 100,
      category: "Misc",
      date: "2025-01-01",
    });

    expect(res.id).toBe(33);
  });

  test("deleteExpense() runs without error", async () => {
    __setMockRecordset([]);

    await expect(expenseService.deleteExpense(5)).resolves.not.toThrow();
  });
});
