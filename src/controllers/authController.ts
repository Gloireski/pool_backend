import { Request, Response } from "express";
import { login, register } from "../services/authService";

export const registerController = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const result = await register(fullName, email, password);
  res.status(201).json(result);
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.json(result);
};
