import { Router } from "express";
import authRouter from "./auth";
import photosRouter from "./photos";
import profileRouter from "./profile";
import uploadRouter from "./upload";
import calendarRouter from "./calendar";
import statsRouter from "./stats";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

router.use("/auth", authRouter);
router.use("/photos", photosRouter);
router.use("/profile", profileRouter);
router.use("/upload", uploadRouter);
router.use("/calendar", calendarRouter);
router.use("/stats", statsRouter);

export default router;
