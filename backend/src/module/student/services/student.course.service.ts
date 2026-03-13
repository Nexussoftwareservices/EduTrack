import prisma from "../../../config/prisma";

const getStudentBatch = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, batchStudents: { select: { batchId: true } } },
  });

  if (!student || student.batchStudents.length === 0) {
    throw {
      statusCode: 404,
      message: "Student batch not found",
    };
  }

  return student.batchStudents[0].batchId;
};

/**
 * GET /student/courses
 */
export const getStudentCoursesService = async (userId: number) => {
  const batchId = await getStudentBatch(userId);

  const courses = await prisma.course.findMany({
    where: { batchId },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          materials: true,
          tests: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
};

/**
 * GET /student/courses/:id
 */
export const getStudentCourseByIdService = async (
  userId: number,
  courseId: number,
) => {
  const batchId = await getStudentBatch(userId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      batchId,
    },
    include: {
      materials: true,
      tests: {
        select: {
          id: true,
          title: true,
          totalMarks: true,
        },
      },
    },
  });

  if (!course) {
    throw {
      statusCode: 404,
      message: "Course not found",
    };
  }

  return course;
};

/**
 * GET /student/courses/:id/recordings
 */
export const getStudentCourseRecordingsService = async (
  userId: number,
  courseId: number,
) => {
  const batchId = await getStudentBatch(userId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      batchId,
    },
    select: { id: true },
  });

  if (!course) {
    throw {
      statusCode: 404,
      message: "Course not found",
    };
  }

  const recordings = await prisma.recording.findMany({
    where: {
      meeting: {
        batchId,
      },
    },
    select: {
      id: true,
      videoUrl: true,
      uploadedAt: true,
      meeting: {
        select: {
          title: true,
          scheduledAt: true,
        },
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });

  return recordings;
};

/**
 * GET /student/courses/:id/resources
 */
export const getStudentCourseResourcesService = async (
  userId: number,
  courseId: number,
) => {
  const batchId = await getStudentBatch(userId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      batchId,
    },
    select: { id: true },
  });

  if (!course) {
    throw {
      statusCode: 404,
      message: "Course not found",
    };
  }

  const materials = await prisma.courseMaterial.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      fileUrl: true,
      uploadedAt: true,
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });

  return materials;
};
