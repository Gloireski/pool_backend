import { Response } from "express";
import { AuthRequest } from "../misc/auth";
import {
  addDescriptionByUserId,
  getOrCreateProfileByUserId,
  updateProfileByUserId,
} from "../services/profileService";

export const getProfileController = async (req: AuthRequest, res: Response) => {
  const user = await getOrCreateProfileByUserId(req.user!.id);
  res.json(user);
};

export const updateProfileController = async (
  req: AuthRequest,
  res: Response
) => {
  const user = await updateProfileByUserId(req.user!.id, req.body);
  res.json(user);
};

export const addDescriptionController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await addDescriptionByUserId(req.user!.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to add description" });
  }
};
