import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";
import AppError from "../utils/AppError";

export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("User not authenticated", 401));
        }

        if (req.user.role !== 'admin') {
            return next(new AppError("Access denied. Admin only.", 403));
        }

        next();
    };
};
