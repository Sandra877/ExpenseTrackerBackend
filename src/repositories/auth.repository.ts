import { getPool } from "../config/db";

interface RegisterInput {
  email: string;
  passwordHash: string;
  verificationToken: string;
}

export const createUser = async (data: RegisterInput) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Email", data.email)
    .input("PasswordHash", data.passwordHash)
    .input("VerificationToken", data.verificationToken)
    .execute("RegisterUser");

  return result.recordset[0];
};

export const verifyUserEmail = async (token: string) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Token", token)
    .execute("VerifyUserEmail");

  return result.recordset[0];
};

export const getUserByEmail = async (email: string) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Email", email)
    .execute("GetUserByEmail");

  return result.recordset[0];
};