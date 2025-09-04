import { Request, Response } from "express";
import { stats } from "../services/photoService";

export const statsController = async (_req: Request, res: Response) => {
  const s = await stats();
  res.json(s);
};
