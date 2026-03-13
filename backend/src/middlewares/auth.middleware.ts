import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";
import { Role } from "@prisma/client";

interface JwtPayload {
  userId: number;
  role: Role;
  instituteId: number | null;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse(res, 401, false, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = decoded; // Attached globally via express.d.ts

    next();
  } catch (error) {
    return ApiResponse(res, 401, false, "Invalid or expired token");
  }
};
