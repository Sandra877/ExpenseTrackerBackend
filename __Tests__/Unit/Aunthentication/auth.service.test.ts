import bcrypt from "bcrypt";
import { generateToken } from "../../../src/utils/generateToken";
import { sendEmail } from "../../../src/utils/sendEmail";

import {
  createUser,
  verifyUserEmail,
  getUserByEmail
} from "../../../src/repositories/auth.repository";

import * as authService from "../../../src/services/auth.service";

// Mock everything external
jest.mock("../../../src/repositories/auth.repository");
jest.mock("bcrypt");
jest.mock("../../../src/utils/generateToken");
jest.mock("../../../src/utils/sendEmail");

describe("Auth Service Test Suite", () => {
  afterEach(() => jest.clearAllMocks());

  // --------------------------------------------------------------------------------
  // REGISTER
  // --------------------------------------------------------------------------------
  it("should hash password, save user, and send verification email", async () => {
    const input = { email: "test@gmail.com", password: "pass123" };

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass123");
    (generateToken as jest.Mock).mockReturnValue("verif-token-abc");
    (createUser as jest.Mock).mockResolvedValue({});
    (sendEmail as jest.Mock).mockResolvedValue(true);

    const res = await authService.register(input);

    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(generateToken).toHaveBeenCalledWith({ email: "test@gmail.com" });
    expect(createUser).toHaveBeenCalledWith({
      email: "test@gmail.com",
      passwordHash: "hashedPass123",
      verificationToken: "verif-token-abc"
    });
    expect(sendEmail).toHaveBeenCalled();
    expect(res).toEqual({ message: "User registered. Check your email to verify." });
  });

  // --------------------------------------------------------------------------------
  // VERIFY EMAIL
  // --------------------------------------------------------------------------------
  it("should verify email using token", async () => {
    (verifyUserEmail as jest.Mock).mockResolvedValue({});

    const res = await authService.verifyEmail("verif-token-123");

    expect(verifyUserEmail).toHaveBeenCalledWith("verif-token-123");
    expect(res).toEqual({ message: "Email verified!" });
  });

  // --------------------------------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------------------------------
  it("should login user and return JWT", async () => {
    const mockUser = {
      id: 1,
      email: "test@gmail.com",
      role: "user",
      passwordHash: "hashedPass",
      isVerified: true
    };

    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("jwt-token-123");

    const result = await authService.login({
      email: "test@gmail.com",
      password: "pass123"
    });

    expect(getUserByEmail).toHaveBeenCalledWith("test@gmail.com");
    expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "hashedPass");
    expect(generateToken).toHaveBeenCalled();
    expect(result).toEqual({
      message: "Login successful",
      token: "jwt-token-123"
    });
  });

  it("should throw error when user does not exist", async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(undefined);

    await expect(
      authService.login({ email: "x@gmail.com", password: "123" })
    ).rejects.toThrow("User not found");
  });

  it("should throw error when email is not verified", async () => {
    const mockUser = {
      isVerified: false,
      passwordHash: "hashed",
    };

    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      authService.login({ email: "x@gmail.com", password: "123" })
    ).rejects.toThrow("Please verify your email first");
  });

  it("should throw error for invalid password", async () => {
    const mockUser = {
      isVerified: true,
      passwordHash: "hashed"
    };

    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({ email: "x@gmail.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});
