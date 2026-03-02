import { Role } from "../../generated/prisma";
import { signJwt } from "./jwt";

interface GenerateTokenParams {
  userId: number;
  role: Role;
  instituteId?: number | null;
}

export const generateToken = ({
  userId,
  role,
  instituteId = null,
}: GenerateTokenParams): string => {
  return signJwt({
    userId,
    role,
    instituteId,
  });
};

/**
 * 
{
"userId": 12,
"role": "INST_ADMIN",
"instituteId": 3
}
 */