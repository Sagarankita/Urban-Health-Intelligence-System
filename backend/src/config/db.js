import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'health_app',
  user: process.env.DB_USER || 'postgres',
  password: (process.env.DB_PASSWORD || 'password').trim(),
  port: process.env.DB_PORT || 5432,
  connectionTimeoutMillis: 5000, // 5 second timeout
  query_timeout: 10000, // 10 second query timeout
});

// Test connection on startup (optional)
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.log('Database connection error (this is normal if DB is not set up):', err.message);
});

export default pool;
