import bcrypt from "bcrypt";
import { getPool } from "../config/db";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";

interface RegisterInput {
  email: string;
  password: string;
}

export const register = async ({ email, password }: RegisterInput) => {
  const pool = await getPool();

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Generate email verification token
  const verificationToken = generateToken({ email });

  // Call stored procedure
  const result = await pool
    .request()
    .input("Email", email)
    .input("PasswordHash", passwordHash)
    .input("VerificationToken", verificationToken)
    .execute("RegisterUser");

  // Send verification email
  await sendEmail(
  email,
  "Verify your account",
  `Click to verify your account: ${process.env.BACKEND_URL}/api/auth/verify/${verificationToken}`
);


  return { message: "User registered. Check your email to verify." };
};

export const verifyEmail = async (token: string) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Token", token)
    .execute("VerifyUserEmail");

  return { message: "Email verified!" };
};

interface LoginInput {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginInput) => {
  const pool = await getPool();

  // Get user
  const userResult = await pool
    .request()
    .input("Email", email)
    .execute("GetUserByEmail");

  const user = userResult.recordset[0];

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Please verify your email first");

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate JWT
  const token = generateToken({ id: user.id, email: user.email });

  return { message: "Login successful", token };
};
