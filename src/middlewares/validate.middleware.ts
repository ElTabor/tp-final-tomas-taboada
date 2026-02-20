import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors,
    });
  }
};

export default validate;
