import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

export default router;
