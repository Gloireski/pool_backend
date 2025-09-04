import User from "../models/User";
import { Types } from "mongoose";

export async function getOrCreateProfileByUserId(userId: string) {
  return User.findById(new Types.ObjectId(userId));
}

export async function updateProfileByUserId(userId: string, data: { fullName?: string; email?: string; avatarUrl?: string }) {
  const user = await User.findById(new Types.ObjectId(userId));
  if (!user) return null;
  if (data.fullName !== undefined) (user as any).fullName = data.fullName;
  if (data.email !== undefined) (user as any).email = data.email;
  if (data.avatarUrl !== undefined) (user as any).avatarUrl = data.avatarUrl;
  await user.save();
  return user;
}

