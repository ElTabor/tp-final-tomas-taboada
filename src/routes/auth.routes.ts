import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { register, login, logout } from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.schema";
import authMiddleware from "../middlewares/auth.middleware";
import { loginLimiter } from "../middlewares/rateLimit.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);

router.post("/logout", authMiddleware as any, logout as any);

export default router;
