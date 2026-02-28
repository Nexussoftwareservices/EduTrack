import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import {
  getStudentCoursesService,
  getStudentCourseByIdService,
  getStudentCourseRecordingsService,
  getStudentCourseResourcesService,
} from "./services/student.course.service";

/**
 * GET /student/courses
 */
export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const courses = await getStudentCoursesService(userId);

    return ApiResponse(res, 200, true, "Courses fetched successfully", courses);
  } catch (error: any) {
    return ApiResponse(
      res,
      error.statusCode || 500,
      false,
      error.message || "Unable to fetch courses",
    );
  }
};

/**
 * GET /student/courses/:id
 */
export const getStudentCourseById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const courseId = Number(req.params.id);

    const course = await getStudentCourseByIdService(userId, courseId);

    return ApiResponse(res, 200, true, "Course fetched successfully", course);
  } catch (error: any) {
    return ApiResponse(
      res,
      error.statusCode || 500,
      false,
      error.message || "Unable to fetch course",
    );
  }
};

/**
 * GET /student/courses/:id/recordings
 */
export const getStudentCourseRecordings = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.userId;
    const courseId = Number(req.params.id);

    const recordings = await getStudentCourseRecordingsService(
      userId,
      courseId,
    );

    return ApiResponse(
      res,
      200,
      true,
      "Recordings fetched successfully",
      recordings,
    );
  } catch (error: any) {
    return ApiResponse(
      res,
      error.statusCode || 500,
      false,
      error.message || "Unable to fetch recordings",
    );
  }
};

/**
 * GET /student/courses/:id/resources
 */
export const getStudentCourseResources = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.userId;
    const courseId = Number(req.params.id);

    const resources = await getStudentCourseResourcesService(userId, courseId);

    return ApiResponse(
      res,
      200,
      true,
      "Resources fetched successfully",
      resources,
    );
  } catch (error: any) {
    return ApiResponse(
      res,
      error.statusCode || 500,
      false,
      error.message || "Unable to fetch resources",
    );
  }
};
