import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { authMiddleware, AuthRequest } from "../misc/auth";
import { createPhotoController, listPhotosController, getPhotoController, deletePhotoController } from "../controllers/photosController";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), asyncHandler(createPhotoController));

router.get("/", authMiddleware, asyncHandler(listPhotosController));

router.get("/:id", asyncHandler(getPhotoController));

router.delete("/:id", asyncHandler(deletePhotoController));

export default router;
