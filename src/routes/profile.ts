import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { authMiddleware, AuthRequest } from "../misc/auth";
import { getProfileController, updateProfileController, addDescriptionController } from "../controllers/profileController";
import { Request, Response } from "express";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfileController));

router.put("/", authMiddleware, asyncHandler(updateProfileController));
router.put("/add-description", authMiddleware, asyncHandler(addDescriptionController));

export default router;
