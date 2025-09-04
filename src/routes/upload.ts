import { Router, Response } from "express";
import { asyncHandler } from "../misc/errors";
import { upload } from "../middleware/upload";
import { processImage, getImageUrl } from "../middleware/imageProcessor";
import { createPhoto } from "../repositories/photoRepository";
import { updateProfileByUserId } from "../services/profileService";
import { authMiddleware, AuthRequest } from "../misc/auth";
import path from "path";

const router = Router();

// Explicit multer error handling to surface failures
router.post("/profile-picture", (req, res, next) => {
  upload.single("image")(req, res, (err: any) => {
    if (err) {
      console.warn(`[upload] multer error:`, err?.message || err);
      return res.status(400).json({ message: err?.message || "Upload error" });
    }
    next();
  });
}, authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log(`[upload] /profile-picture received fields=`, req.body);
  if (!req.file) {
    console.warn(`[upload] no file provided`);
    return res.status(400).json({ message: "No image uploaded" });
  }

  const inputPath = req.file.path;
  const filename = req.file.filename;
  const outputPath = path.join(process.cwd(), "downloads", filename);
  console.log(`[upload] file saved → ${inputPath}, processing to ${outputPath}`);

  // Process image to JPG
  const success = await processImage(inputPath, outputPath);
  if (!success) {
    console.error(`[upload] image processing failed for ${filename}`);
    return res.status(500).json({ message: "Image processing failed" });
  }

  const imageUrl = getImageUrl(filename);

  // Create photo record with metadata
  const photoData: any = {
    uri: imageUrl,
    latitude: req.body?.latitude ? parseFloat(req.body.latitude) : 0,
    longitude: req.body?.longitude ? parseFloat(req.body.longitude) : 0,
    capturedAt: req.body?.capturedAt ? new Date(req.body.capturedAt) : new Date(),
    address: req.body?.address || "",
    notes: req.body?.notes || "Profile picture",
    isProfilePicture: true,
    userId: req.user?.id
  };

  let photo: any = null;
  try {
    photo = await createPhoto(photoData);
  } catch (e: any) {
    console.error(`[upload] failed to create photo doc:`, e?.message || e);
  }

  // Update profile avatarUrl
  try {
    if (req.user?.id) {
      await updateProfileByUserId(req.user.id, { avatarUrl: imageUrl });
    }
  } catch (e) {
    console.warn(`[upload] failed to update profile avatar:`, (e as any)?.message || e);
  }

  res.json({
    message: "Profile picture uploaded successfully",
    photo,
    imageUrl
  });
}));

export default router;
