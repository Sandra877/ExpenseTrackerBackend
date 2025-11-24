import sql, { ConnectionPool, config as SqlConfig } from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: SqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  server: process.env.DB_SERVER!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: ConnectionPool | null = null;

export const getPool = async (): Promise<ConnectionPool> => {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error("SQL Database Error", error);
    throw error;
  }
};
