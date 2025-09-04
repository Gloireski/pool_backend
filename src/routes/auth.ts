import { Router } from "express";
import { asyncHandler } from "../misc/errors";
import { loginController, registerController } from "../controllers/authController";
import { Request, Response } from "express";

const router = Router();

router.post("/register", asyncHandler(registerController));

router.post("/login", asyncHandler(loginController));

export default router;
