import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};
