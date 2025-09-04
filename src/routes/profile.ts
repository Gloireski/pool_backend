import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { authMiddleware, AuthRequest } from "../misc/auth";
import { getProfileController, updateProfileController } from "../controllers/profileController";
import { Request, Response } from "express";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfileController));

router.put("/", authMiddleware, asyncHandler(updateProfileController));

export default router;
