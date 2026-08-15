import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export interface AuthRequest extends Request {
  userId?: string;
}

export function extractUserId(req: Request): string | undefined {
  // 1. Direct Clerk / Custom user headers
  const headerUserId =
    (req.headers['x-clerk-user-id'] as string) ||
    (req.headers['x-user-id'] as string) ||
    (req.headers['user-id'] as string);

  if (headerUserId && typeof headerUserId === 'string' && headerUserId.trim()) {
    return headerUserId.trim();
  }

  // 2. Authorization Bearer Token (Clerk or JWT)
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.split(' ')[1];
    if (token) {
      // Decode without verification first for Clerk JWTs
      const decoded = jwt.decode(token) as any;
      if (decoded && (decoded.sub || decoded.userId || decoded.clerkUserId)) {
        return decoded.sub || decoded.userId || decoded.clerkUserId;
      }
      // Try local JWT verify
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        if (payload && (payload.userId || payload.sub)) {
          return payload.userId || payload.sub;
        }
      } catch (err) {}
    }
  }

  // 3. Dev mode fallback default user
  return 'dev_passenger_user_id';
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = extractUserId(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized — Clerk or JWT Token Required' });
  }
  req.userId = userId;
  next();
}
