import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/authService";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; fullName: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.sub, email: payload.email, fullName: payload.fullName };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function attachUser(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.id) return next();
  const user = await getUserById(req.user.id);
  if (!user) return res.status(401).json({ message: "User not found" });
  next();
}
