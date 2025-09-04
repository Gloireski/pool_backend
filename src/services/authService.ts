import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";
const JWT_EXPIRES = "7d";

export async function register(fullName: string, email: string, password: string) {
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      const err: any = new Error("Email already in use");
      err.status = 409; err.code = 'EMAIL_TAKEN';
      console.warn(`[auth] register rejected (email taken) → ${email}`);
      throw err;
    }
    const user: IUser = new (User as any)({ fullName, email });
    (user as any).setPassword(password);
    await user.save();
    return issueToken(user);
  } catch (e: any) {
    // Map Mongo duplicate key just in case race condition
    if (e?.code === 11000) {
      const err: any = new Error("Email already in use");
      err.status = 409; err.code = 'EMAIL_TAKEN';
      console.warn(`[auth] register duplicate key → ${email}`);
      throw err;
    }
    console.error(`[auth] register error for ${email}:`, e?.message || e);
    throw e;
  }
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !(user as any).validatePassword(password)) {
    const err: any = new Error("Invalid credentials");
    err.status = 401; err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  return issueToken(user);
}

function issueToken(user: IUser) {
  const payload = { sub: user.id, email: user.email, fullName: user.fullName };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return { token, user: payload };
}

export async function getUserById(id: string) {
  return User.findById(id);
}
