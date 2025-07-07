import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in .env");
}

function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer" || parts.length < 2) return null;

  return parts[1];
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Access denied" });
  }
};

export const checkAuthOptional = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req.headers.authorization);

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      req.userId = payload.userId;
    } catch (err) {
      res.status(401).json({ message: "Access denied" });
      return;
    }
  }

  next();
};
