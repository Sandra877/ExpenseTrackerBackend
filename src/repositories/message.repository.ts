import { getPool } from "../config/db";

export const saveMessage = async (data: any) => {
  const pool = await getPool();

  const result = await pool.request()
    .input("userId", data.userId)
    .input("name", data.name)
    .input("email", data.email)
    .input("subject", data.subject)
    .input("message", data.message)
    .query(`
      INSERT INTO Messages (userId, name, email, subject, message)
      OUTPUT INSERTED.id
      VALUES (@userId, @name, @email, @subject, @message)
    `);

  return result.recordset[0];
};
