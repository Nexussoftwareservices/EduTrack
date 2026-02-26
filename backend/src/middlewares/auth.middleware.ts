import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { ApiResponse } from "../utils/apiResponse";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    instituteId?: number | null;
  };
}

/**
 *  JWT Structure Looks Like
{
"userId": 12,
"role": "INST_ADMIN",
"instituteId": 3
}
 */

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse(res, 401, false, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse(res, 401, false, "Invalid or expired token");
  }
};
