import request from "supertest";
import app from "../../src/index";
import { getPool, closePool } from "../../src/config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../../src/utils/generateToken";

let pool: any;
let adminToken: string;
let normalUserId: number;

beforeAll(async () => {
  pool = await getPool();
  

  // Insert admin
  const adminEmail = `admin_${Date.now()}@testmail.com`;
  const pass = await bcrypt.hash("adminpass", 10);

  await pool.request()
    .input("email", adminEmail)
    .input("passwordHash", pass)
    .query(`
      INSERT INTO Users (email, passwordHash, isVerified, role)
      VALUES (@email, @passwordHash, 1, 'admin')
    `);

  adminToken = generateToken({ email: adminEmail, role: "admin", id: 1 });

  // Insert user to manage
  const result = await pool.request()
    .query(`
      INSERT INTO Users (email, passwordHash, isVerified, role)
      OUTPUT INSERTED.id
      VALUES ('normaluser@testmail.com', 'x', 1, 'user')
    `);

  normalUserId = result.recordset[0].id;
});

afterAll(async () => {
  await pool.request().query("DELETE FROM Expenses");
  await pool.request().query("DELETE FROM Users WHERE email LIKE '%testmail.com%'");
  await closePool();
});

describe("ADMIN API", () => {
  it("should fetch all users", async () => {
    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a user's expenses", async () => {
    const res = await request(app)
      .get(`/admin/user/${normalUserId}/expenses`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should delete a user", async () => {
    const res = await request(app)
      .delete(`/admin/user/${normalUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
