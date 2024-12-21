import db from '../db';
import dotenv from 'dotenv';

dotenv.config();

export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(25) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      active BOOLEAN NOT NULL DEFAULT FALSE,
      roles VARCHAR(30) ARRAY NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login TIMESTAMPTZ
    )
  `;
  try {
    await db.query(query);
    console.log('Users table created or already exists.');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};