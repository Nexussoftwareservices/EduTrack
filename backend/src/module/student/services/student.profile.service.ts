import prisma from "../../../config/prisma";
import { hashPassword } from "../../../utils/hash";

// Get Student Profile
export const getStudentProfileService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: {
        include: {
          institute: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      },
    },
  });

  // if user not found
  if (!user || !user.student) {
    throw {
      statusCode: 404,
      message: "Student profile not found",
    };
  }

  // Removing sensitive informations - password field
  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    student: user.student,
  };
};

// Updating Student Profile
export const updateStudentProfileService = async (
  userId: number,
  updateData: {
    name?: string;
    phone?: string;
    password?: string;
  },
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  let updatedFields: any = {};

  // Partial update logic
  if (updateData.name !== undefined) {
    updatedFields.name = updateData.name;
  }

  if (updateData.phone !== undefined) {
    updatedFields.phone = updateData.phone;
  }

  if (updateData.password !== undefined) {
    updatedFields.password = await hashPassword(updateData.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedFields,
  });

  const { password, ...safeUser } = updatedUser;

  return safeUser;
};


export const getStudentNotificationsService = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
  });

  if (!student) {
    throw {
      statusCode: 404,
      message: "Student not found",
    };
  }

  const notifications = await prisma.notification.findMany({
    where: {
      studentId: student.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};
