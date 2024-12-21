import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { getUserInfo, getControlHash } from '../logic/userinfo';
import dotenv from 'dotenv';
import { User } from '../types';
dotenv.config();

const router = Router();

const validateUsername = (username: string): string | null => {
  if (!username) {
    return 'Username required.';
  }
  if (username.length < 2) {
    return 'Username too short. Minimum 2 characters.';
  }
  if (username.length > 20) {
    return 'Username too long. Maximum 20 characters.';
  }
  if (!username.match(/^[a-zA-Z][a-zA-Z_]+$/g)) {
    return 'Username must start with letter and contain letters or underscores.';
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password required.';
  }
  if (password.length < 5) {
    return 'Password too short. Minimum 5 characters.';
  }
  if (password.length > 200) {
    return 'Password too long. Maximum 200 characters.';
  }
  if (!password.match(/[a-z]/g) || !password.match(/[A-Z]/g) || !password.match(/[0-9]/g)) {
    return 'Password must contain lowercase, uppercase and digit characters.';
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email required.';
  }
  email = email.toLowerCase();
  if (!email.match(/^[a-z0-9\.\-\_]+@[a-z0-9\.\-\_]+\.[a-z]{2,10}/g)) {
    return 'Email is malformed.';
  }
  return null;
};

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (validateUsername(username)) {
    res.status(400).json({ error: validateUsername(username) });
    return;
  }
  if (validatePassword(password)) {
    res.status(400).json({ error: validatePassword(password) });
    return;
  }
  if (validateEmail(email)) {
    res.status(400).json({ error: validateEmail(email) });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username.toLowerCase(), hashedPassword, email]);
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username.toLowerCase()]);
    const user: User = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      if (!user.active) {
        res.status(403).json({ code: 'USER_INACTIVE', error: 'User is disabled' });
        return;
      }
      await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
      const csig = await getControlHash(req);
      const token = jwt.sign(
        { user_id: user.id, username: user.username, email: user.email, csig: csig, roles: user.roles || [] },
        process.env.JWT_SECRET?.replace(/%%/g, '\n') || '',
        { algorithm: 'RS256', expiresIn: '1h' });
      res.setHeader('Authorization', 'Bearer ' + token);
      res.json({ token, user: { user_id: user.id, username: user.username, email: user.email, roles: user.roles || [] } });
    } else {
      res.status(401).json({ code: 'INVALID_CRED', error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// User info
router.get('/userinfo', async (req: Request, res: Response) => {
  try {
    const data = await getUserInfo(req);
    res.json({ user_id: data.user_id, username: data.username, email: data.email, roles: data.roles || [] });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    res.status(403).end();
  }
});

export default router;