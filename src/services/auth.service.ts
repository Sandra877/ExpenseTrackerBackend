import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";
import {
  createUser,
  verifyUserEmail,
  getUserByEmail
} from "../repositories/auth.repository";

interface RegisterInput {
  email: string;
  password: string;
}

export const register = async ({ email, password }: RegisterInput) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = generateToken({ email });

  // Create user via repository
  await createUser({
    email,
    passwordHash,
    verificationToken
  });

  // Send verification email
  await sendEmail(
    email,
    "Verify your account",
    `Click to verify your account: ${process.env.FRONTEND_URL}/verify/${verificationToken}`
  );

  return { message: "User registered. Check your email to verify." };
};

export const verifyEmail = async (token: string) => {
  await verifyUserEmail(token);
  return { message: "Email verified!" };
};

interface LoginInput {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginInput) => {
  // Get user from repository
  const user = await getUserByEmail(email);

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Please verify your email first");

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return { message: "Login successful", token };
};
