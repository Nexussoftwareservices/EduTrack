import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import {
  getStudentProfileService,
  updateStudentProfileService,
  getStudentNotificationsService,
} from "./services/student.profile.service";
import { updateStudentProfileSchema } from "./validations/student.validation";

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const profile = await getStudentProfileService(userId);

    return ApiResponse(res, 200, true, "Profile fetched successfully", profile);
  } catch (error) {
    console.error("Unable to GetStudent Profile: ", error);
    return ApiResponse(res, 500, false, "Unable to get Student");
  }
};

export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const validateData = updateStudentProfileSchema.parse(req.body);

    // Update the Profile
    const updatedProfile = await updateStudentProfileService(
      userId,
      validateData,
    );

    return ApiResponse(
      res,
      200,
      true,
      "Profile updated Successfully!",
      updatedProfile,
    );
  } catch (error) {
    console.error("Unable to update Student Profile: ", error);
    return ApiResponse(res, 500, false, "Unable to updateStudent Profile");
  }
};

export const studentNotificatioin = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notification = await getStudentNotificationsService(userId);

    return ApiResponse(
      res,
      200,
      true,
      "Notifications fetched successfully",
      notification,
    );
  } catch (error) {
    console.error("Unable to getStudent Notification", error);
    return ApiResponse(
      res,
      500,
      false,
      "Server Error: Unable to Get Student Notification",
    );
  }
};
