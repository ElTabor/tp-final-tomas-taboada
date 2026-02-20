import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { AuthRequest } from "../types/express";

const generateAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "15m" });

const generateRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 409));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({
      message: "Administrator registered successfully",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const accessToken = generateAccessToken({ userId: user._id, role: 'admin' });

    res
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        role: 'admin',
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const user = await User.findById((req.user as any).userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Refresh token logic removed

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
