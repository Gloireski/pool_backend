import { Request, Response } from "express";
import { addPhoto, listPhotos, getPhoto, removePhoto } from "../services/photoService";
import { AuthRequest } from "../misc/auth";

export const createPhotoController = async (req: AuthRequest, res: Response) => {
  const created = await addPhoto({ ...req.body, userId: req.user?.id });
  res.status(201).json(created);
};

export const listPhotosController = async (req: AuthRequest, res: Response) => {
  const result = await listPhotos({ ...(req.query as any), userId: req.user?.id });
  console.log("result", result);
  res.json(result);
};

export const getPhotoController = async (req: Request, res: Response) => {
  const item = await getPhoto(req.params.id);
  if (!item) return res.status(404).json({ message: "Photo not found" });
  res.json(item);
};

export const deletePhotoController = async (req: Request, res: Response) => {
  const deleted = await removePhoto(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Photo not found" });
  res.status(204).send();
};
