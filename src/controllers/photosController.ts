import { Request, Response } from "express";
import { addPhoto, listPhotos, getPhoto, removePhoto } from "../services/photoService";
import { processImage, getImageUrl } from "../middleware/imageProcessor";

export const createPhotoController = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const inputPath = req.file.path;
    const outputPath = inputPath; // ou mettre un chemin différent si tu veux garder l’original

    // Traiter l'image (redimensionner, qualité...)
    await processImage(inputPath, outputPath);

    // Créer l'objet photo pour la base
    const created = await addPhoto({
      uri: getImageUrl(req.file.filename),  // chemin accessible depuis le front
      latitude: Number(req.body.latitude),
      longitude: Number(req.body.longitude),
      capturedAt: new Date(req.body.capturedAt),
      address: req.body.address || "",
      notes: req.body.notes || "",
      userId: req.user?.id,
    });

    res.status(201).json(created);
  } catch (err: any) {
    console.error('[photo] create error:', err);
    res.status(500).json({ message: err.message });
  }
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
