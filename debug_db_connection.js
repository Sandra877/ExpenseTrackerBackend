const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  user: `${process.env.DB_USER}@${process.env.DB_SERVER?.split('.')[0]}`,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  connectionTimeout: 30000,
};

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    const pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL');

    console.log('Pool object:', pool);
    console.log('Pool type:', typeof pool);
    console.log('Pool has request method:', typeof pool.request === 'function');

    // Test a simple query
    const result = await pool.request().query('SELECT 1 as test');
    console.log('Query result:', result.recordset);

    await pool.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ SQL Database Error:', error);
  }
}

testConnection();