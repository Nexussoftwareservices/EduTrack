import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload extends jwt.JwtPayload {
  userId: number;
  role: string; // STUDENT, ADMIN, SUPERADMIN, INSTITUTE
  instituteId?: number | null;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

export const signJwt = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
