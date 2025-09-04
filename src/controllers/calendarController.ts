import { Request, Response } from "express";
import { daysWithPhotos } from "../services/photoService";

export const daysWithPhotosController = async (_req: Request, res: Response) => {
  const days = await daysWithPhotos();
  res.json(days);
};
