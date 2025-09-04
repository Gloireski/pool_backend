import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { daysWithPhotos } from "../services/calendarService";
import { Request, Response } from "express";

const router = Router();

router.get("/days-with-photos", asyncHandler(async (req: Request, res: Response) => {
  const days = await daysWithPhotos();
  res.json(days);
}));

export default router;
