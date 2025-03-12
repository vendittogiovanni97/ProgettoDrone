import { Request, Response } from "express";
import { DronesInfo } from "../../types/droneSchema";
import RealTimeDroneData from "../../models/droneSchemaRealTime";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import { AppSuccess } from "../../types/succesType";

const getAllDrones = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const drones: DronesInfo[] = await RealTimeDroneData.find().select("-__v");
    if (drones.length === 0) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        "Nessun drone trovato"
      );
    }

    AppSuccess.getInstance().successResponse(
      response,
      "Droni trovati",
      responseStatus.OK,
      { drones }
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log("errore durante il recupero dei droni", error);
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR, 
      ErrorCodes.ENTITY_NOT_FOUND,
      "Errore durante il recupero dei droni"
    )
  }
};


export default getAllDrones
