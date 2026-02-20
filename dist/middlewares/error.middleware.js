"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Internal server error",
    });
};
exports.default = errorHandler;
