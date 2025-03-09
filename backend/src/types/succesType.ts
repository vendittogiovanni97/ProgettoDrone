import { Response } from "express";
import { responseStatus } from "../constants/statusEnum";

export class AppSuccess {
  private static instance: AppSuccess;

  public static getInstance(): AppSuccess {
    if (!AppSuccess.instance) {
      AppSuccess.instance = new AppSuccess();
    }
    return AppSuccess.instance;
  }

  public successResponse(
    response: Response,
    message: string,
    statusCode: responseStatus,
    details?: any
  ): void {
    response.status(statusCode).json({ message, statusCode, details });
  }
}
