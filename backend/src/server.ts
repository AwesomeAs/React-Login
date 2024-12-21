import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createUsersTable } from './models/user';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

dotenv.config();

setTimeout(() => {
  createUsersTable();
  console.log('Created users table if not exists!');
}, 1000);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});