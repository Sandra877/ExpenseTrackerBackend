import sql, { ConnectionPool, config as SqlConfig } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: SqlConfig = {
  user: `${process.env.DB_USER}@${process.env.DB_SERVER?.split('.')[0]}`, // ensures full username
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  server: process.env.DB_SERVER!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  connectionTimeout: 30000,
};

let pool: ConnectionPool | null = null;

export const getPool = async (): Promise<ConnectionPool> => {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL');
    return pool;
  } catch (error) {
    console.error('❌ SQL Database Error:', error);
    throw error;
  }
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      console.log('🔌 Database connection pool closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }
};
