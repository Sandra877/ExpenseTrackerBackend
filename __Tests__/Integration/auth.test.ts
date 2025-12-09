import request from "supertest";
import app from "../../src/index";
import { getPool, closePool } from "../../src/config/db";
import bcrypt from "bcrypt";

let testToken = "";


let pool: any;

beforeAll(async () => {
  pool = await getPool();   // 🔥 FIX — connect DB for tests

  await pool.request().query(`
    DELETE FROM Users WHERE email LIKE '%@testmail.com%'
  `);
});

afterAll(async () => {
  await pool.close();   // 🔥 FIX — close DB cleanly
});



describe("AUTH INTEGRATION TESTS", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: `user_${Date.now()}@testmail.com`,
        password: "mypassword123",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/check your email/i);
  });

  it("should verify email successfully", async () => {
    // Insert a fake user with a token manually
    const verificationToken = "test_verify_token_123";

    await pool.request()
      .input("email", "verify@testmail.com")
      .input("passwordHash", "hash")
      .input("verificationToken", verificationToken)
      .query(`
        INSERT INTO Users (email, passwordHash, verificationToken, isVerified)
        VALUES (@email, @passwordHash, @verificationToken, 0)
      `);

    const res = await request(app).get(`/auth/verify/${verificationToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/verified/i);
  });

  it("should login a verified user", async () => {
    const email = "loginuser@testmail.com";
    const password = "pass123";
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert verified user
    await pool.request()
      .input("email", email)
      .input("passwordHash", passwordHash)
      .query(`
        INSERT INTO Users (email, passwordHash, isVerified, role)
        VALUES (@email, @passwordHash, 1, 'user')
      `);

    const res = await request(app).post("/auth/login").send({
      email,
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login if email is not verified", async () => {
    const email = "unverified@testmail.com";
    const password = "pass123";
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.request()
      .input("email", email)
      .input("passwordHash", passwordHash)
      .query(`
        INSERT INTO Users (email, passwordHash, isVerified, role)
        VALUES (@email, @passwordHash, 0, 'user')
      `);

    const res = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/verify your email/i);
  });
});
