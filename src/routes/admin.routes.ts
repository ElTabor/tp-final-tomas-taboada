import express, { Response } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { AuthRequest } from "../types/express";

const router = express.Router();

router.get(
  "/",
  authMiddleware as any,
  authorize("admin") as any,
  (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: "Admin access granted" });
  }
);

export default router;
