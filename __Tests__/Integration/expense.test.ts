import request from "supertest";
import app from "../../src/index";
import { getPool, closePool } from "../../src/config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../../src/utils/generateToken";

let pool: any;
let userId: number;
let authToken: string;




beforeAll(async () => {
  pool = await getPool();   // <-- REQUIRED

  await pool.request().query(`DELETE FROM Expenses`);
  await pool.request().query(`DELETE FROM Users WHERE email LIKE '%@testmail.com%'`);



  // Insert a verified user
  const email = `expenseuser_${Date.now()}@testmail.com`;
  const passwordHash = await bcrypt.hash("pass123", 10);

  const result = await pool.request()
    .input("email", email)
    .input("passwordHash", passwordHash)
    .query(`
      INSERT INTO Users (email, passwordHash, role, isVerified)
      OUTPUT INSERTED.id
      VALUES (@email, @passwordHash, 'user', 1)
    `);

  userId = result.recordset[0].id;

  authToken = generateToken({
    id: userId,
    email,
    role: "user",
  });
});

afterAll(async () => {
  await pool.request().query("DELETE FROM Expenses");
  await pool.request().query("DELETE FROM Users WHERE email LIKE '%@testmail.com'");
  await closePool();
});

describe("EXPENSE API", () => {
  it("should create a new expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Groceries",
        amount: 1200,
        category: "Food",
        date: "2025-01-01",
        note: "milk & bread",
      });

    expect(res.status).toBe(201);
  });

  it("should fetch user expenses", async () => {
    const res = await request(app)
      .get("/expenses")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should update an expense", async () => {
    // Insert one expense manually
    const expense = await pool.request()
      .input("userId", userId)
      .query(`
        INSERT INTO Expenses (userId, title, amount, category, date)
        OUTPUT INSERTED.id
        VALUES (@userId, 'Coffee', 300, 'Food', GETDATE())
      `);

    const id = expense.recordset[0].id;

    const res = await request(app)
      .put(`/expenses/${id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Coffee",
        amount: 500,
        category: "Food",
        date: "2025-01-01",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Coffee");
  });

  it("should delete an expense", async () => {
    const expense = await pool.request()
      .input("userId", userId)
      .query(`
        INSERT INTO Expenses (userId, title, amount, category, date)
        OUTPUT INSERTED.id
        VALUES (@userId, 'Temp', 100, 'Misc', GETDATE())
      `);

    const id = expense.recordset[0].id;

    const res = await request(app)
      .delete(`/expenses/${id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
