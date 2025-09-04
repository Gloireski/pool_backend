import { Router, Request, Response } from "express";
import { asyncHandler } from "../misc/errors";
import { stats } from "../services/statsService";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const s = await stats();
  res.json(s);
}));

export default router;
