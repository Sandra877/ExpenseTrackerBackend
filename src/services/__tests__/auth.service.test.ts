jest.mock("mssql");
jest.mock("../../utils/sendEmail");
jest.mock("../../utils/generateToken");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");


import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { sendEmail } from "../../utils/sendEmail";
import * as authService from "../auth.service";
import { __setMockRecordset } from "../../../__mocks__/mssql";

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("register() should hash password, save user and send email", async () => {
    __setMockRecordset([{ id: 1 }]);

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed123");

    const res = await authService.register({
      email: "test@example.com",
      password: "pass123",
    });

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(res).toHaveProperty(
      "message",
      "User registered. Check your email to verify."
    );
  });

  test("login() should throw user not found", async () => {
    __setMockRecordset([]); // no user

    await expect(
      authService.login({
        email: "xx@test.com",
        password: "123",
      })
    ).rejects.toThrow("User not found");
  });

  test("login() should throw if user not verified", async () => {
    __setMockRecordset([{ isVerified: 0 }]);

    await expect(
      authService.login({ email: "a@test.com", password: "123" })
    ).rejects.toThrow("Please verify your email first");
  });

  test("login() should throw if password invalid", async () => {
    __setMockRecordset([
      { isVerified: 1, passwordHash: "hashed-pass" },
    ]);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({ email: "a@test.com", password: "123" })
    ).rejects.toThrow("Invalid credentials");
  });

  test("login() should return token if valid", async () => {
    __setMockRecordset([
      { id: 1, email: "a@test.com", isVerified: 1, passwordHash: "h" },
    ]);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("jwt-token");

    const res = await authService.login({
      email: "a@test.com",
      password: "pass",
    });

    expect(res).toHaveProperty("token", "jwt-token");
  });
});
