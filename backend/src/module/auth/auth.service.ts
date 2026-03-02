import prisma from "../../config/prisma";
import crypto from "crypto";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/generateTokens";
import { Role } from "../../../generated/prisma";
import { sendEmail } from "./mail/mail.service";
import { resetPasswordTemplate } from "./mail/template";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  instituteId?: number;
}

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  if (!data.instituteId) {
    throw new Error("Institute is required");
  }

  const institute = await prisma.institute.findUnique({
    where: { id: data.instituteId },
  });

  if (!institute || institute.status !== "ACTIVE") {
    throw new Error("Invalid or inactive institute");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  if (data.role === "STUDENT") {
    await prisma.student.create({
      data: {
        userId: user.id,
        instituteId: institute.id,
      },
    });
  }

  if (data.role === "TRAINER") {
    await prisma.trainer.create({
      data: {
        userId: user.id,
        instituteId: institute.id,
      },
    });
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    instituteId: institute.id,
  });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw {
      statusCode: 400,
      message: "Email and password are required",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      trainer: true,
    },
  });

  if (!user) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  if (!user.isActive) {
    throw {
      statusCode: 403,
      message: "Account is inactive",
    };
  }

  let isPasswordValid = false;

  try {
    isPasswordValid = await comparePassword(password, user.password);
  } catch (err) {
    throw {
      statusCode: 500,
      message: "Authentication failed",
    };
  }

  if (!isPasswordValid) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  let instituteId: number | null = null;

  if (user.student) instituteId = user.student.instituteId;
  if (user.trainer) instituteId = user.trainer.instituteId;

  // 4️⃣ Institute validation
  if (instituteId) {
    const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
    });

    if (!institute || institute.status !== "ACTIVE") {
      throw {
        statusCode: 403,
        message: "Institute is blocked or inactive",
      };
    }
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    instituteId,
  });

  // 5️⃣ Remove password before returning
  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const forgotPasswordUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash before storing
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  // Frontend reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = resetPasswordTemplate(resetUrl);

  await sendEmail(user.email, "Reset Your Password", html);

  return {
    message: "Password reset email sent successfully",
  };
};

export const resetPasswordUser = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      token: hashedToken,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetRecord) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: {
      password: hashedPassword,
    },
  });

  // Delete token after usage
  await prisma.passwordReset.delete({
    where: { id: resetRecord.id },
  });

  return { message: "Password reset successful" };
};
