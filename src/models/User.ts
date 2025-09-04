import mongoose from "mongoose";
import crypto from "crypto";

export interface IUser extends mongoose.Document {
  fullName: string;
  email: string;
  avatarUrl?: string;
  passwordHash: string;
  salt: string;
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  avatarUrl: { type: String },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex");
};

userSchema.methods.validatePassword = function(password: string) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex");
  return this.passwordHash === hash;
};

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
