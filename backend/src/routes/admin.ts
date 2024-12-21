import { Router, Request, Response } from 'express';
import db from '../db';
import { getUserInfo } from '../logic/userinfo';
import constants from '../constants';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.use('/', async (req: Request, res: Response, next) => {
  try {
    await getUserInfo(req, constants.roles.admin);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    res.status(403).end();
    return;
  }
  next();
});

router.get('/users', async (req: Request, res: Response) => {
  const result = await db.query('SELECT id, username, email, active, roles, recover_key FROM users ORDER BY username');
  res.json(result.rows);
});

router.post('/user_active', async (req: Request, res: Response) => {
  const { user_id, active } = req.body;
  if (isNaN(parseInt(user_id)) || (active != '0' && active != '1')) {
    res.status(400).end();
    return;
  }
  const result = await db.query("UPDATE users SET active = $2 WHERE id = $1 AND NOT ('admin' = ANY (roles))", [parseInt(user_id), active == '1']);
  res.json({ updated: (result.rowCount ?? 0) > 0 });
});

export default router;