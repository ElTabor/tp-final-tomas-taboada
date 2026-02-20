"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.default = roleMiddleware;
