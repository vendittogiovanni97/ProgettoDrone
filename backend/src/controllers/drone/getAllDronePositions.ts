import { Request, Response } from "express";
import { ErrorCodes } from "../../constants/errorCodes";
import { responseStatus } from "../../constants/statusEnum";
import RealTimeDroneData from "../../models/droneSchemaRealTime";
import { AppError } from "../../types/appError";
import { AppSuccess } from "../../types/succesType";
import { DronePosition } from "../../types/droneSchema";

const getAllDronePositions = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Recupera solo i campi longitude e latitude da tutti i droni
    const dronePositions: DronePosition[] = await RealTimeDroneData.find()
      .select("deviceId lon lat -_id") // Seleziona solo deviceId longitude e latitude, esclude _id
      .exec();

    // Se non ci sono droni, restituisci un errore
    if (dronePositions.length === 0) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        "Nessun drone trovato"
      );
    }

    // Restituisci le posizioni dei droni come risposta
    AppSuccess.getInstance().successResponse(
      response,
      "DRONE_POSITIONS_RETRIEVED",
      responseStatus.OK,
      { dronePositions }
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error(
      "Errore durante il recupero delle posizioni dei droni:",
      error
    );
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.ENTITY_NOT_FOUND,
      "Errore durante il recupero delle posizioni dei droni"
    );
  }
};

export default getAllDronePositions;
