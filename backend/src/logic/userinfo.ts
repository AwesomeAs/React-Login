import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import constants from '../constants';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const getControlHash = async (req: Request): Promise<string> => {
  const userAgent = (req.headers['user-agent'] || '-').replace(/[^a-zA-Z0-9]/g, '');
  const matchResult = (await bcrypt.hash(userAgent, constants.controlHashSalt)).match(/[^\$]+$/g);
  if (!matchResult) {
    throw new Error('Hash match failed');
  }
  return matchResult[0];
};

export const getUserInfo = async (req: Request, requireRole?: string): Promise<jwt.JwtPayload> => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }
  const token = /^Bearer (.+)$/g.exec(authHeader);
  if (!token || !token[1]) {
    throw new Error('Invalid pattern in Authorization header');
  }
  const data = jwt.verify(token[1], process.env.JWT_PUBLIC?.replace(/%%/g, '\n') || '', { algorithms: ['RS256'] }) as jwt.JwtPayload;
  if (requireRole && !(data && data.roles && data.roles.indexOf(requireRole) !== -1)) {
    throw new Error(`User ${data.username} does not have required role ${requireRole}`);
  }
  const csig = await getControlHash(req);
  if (!(data && data.csig && data.csig === csig)) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    throw new Error('Invalid token for IP detected: ' + (ip || '-'));
  }
  return data;
};