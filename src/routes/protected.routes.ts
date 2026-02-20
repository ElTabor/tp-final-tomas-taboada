import express, { Response } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/express";

const router = express.Router();

router.get("/", authMiddleware as any, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user,
  });
});

export default router;
