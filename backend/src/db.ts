import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  connectionTimeoutMillis: 5000, // 5 seconds
});
console.log('Attempted to connect to database.');

pool.on('error', (err) => {
    console.log('Database error: ' + err);
});

export default pool;