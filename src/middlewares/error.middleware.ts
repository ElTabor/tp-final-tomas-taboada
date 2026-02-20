import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
