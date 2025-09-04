import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { authMiddleware, AuthRequest } from "../misc/auth";
import { createPhotoController, listPhotosController, getPhotoController, deletePhotoController } from "../controllers/photosController";

const router = Router();

router.post("/", authMiddleware, asyncHandler(createPhotoController));

router.get("/", authMiddleware, asyncHandler(listPhotosController));

router.get("/:id", asyncHandler(getPhotoController));

router.delete("/:id", asyncHandler(deletePhotoController));

export default router;
